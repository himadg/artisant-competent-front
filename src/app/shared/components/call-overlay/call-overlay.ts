import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, PLATFORM_ID, effect, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { CallService } from '../../../core/services/call.service';
import { FlashMessageService } from '../../../core/services/flash-message.service';
import { UserAvatar } from '../user-avatar/user-avatar';
import { VideoCall } from '../video-call/video-call';

@Component({
  selector: 'call-overlay',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TranslocoModule, UserAvatar, VideoCall],
  templateUrl: './call-overlay.html',
  styleUrl: './call-overlay.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CallOverlay {
  readonly callService = inject(CallService);
  private readonly flashMessage = inject(FlashMessageService);

  // Créé une seule fois (pas dans l'effect) pour ne pas recréer un <audio> à chaque changement
  // d'appel entrant ; reste `null` côté serveur (SSR) où `Audio` n'existe pas.
  private readonly ringtone = isPlatformBrowser(inject(PLATFORM_ID)) ? new Audio('/assets/sounds/ringtone.mp3') : null;

  constructor() {
    if (this.ringtone) this.ringtone.loop = true;

    effect(() => {
      if (!this.callService.callEndedByPeer()) return;
      this.flashMessage.set({ type: 'info', key: 'dashboard.messages.callDeclined' });
      this.callService.clearCallEndedByPeer();
    });

    // Autoplay avec son : les navigateurs le bloquent tant qu'aucun geste utilisateur n'a eu lieu
    // sur la page — .catch() silencieux plutôt qu'une erreur non gérée dans la console.
    effect(() => {
      if (!this.ringtone) return;
      if (this.callService.incomingCall()) {
        void this.ringtone.play().catch(() => {});
      } else {
        this.ringtone.pause();
        this.ringtone.currentTime = 0;
      }
    });
  }

  accept(): void {
    this.callService.acceptIncomingCall();
  }

  decline(): void {
    this.callService.declineIncomingCall();
  }

  end(payload: { wasConnected: boolean }): void {
    this.callService.endCall(payload.wasConnected);
  }
}
