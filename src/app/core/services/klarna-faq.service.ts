import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Coordonne l'ouverture de l'accordéon FAQ Klarna (`home.faq.q12`) situé sur la
 * page d'accueil depuis n'importe quel point de l'application — typiquement le
 * lien « Klarna » du bandeau d'annonce affiché en haut de chaque page.
 *
 * Implémenté en `Subject` (et non en signal) pour pouvoir ré-émettre une demande
 * d'ouverture même si la valeur précédente était déjà « ouvert ». Cela permet
 * notamment de re-déclencher le scroll + ouverture lorsque l'utilisateur a
 * manuellement refermé l'accordéon puis re-cliqué sur le lien du bandeau.
 */
@Injectable({ providedIn: 'root' })
export class KlarnaFaqService {
  private readonly _openRequest$ = new Subject<void>();

  /** Observable consommé par la page d'accueil pour ouvrir l'accordéon Klarna et y défiler. */
  readonly openRequest$ = this._openRequest$.asObservable();

  /** Demande l'ouverture de l'accordéon FAQ Klarna sur la page d'accueil. */
  requestOpen(): void {
    this._openRequest$.next();
  }
}
