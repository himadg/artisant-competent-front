import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, computed, inject, resource, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { MissionService } from '../../../core/services/mission.service';
import { ALLOWED_DOCUMENT_TYPES, isFileTypeAllowed } from '../../../core/utils/file-types';
import { MissionFollowUpEntry } from '../../interfaces/mission';
import { PreviewDocument } from '../../interfaces/preview-document';
import { DocCard } from '../doc-card/doc-card';
import { DocModal } from '../doc-modal/doc-modal';
import { InlineEditActions } from '../inline-edit-actions/inline-edit-actions';
import { UserAvatar } from '../user-avatar/user-avatar';
import { LocalizedDatePipe } from '../../pipes/localized-date.pipe';
import { FlashMessageService } from '../../../core/services/flash-message.service';
import { AuthService } from '../../../core/services/auth.service';

/** Format `YYYY-MM-DD` attendu par `<input type="date">`. */
function toDateInputValue(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Les images sont converties en `.webp` à l'upload, les PDF gardent leur extension —
 * cf. `StorageService.processAndUpload` côté back. */
function isPdfKey(key: string): boolean {
  return key.endsWith('.pdf');
}

type MissionTab = 'infos' | 'suivi' | 'documents';

@Component({
  selector: 'mission-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, TranslocoModule, DocCard, DocModal, InlineEditActions, UserAvatar, LocalizedDatePipe],
  templateUrl: './mission-detail.html',
  styleUrl: './mission-detail.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MissionDetailComponent {
  readonly isPdfKey = isPdfKey;

  private readonly route = inject(ActivatedRoute);
  private readonly missionService = inject(MissionService);
  private readonly flashMessage = inject(FlashMessageService);
  private readonly authService = inject(AuthService);
  private readonly transloco = inject(TranslocoService);

  private readonly paramMap = toSignal(this.route.paramMap);
  readonly missionId = computed(() => this.paramMap()?.get('id') ?? '');

  readonly today = toDateInputValue(new Date());

  readonly activeTab = signal<MissionTab>('infos');
  setTab(tab: MissionTab): void {
    this.activeTab.set(tab);
  }

  readonly missionResource = resource({
    params: this.missionId,
    loader: ({ params }) => this.missionService.getById(params),
  });

  /** Seul le pro de la mission peut modifier le suivi — le client ne peut que le lire. */
  readonly isProfessional = computed(() => {
    const professionalProfileId = this.authService.currentUser()?.professionalProfile?.id;
    const recipientId = this.missionResource.value()?.conversation.recipientProfessionalProfile.id;
    return !!professionalProfileId && professionalProfileId === recipientId;
  });

  readonly followUpResource = resource({
    params: this.missionId,
    loader: ({ params }) => this.missionService.getFollowUp(params),
  });

  readonly documentsResource = resource({
    params: this.missionId,
    loader: ({ params }) => this.missionService.getDocuments(params),
  });

  readonly docToPreview = signal<PreviewDocument | null>(null);

  openDoc(url: string | null, label: string): void {
    if (!url) return;
    this.docToPreview.set({ url, title: label });
  }

  // ── Suivi : ajout d'une entrée ───────────────────────────────────────────
  readonly addingEntry = signal(false);
  readonly newEntryNote = signal('');
  readonly newEntryDate = signal(toDateInputValue(new Date()));
  readonly savingEntry = signal(false);
  readonly newEntryPhotoFiles = signal<File[]>([]);
  readonly newEntryPhotoPreviews = signal<string[]>([]);

  startAddEntry(): void {
    this.newEntryNote.set('');
    this.newEntryDate.set(toDateInputValue(new Date()));
    this.newEntryPhotoFiles.set([]);
    this.newEntryPhotoPreviews.set([]);
    this.addingEntry.set(true);
  }

  cancelAddEntry(): void {
    for (const url of this.newEntryPhotoPreviews()) URL.revokeObjectURL(url);
    this.newEntryPhotoFiles.set([]);
    this.newEntryPhotoPreviews.set([]);
    this.addingEntry.set(false);
  }

  async onAddNewEntryPhotoFile(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;

    if (!(await isFileTypeAllowed(file, ALLOWED_DOCUMENT_TYPES))) {
      this.flashMessage.set({ type: 'error', key: 'mission.followUp.invalidFormat' });
      return;
    }

    this.newEntryPhotoFiles.update((files) => [...files, file]);
    this.newEntryPhotoPreviews.update((urls) => [...urls, URL.createObjectURL(file)]);
  }

  removeNewEntryPhoto(index: number): void {
    URL.revokeObjectURL(this.newEntryPhotoPreviews()[index]);
    this.newEntryPhotoFiles.update((files) => files.filter((_, i) => i !== index));
    this.newEntryPhotoPreviews.update((urls) => urls.filter((_, i) => i !== index));
  }

  /** Le texte prime sur les photos : un échec d'upload ne doit jamais empêcher
   * l'enregistrement de l'entrée, les photos ne font que l'accompagner. */
  async saveNewEntry(): Promise<void> {
    const note = this.newEntryNote().trim();
    const date = this.newEntryDate();
    if (!note || !date) return;

    this.savingEntry.set(true);
    try {
      const entry = await this.missionService.createFollowUpEntry(this.missionId(), {
        note,
        date: new Date(date).toISOString(),
      });

      const files = this.newEntryPhotoFiles();
      if (files.length > 0) {
        try {
          await this.missionService.uploadFollowUpPhotos(this.missionId(), entry.id, files);
        } catch {
          this.flashMessage.set({ type: 'warning', key: 'mission.followUp.photoUploadError' });
        }
      }

      for (const url of this.newEntryPhotoPreviews()) URL.revokeObjectURL(url);
      this.newEntryPhotoFiles.set([]);
      this.newEntryPhotoPreviews.set([]);
      this.followUpResource.reload();
      this.addingEntry.set(false);
    } catch {
      this.flashMessage.set({ type: 'error', key: 'mission.followUp.error' });
    } finally {
      this.savingEntry.set(false);
    }
  }

  // ── Suivi : modification / suppression d'une entrée ──────────────────────
  readonly editingEntryId = signal<string | null>(null);
  readonly editEntryNote = signal('');
  readonly editEntryDate = signal('');
  readonly savingEditEntry = signal(false);
  readonly editEntryPhotoFiles = signal<File[]>([]);
  readonly editEntryPhotoPreviews = signal<string[]>([]);

  startEditEntry(entry: MissionFollowUpEntry): void {
    this.editingEntryId.set(entry.id);
    this.editEntryNote.set(entry.note ?? '');
    this.editEntryDate.set(entry.date ? toDateInputValue(new Date(entry.date)) : toDateInputValue(new Date()));
    this.editEntryPhotoFiles.set([]);
    this.editEntryPhotoPreviews.set([]);
  }

  cancelEditEntry(): void {
    for (const url of this.editEntryPhotoPreviews()) URL.revokeObjectURL(url);
    this.editEntryPhotoFiles.set([]);
    this.editEntryPhotoPreviews.set([]);
    this.editingEntryId.set(null);
  }

  async onAddEditEntryPhotoFile(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;

    if (!(await isFileTypeAllowed(file, ALLOWED_DOCUMENT_TYPES))) {
      this.flashMessage.set({ type: 'error', key: 'mission.followUp.invalidFormat' });
      return;
    }

    this.editEntryPhotoFiles.update((files) => [...files, file]);
    this.editEntryPhotoPreviews.update((urls) => [...urls, URL.createObjectURL(file)]);
  }

  removeEditEntryPhoto(index: number): void {
    URL.revokeObjectURL(this.editEntryPhotoPreviews()[index]);
    this.editEntryPhotoFiles.update((files) => files.filter((_, i) => i !== index));
    this.editEntryPhotoPreviews.update((urls) => urls.filter((_, i) => i !== index));
  }

  /** Même logique que `saveNewEntry` : le texte est validé indépendamment de l'upload des photos. */
  async saveEditEntry(entryId: string): Promise<void> {
    const note = this.editEntryNote().trim();
    const date = this.editEntryDate();
    if (!note || !date) return;

    this.savingEditEntry.set(true);
    try {
      await this.missionService.updateFollowUpEntry(this.missionId(), entryId, {
        note,
        date: new Date(date).toISOString(),
      });

      const files = this.editEntryPhotoFiles();
      if (files.length > 0) {
        try {
          await this.missionService.uploadFollowUpPhotos(this.missionId(), entryId, files);
        } catch {
          this.flashMessage.set({ type: 'warning', key: 'mission.followUp.photoUploadError' });
        }
      }

      for (const url of this.editEntryPhotoPreviews()) URL.revokeObjectURL(url);
      this.editEntryPhotoFiles.set([]);
      this.editEntryPhotoPreviews.set([]);
      this.followUpResource.reload();
      this.editingEntryId.set(null);
    } catch {
      this.flashMessage.set({ type: 'error', key: 'mission.followUp.error' });
    } finally {
      this.savingEditEntry.set(false);
    }
  }

  deleteEntry(entryId: string): void {
    if (!confirm(this.transloco.translate('mission.followUp.deleteConfirm'))) return;

    this.missionService
      .deleteFollowUpEntry(this.missionId(), entryId)
      .then(() => this.followUpResource.reload())
      .catch(() => this.flashMessage.set({ type: 'error', key: 'mission.followUp.error' }));
  }
}
