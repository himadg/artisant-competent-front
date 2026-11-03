import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { AuthService } from '../../../core/services/auth.service';
import { FlashMessageService } from '../../../core/services/flash-message.service';
import { evaluatePasswordCriteria } from '../../../core/utils/common-utils';
import { PASSWORD_STRONG_REGEXP } from '../../../core/utils/regexp';

type SubmitError = 'invalidToken' | 'rateLimited' | 'generic';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, TranslocoModule, RouterModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPasswordPage {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly flashMessage = inject(FlashMessageService);

  // Lu une seule fois à l'ouverture de la page : le lien de reset n'est valable que pour cette
  // visite, pas de raison de le relire dynamiquement en cas de navigation interne.
  readonly token = this.route.snapshot.queryParamMap.get('token');

  readonly showPassword = signal(false);
  readonly showConfirmPassword = signal(false);
  readonly passwordFocused = signal(false);
  readonly loading = signal(false);
  readonly submitError = signal<SubmitError | null>(null);

  readonly form = this.fb.group({
    password: ['', [Validators.required, Validators.pattern(PASSWORD_STRONG_REGEXP)]],
    confirmPassword: ['', Validators.required],
  });

  readonly passwordValue = toSignal(this.form.get('password')!.valueChanges, {
    initialValue: this.form.get('password')!.value,
  });
  readonly passwordCriteria = computed(() => evaluatePasswordCriteria(this.passwordValue() as string));

  togglePassword(): void {
    this.showPassword.update((show) => !show);
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update((show) => !show);
  }

  async submit(): Promise<void> {
    if (!this.token) return;

    this.form.markAllAsTouched();
    if (this.form.invalid || this.form.value.password !== this.form.value.confirmPassword) return;

    this.loading.set(true);
    this.submitError.set(null);

    try {
      await this.authService.resetPassword(this.token, this.form.getRawValue().password!);
      this.flashMessage.set({ type: 'success', key: 'resetPassword.success' });
      await this.router.navigate(['/auth/login']);
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status;
      if (status === 429) this.submitError.set('rateLimited');
      else if (status === 400) this.submitError.set('invalidToken');
      else this.submitError.set('generic');
    } finally {
      this.loading.set(false);
    }
  }
}
