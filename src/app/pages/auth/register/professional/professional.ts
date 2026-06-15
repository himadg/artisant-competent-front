import { Component, signal, inject, OnDestroy, ViewChild, computed, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormControl,
  Validators,
  FormArray,
  AbstractControl,
} from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { Subject, switchMap, debounceTime, distinctUntilChanged, filter, forkJoin, of, takeUntil } from 'rxjs';
import { hourValidator, openingAtLeastOne, trustedContactValidator, optionalEmailValidator } from '../../../../core/utils/validators';
import { capitalize, normalizeName, evaluatePasswordCriteria, getAffiliateCode, clearAffiliateCode } from '../../../../core/utils/common-utils';
import { TradeApiService } from '../../../../core/services/trade-api.service';
import { Trade } from '../../../../shared/interfaces/trade';
import { TurnstileComponent } from '../../../../shared/components/turnstile/turnstile';
import { LegalModal } from '../../../../shared/components/legal-modal/legal-modal';
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
import { LangService } from '../../../../core/services/lang.service';
import { AuthService } from '../../../../core/services/auth.service';
import { DiplomaEntry } from '../../../../shared/interfaces/diploma-entry';

type DocTarget = 'photo' | 'idFront' | 'idBack' | 'logo' | 'rib';

@Component({
  selector: 'register-professional',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, TranslocoModule, TurnstileComponent, LegalModal],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './professional.html',
  styleUrl: './professional.scss',
})
export class RegisterProfessional implements OnDestroy {
  readonly fb = new FormBuilder();
  private readonly tradeApi = inject(TradeApiService);
  private readonly userApi = inject(UserApiService);
  private readonly geocodingService = inject(GeocodingService);
  private readonly siretService = inject(SiretService);
  private readonly uploadService = inject(UploadService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly langService = inject(LangService);
  private readonly destroy$ = new Subject<void>();

  readonly step = signal<1 | 2>(1);

  // File previews & names (non-diploma)
  readonly photoPreview = signal<string | null>(null);
  readonly photoName = signal<string | null>(null);
  readonly idFrontPreview = signal<string | null>(null);
  readonly idFrontName = signal<string | null>(null);
  readonly idBackPreview = signal<string | null>(null);
  readonly idBackName = signal<string | null>(null);
  readonly logoPreview = signal<string | null>(null);
  readonly logoName = signal<string | null>(null);
  readonly ribPreview = signal<string | null>(null);
  readonly ribName = signal<string | null>(null);

  // Multiple diplomas
  readonly diplomaFiles = signal<DiplomaEntry[]>([{ file: null, preview: null, fileName: null, documentName: '', expiryDate: '' }]);
  readonly diplomaTouched = signal(false);
  readonly hoursTouched = signal(false);
  readonly diplomasValid = computed(() => this.diplomaFiles().some(d => d.file !== null && d.documentName.trim() !== ''));

  readonly trades = signal<Trade[]>([]);
  readonly days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  // Dropdowns for opening hours
  readonly hoursOptions = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  readonly minutesOptions = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  readonly descriptionLength = signal(0);
  readonly supplierQuery = signal<string>('');
  readonly supplierDropdownOpen = signal<boolean>(false);
  readonly adressError = signal<'addressPersonal' | 'addressWork' | null>(null);
  readonly birthDateFocused = signal<boolean>(false);
  readonly today = new Date().toLocaleDateString('en-CA');

  // Birth date dropdowns
  bdDay = 0;
  bdMonth = 0;
  bdYear = 0;
  readonly BD_MONTHS = [1,2,3,4,5,6,7,8,9,10,11,12];
  readonly BD_YEARS = Array.from({ length: 101 }, (_, i) => new Date().getFullYear() - i);

  get bdDaysInMonth(): number {
    if (!this.bdMonth) return 31;
    return new Date(this.bdYear || 2000, this.bdMonth, 0).getDate();
  }

  get bdDayOptions(): number[] {
    return Array.from({ length: this.bdDaysInMonth }, (_, i) => i + 1);
  }

  private updateBirthDateControl(): void {
    const ctrl = this.form.get('user.birthDate')!;
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

  readonly showPassword = signal<boolean>(false);
  readonly showConfirmPassword = signal<boolean>(false);
  readonly passwordFocused = signal<boolean>(false);
  readonly showSubmitError = signal<boolean>(false);
  readonly submitting = signal(false);
  readonly referralCodeError = signal(false);
  readonly legalModalOpen = signal(false);
  readonly hasStep1Errors = signal<boolean>(false);
  readonly goodPracticesModalOpen = signal(false);
  readonly mediatorGuideModalOpen = signal(false);
  readonly docObligationsModalOpen = signal(false);
  readonly workingAddressModalOpen = signal(false);
  readonly cmodModalOpen = signal(false);
  readonly openingHoursModalOpen = signal(false);
  readonly sellingTipsModalOpen = signal(false);

  readonly personalAddressSuggestions = signal<AddressSuggestion[]>([]);
  readonly personalAddressOpen = signal<boolean>(false);

  readonly workAddressSuggestions = signal<AddressSuggestion[]>([]);
  readonly workAddressOpen = signal<boolean>(false);

  readonly siretStatus = signal<'idle' | 'loading' | 'valid' | 'invalid' | 'closed'>('idle');
  readonly siretCompanyName = signal<string | null>(null);
  readonly captchaToken = signal<string | null>(null);

  private readonly personalAddressSearch$ = new Subject<string>();
  private readonly workAddressSearch$ = new Subject<string>();

  readonly turnstileSiteKey = inject(AppConfigService).get('turnstileSiteKey');
  @ViewChild(TurnstileComponent) private readonly turnstile!: TurnstileComponent;

  constructor() {
    this.tradeApi.getAll().subscribe(trades => this.trades.set(trades));

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
      professionalEmail: ['', optionalEmailValidator],
      photo: new FormControl<File | null>(null, { nonNullable: false, validators: [Validators.required] }),
      idFront: new FormControl<File | null>(null, { nonNullable: false, validators: [Validators.required] }),
      idBack: new FormControl<File | null>(null, { nonNullable: false, validators: [Validators.required] }),
      logo: new FormControl<File | null>(null, { nonNullable: false, validators: [Validators.required] }),
      rib: new FormControl<File | null>(null, { nonNullable: false, validators: [Validators.required] }),
      companyName: ['', Validators.required],
      workAddress: this.fb.group({
        streetNumber: ['', [Validators.required, Validators.pattern(STREET_NUMBER_REGEXP)]],
        streetName: ['', Validators.required],
        additionalInfo: [''],
        postalCode: ['', [Validators.required, Validators.pattern(POSTAL_CODE_REGEXP)]],
        city: ['', Validators.required],
      }),
      siret: ['', [Validators.required, Validators.pattern(SIRET_REGEXP)]],
      companyStatus: ['', Validators.required],
      trades: [<string[]>[], [Validators.required]],
      yearsExperience: ['', [Validators.required, Validators.min(0)]],
      onCall: [false],
      hours: this.fb.array(
        this.days.map((day) =>
          this.fb.group(
            { day, openHour: '', openMinute: '', closeHour: '', closeMinute: '', closed: false, onCallDay: false },
            { validators: [Validators.required, hourValidator] },
          ),
        ),
        { validators: [openingAtLeastOne] }
      ),
      description: ['', [Validators.required, Validators.maxLength(1000)]],
      trustName: [''],
      trustPhone: [''],
      suppliers: new FormControl<string[]>([], { nonNullable: true, validators: [Validators.required] }),
      mediatorName: [''],
      mediatorAddress: [''],
      mediatorWebsite: [''],
      mediatorContactMethod: [''],
      mediatorAdditionalInfo: ['', Validators.maxLength(500)],
      additionalRemarks: ['', Validators.maxLength(500)],
      companyRemarks: ['', Validators.maxLength(500)],
    }, { validators: [trustedContactValidator] }),
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

  readonly passwordCriteria = computed(() => evaluatePasswordCriteria(this.passwordValue() as string));

  readonly yearsExperienceValue = toSignal(
    this.form.get('professionalProfile.yearsExperience')!.valueChanges,
    { initialValue: this.form.get('professionalProfile.yearsExperience')!.value }
  );

  readonly showCmod = computed(() => {
    const years = Number(this.yearsExperienceValue());
    return !isNaN(years) && years >= 3;
  });

  get hours(): FormArray {
    return this.form.get('professionalProfile.hours') as FormArray;
  }

  nextStep() {
    this.step.set(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
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
        if (result.companyName) companyCtrl?.setValue(result.companyName);
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

  // --- Files (non-diploma) ---
  private setPreview(target: DocTarget, val: string | null) {
    if (target === 'photo') this.photoPreview.set(val);
    else if (target === 'idFront') this.idFrontPreview.set(val);
    else if (target === 'idBack') this.idBackPreview.set(val);
    else if (target === 'logo') this.logoPreview.set(val);
    else if (target === 'rib') this.ribPreview.set(val);
  }

  private setName(target: DocTarget, name: string | null) {
    if (target === 'photo') this.photoName.set(name);
    else if (target === 'idFront') this.idFrontName.set(name);
    else if (target === 'idBack') this.idBackName.set(name);
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

  // --- Diplomas (multiple) ---
  addDiplomaSlot() {
    this.diplomaFiles.update(list => [...list, { file: null, preview: null, fileName: null, documentName: '', expiryDate: '' }]);
  }

  removeDiplomaSlot(index: number) {
    if (this.diplomaFiles().length < 2) return;
    this.diplomaFiles.update(list => list.filter((_, i) => i !== index));
  }

  updateDiplomaDocumentName(index: number, value: string) {
    this.diplomaFiles.update(list => list.map((entry, i) => i === index ? { ...entry, documentName: value } : entry));
  }

  updateDiplomaExpiry(index: number, value: string) {
    this.diplomaFiles.update(list => list.map((entry, i) => i === index ? { ...entry, expiryDate: value } : entry));
  }

  onDiplomaFileChange(index: number, e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0] ?? null;
    if (!file) {
      this.diplomaFiles.update(list => list.map((entry, i) => i === index ? { ...entry, file: null, preview: null, fileName: null } : entry));
      return;
    }
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        this.diplomaFiles.update(list => list.map((entry, i) => i === index ? { ...entry, file, preview: reader.result as string, fileName: file.name } : entry));
      };
      reader.readAsDataURL(file);
    } else {
      this.diplomaFiles.update(list => list.map((entry, i) => i === index ? { ...entry, file, preview: null, fileName: file.name } : entry));
    }
  }

  removeDiplomaFile(index: number) {
    this.diplomaFiles.update(list => list.map((entry, i) => i === index ? { ...entry, file: null, preview: null, fileName: null } : entry));
  }

  // --- Opening hours ---
  resetTime(ctrl: AbstractControl) {
    ctrl.get('openHour')?.setValue('');
    ctrl.get('openMinute')?.setValue('');
    ctrl.get('closeHour')?.setValue('');
    ctrl.get('closeMinute')?.setValue('');
  }

  onDayCheckboxChange(ctrl: AbstractControl, changed: 'closed' | 'onCallDay') {
    if (ctrl.get(changed)?.value) {
      const other = changed === 'closed' ? 'onCallDay' : 'closed';
      ctrl.get(other)?.setValue(false);
    }
    this.resetTime(ctrl);
  }

  onOpenTimeChange(ctrl: AbstractControl) {
    const openH = (ctrl.get('openHour')?.value as string) ?? '';
    const openM = (ctrl.get('openMinute')?.value as string) ?? '';
    const closeH = (ctrl.get('closeHour')?.value as string) ?? '';
    const closeM = (ctrl.get('closeMinute')?.value as string) ?? '';
    if (!openH || !openM || !closeH || !closeM) return;
    const start = `${openH.padStart(2, '0')}:${openM.padStart(2, '0')}`;
    const end = `${closeH.padStart(2, '0')}:${closeM.padStart(2, '0')}`;
    if (start >= end) {
      ctrl.get('closeHour')?.setValue('');
      ctrl.get('closeMinute')?.setValue('');
    }
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

  // --- Suppliers ---
  onSupplierInput(event: Event) {
    this.supplierQuery.set((event.target as HTMLInputElement).value);
    this.supplierDropdownOpen.set(true);
  }

  addSupplierFromInput() {
    const value = this.supplierQuery().trim();
    if (!value) return;
    const ctrl = this.form.get('professionalProfile.suppliers')!;
    const current = ctrl.value as string[];
    if (!current.includes(value)) ctrl.setValue([...current, value]);
    this.supplierQuery.set('');
    this.supplierDropdownOpen.set(false);
  }

  closeSupplierDropdown() {
    setTimeout(() => this.supplierDropdownOpen.set(false), 150);
  }

  removeSupplier(supplier: string) {
    const ctrl = this.form.get('professionalProfile.suppliers')!;
    ctrl.setValue((ctrl.value as string[]).filter((s) => s !== supplier));
  }

  // --- Submit ---
  submit() {
    console.log('submit', this.form.value);
    this.showSubmitError.set(false);
    this.hasStep1Errors.set(false);
    this.diplomaTouched.set(true);
    this.hoursTouched.set(true);
    this.form.markAllAsTouched();

    const user = this.form.value.user;

    if (this.form.invalid || user?.password !== user?.confirmPassword || !this.diplomasValid()) {
      this.showSubmitError.set(true);

      const step1Controls = [
        this.form.get('user'),
        this.form.get('professionalProfile.professionalEmail'),
        this.form.get('professionalProfile.managerPhone'),
        this.form.get('professionalProfile.photo'),
        this.form.get('professionalProfile.idFront'),
        this.form.get('professionalProfile.idBack'),
      ];

      const isStep1Invalid = step1Controls.some(ctrl => ctrl?.invalid)
        || !this.diplomasValid()
        || !!this.form.get('professionalProfile')?.errors?.['trustedContactIncomplete'];

      const passwordMismatch = user?.password !== user?.confirmPassword;

      if (isStep1Invalid || passwordMismatch) {
        this.hasStep1Errors.set(true);
      }

      const findInvalid = (group: AbstractControl, path = ''): void => {
        if ('controls' in group) {
          Object.entries((group as any).controls).forEach(([k, c]) => findInvalid(c as any, path ? `${path}.${k}` : k));
        } else if (group.invalid) {
          console.warn('Invalid control:', path, group.errors);
        }
      };
      findInvalid(this.form);

      setTimeout(() => {
        const firstError = document.querySelector<HTMLElement>(
          'input.ng-invalid.ng-touched, select.ng-invalid.ng-touched, textarea.ng-invalid.ng-touched, .force-invalid'
        );
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);

      return;
    }

    this.adressError.set(null);
    const captchaToken = this.captchaToken();
    if (!captchaToken) return;

    this.form.value.user!.lastName = this.form.value.user!.lastName!.trim().toUpperCase();
    this.form.value.user!.firstName = capitalize(this.form.value.user!.firstName!.trim());

    const raw = this.form.value;
    const rawHours = ((raw.professionalProfile?.hours ?? []) as {
      day: string;
      openHour: string; openMinute: string;
      closeHour: string; closeMinute: string;
      closed: boolean;
      onCallDay: boolean;
    }[]);

    const openingHours = {
      days: rawHours.map(h => {
        const start = !h.closed && h.openHour && h.openMinute
          ? `${h.openHour.padStart(2, '0')}:${h.openMinute.padStart(2, '0')}`
          : null;
        const end = !h.closed && h.closeHour && h.closeMinute
          ? `${h.closeHour.padStart(2, '0')}:${h.closeMinute.padStart(2, '0')}`
          : null;
        return {
          day: h.day,
          closed: h.closed,
          onCall: h.onCallDay,
          intervals: start && end ? [{ start, end }] : [],
        };
      }),
    };

    const { hours: _h, trustName, trustPhone, suppliers, photo, idFront, idBack, logo, rib, additionalRemarks, companyRemarks, ...profRest } =
      raw.professionalProfile as Record<string, unknown> & {
        hours: unknown; trustName: string; trustPhone: string; suppliers: string[];
        photo: File | null; idFront: File | null; idBack: File | null;
        logo: File | null; rib: File | null; additionalRemarks: string; companyRemarks: string;
      };

    const { confirmPassword: _cp, ...userFields } = raw.user as Record<string, unknown> & { confirmPassword: unknown };

    const referralCode = getAffiliateCode();
    const payload: Record<string, unknown> = {
      lang: this.langService.lang(),
      user: { ...userFields },
      professionalProfile: {
        ...profRest,
        openingHours,
        trustedContactName: trustName || undefined,
        trustedContactPhone: trustPhone || undefined,
        suppliers,
        additionalRemarks: additionalRemarks || undefined,
        companyRemarks: companyRemarks || undefined,
      },
      ...(referralCode ? { referralCode } : {}),
    };

    const upload = (file: File | null) => file ? this.uploadService.upload(file) : of('');

    const diplomaEntries = this.diplomaFiles().filter(d => d.file !== null);
    const diplomaUploads$ = diplomaEntries.length > 0
      ? forkJoin(diplomaEntries.map(d => upload(d.file)))
      : of<string[]>([]);

    let mailSent = true;

    this.submitting.set(true);
    this.userApi.registerProfessional(payload, captchaToken)
      .pipe(
        switchMap(({ userId, accessToken, mailSent: ms }) => {
          mailSent = ms;
          this.authService.setTempToken(accessToken);
          clearAffiliateCode();
          return forkJoin([
            upload(photo),
            upload(idFront),
            upload(idBack),
            upload(logo),
            upload(rib),
          ]).pipe(
            switchMap(([photoKey, idFrontKey, idBackKey, companyLogoKey, ribKey]) =>
              diplomaUploads$.pipe(
                switchMap((diplomaKeys) =>
                  this.userApi.createProfessionalDocuments(userId, {
                    photoKey, idFrontKey, idBackKey,
                    diplomas: diplomaKeys.map((key, i) => ({
                      key,
                      documentName: diplomaEntries[i].documentName,
                      expiryDate: diplomaEntries[i].expiryDate,
                    })),
                    companyLogoKey, ribKey,
                  }),
                ),
              )
            ),
          );
        }),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/auth/login'], {
            queryParams: { registeredPro: 'success', mailFailed: mailSent ? null : '1' },
          });
        },
        error: (err) => {
          this.submitting.set(false);
          const msg = (err?.error?.message ?? '') as string;
          if (msg === 'INVALID_REFERRAL_CODE') {
            this.referralCodeError.set(true);
            this.turnstile.reset();
            this.onCaptchaReset();
            return;
          }
          if (msg.toLowerCase().includes('personnelle')) this.adressError.set('addressPersonal');
          else if (msg.toLowerCase().includes('travail')) this.adressError.set('addressWork');
          this.turnstile.reset();
          this.onCaptchaReset();
        },
      });
  }
}
