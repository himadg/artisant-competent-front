import { Component, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA, OnInit, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { isBefore, parseISO, startOfDay } from 'date-fns';
import { AuthService } from '../../../core/services/auth.service';
import { UserApiService } from '../../../core/services/user-api.service';
import { FlashMessageService } from '../../../core/services/flash-message.service';
import { DiplomaEntry } from '../../../shared/interfaces/diploma-entry';
import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_DOCUMENT_TYPES,
  DocTarget,
  IMAGE_ONLY_TARGETS,
  isFileTypeAllowed,
} from '../../../core/utils/file-types';
import { buildDocumentUploadErrorMessage } from '../../../core/utils/document-upload-error';

@Component({
  selector: 'complete-registration',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule],
  templateUrl: './complete-registration.html',
  styleUrl: './complete-registration.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CompleteRegistrationPage implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly userApi = inject(UserApiService);
  private readonly flashMessage = inject(FlashMessageService);
  private readonly router = inject(Router);
  private readonly transloco = inject(TranslocoService);

  readonly today = new Date().toLocaleDateString('en-CA');
  readonly submitting = signal(false);
  readonly touched = signal(false);

  readonly photoName = signal<string | null>(null);
  readonly idFrontName = signal<string | null>(null);
  readonly idBackName = signal<string | null>(null);
  readonly logoName = signal<string | null>(null);
  readonly ribName = signal<string | null>(null);

  // Data-URL pour un aperçu image, ou le repère "pdf" (aucun rendu de contenu, juste une icône) —
  // null tant qu'aucun fichier n'a été choisi pour ce champ.
  readonly photoPreview = signal<string | 'pdf' | null>(null);
  readonly idFrontPreview = signal<string | 'pdf' | null>(null);
  readonly idBackPreview = signal<string | 'pdf' | null>(null);
  readonly logoPreview = signal<string | 'pdf' | null>(null);
  readonly ribPreview = signal<string | 'pdf' | null>(null);

  private photo: File | null = null;
  private idFront: File | null = null;
  private idBack: File | null = null;
  private logo: File | null = null;
  private rib: File | null = null;

  readonly diplomaFiles = signal<DiplomaEntry[]>([
    { file: null, preview: null, fileName: null, documentName: '', expiryDate: '' },
  ]);

  // Indices des lignes de diplôme dont l'utilisateur a quitté le focus au moins une fois (ou
  // toutes, après une tentative d'envoi) — n'affiche les erreurs d'une ligne qu'une fois qu'on l'a
  // quittée, pas en continu pendant la saisie.
  readonly touchedDiplomaRows = signal<Set<number>>(new Set());

  readonly diplomaEntryErrors = computed(() =>
    this.diplomaFiles().map((d) => {
      if (!d.file && !d.documentName.trim() && !d.expiryDate) return null;
      const missingFile = !d.file;
      const missingName = !d.documentName.trim();
      const expiryPast = !!d.expiryDate && isBefore(parseISO(d.expiryDate), startOfDay(new Date()));
      const missingExpiry = !d.expiryDate;
      if (missingFile || missingName || expiryPast || missingExpiry) {
        return { missingFile, missingName, expiryPast, missingExpiry };
      }
      return null;
    }),
  );

  readonly diplomasValid = computed(() => {
    const entries = this.diplomaFiles();
    if (!entries.some((d) => d.file !== null)) return false;
    return this.diplomaEntryErrors().every((err, i) => {
      if (!entries[i].file && !entries[i].documentName.trim() && !entries[i].expiryDate) return true;
      return err === null;
    });
  });

  readonly formValid = computed(
    () => !!this.photo && !!this.idFront && !!this.idBack && !!this.logo && !!this.rib && this.diplomasValid(),
  );

  ngOnInit(): void {
    // Rien à reprendre pour un compte déjà complet : évite un accès direct à cet écran par URL.
    if (this.authService.currentUser()?.status !== 'INCOMPLETE') {
      this.router.navigate(['/dashboard']);
    }
  }

  logout(): void {
    this.authService.logout();
  }

  async addFile(target: DocTarget, e: Event): Promise<void> {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    if (!file) return;

    const allowedTypes = IMAGE_ONLY_TARGETS.has(target) ? ALLOWED_IMAGE_TYPES : ALLOWED_DOCUMENT_TYPES;
    if (!(await isFileTypeAllowed(file, allowedTypes))) {
      input.value = '';
      const key = IMAGE_ONLY_TARGETS.has(target) ? 'errors.invalidImageFormat' : 'errors.invalidDocumentFormat';
      this.flashMessage.set({ type: 'error', key });
      return;
    }

    if (target === 'photo') { this.photo = file; this.photoName.set(file.name); }
    else if (target === 'idFront') { this.idFront = file; this.idFrontName.set(file.name); }
    else if (target === 'idBack') { this.idBack = file; this.idBackName.set(file.name); }
    else if (target === 'logo') { this.logo = file; this.logoName.set(file.name); }
    else if (target === 'rib') { this.rib = file; this.ribName.set(file.name); }

    this.setPreview(target, file);
  }

  private setPreview(target: DocTarget, file: File): void {
    const preview = this.previewSignal(target);

    if (file.type === 'application/pdf') {
      preview.set('pdf');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => preview.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  private previewSignal(target: DocTarget) {
    return target === 'photo' ? this.photoPreview
      : target === 'idFront' ? this.idFrontPreview
      : target === 'idBack' ? this.idBackPreview
      : target === 'logo' ? this.logoPreview
      : this.ribPreview;
  }

  private nameSignal(target: DocTarget) {
    return target === 'photo' ? this.photoName
      : target === 'idFront' ? this.idFrontName
      : target === 'idBack' ? this.idBackName
      : target === 'logo' ? this.logoName
      : this.ribName;
  }

  removeFile(target: DocTarget): void {
    // Même confirmation que sur le formulaire d'inscription pro — comportement volontairement
    // identique entre les deux écrans.
    if (!confirm(this.transloco.translate('professional.confirmDeleteFile'))) return;

    if (target === 'photo') this.photo = null;
    else if (target === 'idFront') this.idFront = null;
    else if (target === 'idBack') this.idBack = null;
    else if (target === 'logo') this.logo = null;
    else this.rib = null;

    this.nameSignal(target).set(null);
    this.previewSignal(target).set(null);
  }

  addDiplomaSlot(): void {
    this.diplomaFiles.update((list) => [
      ...list,
      { file: null, preview: null, fileName: null, documentName: '', expiryDate: '' },
    ]);
  }

  removeDiplomaSlot(index: number): void {
    if (this.diplomaFiles().length < 2) return;
    this.diplomaFiles.update((list) => list.filter((_, i) => i !== index));
    // Réindexation : les lignes après celle supprimée décalent d'un cran.
    this.touchedDiplomaRows.update((rows) => {
      const next = new Set<number>();
      for (const i of rows) {
        if (i < index) next.add(i);
        else if (i > index) next.add(i - 1);
      }
      return next;
    });
  }

  /** Marque la ligne comme "quittée" seulement quand le focus sort vraiment du groupe (nom + date +
   * fichier), pas à chaque changement de champ à l'intérieur de la même ligne. */
  onDiplomaRowBlur(index: number, event: FocusEvent): void {
    const row = event.currentTarget as HTMLElement;
    const next = event.relatedTarget as Node | null;
    if (next && row.contains(next)) return;
    this.touchedDiplomaRows.update((rows) => new Set(rows).add(index));
  }

  isDiplomaRowTouched(index: number): boolean {
    return this.touchedDiplomaRows().has(index);
  }

  updateDiplomaDocumentName(index: number, value: string): void {
    this.diplomaFiles.update((list) => list.map((e, i) => (i === index ? { ...e, documentName: value } : e)));
  }

  updateDiplomaExpiry(index: number, value: string): void {
    this.diplomaFiles.update((list) => list.map((e, i) => (i === index ? { ...e, expiryDate: value } : e)));
  }

  async onDiplomaFileChange(index: number, e: Event): Promise<void> {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    if (!file) return;

    if (!(await isFileTypeAllowed(file, ALLOWED_DOCUMENT_TYPES))) {
      input.value = '';
      this.flashMessage.set({ type: 'error', key: 'errors.invalidDocumentFormat' });
      return;
    }

    this.diplomaFiles.update((list) => list.map((e, i) => (i === index ? { ...e, file, fileName: file.name } : e)));
  }

  removeDiplomaFile(index: number): void {
    this.diplomaFiles.update((list) =>
      list.map((e, i) => (i === index ? { ...e, file: null, fileName: null } : e)),
    );
  }

  submit(): void {
    this.touched.set(true);
    if (!this.formValid()) return;

    const userId = this.authService.currentUser()?.id;
    if (!userId) return;

    const diplomaEntries = this.diplomaFiles().filter((d) => d.file !== null);

    const formData = new FormData();
    formData.append('photo', this.photo!);
    formData.append('idFront', this.idFront!);
    formData.append('idBack', this.idBack!);
    formData.append('logo', this.logo!);
    formData.append('rib', this.rib!);
    for (const entry of diplomaEntries) {
      if (entry.file) formData.append('diplomas', entry.file);
    }
    formData.append(
      'diplomasMeta',
      JSON.stringify(diplomaEntries.map((d) => ({ documentName: d.documentName, expiryDate: d.expiryDate }))),
    );

    this.submitting.set(true);
    this.userApi.createProfessionalDocuments(userId, formData).subscribe({
      next: ({ mailSent }) => {
        const user = this.authService.currentUser();
        if (user) this.authService.setUser({ ...user, status: 'PENDING_VALIDATION' });
        this.flashMessage.set({
          type: mailSent ? 'success' : 'warning',
          key: mailSent ? 'login.registeredProSuccess' : 'login.registeredProMailFailed',
        });
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.submitting.set(false);
        this.flashMessage.set(buildDocumentUploadErrorMessage(err, this.transloco));
      },
    });
  }
}
