import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import {
  PRO_REJECTION_DETAILS_MAX_LENGTH,
  PRO_REJECTION_REASONS,
  ProRejectionReason,
  RejectProfessionalPayload,
} from '../../../../shared/interfaces/user';

@Component({
  selector: 'reject-pro-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, TranslocoModule],
  templateUrl: './reject-pro-modal.html',
})
export class RejectProModal {
  /** Nom affiché dans le titre (prénom nom — entreprise). */
  readonly displayName = input.required<string>();
  /** Requête de refus en cours côté parent : bloque la double soumission et la fermeture. */
  readonly submitting = input(false);

  readonly cancelled = output<void>();
  readonly confirmed = output<RejectProfessionalPayload>();

  private readonly fb = inject(FormBuilder);

  readonly reasons = PRO_REJECTION_REASONS;
  readonly detailsMaxLength = PRO_REJECTION_DETAILS_MAX_LENGTH;

  readonly form = this.fb.nonNullable.group({
    reason: this.fb.nonNullable.control<ProRejectionReason | ''>('', Validators.required),
    details: ['', Validators.maxLength(PRO_REJECTION_DETAILS_MAX_LENGTH)],
  });

  readonly detailsValue = toSignal(this.form.controls.details.valueChanges, { initialValue: '' });
  readonly formStatus = toSignal(this.form.statusChanges, { initialValue: this.form.status });

  close() {
    if (!this.submitting()) this.cancelled.emit();
  }

  submit() {
    if (this.form.invalid || this.submitting()) return;
    const { reason, details } = this.form.getRawValue();
    const trimmed = details.trim();
    this.confirmed.emit({ reason: reason as ProRejectionReason, ...(trimmed && { details: trimmed }) });
  }
}
