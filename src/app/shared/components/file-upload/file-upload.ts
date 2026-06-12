import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  forwardRef,
  inject,
  Input,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FilePondModule, FilePondComponent } from 'ngx-filepond';
import { registerPlugin } from 'filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import { firstValueFrom } from 'rxjs';
import { StorageService } from '../../../core/services/storage.service';

// Enregistrement unique des plugins FilePond (au chargement du module)
registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType, FilePondPluginFileValidateSize);

/**
 * Champ d'upload réutilisable basé sur FilePond.
 *
 * Compatible avec l'existant : on envoie le binaire au backend
 * (`POST /api/storage/upload`) qui renvoie une clé. La VALEUR du contrôle de
 * formulaire est cette clé (string) — ou `null` si aucun fichier. Pour
 * réafficher un fichier déjà uploadé (édition de profil), on charge le binaire
 * via l'URL signée renvoyée par `GET /api/storage/:key/url`.
 *
 * Usage :
 *   <ac-file-upload formControlName="photo" accept="image/*" [label]="'...'"></ac-file-upload>
 */
@Component({
  selector: 'ac-file-upload',
  standalone: true,
  imports: [CommonModule, FilePondModule],
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUpload),
      multi: true,
    },
  ],
})
export class FileUpload implements ControlValueAccessor, OnInit {
  private readonly storage = inject(StorageService);

  @ViewChild('pond') pond?: FilePondComponent;

  /** Types acceptés (équivalent attribut `accept` d'un input file). */
  @Input() accept = 'image/*,.pdf';
  /** Libellé de la zone de dépôt. */
  @Input() label = 'Glissez un fichier ou <span class="filepond--label-action">parcourir</span>';
  /** Taille max (ex: '5MB'). */
  @Input() maxFileSize: string | null = '10MB';
  /** Affiche l'aperçu image. */
  @Input() imagePreview = true;
  /** Désactive le champ. */
  @Input() disabled = false;

  /** Fichiers à afficher au démarrage (restauration depuis une clé). */
  readonly pondFiles = signal<any[]>([]);

  private onChange: (value: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  /** Clé courante stockée côté backend. */
  private currentKey: string | null = null;

  /**
   * Options FilePond — calculées une seule fois (référence stable).
   *
   * IMPORTANT : `ngx-filepond` rappelle `pond.setOptions()` à chaque fois que
   * la référence de l'input `[options]` change (cf. son `ngOnChanges`). Si on
   * expose un getter, Angular fournit un nouvel objet à chaque cycle de
   * détection de changement, ce qui reconfigure FilePond en boucle et empêche
   * le plugin image-preview de terminer le rendu de l'aperçu. On fige donc la
   * référence dans `ngOnInit`.
   */
  pondOptions: Record<string, unknown> = {};

  ngOnInit(): void {
    this.pondOptions = this.buildPondOptions();
  }

  private buildPondOptions() {
    // FilePond attend des types MIME ; on convertit les extensions courantes.
    const extToMime: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.webp': 'image/webp',
    };
    const acceptedFileTypes = this.accept
      .split(',')
      .map((t) => t.trim())
      .map((t) => (t.startsWith('.') ? extToMime[t.toLowerCase()] : t))
      .filter((t): t is string => !!t);

    return {
      allowImagePreview: this.imagePreview,
      allowMultiple: false,
      maxFiles: 1,
      disabled: this.disabled,
      acceptedFileTypes: acceptedFileTypes.length ? acceptedFileTypes : undefined,
      maxFileSize: this.maxFileSize ?? undefined,
      labelIdle: this.label,
      credits: false,
      // Le binaire est uploadé ici ; la clé renvoyée devient le serverId du fichier.
      server: {
        process: (
          _fieldName: string,
          file: File,
          _metadata: unknown,
          load: (key: string) => void,
          error: (msg: string) => void,
          progress: (computable: boolean, loaded: number, total: number) => void,
          abort: () => void,
        ) => {
          let aborted = false;
          this.storage.upload(file).subscribe({
            next: (res) => {
              if (aborted) return;
              progress(true, 1, 1);
              // FilePond mémorise la clé comme serverId du fichier.
              load(res.key);
              this.setKey(res.key);
            },
            error: () => error('upload failed'),
          });
          return {
            abort: () => {
              aborted = true;
              abort();
            },
          };
        },
        // Pas d'endpoint de suppression : on retire juste localement.
        revert: (_uniqueFileId: string, load: () => void) => {
          this.setKey(null);
          load();
        },
        // Restauration d'un fichier existant à partir de sa clé (via URL signée).
        load: (
          source: string,
          load: (file: Blob) => void,
          error: (msg: string) => void,
          progress: (computable: boolean, loaded: number, total: number) => void,
          abort: () => void,
        ) => {
          let aborted = false;
          firstValueFrom(this.storage.getUrl(source))
            .then((res) => fetch(res.url))
            .then((r) => r.blob())
            .then((blob) => {
              if (aborted) return;
              progress(true, 1, 1);
              load(blob);
            })
            .catch(() => error('load failed'));
          return {
            abort: () => {
              aborted = true;
              abort();
            },
          };
        },
      },
    };
  }

  private setKey(key: string | null) {
    this.currentKey = key;
    this.onChange(key);
  }

  // --- Évènements FilePond -------------------------------------------------

  onProcessFile(event: any) {
    // event.detail.file.serverId contient la clé renvoyée par le backend
    const key = event?.detail?.file?.serverId ?? null;
    if (key) this.setKey(key);
  }

  onRemoveFile() {
    this.setKey(null);
    this.onTouched();
  }

  // --- ControlValueAccessor ------------------------------------------------

  writeValue(value: string | null): void {
    this.currentKey = value ?? null;
    if (value) {
      // Affiche le fichier déjà uploadé ; `server.load` ira chercher le binaire.
      this.pondFiles.set([{ source: value, options: { type: 'local' } }]);
    } else {
      this.pondFiles.set([]);
    }
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
