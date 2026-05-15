import { Component, signal, inject, OnDestroy, ViewChild, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import {
  ReactiveFormsModule,
  FormBuilder,
  FormControl,
  Validators,
  FormArray,
  AbstractControlOptions,
  AbstractControl,
} from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { Subject, switchMap, debounceTime, distinctUntilChanged, filter, forkJoin, of, takeUntil } from 'rxjs';
import { hourValidator, servicesValidator, openingAtLeastOne } from '../../../../core/utils/validators';
import { capitalize, normalizeName } from '../../../../core/utils/common-utils';
import { ServiceApiService } from '../../../../core/services/service-api.service';
import { TradeApiService } from '../../../../core/services/trade-api.service';
import { Service } from '../../../../shared/interfaces/service';
import { Trade } from '../../../../shared/interfaces/trade';
import { TurnstileComponent } from '../../../../shared/components/turnstile/turnstile';
import { Router } from '@angular/router';
import { UserApiService } from '../../../../core/services/user-api.service';
import { GeocodingService, AddressSuggestion } from '../../../../core/services/geocoding.service';
import { SiretService } from '../../../../core/services/siret.service';
import { UploadService } from '../../../../core/services/upload.service';
import {
  NAME_REGEXP,
  PASSWORD_STRONG_REGEXP,
  PHONE_FR_REGEXP,
  POSTAL_CODE_REGEXP,
  SIRET_REGEXP,
  STREET_NUMBER_REGEXP,
} from '../../../../core/utils/regexp';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../shared/interfaces/user';


type DocTarget = 'photo' | 'idFront' | 'idBack' | 'insuranceDoc' | 'diplomaDoc' | 'logo' | 'rib';

@Component({
  selector: 'register-professional',
  standalone: true,
  imports: [ReactiveFormsModule, TranslocoModule, TurnstileComponent],
  templateUrl: './professional.html',
  styleUrl: './professional.scss',
})
export class RegisterProfessional implements OnDestroy {
  readonly fb = new FormBuilder();
  private readonly serviceApi = inject(ServiceApiService);
  private readonly tradeApi = inject(TradeApiService);
  private readonly userApi = inject(UserApiService);
  private readonly geocodingService = inject(GeocodingService);
  private readonly siretService = inject(SiretService);
  private readonly uploadService = inject(UploadService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  // Navigation entre les pages du formulaire (UX)
  readonly step = signal<1 | 2>(1);

  // File previews & names
  readonly photoPreview = signal<string | null>(null);
  readonly photoName = signal<string | null>(null);
  readonly idFrontPreview = signal<string | null>(null);
  readonly idFrontName = signal<string | null>(null);
  readonly idBackPreview = signal<string | null>(null);
  readonly idBackName = signal<string | null>(null);
  readonly insuranceDocPreview = signal<string | null>(null);
  readonly insuranceDocName = signal<string | null>(null);
  readonly diplomaPreview = signal<string | null>(null);
  readonly diplomaName = signal<string | null>(null);
  readonly logoPreview = signal<string | null>(null);
  readonly logoName = signal<string | null>(null);
  readonly ribPreview = signal<string | null>(null);
  readonly ribName = signal<string | null>(null);

  readonly trades = signal<Trade[]>([]);
  readonly days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  readonly serviceResults = signal<Service[]>([]);
  readonly selectedServices = signal<Service[]>([]);
  readonly searchQuery = signal<string>('');
  readonly pendingServiceDescriptions = signal<string[]>([]);
  readonly supplierInput = signal<string>('');
  readonly searchingService = signal<boolean>(false);
  readonly dropdownOpen = signal<boolean>(false);
  readonly birthDateFocused = signal<boolean>(false);
  readonly insuranceExpiryFocused = signal<boolean>(false);
  readonly today = new Date().toLocaleDateString('en-CA');

  readonly showPassword = signal<boolean>(false);
  readonly showConfirmPassword = signal<boolean>(false);
  readonly passwordFocused = signal<boolean>(false);
  readonly showSubmitError = signal<boolean>(false);

  readonly personalAddressSuggestions = signal<AddressSuggestion[]>([]);
  readonly personalAddressOpen = signal<boolean>(false);

  readonly workAddressSuggestions = signal<AddressSuggestion[]>([]);
  readonly workAddressOpen = signal<boolean>(false);

  readonly siretStatus = signal<'idle' | 'loading' | 'valid' | 'invalid' | 'closed'>('idle');
  readonly siretCompanyName = signal<string | null>(null);
  readonly captchaToken = signal<string | null>(null);

  private readonly serviceSearch$ = new Subject<string>();
  private readonly personalAddressSearch$ = new Subject<string>();
  private readonly workAddressSearch$ = new Subject<string>();

  readonly turnstileSiteKey = inject(AppConfigService).get('turnstileSiteKey');
  @ViewChild(TurnstileComponent) private readonly turnstile!: TurnstileComponent;

  constructor() {
    this.tradeApi.getAll().subscribe(trades => this.trades.set(trades));

    this.serviceSearch$.pipe(
      distinctUntilChanged(),
      filter(query => query.length >= 3),
      switchMap(query => {
        this.searchingService.set(true);
        return this.serviceApi.search(query).pipe(debounceTime(300));
      }),
      takeUntil(this.destroy$),
    ).subscribe(results => {
      this.serviceResults.set(results.filter(service => !this.selectedServices().includes(service)));
      this.searchingService.set(false);
    });

    this.personalAddressSearch$.pipe(
      distinctUntilChanged(),
      filter(query => query.length >= 3),
      switchMap(query => this.geocodingService.search(query)),
      takeUntil(this.destroy$),
    ).subscribe(suggestions => this.personalAddressSuggestions.set(suggestions));

    this.workAddressSearch$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(query => query.length >= 3),
      switchMap(query => this.geocodingService.search(query)),
      takeUntil(this.destroy$),
    ).subscribe(suggestions => this.workAddressSuggestions.set(suggestions));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  readonly form = this.fb.group({
    user: this.fb.group({
      gender: ['', Validators.required],
      lastName: ['', [Validators.required, Validators.pattern(NAME_REGEXP)]],
      firstName: ['', [Validators.required, Validators.pattern(NAME_REGEXP)]],
      birthDate: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(PASSWORD_STRONG_REGEXP)]],
      confirmPassword: ['', Validators.required],
      address: this.fb.group({
        streetNumber: ['', Validators.required],
        streetName: ['', Validators.required],
        additionalInfo: [''],
        postalCode: ['', [Validators.required, Validators.pattern(POSTAL_CODE_REGEXP)]],
        city: ['', Validators.required],
      }),
    }),
    professionalProfile: this.fb.group({
      managerPhone: ['', [Validators.required, Validators.pattern(PHONE_FR_REGEXP)]],
      professionalEmail: [''],
      photo: new FormControl<File | null>(null, { nonNullable: false, validators: [Validators.required] }),
      idFront: new FormControl<File | null>(null, { nonNullable: false, validators: [Validators.required] }),
      idBack: new FormControl<File | null>(null, { nonNullable: false, validators: [Validators.required] }),
      insuranceDoc: new FormControl<File | null>(null, { nonNullable: false, validators: [Validators.required] }),
      diplomaDoc: new FormControl<File | null>(null, { nonNullable: false, validators: [Validators.required] }),
      logo: new FormControl<File | null>(null, { nonNullable: false, validators: [Validators.required] }),
      rib: new FormControl<File | null>(null, { nonNullable: false, validators: [Validators.required] }),
      insuranceName: ['', [Validators.required, Validators.pattern(NAME_REGEXP)]],
      insuranceNumber: ['', Validators.required],
      insuranceExpiry: ['', Validators.required],
      companyName: ['', Validators.required],
      workAddress: this.fb.group({
        streetNumber: ['', [Validators.required, Validators.pattern(STREET_NUMBER_REGEXP)]],
        streetName: ['', Validators.required],
        additionalInfo: [''],
        postalCode: ['', [Validators.required, Validators.pattern(POSTAL_CODE_REGEXP)]],
        city: ['', Validators.required],
      }),
      siret: ['', [Validators.required, Validators.pattern(SIRET_REGEXP)]],
      trades: [<string[]>[], [Validators.required]],
      yearsExperience: ['', [Validators.required, Validators.min(0)]],
      onCall: [false],
      hours: this.fb.array(
        this.days.map((day) =>
          this.fb.group(
            { day: day, start: '', end: '', closed: true },
            { validators: [Validators.required, Validators.minLength(1), Validators.maxLength(7), hourValidator] } as AbstractControlOptions,
          ),
        ),
        { validators: [openingAtLeastOne] }
      ),
      description: ['', [Validators.required, Validators.maxLength(500)]],
      services: [<string[]>[], [servicesValidator(() => this.pendingServiceDescriptions().length)]],
      trustName: [''],
      trustPhone: [''],
      suppliers: new FormControl<string[]>([], { nonNullable: true, validators: [Validators.required] }),
    }),
    captcha: [false, Validators.requiredTrue],
    terms: [false, Validators.requiredTrue],
  });

  readonly onCall = toSignal(
    this.form.get('professionalProfile.onCall')!.valueChanges,
    { initialValue: this.form.get('professionalProfile.onCall')!.value },
  );

  readonly passwordValue = toSignal(
    this.form.get('user.password')!.valueChanges,
    { initialValue: this.form.get('user.password')!.value }
  );

  readonly passwordCriteria = computed(() => {
    const pwd = (this.passwordValue() || '') as string;
    return {
      length: pwd.length >= 12,
      lower: /[a-z]/.test(pwd),
      upper: /[A-Z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[^a-zA-Z0-9]/.test(pwd),
    };
  });

  get hours(): FormArray {
    return this.form.get('professionalProfile.hours') as FormArray;
  }

  nextStep() { this.step.set(2); }
  backStep() { this.step.set(1); }

  // --- Address autocomplete ---
  onPersonalAddressSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    if (query.length < 3) { this.personalAddressSuggestions.set([]); return; }
    this.personalAddressSearch$.next(query);
  }

  selectPersonalAddress(address: AddressSuggestion) {
    this.personalAddressSuggestions.set([]);
    this.personalAddressOpen.set(false);
    const group = this.form.get('user.address')!;
    const currentNumber = (group.get('streetNumber')!.value ?? '') as string;
    if (address.streetNumber && !/^\d/.test(currentNumber)) group.get('streetNumber')!.setValue(address.streetNumber);
    group.patchValue({ streetName: address.streetName, additionalInfo: null, postalCode: address.postalCode, city: address.city } as any);
  }

  closePersonalAddressSuggestions() { setTimeout(() => this.personalAddressOpen.set(false), 150); }

  onPersonalPostalCodeInput(event: Event) {
    const code = (event.target as HTMLInputElement).value;
    if (code.length !== 5) return;
    this.geocodingService.lookupCity(code).pipe(takeUntil(this.destroy$)).subscribe(city => {
      if (city) this.form.get('user.address.city')!.setValue(city);
    });
  }

  onWorkAddressSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    if (query.length < 3) { this.workAddressSuggestions.set([]); return; }
    this.workAddressSearch$.next(query);
  }

  selectWorkAddress(adress: AddressSuggestion) {
    this.workAddressSuggestions.set([]);
    this.workAddressOpen.set(false);
    const group = this.form.get('professionalProfile.workAddress')!;
    if (adress.streetNumber) group.get('streetNumber')!.setValue(adress.streetNumber);
    group.patchValue({ streetName: adress.streetName, additionalInfo: null, postalCode: adress.postalCode, city: adress.city } as any);
  }

  closeWorkAddressSuggestions() { setTimeout(() => this.workAddressOpen.set(false), 150); }

  onWorkPostalCodeInput(event: Event) {
    const code = (event.target as HTMLInputElement).value;
    if (code.length !== 5) return;
    this.geocodingService.lookupCity(code).pipe(takeUntil(this.destroy$)).subscribe(city => {
      if (city) this.form.get('professionalProfile.workAddress.city')!.setValue(city);
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

  private validateCompanyNameMatch() {
    const apiName = this.siretCompanyName();
    const companyCtrl = this.form.get('professionalProfile.companyName');
    if (!apiName || !companyCtrl) return;
    const formName = normalizeName(companyCtrl.value ?? '');
    const normalized = normalizeName(apiName);
    const matches = normalized.includes(formName) || formName.includes(normalized);
    companyCtrl.setErrors(matches ? null : { siretMismatch: true });
  }

  onSiretChange() {
    this.siretStatus.set('idle');
    this.siretCompanyName.set(null);
    this.form.get('professionalProfile.companyName')?.setErrors(null);
  }

  onSiretBlur() {
    const siret = this.form.get('professionalProfile.siret')?.value ?? '';
    if (!SIRET_REGEXP.test(siret)) return;
    this.siretStatus.set('loading');
    this.siretService.verify(siret).pipe(takeUntil(this.destroy$)).subscribe(result => {
      if (result.valid) {
        this.siretStatus.set('valid');
        this.siretCompanyName.set(result.companyName ?? null);
        const companyCtrl = this.form.get('professionalProfile.companyName');
        if (!companyCtrl?.value && result.companyName) companyCtrl?.setValue(result.companyName);
        this.validateCompanyNameMatch();
      } else if (result.closed) {
        this.siretStatus.set('closed');
      } else {
        this.siretStatus.set('invalid');
      }
    });
  }

  onCompanyNameBlur() {
    if (this.siretCompanyName()) this.validateCompanyNameMatch();
  }

  // --- Files (step 2) ---
  private setPreview(target: DocTarget, val: string | null) {
    if (target === 'photo') this.photoPreview.set(val);
    else if (target === 'idFront') this.idFrontPreview.set(val);
    else if (target === 'idBack') this.idBackPreview.set(val);
    else if (target === 'insuranceDoc') this.insuranceDocPreview.set(val);
    else if (target === 'diplomaDoc') this.diplomaPreview.set(val);
    else if (target === 'logo') this.logoPreview.set(val);
    else if (target === 'rib') this.ribPreview.set(val);
  }

  private setName(target: DocTarget, name: string | null) {
    if (target === 'photo') this.photoName.set(name);
    else if (target === 'idFront') this.idFrontName.set(name);
    else if (target === 'idBack') this.idBackName.set(name);
    else if (target === 'insuranceDoc') this.insuranceDocName.set(name);
    else if (target === 'diplomaDoc') this.diplomaName.set(name);
    else if (target === 'logo') this.logoName.set(name);
    else if (target === 'rib') this.ribName.set(name);
  }

  addFile(target: DocTarget, e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0] ?? null;
    if (!file) {
      this.setPreview(target, null);
      this.setName(target, null);
      this.form.get('professionalProfile')!.patchValue({ [target]: null } as any);
      return;
    }
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => this.setPreview(target, reader.result as string);
      reader.readAsDataURL(file);
    } else {
      this.setPreview(target, null);
    }
    this.setName(target, file.name);
    this.form.get('professionalProfile')!.patchValue({ [target]: file } as any);
  }

  removeFile(target: DocTarget) {
    const ok = confirm('Supprimer le fichier ?');
    if (!ok) return;
    this.setPreview(target, null);
    this.setName(target, null);
    this.form.get('professionalProfile')!.patchValue({ [target]: null } as any);
  }

  // --- Trades ---
  isTradeSelected(id: string) {
    const trades = this.form.get('professionalProfile')!.value.trades as string[];
    return Array.isArray(trades) && trades.includes(id);
  }

  toggleTrade(id: string) {
    const prof = this.form.get('professionalProfile')!;
    const trades = (prof.value.trades as string[]) ?? [];
    const next = trades.includes(id) ? trades.filter(tradeId => tradeId !== id) : [...trades, id];
    prof.patchValue({ trades: next } as any);
  }

  isOnCallTradeSelected() {
    return this.trades().some(trade => trade.isOnCall && this.isTradeSelected(trade.id));
  }

  // --- Services ---
  openDropdown() { this.dropdownOpen.set(true); }
  closeDropdown() { setTimeout(() => this.dropdownOpen.set(false), 150); }

  onServiceSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.searchQuery.set(query);
    if (query.length < 3) {
      this.serviceResults.set([]);
      this.searchingService.set(false);
      this.serviceSearch$.next('');
      return;
    }
    this.serviceSearch$.next(query.trim());
  }

  get unselectedResults(): Service[] {
    const selected = this.selectedServices();
    const pending = this.pendingServiceDescriptions();
    return this.serviceResults().filter(
      result => !selected.some(service => service.id === result.id) && !pending.includes(result.description),
    );
  }

  addPendingService() {
    const description = this.searchQuery().trim();
    if (!description || this.pendingServiceDescriptions().includes(description)) return;
    this.pendingServiceDescriptions.update(list => [...list, description]);
    this.form.get('professionalProfile.services')?.updateValueAndValidity();
    this.dropdownOpen.set(false);
    this.searchQuery.set('');
    this.serviceResults.set([]);
  }

  removePendingService(description: string) {
    this.pendingServiceDescriptions.update(list => list.filter(desc => desc !== description));
    this.form.get('professionalProfile.services')?.updateValueAndValidity();
  }

  isServiceSelected(id: string) {
    return this.selectedServices().some(service => service.id === id);
  }

  toggleService(item: Service) {
    const current = this.selectedServices();
    const next = current.some(service => service.id === item.id)
      ? current.filter(service => service.id !== item.id)
      : [...current, item];
    this.selectedServices.set(next);
    this.form.get('professionalProfile')!.patchValue({ services: next.map(service => service.id) } as any);
    this.dropdownOpen.set(false);
    this.searchQuery.set('');
    this.serviceResults.set([]);
  }

  removeService(id: string) {
    const next = this.selectedServices().filter(service => service.id !== id);
    this.selectedServices.set(next);
    this.form.get('professionalProfile')!.patchValue({ services: next.map(service => service.id) } as any);
  }

  // --- Suppliers ---
  addSupplier(event: KeyboardEvent) {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    const value = this.supplierInput().trim();
    if (!value) return;
    const ctrl = this.form.get('professionalProfile.suppliers')!;
    const current = ctrl.value as string[];
    if (!current.includes(value)) ctrl.setValue([...current, value]);
    this.supplierInput.set('');
  }

  removeSupplier(supplier: string) {
    const ctrl = this.form.get('professionalProfile.suppliers')!;
    ctrl.setValue((ctrl.value as string[]).filter((s) => s !== supplier));
  }

  // --- Submit ---
  submit() {
    this.showSubmitError.set(false);
    this.form.markAllAsTouched();

    const user = this.form.value.user;
    
    if (this.form.invalid || user?.password !== user?.confirmPassword) {
      this.showSubmitError.set(true);
      const findInvalid = (group: AbstractControl, path = ''): void => {
        if ('controls' in group) {
          Object.entries((group as any).controls).forEach(([k, c]) => findInvalid(c as any, path ? `${path}.${k}` : k));
        } else if (group.invalid) {
          console.warn('Invalid control:', path, group.errors);
        }
      };
      findInvalid(this.form);
      
      // Auto-scroll vers le premier élément en erreur
      setTimeout(() => {
        const firstError = document.querySelector('.ng-invalid.ng-touched, .force-invalid');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      
      return;
    }

    const captchaToken = this.captchaToken();
    if (!captchaToken) return;

    const pending = this.pendingServiceDescriptions();

    const register = (serviceIds: string[]) => {
      // On convertit le nom en majuscules
      this.form.value.user!.lastName = this.form.value.user!.lastName!.trim().toUpperCase();
      // On capitalise le prénom, c'est à dire prenom => Prenom
      this.form.value.user!.firstName = capitalize(this.form.value.user!.firstName!.trim());

      const raw = this.form.value;
      const rawHours = ((raw.professionalProfile?.hours ?? []) as { day: string; start: string | null; end: string | null }[]);
      const openingHours = {
        days: rawHours.map(h => ({
          day: h.day,
          closed: !h.start && !h.end,
          intervals: h.start && h.end ? [{ start: h.start, end: h.end }] : [],
        })),
      };

      const { hours: _h, trustName, trustPhone, suppliers, photo, idFront, idBack, insuranceDoc, diplomaDoc, logo, rib, ...profRest } =
        raw.professionalProfile as Record<string, unknown> & {
          hours: unknown; trustName: string; trustPhone: string; suppliers: string[];
          photo: File | null; idFront: File | null; idBack: File | null;
          insuranceDoc: File | null; diplomaDoc: File | null; logo: File | null; rib: File | null;
        };

      const { confirmPassword: _cp, ...userFields } = raw.user as Record<string, unknown> & { confirmPassword: unknown };

      const payload = {
        user: userFields,
        professionalProfile: {
          ...profRest,
          services: serviceIds,
          openingHours,
          trustedContactName: trustName || undefined,
          trustedContactPhone: trustPhone || undefined,
          suppliers,
        },
      };

      const upload = (file: File | null) =>
        file ? this.uploadService.upload(file) : of('');

      this.userApi.registerProfessional(payload as Record<string, unknown>, captchaToken)
        .pipe(
          switchMap(({ userId, accessToken, user }) => {
            this.authService.setSession(accessToken, user as User);
            return forkJoin([
              upload(photo),
              upload(idFront),
              upload(idBack),
              upload(insuranceDoc),
              upload(diplomaDoc),
              upload(logo),
              upload(rib),
            ]).pipe(
              switchMap(([photoKey, idFrontKey, idBackKey, insuranceDocKey, diplomaDocKey, companyLogoKey, ribKey]) =>
                this.userApi.createProfessionalDocuments(userId, {
                  photoKey, idFrontKey, idBackKey, insuranceDocKey, diplomaDocKey, companyLogoKey, ribKey,
                }),
              ),
            );
          }),
          takeUntil(this.destroy$),
        )
        .subscribe({
          next: () => { this.router.navigate(['/auth/login']); },
          error: (err) => {
            console.error('Erreur inscription', err);
            this.turnstile.reset();
            this.onCaptchaReset();
          },
        });
    };

    if (pending.length === 0) {
      register(this.selectedServices().map(service => service.id));
      return;
    }

    forkJoin(pending.map(desc => this.serviceApi.create(desc))).subscribe({
      next: (created: Service[]) => {
        register([
          ...this.selectedServices().map(service => service.id),
          ...created.map(service => service.id),
        ]);
      },
    });
  }
}
