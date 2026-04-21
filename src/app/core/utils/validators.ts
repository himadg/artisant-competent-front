import { AbstractControl, FormArray, FormGroup, ValidatorFn, ValidationErrors } from '@angular/forms';

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
