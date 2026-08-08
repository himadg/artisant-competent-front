import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Avatar présentationnel : photo si fournie, sinon icône générique.
 * La taille se pilote entièrement via la variable CSS `--avatar-size` posée sur l'hôte
 * (ex: `<user-avatar style="--avatar-size: 9rem">`) — largeur, hauteur et taille de
 * l'icône du placeholder en découlent, aucun autre réglage n'est nécessaire.
 */
@Component({
  selector: 'user-avatar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './user-avatar.html',
  styleUrl: './user-avatar.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UserAvatar {
  readonly photoUrl = input<string | null>(null);
  readonly alt = input<string>('');
}
