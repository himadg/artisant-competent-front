import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, inject, input, output, resource, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { DemandService } from '../../../core/services/demand.service';
import { ChatService } from '../../../core/services/chat.service';
import { AuthService } from '../../../core/services/auth.service';
import { DemandDetail } from '../../interfaces/demand';
import { PreviewDocument } from '../../interfaces/preview-document';
import { DocModal } from '../doc-modal/doc-modal';
import { InlineEditActions } from '../inline-edit-actions/inline-edit-actions';
import { extractDocNameFromS3 } from '../../../core/utils/common-utils';
import { LocalizedDatePipe } from '../../pipes/localized-date.pipe';
import { FlashMessageService } from '../../../core/services/flash-message.service';
import { ALLOWED_IMAGE_TYPES } from '../../../core/utils/file-types';

const MAX_PHOTOS = 3;

@Component({
  selector: 'demand-details-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, TranslocoModule, DocModal, InlineEditActions, LocalizedDatePipe],
  templateUrl: './demand-details-modal.html',
  styleUrl: './demand-details-modal.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DemandDetailsModal {
  private readonly demandService = inject(DemandService);
  private readonly chatService = inject(ChatService);
  private readonly authService = inject(AuthService);
  private readonly transloco = inject(TranslocoService);
  private readonly flashMessage = inject(FlashMessageService);

  readonly demandId = input.required<string>();
  readonly canEdit = input(false);

  readonly closed = output<void>();
  readonly updated = output<DemandDetail>();
  readonly messageStarted = output<string>();

  readonly startingConversation = signal(false);

  /** Le bouton "envoyer un message" n'a de sens que pour un pro faisant partie des destinataires de la demande. */
  canSendMessage(demand: DemandDetail | undefined): boolean {
    if (!demand || this.canEdit() || this.authService.currentUser()?.role?.code !== 'PROFESSIONAL') return false;
    const professionalProfileId = this.authService.currentUser()?.professionalProfile?.id;
    return !!professionalProfileId && demand.professionals.some((p) => p.id === professionalProfileId);
  }

  sendMessage(): void {
    this.startingConversation.set(true);
    this.chatService
      .findOrCreateConversation(this.demandId())
      .then((conversation) => this.messageStarted.emit(conversation.id))
      .finally(() => this.startingConversation.set(false));
  }

  readonly docToPreview = signal<PreviewDocument | null>(null);

  readonly demandResource = resource({
    params: this.demandId,
    loader: ({ params }) => this.demandService.getById(params),
  });

  // ── Description ──────────────────────────────────────────────────────────
  readonly editDescriptionMode = signal(false);
  readonly descriptionDraft = signal('');
  readonly savingDescription = signal(false);

  enterEditDescription(currentDescription: string): void {
    this.descriptionDraft.set(currentDescription);
    this.editDescriptionMode.set(true);
  }

  cancelEditDescription(): void {
    this.editDescriptionMode.set(false);
  }

  saveDescription(): void {
    const description = this.descriptionDraft().trim();
    if (description.length < 10) return;

    this.savingDescription.set(true);
    this.demandService.update(this.demandId(), description)
      .then((updated) => {
        this.demandResource.set(updated);
        this.updated.emit(updated);
        this.editDescriptionMode.set(false);
      })
      .finally(() => this.savingDescription.set(false));
  }

  // ── Photos ───────────────────────────────────────────────────────────────
  readonly editPhotosMode = signal(false);
  readonly keptPhotoKeys = signal<string[]>([]);
  readonly keptPhotoUrls = signal<string[]>([]);
  readonly newPhotoFiles = signal<File[]>([]);
  readonly newPhotoPreviews = signal<string[]>([]);
  readonly savingPhotos = signal(false);

  openPhoto(url: string, key: string): void {
    this.docToPreview.set({ url, title: extractDocNameFromS3(key) });
  }

  totalEditedPhotos(): number {
    return this.keptPhotoKeys().length + this.newPhotoFiles().length;
  }

  enterEditPhotos(photoKeys: string[], photos: string[]): void {
    this.keptPhotoKeys.set([...photoKeys]);
    this.keptPhotoUrls.set([...photos]);
    this.editPhotosMode.set(true);
  }

  cancelEditPhotos(): void {
    this.clearNewPhotos();
    this.editPhotosMode.set(false);
  }

  removeKeptPhoto(index: number): void {
    this.keptPhotoKeys.update((keys) => keys.filter((_, i) => i !== index));
    this.keptPhotoUrls.update((urls) => urls.filter((_, i) => i !== index));
  }

  onAddPhotoFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;

    if (this.totalEditedPhotos() >= MAX_PHOTOS) {
      this.flashMessage.set({ type: 'error', key: 'demand.detail.errorMaxPhotos' });
      return;
    }
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      this.flashMessage.set({ type: 'error', key: 'demand.modal.errorInvalidFormat' });
      return;
    }

    this.newPhotoFiles.update((files) => [...files, file]);
    this.newPhotoPreviews.update((urls) => [...urls, URL.createObjectURL(file)]);
  }

  removeNewPhoto(index: number): void {
    URL.revokeObjectURL(this.newPhotoPreviews()[index]);
    this.newPhotoFiles.update((files) => files.filter((_, i) => i !== index));
    this.newPhotoPreviews.update((urls) => urls.filter((_, i) => i !== index));
  }

  savePhotos(): void {
    this.savingPhotos.set(true);
    this.demandService.uploadPhotos(this.demandId(), this.newPhotoFiles(), this.keptPhotoKeys())
      .then((updated) => {
        this.demandResource.set(updated);
        this.updated.emit(updated);
        this.clearNewPhotos();
        this.editPhotosMode.set(false);
      })
      .finally(() => this.savingPhotos.set(false));
  }

  private clearNewPhotos(): void {
    for (const url of this.newPhotoPreviews()) URL.revokeObjectURL(url);
    this.newPhotoFiles.set([]);
    this.newPhotoPreviews.set([]);
  }

  // ── Annulation ───────────────────────────────────────────────────────────
  readonly cancelling = signal(false);

  cancelDemand(): void {
    if (!confirm(this.transloco.translate('demand.detail.cancelConfirm'))) return;

    this.cancelling.set(true);
    this.demandService.cancel(this.demandId())
      .then((updated) => {
        this.demandResource.set(updated);
        this.updated.emit(updated);
      })
      .finally(() => this.cancelling.set(false));
  }
}
