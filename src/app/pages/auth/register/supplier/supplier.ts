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
  selector: 'register-supplier',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslocoModule],
  templateUrl: './supplier.html',
  styleUrl: './supplier.scss',
})
export class RegisterSupplier {
  readonly fb = new FormBuilder();
  readonly logoPreview = signal<string | null>(null);
  readonly logoName = signal<string | null>(null);
  readonly ribPreview = signal<string | null>(null);
  readonly ribName = signal<string | null>(null);

  readonly servicesKeys = ['installation', 'repair', 'maintenance', 'consulting'];
  readonly days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  private hourValidator = (group: AbstractControl) => {
    const g = group as FormGroup;
    const start = g.get('start')?.value as string;
    const end = g.get('end')?.value as string;
    if (!start && !end) return null;
    if (!start || !end) return { timeRequired: true } as any;
    return start < end ? null : ({ timeOrder: true } as any);
  };

  readonly form = this.fb.group({
    gender: ['', Validators.required],
    lastName: ['', Validators.required],
    firstName: ['', Validators.required],
    companyName: ['', Validators.required],
    address: this.fb.group({
      streetNumber: ['', Validators.required],
      streetName: ['', Validators.required],
      additionalInfo: [''],
      postalCode: ['', Validators.required],
      city: ['', Validators.required],
    }),
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
    hours: this.fb.array(
      this.days.map((d) => this.fb.nonNullable.group({ day: d, start: '', end: '' }, { validators: [this.hourValidator] }))
    ),
    siret: ['', [Validators.required, Validators.pattern(/^\d{14}$/)]],
    services: [<string[]>[]],
    captcha: [false, Validators.requiredTrue],
    terms: [false, Validators.requiredTrue],
    logo: new FormControl<File | null>(null),
    rib: new FormControl<File | null>(null),
  });

  get hours(): FormArray {
    return this.form.get('hours') as FormArray;
  }

  addLogo(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0] ?? null;
    if (!file) {
      this.logoPreview.set(null);
      this.logoName.set(null);
      this.form.patchValue({ logo: null });
      return;
    }
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => this.logoPreview.set(reader.result as string);
      reader.readAsDataURL(file);
      this.logoName.set(file.name);
    } else {
      this.logoPreview.set(null);
      this.logoName.set(file.name);
    }
    this.form.patchValue({ logo: file });
  }

  removeLogo() {
    const ok = confirm('Supprimer le logo ?');
    if (ok) {
      this.logoPreview.set(null);
      this.logoName.set(null);
      this.form.patchValue({ logo: null });
    }
  }

  addRib(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0] ?? null;
    if (!file) {
      this.ribPreview.set(null);
      this.ribName.set(null);
      this.form.patchValue({ rib: null });
      return;
    }
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => this.ribPreview.set(reader.result as string);
      reader.readAsDataURL(file);
      this.ribName.set(file.name);
    } else {
      this.ribPreview.set(null);
      this.ribName.set(file.name);
    }
    this.form.patchValue({ rib: file });
  }

  removeRib() {
    const ok = confirm('Supprimer le RIB ?');
    if (ok) {
      this.ribPreview.set(null);
      this.ribName.set(null);
      this.form.patchValue({ rib: null });
    }
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
    const payload = {
      ...this.form.value,
      logoName: this.logoName(),
      ribName: this.ribName(),
    } as any;
    console.log(payload);
  }
}
