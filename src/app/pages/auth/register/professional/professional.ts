import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
  FormGroup,
  AbstractControl,
} from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'register-professional',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslocoModule],
  templateUrl: './professional.html',
  styleUrl: './professional.scss',
})
export class RegisterProfessional {
  readonly fb = new FormBuilder();
  readonly step = signal<1 | 2>(1);

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

  readonly tradesKeys = ['locksmith', 'plumbing', 'electricity'];
  readonly servicesKeys = ['installation', 'repair', 'maintenance', 'consulting'];

  private emailsValidator = (group: AbstractControl) => {
    const g = group as FormGroup;
    const personal = g.get('personalEmail')?.value as string;
    const professional = g.get('professionalEmail')?.value as string;
    return personal || professional ? null : ({ emailRequired: true } as any);
  };

  private hourValidator = (group: AbstractControl) => {
    const g = group as FormGroup;
    const start = g.get('start')?.value as string;
    const end = g.get('end')?.value as string;
    if (!start && !end) return null;
    if (!start || !end) return { timeRequired: true } as any;
    return start < end ? null : ({ timeOrder: true } as any);
  };

  readonly days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  readonly form = this.fb.group({
    gender: ['', Validators.required],
    lastName: ['', Validators.required],
    firstName: ['', Validators.required],
    birthDate: ['', Validators.required],
    managerStatus: ['', Validators.required],
    managerPhone: ['', Validators.required],
    emails: this.fb.group(
      {
        personalEmail: ['', Validators.email],
        professionalEmail: ['', Validators.email],
      },
      { validators: [this.emailsValidator] }
    ),
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
    address: this.fb.group({
      streetNumber: ['', Validators.required],
      streetName: ['', Validators.required],
      additionalInfo: [''],
      postalCode: ['', Validators.required],
      city: ['', Validators.required],
    }),
    photo: new FormControl<File | null>(null, { nonNullable: false, validators: [Validators.required] }),
    idFront: new FormControl<File | null>(null, { nonNullable: false, validators: [Validators.required] }),
    idBack: new FormControl<File | null>(null, { nonNullable: false, validators: [Validators.required] }),
    insuranceDoc: new FormControl<File | null>(null, { nonNullable: false, validators: [Validators.required] }),
    insuranceName: ['', Validators.required],
    insuranceNumber: ['', Validators.required],
    insuranceExpiry: ['', Validators.required],
    diplomaDoc: new FormControl<File | null>(null, { nonNullable: false, validators: [Validators.required] }),

    logo: new FormControl<File | null>(null, { nonNullable: false, validators: [Validators.required] }),
    companyName: ['', Validators.required],
    workAddress: this.fb.group({
      streetNumber: ['', Validators.required],
      streetName: ['', Validators.required],
      additionalInfo: [''],
      postalCode: ['', Validators.required],
      city: ['', Validators.required],
    }),
    siret: ['', [Validators.required, Validators.pattern(/^\d{14}$/)]],
    rib: new FormControl<File | null>(null, { nonNullable: false, validators: [Validators.required] }),
    trades: [<string[]>[]],
    yearsExperience: [0, [Validators.required, Validators.min(0)]],
    onCall: [false],
    hours: this.fb.array(
      this.days.map((d) => this.fb.group({ day: d, start: '', end: '' }, { validators: [this.hourValidator] }))
    ),
    description: ['', [Validators.required, Validators.maxLength(500)]],
    services: [<string[]>[]],
    trustName: [''],
    trustPhone: [''],
    suppliers: ['', Validators.required],
    captcha: [false, Validators.requiredTrue],
    terms: [false, Validators.requiredTrue],
  });

  get hours(): FormArray {
    return this.form.get('hours') as FormArray;
  }

  nextStep() {
    this.step.set(2);
  }
  backStep() {
    this.step.set(1);
  }

  addFile(target: 'photo' | 'idFront' | 'idBack' | 'insuranceDoc' | 'diplomaDoc' | 'logo' | 'rib', e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0] ?? null;
    const setPreview = (val: string | null) => {
      if (target === 'photo') this.photoPreview.set(val);
      else if (target === 'idFront') this.idFrontPreview.set(val);
      else if (target === 'idBack') this.idBackPreview.set(val);
      else if (target === 'insuranceDoc') this.insuranceDocPreview.set(val);
      else if (target === 'diplomaDoc') this.diplomaPreview.set(val);
      else if (target === 'logo') this.logoPreview.set(val);
      else if (target === 'rib') this.ribPreview.set(val);
    };
    const setName = (name: string | null) => {
      if (target === 'photo') this.photoName.set(name);
      else if (target === 'idFront') this.idFrontName.set(name);
      else if (target === 'idBack') this.idBackName.set(name);
      else if (target === 'insuranceDoc') this.insuranceDocName.set(name);
      else if (target === 'diplomaDoc') this.diplomaName.set(name);
      else if (target === 'logo') this.logoName.set(name);
      else if (target === 'rib') this.ribName.set(name);
    };
    if (!file) {
      setPreview(null);
      setName(null);
      this.form.patchValue({ [target]: null } as any);
      return;
    }
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
      setName(file.name);
    } else {
      setPreview(null);
      setName(file.name);
    }
    this.form.patchValue({ [target]: file } as any);
  }

  removeFile(target: 'photo' | 'idFront' | 'idBack' | 'insuranceDoc' | 'diplomaDoc' | 'logo' | 'rib') {
    const ok = confirm('Supprimer le fichier ?');
    if (ok) {
      const setPreview = (val: string | null) => {
        if (target === 'photo') this.photoPreview.set(val);
        else if (target === 'idFront') this.idFrontPreview.set(val);
        else if (target === 'idBack') this.idBackPreview.set(val);
        else if (target === 'insuranceDoc') this.insuranceDocPreview.set(val);
        else if (target === 'diplomaDoc') this.diplomaPreview.set(val);
        else if (target === 'logo') this.logoPreview.set(val);
        else if (target === 'rib') this.ribPreview.set(val);
      };
      const setName = (name: string | null) => {
        if (target === 'photo') this.photoName.set(name);
        else if (target === 'idFront') this.idFrontName.set(name);
        else if (target === 'idBack') this.idBackName.set(name);
        else if (target === 'insuranceDoc') this.insuranceDocName.set(name);
        else if (target === 'diplomaDoc') this.diplomaName.set(name);
        else if (target === 'logo') this.logoName.set(name);
        else if (target === 'rib') this.ribName.set(name);
      };
      setPreview(null);
      setName(null);
      this.form.patchValue({ [target]: null } as any);
    }
  }

  isTradeSelected(key: string) {
    const v = this.form.value.trades as string[];
    return Array.isArray(v) && v.includes(key);
  }
  toggleTrade(key: string) {
    const v = (this.form.value.trades as string[]) ?? [];
    const next = v.includes(key) ? v.filter((k) => k !== key) : [...v, key];
    this.form.patchValue({ trades: next });
  }
  isServiceSelected(key: string) {
    const v = this.form.value.services as string[];
    return Array.isArray(v) && v.includes(key);
  }
  toggleService(key: string) {
    const v = (this.form.value.services as string[]) ?? [];
    const next = v.includes(key) ? v.filter((k) => k !== key) : [...v, key];
    this.form.patchValue({ services: next });
  }

  submit() {
    if (this.form.value.password !== this.form.value.confirmPassword) return;
    if (this.form.invalid) return;
    const payload = { ...this.form.value } as any;
    console.log(payload);
  }
}
