import { Component, ChangeDetectionStrategy, OnDestroy, OnInit, effect, inject, input, output, signal } from '@angular/core';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { ChatService } from '../../../core/services/chat.service';
import { QuoteService } from '../../../core/services/quote.service';
import { FlashMessageService } from '../../../core/services/flash-message.service';
import { QuotePreviewData, QuoteStatus, QuoteViewerData } from '../../interfaces/quote';
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
    interventionAddress: quote.interventionAddress,
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
  imports: [QuotePreview, YoutrustSignatureWidget, TranslocoModule],
  templateUrl: './quote-client-view.html',
  styleUrl: './quote-client-view.scss',
})
export class QuoteClientView implements OnInit, OnDestroy {
  private readonly quoteService = inject(QuoteService);
  private readonly chatService = inject(ChatService);
  private readonly flash = inject(FlashMessageService);
  private readonly transloco = inject(TranslocoService);

  readonly quoteId = input.required<string>();
  readonly closed = output<void>();

  readonly loading = signal(true);
  readonly previewData = signal<QuotePreviewData | null>(null);
  // Masquée dès la signature réussie (onClientSigned), pendant l'attente du paiement — la
  // signature elle-même ne doit plus jamais être redéclenchée depuis ici. Réaffichée si le
  // paiement échoue, pour permettre de recliquer "Accepter et signer le devis".
  readonly previewVisible = signal(true);
  // Vrai que si c'est le client auteur qui est sur la vue. Peut interagir avec les cases de
  // consentement/signature — jamais le pro.
  readonly canSign = signal(false);
  // Explique pourquoi il ne peut plus éditer/signer (client) ou que le devis est clos (pro) —
  // libellé différent selon le rôle.
  readonly statusNotice = signal<string | null>(null);

  readonly signing = signal(false);
  readonly signatureLink = signal<string | null>(null);
  readonly isSandbox = signal(false);
  readonly processingPayment = signal(false);


  private readonly awaitingPayment = signal(false);
  // confirmPayment attend ces 2 conditions : webhook YouTrust reçu (statut réellement PENDING_PAYMENT)
  // et délai minimum écoulé (simulation du temps de paiement, Stripe Connect pas encore câblé).
  private readonly webhookConfirmed = signal(false);
  private readonly minDelayDone = signal(false);
  private minDelayTimeout: ReturnType<typeof setTimeout> | null = null;
  // Garde-fou si le webhook n'arrive jamais (socket déconnecté/event perdu).
  private paymentSafetyTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect(() => {
      const message = this.chatService.updatedMessage();
      if (!message || !this.awaitingPayment()) return;
      if (message.quoteId !== this.quoteId() || message.quoteStatus !== 'PENDING_PAYMENT') return;
      this.webhookConfirmed.set(true);
      this.tryConfirmPayment();
    });

