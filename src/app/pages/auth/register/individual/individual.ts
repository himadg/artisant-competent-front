import { Component, signal, inject, OnDestroy } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, FormControl, Validators } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { Subject, switchMap, debounceTime, distinctUntilChanged, filter, of, takeUntil } from 'rxjs';
import { GeocodingService, AddressSuggestion } from '../../../../core/services/geocoding.service';
import { TurnstileComponent } from '../../../../shared/components/turnstile/turnstile';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { UploadService } from '../../../../core/services/upload.service';
import { UserApiService } from '../../../../core/services/user-api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../shared/interfaces/user';
import { Router } from '@angular/router';
import { capitalize } from '../../../../core/utils/common-utils';

@Component({
  selector: 'register-individual',
  standalone: true,
  imports: [ReactiveFormsModule, TranslocoModule, TurnstileComponent],
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
  private readonly destroy$ = new Subject<void>();
  private readonly addressSearch$ = new Subject<string>();

  readonly turnstileSiteKey = inject(AppConfigService).get('turnstileSiteKey');
  readonly today = new Date().toISOString().split('T')[0];

  readonly photoPreview = signal<string | null>(null);
  readonly addressSuggestions = signal<AddressSuggestion[]>([]);
  readonly addressOpen = signal(false);
  readonly captchaToken = signal<string | null>(null);
  readonly showPassword = signal(false);
  readonly showConfirmPassword = signal(false);

  readonly form = this.fb.group({
    photo: new FormControl<File | null>(null),
    gender: ['', Validators.required],
    lastName: ['', Validators.required],
    firstName: ['', Validators.required],
    birthDate: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
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
    console.log('form.value:', this.form.value);
    if (this.form.value.password !== this.form.value.confirmPassword) return;
    if (this.form.invalid) return;

    const { gender, lastName, firstName, birthDate, email, password, phone, address, photo } = this.form.value;
    const captchaToken = this.captchaToken();
    if (!captchaToken) return;

    const payload = {
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
    };

    this.userApi
      .registerIndividual(payload as Record<string, unknown>, captchaToken)
      .pipe(
        switchMap(({ userId, accessToken, user }) => {
          this.authService.setSession(accessToken, user as User);
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
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          console.error('Erreur inscription:', err);
        },
      });
  }
}
