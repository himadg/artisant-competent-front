import {
  Component,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  input,
  output,
  ChangeDetectionStrategy,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

// SDK chargé globalement (cf. index.html), même principe que TurnstileComponent : on attend qu'il
// soit prêt plutôt que de le charger nous-mêmes, pour ne pas dupliquer le script sur chaque usage.
declare class Yousign {
  constructor(options: { signatureLink: string; iframeContainerId: string; isSandbox: boolean });
  onSuccess(callback: () => void): void;
}

let nextContainerId = 0;

/**
 * Widget de signature YouTrust embarqué (iframe SDK officiel) — utilisé aussi bien pour la signature
 * du pro à l'envoi du devis que pour celle du client à l'acceptation (cf. quote-modal / quote-preview).
 * Ne JAMAIS passer `redirect_urls` au signataire côté backend : ça désactive les événements envoyés
 * par l'iframe (cf. doc YouTrust), `onSuccess` est le seul moyen fiable de détecter la fin de signature.
 */
@Component({
  selector: 'youtrust-signature-widget',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule],
  templateUrl: './youtrust-signature-widget.html',
  styleUrl: './youtrust-signature-widget.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class YoutrustSignatureWidget implements AfterViewInit, OnDestroy {
  readonly signatureLink = input.required<string>();
  readonly isSandbox = input.required<boolean>();
  readonly success = output<void>();
  // Permet de quitter la modale sans avoir signé (ex: le pro change d'avis, ferme par erreur) — la
  // signature reste possible plus tard puisque le lien redevient accessible via un nouvel appel.
  readonly closed = output<void>();

  @ViewChild('container') private readonly container!: ElementRef<HTMLDivElement>;
  private readonly containerId = `youtrust-signature-widget-${nextContainerId++}`;
  private pollTimeout: ReturnType<typeof setTimeout> | null = null;

  ngAfterViewInit(): void {
    this.container.nativeElement.id = this.containerId;
    this.renderWhenReady();
  }

  private renderWhenReady(attempts = 0): void {
    if (typeof Yousign !== 'undefined') {
      const widget = new Yousign({
        signatureLink: this.signatureLink(),
        iframeContainerId: this.containerId,
        isSandbox: this.isSandbox(),
      });
      widget.onSuccess(() => this.success.emit());
      return;
    }
    if (attempts < 50) {
      this.pollTimeout = setTimeout(() => this.renderWhenReady(attempts + 1), 100);
    }
  }

  ngOnDestroy(): void {
    if (this.pollTimeout !== null) clearTimeout(this.pollTimeout);
  }
}
