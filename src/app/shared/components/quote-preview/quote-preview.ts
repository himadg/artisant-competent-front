import { Component, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA, computed, input, output } from '@angular/core';
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

  // N'affiche les boutons accepter/décliner que pour le client, tant qu'une décision est encore
  // attendue — les 2 cases d'engagement (quoteAgreementAccepted/earlyStartAccepted) ne sont plus
  // gérées ici : elles sont désormais des champs checkbox natifs du document signé YouTrust
  // (obligatoires), cochés directement dans son widget, jamais dans cette app.
  readonly interactive = input(false);

  // Rendu "papier nu", sans overlay/backdrop/bouton fermer — utilisé uniquement par la route
  // d'impression (cf. quote-print-page) capturée en PDF par Playwright, jamais par un utilisateur.
  readonly printMode = input(false);

  // Message expliquant au client pourquoi il ne peut plus éditer/signer (devis refusé, déjà signé,
  // payé...) — propre à l'aperçu affiché dans l'app, jamais au document légal (cf. printMode dans le
  // template). `null` : rien à afficher (cas normal, en attente de décision).
  readonly statusNotice = input<string | null>(null);

  // Décision prise ici, l'action réelle (appel serveur, ouverture du widget de signature) est gérée
  // par le parent (cf. QuoteClientView) — ce composant reste purement présentationnel, comme `closed`.
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

  civilityKey(gender: string): string {
    return gender === 'male' ? 'quote.preview.civilityMale' : 'quote.preview.civilityFemale';
  }
}
