import { Component, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA, computed, input, output, signal } from '@angular/core';
import { DecimalPipe, NgTemplateOutlet } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { QuoteLineItem, QuotePreviewData } from '../../interfaces/quote';
import { LocalizedDatePipe } from '../../pipes/localized-date.pipe';

@Component({
  selector: 'quote-preview',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule, DecimalPipe, LocalizedDatePipe, NgTemplateOutlet],
  templateUrl: './quote-preview.html',
  styleUrl: './quote-preview.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class QuotePreview {
  readonly data = input.required<QuotePreviewData>();
  readonly closed = output<void>();

  // Uniquement pour le client (jamais le pro) : les 2 seules cases qui lui appartiennent. État
  // local uniquement pour l'instant — aucune sauvegarde/signature réelle tant que cette feature
  // n'est pas construite (cf. discussion signature électronique).
  readonly interactive = input(false);

  // Rendu "papier nu", sans overlay/backdrop/bouton fermer — utilisé uniquement par la route
  // d'impression (cf. quote-print-page) capturée en PDF par Playwright, jamais par un utilisateur.
  readonly printMode = input(false);
  readonly quoteAgreementAccepted = signal(false);
  readonly earlyStartAccepted = signal(false);
  readonly canAccept = computed(() => this.quoteAgreementAccepted() && this.earlyStartAccepted());

  // Décision prise ici (cocher les 2 cases + cliquer), l'action réelle (appel serveur, ouverture du
  // widget de signature) est gérée par le parent (cf. QuoteClientView) — ce composant reste
  // purement présentationnel, comme pour `closed`.
  readonly accept = output<void>();
  readonly decline = output<void>();

  private readonly allLines = computed(() => [
    ...this.data().materialLines,
    ...this.data().laborLines,
    ...this.data().logisticsLines,
  ]);

  readonly totalHT = computed(() => this.allLines().reduce((sum, l) => sum + (l.amountHT ?? 0), 0));
  readonly totalVAT = computed(() =>
    this.data().vatExempt
      ? 0
      : this.allLines().reduce((sum, l) => sum + ((l.amountHT ?? 0) * l.vatRate) / 100, 0),
  );
  readonly totalTTC = computed(() => this.totalHT() + this.totalVAT());

  readonly documents = computed(() => this.data().documents.filter((d) => d.name.trim()));

  lineTTC(line: QuoteLineItem): number {
    const ht = line.amountHT ?? 0;
    if (this.data().vatExempt) return ht;
    return ht + (ht * line.vatRate) / 100;
  }

  close(): void {
    this.closed.emit();
  }
}
