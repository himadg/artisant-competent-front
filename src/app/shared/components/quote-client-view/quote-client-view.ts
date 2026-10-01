import { Component, ChangeDetectionStrategy, OnInit, inject, input, output, signal } from '@angular/core';
import { QuoteService } from '../../../core/services/quote.service';
import { FlashMessageService } from '../../../core/services/flash-message.service';
import { QuotePreviewData, QuoteViewerData } from '../../interfaces/quote';
import { QuotePreview } from '../quote-preview/quote-preview';
import { YoutrustSignatureWidget } from '../youtrust-signature-widget/youtrust-signature-widget';

// Exportée : réutilisée telle quelle par quote-print-page (même mise en forme des données, que ce
// soit pour l'aperçu client interactif ou la capture PDF non-interactive).
export function toPreviewData(quote: QuoteViewerData): QuotePreviewData {
  return {
    quoteNumber: quote.quoteNumber,
    createdAt: quote.createdAt,
    validUntil: quote.validUntil,
    professional: quote.professional,
    client: quote.client,
    materialLines: quote.materialLines,
    laborLines: quote.laborLines,
    logisticsLines: quote.logisticsLines,
    nightWorkSurcharge: quote.nightWorkSurcharge,
    estimatedStartDate: quote.estimatedStartDate,
    estimatedEndDate: quote.estimatedEndDate,
    documents: quote.documents,
    remarks: quote.remarks,
    decennaleInsurer: quote.decennaleInsurer,
    decennalePolicyNumber: quote.decennalePolicyNumber,
    decennaleCoverageArea: quote.decennaleCoverageArea,
    rcProInsurer: quote.rcProInsurer,
    rcProPolicyNumber: quote.rcProPolicyNumber,
    klarnaAccepted: quote.klarnaAccepted,
    vatExempt: quote.vatExempt,
  };
}

/** Vue en lecture seule du devis pour qui n'est pas le pro propriétaire (client, cmod plus tard) —
 * réutilise `quote-preview` (déjà sans aucun champ éditable) plutôt que `quote-modal`, pour ne
 * jamais exposer de champ manipulable côté navigateur (cf. discussion sécurité). */
@Component({
  selector: 'quote-client-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [QuotePreview, YoutrustSignatureWidget],
  templateUrl: './quote-client-view.html',
  styleUrl: './quote-client-view.scss',
})
export class QuoteClientView implements OnInit {
  private readonly quoteService = inject(QuoteService);
  private readonly flash = inject(FlashMessageService);

  readonly quoteId = input.required<string>();
  readonly closed = output<void>();

  readonly loading = signal(true);
  readonly previewData = signal<QuotePreviewData | null>(null);
  // Seul le client auteur peut interagir avec les cases de consentement/signature — jamais le pro,
  // même en consultant son propre devis déjà envoyé (calculé côté serveur, cf. QuoteService.getForViewer).
  readonly canSign = signal(false);

  readonly signing = signal(false);
  readonly signatureLink = signal<string | null>(null);
  readonly isSandbox = signal(false);

  ngOnInit(): void {
    this.quoteService
      .getForViewer(this.quoteId())
      .then((quote) => {
        this.previewData.set(toPreviewData(quote));
        this.canSign.set(quote.isDemandAuthor);
      })
      .catch(() => {
        this.flash.set({ type: 'error', key: 'errors.unknown' });
        this.closed.emit();
      })
      .finally(() => this.loading.set(false));
  }

  onAccept(): void {
    if (this.signing()) return;
    this.signing.set(true);
    this.quoteService
      .getClientSignatureLink(this.quoteId())
      .then(({ signatureLink, isSandbox }) => {
        if (!signatureLink) {
          this.flash.set({ type: 'error', key: 'errors.unknown' });
          return;
        }
        this.signatureLink.set(signatureLink);
        this.isSandbox.set(isSandbox);
      })
      .catch(() => this.flash.set({ type: 'error', key: 'errors.unknown' }))
      .finally(() => this.signing.set(false));
  }

  // Signature confirmée côté widget — la bascule réelle en ACCEPTED se fait côté serveur via
  // webhook une fois les 2 parties signées, on ferme simplement la vue ici.
  onClientSigned(): void {
    this.signatureLink.set(null);
    this.flash.set({ type: 'success', key: 'quote.agreement.acceptSuccess' });
    this.closed.emit();
  }

  onDecline(): void {
    if (this.signing()) return;
    this.signing.set(true);
    this.quoteService
      .decline(this.quoteId())
      .then(() => {
        this.flash.set({ type: 'success', key: 'quote.agreement.declineSuccess' });
        this.closed.emit();
      })
      .catch(() => this.flash.set({ type: 'error', key: 'errors.unknown' }))
      .finally(() => this.signing.set(false));
  }
}
