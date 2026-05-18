import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  input,
  linkedSignal,
} from '@angular/core';

/** Compteur module-level pour générer des id uniques (ordre de création déterministe -> stable en SSR). */
let nextAccordionId = 0;

/**
 * Accordéon réutilisable — sections de la page d'accueil (villes, métiers, urgence, artisans) et FAQ.
 *
 * - Le header est un `<button>` natif : Espace et Entrée déclenchent nativement l'ouverture/fermeture.
 * - Animation d'ouverture en CSS pur (`grid-template-rows` 0fr->1fr) : compatible SSR, sans mesure JS.
 * - Le contenu replié est rendu `inert` (retiré du focus clavier et de l'arbre d'accessibilité).
 *
 * @example Exemple 1 — usage simple (sections villes / métiers / urgence / artisans)
 * ```html
 * <accordion title="Plomberie">
 *   <ul>
 *     <li>Recherche et réparation de fuite</li>
 *     <li>Débouchage de canalisation</li>
 *   </ul>
 * </accordion>
 * ```
 *
 * @example Exemple 2 — usage FAQ avec résumé LLM-friendly
 * ```html
 * <accordion
 *   variant="faq"
 *   title="C'est quoi le séquestre de fonds ?"
 *   summary="Votre paiement est bloqué chez Stripe dès l'acceptation du devis. L'artisan
 *            n'est payé qu'une fois le chantier validé par vos soins."
 *   (toggled)="onFaqToggled('sequestre', $event)"
 * >
 *   <p>Quand vous acceptez un devis, votre paiement est placé sur un compte séquestre
 *      géré par Stripe. L'argent est bloqué tant que vous n'avez pas validé la fin du chantier...</p>
 * </accordion>
 * ```
 */
@Component({
  selector: 'accordion',
  standalone: true,
  templateUrl: './accordion.html',
  styleUrl: './accordion.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Accordion {
  /** Titre affiché dans l'en-tête cliquable (requis). */
  readonly title = input.required<string>();

  /** Résumé court affiché dans un encart distinct en haut du contenu déployé (optionnel). */
  readonly summary = input<string>();

  /** État initial : accordéon ouvert (`true`) ou fermé (`false`). */
  readonly isOpen = input(false);

  /** Variante de style selon le contexte d'utilisation. */
  readonly variant = input<'section' | 'faq'>('section');

  /** Émis à chaque changement d'état (`true` = ouvert) — prévu pour le tracking analytics. */
  @Output() readonly toggled = new EventEmitter<boolean>();

  /** État courant : initialisé depuis `isOpen`, puis piloté par l'utilisateur. */
  protected readonly expanded = linkedSignal(() => this.isOpen());

  private readonly instanceId = ++nextAccordionId;
  protected readonly headerId = `accordion-header-${this.instanceId}`;
  protected readonly panelId = `accordion-panel-${this.instanceId}`;

  /** Bascule l'état ouvert/fermé et notifie via la sortie `toggled`. */
  protected toggle(): void {
    this.expanded.update((open) => !open);
    this.toggled.emit(this.expanded());
  }
}
