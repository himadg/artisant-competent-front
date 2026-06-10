import { capitalize } from './../../../../core/utils/common-utils';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

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
import { LegalModal } from '../../../../shared/components/legal-modal/legal-modal';
import { FileUpload } from '../../../../shared/components/file-upload/file-upload';

@Component({
  selector: 'register-supplier',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, TranslocoModule, LegalModal, FileUpload],
  templateUrl: './supplier.html',
  styleUrl: './supplier.scss',
})
export class RegisterSupplier {
  readonly fb = new FormBuilder();
  readonly legalModalOpen = signal(false);

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
      this.days.map((d) =>
        this.fb.nonNullable.group({ day: d, start: '', end: '' }, { validators: [this.hourValidator] }),
      ),
    ),
    siret: ['', [Validators.required, Validators.pattern(/^\d{14}$/)]],
    services: [<string[]>[]],
    captcha: [false, Validators.requiredTrue],
    terms: [false, Validators.requiredTrue],
    // Valeurs : clés de stockage renvoyées par le backend (upload via ac-file-upload).
    logoKey: new FormControl<string | null>(null),
    ribKey: new FormControl<string | null>(null),
  });

  get hours(): FormArray {
    return this.form.get('hours') as FormArray;
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
    this.form.value.lastName = (this.form.value.lastName as string).toUpperCase();
    this.form.value.firstName = capitalize(this.form.value.firstName as string);
    const payload = {
      ...this.form.value,
    };
  }
}
