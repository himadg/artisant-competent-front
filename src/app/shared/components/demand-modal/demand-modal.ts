import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { ALLOWED_IMAGE_TYPES, isFileTypeAllowed } from '../../../core/utils/file-types';

export interface DemandFormValue {
  description: string;
  files: File[];
}

@Component({
  selector: 'demand-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, TranslocoModule],
  templateUrl: './demand-modal.html',
  styleUrl: './demand-modal.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DemandModal {
  private readonly fb = inject(FormBuilder);

  readonly professionalCount = input.required<number>();
  readonly loading = input(false);
  readonly closed = output<void>();
  readonly submitted = output<DemandFormValue>();

  readonly selectedFiles = signal<File[]>([]);
  readonly showFormatError = signal(false);
  readonly fadingFormatError = signal(false);

  readonly form = this.fb.group({
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
  });

  get descriptionControl() {
    return this.form.controls.description;
  }

  private formatErrorTimer: ReturnType<typeof setTimeout> | null = null;

  async onFilesChange(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const all = Array.from(input.files ?? []);
    const validityChecks = await Promise.all(all.map((f) => isFileTypeAllowed(f, ALLOWED_IMAGE_TYPES)));
    const valid = all.filter((_, i) => validityChecks[i]);

    if (valid.length < all.length) {
      this.showFormatError.set(true);
      this.fadingFormatError.set(false);
      if (this.formatErrorTimer) clearTimeout(this.formatErrorTimer);
      this.formatErrorTimer = setTimeout(() => {
        this.fadingFormatError.set(true);
        setTimeout(() => {
          this.showFormatError.set(false);
          this.fadingFormatError.set(false);
        }, 500);
      }, 4500);
    }

    this.selectedFiles.update(existing => {
      const combined = [...existing, ...valid];
      return combined.filter((f, i, arr) => arr.findIndex(x => x.name === f.name) === i).slice(0, 3);
    });
    input.value = '';
  }

  removeFile(index: number): void {
    this.selectedFiles.update(files => files.filter((_, i) => i !== index));
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitted.emit({
      description: this.form.getRawValue().description!,
      files: this.selectedFiles(),
    });
  }
}
