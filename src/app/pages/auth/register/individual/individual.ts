import { Component, signal, inject, OnDestroy, computed, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, FormControl, Validators } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { Subject, switchMap, debounceTime, distinctUntilChanged, filter, of, takeUntil } from 'rxjs';
import { GeocodingService, AddressSuggestion } from '../../../../core/services/geocoding.service';
import { TurnstileComponent } from '../../../../shared/components/turnstile/turnstile';
import { LegalModal } from '../../../../shared/components/legal-modal/legal-modal';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { UploadService } from '../../../../core/services/upload.service';
import { UserApiService } from '../../../../core/services/user-api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { capitalize, evaluatePasswordCriteria, getAffiliateCode, clearAffiliateCode } from '../../../../core/utils/common-utils';
import { PASSWORD_STRONG_REGEXP } from '../../../../core/utils/regexp';
import { LangService } from '../../../../core/services/lang.service';

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
  private readonly uploadService = inject(UploadService);
  private readonly userApi = inject(UserApiService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly langService = inject(LangService);
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
    lastName: ['', Validators.required],
    firstName: ['', Validators.required],
    birthDate: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(PASSWORD_STRONG_REGEXP)]],
    confirmPassword: ['', Validators.required],
    phone: ['', Validators.required],
    address: this.fb.group({
      streetNumber: ['', Validators.required],
      streetName: ['', Validators.required],
      additionalInfo: [''],
      postalCode: ['', Validators.required],
      city: ['', Validators.required],
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
    const currentNumber = (group.get('streetNumber')!.value ?? '') as string;
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

    console.log('submit', this.form.value);

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
      lang: this.langService.lang(),
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
        switchMap(({ userId, accessToken, user: _user }) => {
          this.authService.setTempToken(accessToken);
          clearAffiliateCode();
          return (photo ? this.uploadService.upload(photo) : of('')).pipe(
            switchMap((photoKey) =>
              photoKey ? this.userApi.createIndividualDocuments(userId, photoKey) : of(undefined),
            ),
          );
        }),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/auth/login'], { queryParams: { registeredIndividual: 'success' } });
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
