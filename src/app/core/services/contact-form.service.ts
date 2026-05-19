import { Injectable, signal } from '@angular/core';

/**
 * Coordonne l'ouverture du formulaire de contact situé dans le footer
 * (accordéon replié par défaut) depuis n'importe quel point de l'application —
 * par exemple le bouton « Demander une consultation CMOD » de la page d'accueil.
 *
 * L'accordéon contact du footer lie son état `isOpen` à `openRequested` :
 * tant qu'aucune ouverture n'a été demandée, il reste fermé sur toutes les pages.
 */
@Injectable({ providedIn: 'root' })
export class ContactFormService {
  /** `true` dès qu'une ouverture du formulaire de contact a été demandée. */
  private readonly _openRequested = signal(false);

  /** Signal en lecture seule consommé par l'accordéon contact du footer. */
  readonly openRequested = this._openRequested.asReadonly();

  /** Demande le dépliage du formulaire de contact du footer. */
  requestOpen(): void {
    this._openRequested.set(true);
  }
}