    // Rattrape une notif manquée pendant une coupure réseau : à chaque (re)connexion du socket, on
    // revérifie le statut réel par un simple appel REST plutôt que de compter uniquement sur le WebSocket.
    effect(() => {
      this.chatService.reconnected();
      if (!this.awaitingPayment()) return;
      this.resyncAfterReconnect();
    });
  }

  private resyncAfterReconnect(): void {
    this.quoteService
      .getForViewer(this.quoteId())
      .then((quote) => {
        if (quote.status !== 'PENDING_PAYMENT') return;
        this.webhookConfirmed.set(true);
        this.tryConfirmPayment();
      })
      .catch(() => {});
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }

  // Déclenche confirmPayment dès que les 2 conditions sont vraies, peu importe l'ordre d'arrivée.
  private tryConfirmPayment(): void {
    if (!this.webhookConfirmed() || !this.minDelayDone()) return;
    this.awaitingPayment.set(false);
    this.clearTimers();
    this.confirmPayment();
  }

  private clearTimers(): void {
    if (this.minDelayTimeout !== null) {
      clearTimeout(this.minDelayTimeout);
      this.minDelayTimeout = null;
    }
    if (this.paymentSafetyTimeout !== null) {
      clearTimeout(this.paymentSafetyTimeout);
      this.paymentSafetyTimeout = null;
    }
  }

  // DRAFT n'arrive jamais ici (getForViewer le bloque côté serveur), SIGNED_BY_PRO ne nécessite
  // aucune explication (une décision est encore attendue, les cases/boutons s'affichent déjà), et
  // PENDING_PAYMENT/PAID n'ouvrent plus cette vue du tout. DECLINED reste le seul cas à expliquer,
  // avec un libellé différent selon qui consulte (le client l'a refusé lui-même, le pro découvre
  // juste que le client l'a refusé).
  private computeStatusNotice(status: QuoteStatus, isDemandAuthor: boolean): string | null {
    if (status !== 'DECLINED') return null;
    return this.transloco.translate(isDemandAuthor ? 'quote.agreement.noticeDeclined' : 'quote.agreement.noticeDeclinedByClient');
  }

  ngOnInit(): void {
    this.quoteService
      .getForViewer(this.quoteId())
      .then((quote) => {
        this.previewData.set(toPreviewData(quote));
        // isDemandAuthor seul ne suffit pas : c'est un rôle, pas un état — un devis déjà DECLINED ou
        // déjà signé par le client (PENDING_PAYMENT/PAID) ne doit plus jamais réafficher les cases
        // à cocher/boutons accepter-refuser, uniquement quand une décision est encore attendue.
        this.canSign.set(quote.isDemandAuthor && quote.status === 'SIGNED_BY_PRO');
        this.statusNotice.set(this.computeStatusNotice(quote.status, quote.isDemandAuthor));
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
      .requestClientSignature(this.quoteId())
      .then(({ signatureLink, isSandbox, alreadySigned }) => {
        if (!signatureLink) {
          // Fenêtre de course rare : le client a déjà signé mais le webhook `signer.done` n'est pas
          // encore traité côté serveur (statut local pas encore mis à jour) — se résout seul en
          // quelques secondes, jamais une vraie erreur à traiter ici.
          this.flash.set({
            type: 'error',
            key: alreadySigned ? 'quote.actions.alreadySignedPending' : 'errors.unknown',
          });
          return;
        }
        this.signatureLink.set(signatureLink);
        this.isSandbox.set(isSandbox);
      })
      .catch(() => this.flash.set({ type: 'error', key: 'errors.unknown' }))
      .finally(() => this.signing.set(false));
  }

  // Signature confirmée côté widget — lance l'attente des 2 conditions de tryConfirmPayment.
  onClientSigned(): void {
    this.signatureLink.set(null);
    this.previewVisible.set(false);
    this.flash.set({ type: 'success', key: 'quote.agreement.signSuccess' });
    this.processingPayment.set(true);
    this.awaitingPayment.set(true);
    this.webhookConfirmed.set(false);
    this.minDelayDone.set(false);

    this.minDelayTimeout = setTimeout(() => {
      this.minDelayDone.set(true);
      this.tryConfirmPayment();
    }, 10000);

    // Abandon si le webhook n'arrive jamais, pour ne pas bloquer l'overlay indéfiniment.
    this.paymentSafetyTimeout = setTimeout(() => {
      this.awaitingPayment.set(false);
      this.processingPayment.set(false);
      this.flash.set({ type: 'error', key: 'quote.agreement.paymentError' });
      this.previewVisible.set(true);
    }, 30000);
  }

  private confirmPayment(): void {
    this.quoteService
      .confirmPayment(this.quoteId())
      .then(() => {
        this.flash.set({ type: 'success', key: 'quote.agreement.paymentSuccess' });
        this.closed.emit();
      })
      // Échec de paiement : réaffiche quote-preview pour recliquer "Accepter et signer le devis".
      .catch(() => {
        this.flash.set({ type: 'error', key: 'quote.agreement.paymentError' });
        this.previewVisible.set(true);
      })
      .finally(() => this.processingPayment.set(false));
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
