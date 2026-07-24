import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Bouton crayon qui se change en paire annuler/valider une fois en édition — pur affichage,
 * la logique métier (quels champs, validation, sauvegarde) reste entièrement dans le parent.
 */
@Component({
  selector: 'inline-edit-actions',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './inline-edit-actions.html',
  styleUrl: './inline-edit-actions.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class InlineEditActions {
  readonly editing = input(false);
  readonly saving = input(false);
  readonly saveDisabled = input(false);

  readonly edit = output<void>();
  readonly cancel = output<void>();
  readonly save = output<void>();
}
