import { Component, signal, inject, OnDestroy, computed, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, FormControl, Validators } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { Subject, switchMap, debounceTime, distinctUntilChanged, filter, takeUntil } from 'rxjs';
import { GeocodingService } from '../../../../core/services/geocoding.service';
import { AddressSuggestion } from '../../../../shared/interfaces/address-suggestion';
import { TurnstileComponent } from '../../../../shared/components/turnstile/turnstile';
import { LegalModal } from '../../../../shared/components/legal-modal/legal-modal';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { UserApiService } from '../../../../core/services/user-api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { capitalize, evaluatePasswordCriteria, getAffiliateCode, clearAffiliateCode } from '../../../../core/utils/common-utils';
import { FlashMessageService } from '../../../../core/services/flash-message.service';
import { NAME_REGEXP, PASSWORD_STRONG_REGEXP, PHONE_FR_REGEXP, POSTAL_CODE_REGEXP, STREET_NUMBER_REGEXP } from '../../../../core/utils/regexp';
import { pastDateValidator } from '../../../../core/utils/validators';

@Component({
  selector: 'register-individual',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, TranslocoModule, TurnstileComponent, LegalModal],
  templateUrl: './individual.html',
  styleUrl: './individual.scss',
})
export class RegisterIndividual implements OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly geocodingService = inject(GeocodingService);
  private readonly userApi = inject(UserApiService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly flashMessage = inject(FlashMessageService);
  private readonly destroy$ = new Subject<void>();
  private readonly addressSearch$ = new Subject<string>();

  readonly turnstileSiteKey = inject(AppConfigService).get('turnstileSiteKey');
  readonly today = new Date().toISOString().split('T')[0];

  // Birth date dropdowns
  bdDay = 0;
  bdMonth = 0;
  bdYear = 0;
  readonly BD_MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  readonly BD_YEARS = Array.from({ length: new Date().getFullYear() - 1900 + 1 }, (_, i) => 1900 + i);

  get bdDaysInMonth(): number {
    if (!this.bdMonth) return 31;
    return new Date(this.bdYear || 2000, this.bdMonth, 0).getDate();
  }

  get bdDayOptions(): number[] {
    return Array.from({ length: this.bdDaysInMonth }, (_, i) => i + 1);
  }

  private updateBirthDateControl(): void {
    const ctrl = this.form.get('birthDate')!;
    if (this.bdDay && this.bdMonth && this.bdYear) {
      const mm = String(this.bdMonth).padStart(2, '0');
      const dd = String(this.bdDay).padStart(2, '0');
      ctrl.setValue(`${this.bdYear}-${mm}-${dd}`);
    } else {
      ctrl.setValue('');
    }
  }

  onBdDayChange(e: Event): void {
    this.bdDay = +(e.target as HTMLSelectElement).value;
    this.updateBirthDateControl();
  }

  onBdMonthChange(e: Event): void {
    this.bdMonth = +(e.target as HTMLSelectElement).value;
    if (this.bdDay > this.bdDaysInMonth) this.bdDay = this.bdDaysInMonth;
    this.updateBirthDateControl();
  }

  onBdYearChange(e: Event): void {
    this.bdYear = +(e.target as HTMLSelectElement).value;
    if (this.bdDay > this.bdDaysInMonth) this.bdDay = this.bdDaysInMonth;
    this.updateBirthDateControl();
  }

  readonly photoPreview = signal<string | null>(null);
  readonly addressSuggestions = signal<AddressSuggestion[]>([]);
  readonly addressOpen = signal(false);
  readonly captchaToken = signal<string | null>(null);
  readonly showPassword = signal(false);
  readonly showConfirmPassword = signal(false);
  readonly passwordFocused = signal(false);
  readonly showSubmitError = signal(false);
  readonly submitting = signal(false);
  readonly legalModalOpen = signal(false);
  readonly referralCodeError = signal(false);

  readonly form = this.fb.group({
    photo: new FormControl<File | null>(null, { nonNullable: false, validators: [Validators.required] }),
    gender: ['', Validators.required],
    lastName: ['', [Validators.required, Validators.pattern(NAME_REGEXP)]],
    firstName: ['', [Validators.required, Validators.pattern(NAME_REGEXP)]],
    birthDate: ['', [Validators.required, pastDateValidator]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(PASSWORD_STRONG_REGEXP)]],
    confirmPassword: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(PHONE_FR_REGEXP)]],
    address: this.fb.group({
      streetNumber: ['', [Validators.required, Validators.pattern(STREET_NUMBER_REGEXP)]],
      streetName: ['', Validators.required],
      additionalInfo: [''],
      postalCode: ['', [Validators.required, Validators.pattern(POSTAL_CODE_REGEXP)]],
      city: ['', [Validators.required, Validators.pattern(NAME_REGEXP)]],
    }),
    captcha: [false, Validators.requiredTrue],
    terms: [false, Validators.requiredTrue],
  });

  readonly passwordValue = toSignal(this.form.get('password')!.valueChanges, {
    initialValue: this.form.get('password')!.value,
  });

  readonly passwordCriteria = computed(() => evaluatePasswordCriteria(this.passwordValue() as string));

  constructor() {
    this.addressSearch$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter((query) => query.length >= 3),
        switchMap((query) => this.geocodingService.search(query)),
        takeUntil(this.destroy$),
      )
      .subscribe((suggestions) => this.addressSuggestions.set(suggestions));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // --- Address autocomplete ---
  onAddressSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    if (query.length < 3) {
      this.addressSuggestions.set([]);
      return;
    }
    this.addressSearch$.next(query);
  }

  selectAddress(address: AddressSuggestion) {
    this.addressSuggestions.set([]);
    this.addressOpen.set(false);
    const group = this.form.get('address')!;
    const currentNumber = (group.get('streetNumber')!.value ?? '');
    if (address.streetNumber && !/^\d/.test(currentNumber)) group.get('streetNumber')!.setValue(address.streetNumber);
    group.patchValue({
      streetName: address.streetName,
      additionalInfo: null,
      postalCode: address.postalCode,
      city: address.city,
    } as any);
  }

  closeAddressSuggestions() {
    setTimeout(() => this.addressOpen.set(false), 150);
  }

  onPostalCodeInput(event: Event) {
    const code = (event.target as HTMLInputElement).value;
    if (code.length !== 5) return;
    this.geocodingService
      .lookupCity(code)
      .pipe(takeUntil(this.destroy$))
      .subscribe((city) => {
        if (city) this.form.get('address.city')!.setValue(city);
      });
  }

  // --- Captcha ---
  onCaptchaResolved(token: string) {
    this.captchaToken.set(token);
    this.form.get('captcha')!.setValue(true);
  }

  onCaptchaReset() {
    this.captchaToken.set(null);
    this.form.get('captcha')!.setValue(false);
  }

  // --- Photo ---
  addPhoto(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.form.get('photo')!.setValue(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.photoPreview.set(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      this.photoPreview.set(null);
    }
  }

  removePhoto() {
    if (confirm('Supprimer la photo ?')) {
      this.photoPreview.set(null);
      this.form.get('photo')!.setValue(null);
    }
  }

  submit() {
    this.showSubmitError.set(false);
    this.form.markAllAsTouched();

    if (this.form.invalid || this.form.value.password !== this.form.value.confirmPassword) {
      this.showSubmitError.set(true);

      setTimeout(() => {
        const firstError = document.querySelector('.ng-invalid.ng-touched, .force-invalid');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);

      return;
    }

    const { gender, lastName, firstName, birthDate, email, password, phone, address, photo } = this.form.value;
    const captchaToken = this.captchaToken();
    if (!captchaToken) return;

    const referralCode = getAffiliateCode();
    const payload: Record<string, unknown> = {
      user: {
        gender,
        lastName: lastName!.toUpperCase(),
        firstName: capitalize(firstName as string),
        birthDate,
        email,
        password,
        address,
      },
      phone,
      ...(referralCode ? { referralCode } : {}),
    };

    this.submitting.set(true);
    this.userApi
      .registerIndividual(payload, captchaToken)
      .pipe(
        switchMap(({ userId, accessToken, user: _user, profileId: _profileId }) => {
          this.authService.setTempToken(accessToken);
          clearAffiliateCode();
          if (!photo) return this.userApi.createIndividualDocuments(userId, new FormData());
          const formData = new FormData();
          formData.append('photo', photo);
          return this.userApi.createIndividualDocuments(userId, formData);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: () => {
          this.flashMessage.set({ type: 'success', key: 'login.registeredIndividualSuccess' });
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          this.submitting.set(false);
          const msg = (err?.error?.message ?? '') as string;
          if (msg === 'INVALID_REFERRAL_CODE') {
            this.referralCodeError.set(true);
            return;
          }
          console.error('Erreur inscription:', err);
        },
      });
  }
}
