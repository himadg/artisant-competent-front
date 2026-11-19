import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';

/**
 * Carte "document" générique (preview image ou icône + libellé + bouton télécharger) —
 * réutilisée pour les pièces d'identité/diplômes du dashboard pro et pour le devis d'une mission.
 */
@Component({
  selector: 'doc-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TranslocoModule],
  templateUrl: './doc-card.html',
  styleUrl: './doc-card.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DocCard {
  readonly label = input.required<string>();
  readonly url = input<string | null>(null);
  readonly previewImageUrl = input<string | null>(null);
  readonly meta = input<string | null>(null);
  readonly pdfIcon = input('vscode-icons:file-type-pdf2');

  readonly open = output<string>();

  onPreviewClick(): void {
    const url = this.url();
    if (url) this.open.emit(url);
  }
}
