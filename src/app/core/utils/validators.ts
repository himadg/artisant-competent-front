import { AbstractControl, FormArray, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { PHONE_FR_REGEXP } from './regexp';

export const hourValidator: ValidatorFn = (group: AbstractControl) => {
  const form = group as FormGroup;
  const closed = form.get('closed')?.value;
  const onCallDay = form.get('onCallDay')?.value;
  if (closed || onCallDay) return null;

  const openHour = form.get('openHour')?.value as string;
  const openMinute = form.get('openMinute')?.value as string;
  const closeHour = form.get('closeHour')?.value as string;
  const closeMinute = form.get('closeMinute')?.value as string;

  if (!openHour || !openMinute || !closeHour || !closeMinute) return { timeRequired: true };

  const start = `${openHour.padStart(2, '0')}:${openMinute.padStart(2, '0')}`;
  const end = `${closeHour.padStart(2, '0')}:${closeMinute.padStart(2, '0')}`;
  return start < end ? null : { timeOrder: true };
};

export const openingAtLeastOne: ValidatorFn = (control: AbstractControl) => {
  const arr = control as FormArray;
  const ok = arr.controls.some((ctrl) => {
    const group = ctrl as FormGroup;
    const closed = group.get('closed')?.value as boolean;
    const onCallDay = group.get('onCallDay')?.value as boolean;
    if (closed || onCallDay) return true;
    return !!group.get('openHour')?.value && !!group.get('openMinute')?.value
      && !!group.get('closeHour')?.value && !!group.get('closeMinute')?.value;
  });
  return ok ? null : { atLeastOneOpen: true };
};

export const optionalEmailValidator: ValidatorFn = (control: AbstractControl) => {
  const value = (control.value as string)?.trim();
  if (!value) return null;
  return Validators.email(control);
};

export const optionalPhoneValidator: ValidatorFn = (control: AbstractControl) => {
  const value = (control.value as string)?.trim();
  if (!value) return null;
  return Validators.pattern(PHONE_FR_REGEXP)(control);
};

export const pastDateValidator: ValidatorFn = (control: AbstractControl) => {
  const value = control.value as string;
  if (!value) return null;
  return value <= new Date().toLocaleDateString('en-CA') ? null : { futureDate: true };
};

export const trustedContactValidator: ValidatorFn = (group: AbstractControl) => {
  const form = group as FormGroup;
  const name = (form.get('trustName')?.value as string)?.trim();
  const phone = (form.get('trustPhone')?.value as string)?.trim();

  if (!!name !== !!phone) return { trustedContactIncomplete: true };
  return null;
};
