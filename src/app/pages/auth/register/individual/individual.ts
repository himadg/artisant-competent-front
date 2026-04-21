import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'register-individual',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslocoModule],
  templateUrl: './individual.html',
  styleUrl: './individual.scss',
})
export class RegisterIndividual {
  readonly fb = new FormBuilder();
  readonly photoPreview = signal<string | null>(null);
  readonly idPreview = signal<string | null>(null);
  readonly idName = signal<string | null>(null);
  readonly ribPreview = signal<string | null>(null);
  readonly ribName = signal<string | null>(null);
  readonly tradesKeys = ['plumbing', 'electricity', 'masonry', 'gardening'];
  readonly servicesKeys = ['installation', 'repair', 'maintenance', 'consulting'];

  readonly form = this.fb.group({
    gender: ['', Validators.required],
    lastName: ['', Validators.required],
    firstName: ['', Validators.required],
    birthDate: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
    phone: ['', Validators.required],
    address: this.fb.group({
      streetNumber: ['', Validators.required],
      streetName: ['', Validators.required],
      additionalInfo: [''],
      postalCode: ['', Validators.required],
      city: ['', Validators.required],
    }),
    offerServices: [false],
    trades: [<string[]>[]],
    services: [<string[]>[]],
    idCard: new FormControl<File | null>(null),
    rib: new FormControl<File | null>(null),
    captcha: [false, Validators.requiredTrue],
    terms: [false, Validators.requiredTrue],
  });

  addPhoto(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0] ?? null;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.photoPreview.set(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      this.photoPreview.set(null);
    }
  }

  removePhoto() {
    const ok = confirm('Supprimer la photo ?');
    if (ok) this.photoPreview.set(null);
  }

  addId(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0] ?? null;
    if (!file) {
      this.idPreview.set(null);
      this.idName.set(null);
      this.form.patchValue({ idCard: null });
      return;
    }
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => this.idPreview.set(reader.result as string);
      reader.readAsDataURL(file);
      this.idName.set(file.name);
    } else {
      this.idPreview.set(null);
      this.idName.set(file.name);
    }
    this.form.patchValue({ idCard: file });
  }

  removeId() {
    const ok = confirm('Supprimer la carte d\'identité ?');
    if (ok) {
      this.idPreview.set(null);
      this.idName.set(null);
      this.form.patchValue({ idCard: null });
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

  toggleOfferServices(e: Event) {
    const checked = (e.target as HTMLInputElement).checked;
    this.form.patchValue({ offerServices: checked });
    const idCtrl = this.form.get('idCard') as FormControl<File | null>;
    const ribCtrl = this.form.get('rib') as FormControl<File | null>;
    if (checked) {
      idCtrl.setValidators([Validators.required]);
      ribCtrl.setValidators([Validators.required]);
    } else {
      idCtrl.clearValidators();
      ribCtrl.clearValidators();
    }
    idCtrl.updateValueAndValidity();
    ribCtrl.updateValueAndValidity();
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
    const payload = {
      ...this.form.value,
      idCardName: this.idName(),
      ribName: this.ribName(),
    } as any;
    console.log(payload);
  }
}
