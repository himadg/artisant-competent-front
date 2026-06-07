import { AbstractControl, FormArray, FormGroup, ValidatorFn, ValidationErrors, Validators } from '@angular/forms';

export const hourValidator: ValidatorFn = (group: AbstractControl) => {
  const form = group as FormGroup;
  const start = form.get('start')?.value as string;
  const end = form.get('end')?.value as string;
  if (!start && !end) return null;
  if (!start || !end) return { timeRequired: true } as ValidationErrors;
  return start < end ? null : ({ timeOrder: true } as ValidationErrors);
};

export const openingAtLeastOne: ValidatorFn = (control: AbstractControl) => {
  const arr = control as FormArray;
  const ok = arr.controls.some((control) => {
    const group = control as FormGroup;
    const start = group.get('start')?.value;
    const end = group.get('end')?.value;
    return !!start && !!end;
  });
  return ok ? null : ({ atLeastOneOpen: true } as ValidationErrors);
};

export const servicesValidator = (getPendingCount: () => number): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const hasExisting = Array.isArray(control.value) && control.value.length > 0;
    const hasPending = getPendingCount() > 0;
    return (hasExisting || hasPending) ? null : { required: true };
  };
};

export const optionalEmailValidator: ValidatorFn = (control: AbstractControl) => {
  const value = (control.value as string)?.trim();
  if (!value) return null;
  return Validators.email(control);
};

export const decennialInsuranceValidator: ValidatorFn = (group: AbstractControl) => {
  const form = group as FormGroup;
  const name = (form.get('decennialInsuranceName')?.value as string)?.trim();
  const number = (form.get('decennialInsuranceNumber')?.value as string)?.trim();
  const expiry = form.get('decennialInsuranceExpiry')?.value as string;
  const doc = form.get('decennialInsuranceDoc')?.value;

  const filled = [name, number, expiry, doc].filter(v => v !== null && v !== '' && v !== undefined).length;
  if (filled !== 4) return { decennialInsuranceIncomplete: true };
  return null;
};

export const trustedContactValidator: ValidatorFn = (group: AbstractControl) => {
  const form = group as FormGroup;
  const name = (form.get('trustName')?.value as string)?.trim();
  const phone = (form.get('trustPhone')?.value as string)?.trim();

  if (!!name !== !!phone) return { trustedContactIncomplete: true };
  return null;
};
