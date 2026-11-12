import { Component, ChangeDetectionStrategy, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuoteService } from '../../../core/services/quote.service';
import { QuotePreviewData } from '../../../shared/interfaces/quote';
import { QuotePreview } from '../../../shared/components/quote-preview/quote-preview';
import { toPreviewData } from '../../../shared/components/quote-client-view/quote-client-view';

/**
 * Page dédiée, chargée uniquement par le navigateur headless (Playwright) lors de la génération PDF
 * — jamais par un utilisateur. Authentification par jeton d'impression (en-tête X-Print-Token posé
 * par Playwright), pas de session utilisateur. Rendu CSR (cf. app.routes.server.ts) : l'en-tête posé
 * au niveau du navigateur s'applique alors directement à l'appel API fait ici, sans plomberie SSR.
 */
@Component({
  selector: 'quote-print-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [QuotePreview],
  templateUrl: './quote-print.html',
  styleUrl: './quote-print.scss',
})
export class QuotePrintPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly quoteService = inject(QuoteService);

  readonly data = signal<QuotePreviewData | null>(null);

  ngOnInit(): void {
    document.documentElement.style.backgroundColor = '#fff';
    document.body.style.backgroundColor = '#fff';

    const quoteId = this.route.snapshot.paramMap.get('quoteId');
    if (!quoteId) return;

    this.quoteService.getPrintData(quoteId).then((quote) => this.data.set(toPreviewData(quote)));
  }
}
