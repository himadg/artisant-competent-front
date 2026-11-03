import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, TranslocoModule, RouterModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPasswordPage {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  readonly loading = signal(false);
  // true une fois la demande envoyée avec succès : affiche la confirmation générique à la place
  // du formulaire, que l'email corresponde ou non à un compte (le backend ne le révèle jamais).
  readonly sent = signal(false);
  readonly serverError = signal<string | null>(null);

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.serverError.set(null);

    try {
      await this.authService.forgotPassword(this.form.getRawValue().email!);
      this.sent.set(true);
    } catch {
      this.serverError.set('forgotPassword.errors.generic');
    } finally {
      this.loading.set(false);
    }
  }
}
