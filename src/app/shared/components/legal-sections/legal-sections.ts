import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

/** Rendu générique d'un document légal : un titre puis une suite ordonnée de sections i18n
 * (chaque clé pointe vers un bloc HTML traduit). Réutilisé par les modales (legal-modal,
 * policy-modal) et par les pages routées (legal-placeholder) pour n'avoir qu'une seule source
 * de vérité pour le rendu — seule la liste de clés change d'un document à l'autre. */
@Component({
  selector: 'legal-sections',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule],
  templateUrl: './legal-sections.html',
})
export class LegalSections {
  readonly titleKey = input.required<string>();
  readonly keys = input.required<string[]>();
}
