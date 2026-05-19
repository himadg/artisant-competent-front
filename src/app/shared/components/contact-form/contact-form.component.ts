import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  Output,
  PLATFORM_ID,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { timeout } from 'rxjs';
import { ContactFormData, ContactSubject } from '../../interfaces/contact-form';

/** Étapes du cycle de vie de l'envoi du formulaire. */
type ContactFormStatus = 'idle' | 'sending' | 'success' | 'error';

/** Compteur module-level pour générer des id uniques : sur la home, deux instances coexistent (section + footer). */
let nextContactFormId = 0;

/**
 * Formulaire de contact réutilisable — inséré sur la page d'accueil et dans l'accordéon du footer.
 *
 * - Reactive Forms : validation native (requis, longueurs, email, téléphone FR).
 * - Envoi `POST /api/contact` côté navigateur uniquement (jamais en SSR).
 * - Mode optimistic en attendant le backend : un 404 ou une erreur réseau est traité
 *   comme un succès (voir `isOptimisticFailure`).
 *
 * @example
 * ```html
 * <app-contact-form source="home" (submitted)="onContactSubmitted($event)"></app-contact-form>
 * ```
 */
@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [ReactiveFormsModule, TranslocoModule],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactFormComponent {
  /** Origine de l'envoi — tracée côté backend pour distinguer la home du footer (requis). */
  readonly source = input.required<'home' | 'footer'>();

  /** Émis après un envoi considéré comme réussi, avec les données soumises. */
  @Output() readonly submitted = new EventEmitter<ContactFormData>();

  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  /** Regex permissive : accepte les formats FR 06… / +33… / 0033… avec espaces, points ou tirets. */
  private static readonly PHONE_PATTERN = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;

  /** Délai au-delà duquel l'appel HTTP est abandonné (évite un bouton bloqué indéfiniment). */
  private static readonly REQUEST_TIMEOUT_MS = 8000;

  /** Longueur maximale du message (alignée sur le compteur affiché et le validateur). */
  protected static readonly MESSAGE_MAX_LENGTH = 1000;

  /** Clés des sujets proposés dans le select, dans l'ordre d'affichage. */
  protected readonly subjectKeys: readonly ContactSubject[] = [
    'general',
    'service',
    'affiliate',
    'currentRequest',
    'technical',
    'press',
    'other',
  ];

  protected readonly messageMaxLength = ContactFormComponent.MESSAGE_MAX_LENGTH;

  /** Préfixe d'id unique à l'instance — garantit des `for`/`id` distincts entre les deux formulaires d'une page. */
  private readonly uid = `contact-form-${++nextContactFormId}`;

  protected readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.pattern(ContactFormComponent.PHONE_PATTERN)]],
    subject: ['', [Validators.required]],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(ContactFormComponent.MESSAGE_MAX_LENGTH)]],
    consent: [false, [Validators.requiredTrue]],
  });

  /** État courant de l'envoi (pilote l'affichage : formulaire, bloc d'erreur ou bloc de succès). */
  protected readonly status = signal<ContactFormStatus>('idle');

  /** Longueur du message saisi, pour le compteur de caractères. */
  private readonly messageValue = toSignal(this.form.controls.message.valueChanges, { initialValue: '' });
  protected readonly messageLength = computed(() => this.messageValue()?.length ?? 0);

  /** id de l'élément de contrôle (input/select/textarea) d'un champ. */
  protected controlId(field: string): string {
    return `${this.uid}-${field}`;
  }

  /** id du message d'erreur d'un champ (référencé par `aria-describedby`). */
  protected errorId(field: string): string {
    return `${this.uid}-${field}-error`;
  }

  /** id du texte d'aide d'un champ (référencé par `aria-describedby`). */
  protected helperId(field: string): string {
    return `${this.uid}-${field}-helper`;
  }

  /** Vrai si le champ est invalide et a déjà été visité — déclenche l'affichage du message d'erreur. */
  protected isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && control.touched;
  }

  /** Vrai si le champ visité porte l'erreur donnée (`required`, `minlength`, `email`, `pattern`…). */
  protected hasError(field: string, error: string): boolean {
    const control = this.form.get(field);
    return !!control && control.touched && control.hasError(error);
  }

  /** Construit `aria-describedby` : id du texte d'aide (si présent) + id de l'erreur (si affichée). */
  protected describedBy(field: string, hasHelper = false): string | null {
    const ids: string[] = [];
    if (hasHelper) ids.push(this.helperId(field));
    if (this.isInvalid(field)) ids.push(this.errorId(field));
    return ids.length ? ids.join(' ') : null;
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // SSR : aucun appel réseau côté serveur — l'envoi n'a de sens que dans le navigateur.
    if (!isPlatformBrowser(this.platformId)) return;

    const raw = this.form.getRawValue();
    const payload: ContactFormData = {
      name: raw.name!.trim(),
      email: raw.email!.trim(),
      phone: raw.phone?.trim() || undefined,
      subject: raw.subject as ContactSubject,
      message: raw.message!.trim(),
      consent: raw.consent!,
      source: this.source(),
    };

    this.status.set('sending');

    this.http
      .post('/api/contact', payload)
      .pipe(timeout(ContactFormComponent.REQUEST_TIMEOUT_MS), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.handleSuccess(payload),
        error: (err: unknown) => {
          // Mode optimistic en attendant le backend d'Ayoub : un 404 ou une erreur
          // réseau (endpoint absent) est traité comme un succès. Seules les vraies
          // erreurs serveur (5xx, 4xx hors 404) affichent le bloc d'erreur.
          if (this.isOptimisticFailure(err)) {
            this.handleSuccess(payload);
          } else {
            this.status.set('error');
          }
        },
      });
  }

  /** Détermine si l'échec doit être ignoré (endpoint pas encore créé) plutôt qu'affiché en erreur. */
  private isOptimisticFailure(err: unknown): boolean {
    if (err instanceof HttpErrorResponse) {
      // status 0 = erreur réseau/CORS ; 404 = endpoint /api/contact pas encore créé.
      return err.status === 0 || err.status === 404;
    }
    // TimeoutError ou erreur inattendue : on reste optimiste tant que le backend n'existe pas.
    return true;
  }

  private handleSuccess(payload: ContactFormData): void {
    this.status.set('success');
    this.submitted.emit(payload);
  }
}
