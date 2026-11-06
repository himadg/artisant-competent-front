import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'video-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule],
  templateUrl: './video-modal.html',
  styleUrl: './video-modal.scss',
})
export class VideoModal {
  readonly videoUrl = input.required<string>();
  readonly closed = output<void>();

  close(): void {
    this.closed.emit();
  }

  // Fermeture au clic en dehors de la boîte uniquement (même technique que legal-modal) : on
  // vérifie que la cible du clic est bien l'overlay lui-même, pas un enfant (la vidéo, les
  // contrôles natifs...) qui aurait fait remonter l'événement par bubbling.
  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('video-overlay')) {
      this.close();
    }
  }
}
