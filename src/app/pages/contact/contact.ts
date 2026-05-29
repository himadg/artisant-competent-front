import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { AuthService } from '../../core/services/auth.service';
import { LangService } from '../../core/services/lang.service';

@Component({
  selector: 'contact-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, TranslocoModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class ContactPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly langService = inject(LangService);
  private readonly translocoService = inject(TranslocoService);

  readonly submitting = signal(false);
  readonly success = signal(false);
  readonly error = signal(false);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    motif: ['', Validators.required],
    otherDetail: [''],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(3000)]],
  });

  readonly isOther = computed(() => this.form.get('motif')?.value === 'other');

  readonly emailReadonly = signal(false);

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      const email = (user as any).professionalProfile?.professionalEmail || user.email;
      this.form.get('email')!.setValue(email);
      this.form.get('email')!.disable();
      this.emailReadonly.set(true);
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.isOther() && !this.form.get('otherDetail')?.value?.trim()) {
      this.form.get('otherDetail')!.markAsTouched();
      this.form.get('otherDetail')!.setErrors({ required: true });
      return;
    }

    this.submitting.set(true);
    this.success.set(false);
    this.error.set(false);

    const raw = this.form.getRawValue();
    const payload = {
      email: raw.email,
      motif: this.translocoService.translate(`contact.motifs.${raw.motif}`),
      otherDetail: raw.otherDetail || undefined,
      description: raw.description,
      lang: this.langService.lang(),
    };

    this.http.post('/contact', payload).subscribe({
      next: () => {
        this.success.set(true);
        this.submitting.set(false);
        this.form.get('motif')!.reset('');
        this.form.get('otherDetail')!.reset('');
        this.form.get('description')!.reset('');
      },
      error: () => {
        this.error.set(true);
        this.submitting.set(false);
      },
    });
  }
}