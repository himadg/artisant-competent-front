import { ChangeDetectionStrategy, Component, inject, input, output, resource, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { DemandService } from '../../../core/services/demand.service';
import { DemandDetail } from '../../interfaces/demand';
import { PreviewDocument } from '../../interfaces/preview-document';
import { DocModal } from '../doc-modal/doc-modal';
import { extractDocNameFromS3 } from '../../../core/utils/common-utils';

const MAX_PHOTOS = 3;
const ALLOWED_PHOTO_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

@Component({
  selector: 'demand-details-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, TranslocoModule, DocModal],
  templateUrl: './demand-details-modal.html',
  styleUrl: './demand-details-modal.scss',
})
export class DemandDetailsModal {
  private readonly demandService = inject(DemandService);
  private readonly transloco = inject(TranslocoService);

  readonly demandId = input.required<string>();
  readonly canEdit = input(false);
  readonly closed = output<void>();
  readonly updated = output<DemandDetail>();

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
    if (!file || !ALLOWED_PHOTO_TYPES.has(file.type) || this.totalEditedPhotos() >= MAX_PHOTOS) return;

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
