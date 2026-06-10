import { Component, input, output, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

export interface PreviewDocument {
  url: string;
  title?: string;
}

@Component({
  selector: 'doc-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './doc-modal.html',
  styleUrl: './doc-modal.scss'
})
export class DocModal {
  document = input.required<PreviewDocument | null>();
  closeModal = output<void>();

  private readonly sanitizer = inject(DomSanitizer);

  isWebp = computed(() => {
    const url = this.document()?.url?.toLowerCase();
    return !!url && !!new RegExp(/\.webp(\?.*)?$/).exec(url);
  });

  isPdf = computed(() => {
    const url = this.document()?.url?.toLowerCase();
    return !!url && !!new RegExp(/\.pdf(\?.*)?$/).exec(url);
  });

  safePdfUrl = computed<SafeResourceUrl | null>(() => {
    const docUrl = this.document()?.url;
    if (!docUrl || !this.isPdf()) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(docUrl);
  });
}
