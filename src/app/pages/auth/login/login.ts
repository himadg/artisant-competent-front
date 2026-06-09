import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, TranslocoModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  readonly loading = signal(false);
  readonly serverError = signal<string | null>(null);
  readonly showPassword = signal(false);

  readonly registeredPro = this.route.snapshot.queryParamMap.get('registeredPro') === 'success';
  readonly registeredProMailFailed = this.route.snapshot.queryParamMap.get('mailFailed') === '1';

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.serverError.set(null);

    const { email, password } = this.form.getRawValue();

    try {
      await this.authService.login(email!, password!);
      const user = this.authService.currentUser();

      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
      if (returnUrl) {
        this.router.navigateByUrl(returnUrl);
        return;
      }

      if (user?.role?.code === 'INDIVIDUAL') {
        alert(`Bienvenue ${user.firstName} ${user.lastName}`);
        this.router.navigate(['/']);
      } else {
        this.router.navigate(['/dashboard']);
      }
    } catch {
      this.serverError.set('login.errors.invalid');
    } finally {
      this.loading.set(false);
    }
  }

  togglePassword() {
    this.showPassword.update(show => !show);
  }
}
