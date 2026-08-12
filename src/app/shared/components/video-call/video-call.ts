import {
  Component,
  ChangeDetectionStrategy,
  CUSTOM_ELEMENTS_SCHEMA,
  input,
  output,
  inject,
  OnInit,
  OnDestroy,
  ElementRef,
  viewChild,
  effect,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { VideoCallService } from '../../../core/services/video-call.service';
import { StreamSourceDirective } from './stream-source.directive';
import { UserAvatar } from '../user-avatar/user-avatar';

@Component({
  selector: 'video-call',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TranslocoModule, StreamSourceDirective, UserAvatar],
  templateUrl: './video-call.html',
  styleUrl: './video-call.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class VideoCall implements OnInit, OnDestroy {
  readonly callService = inject(VideoCallService);

  roomId = input.required<string>();
  audioOnly = input(false);
  peerName = input('');
  peerPhotoUrl = input<string | null>(null);
  localVideo = viewChild<ElementRef<HTMLVideoElement>>('localVideo');

  /** `wasConnected` indique si l'autre participant avait rejoint la room avant qu'on raccroche
   *  (cf. CallService.endCall : évite une notification REST redondante avec le signal WebRTC). */
  readonly hangup = output<{ wasConnected: boolean }>();

  micEnabled = true;
  cameraEnabled = true;
  private everConnected = false;

  readonly hasRemote = computed(() => this.callService.remoteParticipants().length > 0);
  readonly elapsedSeconds = signal(0);
  readonly elapsedLabel = computed(() => {
    const total = this.elapsedSeconds();
    const minutes = Math.floor(total / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (total % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  });

  constructor() {
    effect(() => {
      const stream = this.callService.localVideoStream();
      const videoEl = this.localVideo()?.nativeElement;
      if (videoEl && stream) videoEl.srcObject = stream;
    });

    // Le chrono ne tourne que pendant que l'autre participant est effectivement dans la room
    // (pas pendant la sonnerie, ni s'il quitte temporairement) — onCleanup gère l'arrêt dans les deux cas.
    effect((onCleanup) => {
      if (!this.hasRemote()) return;
      const interval = setInterval(() => this.elapsedSeconds.update((s) => s + 1), 1000);
      onCleanup(() => clearInterval(interval));
    });

    // Si l'autre participant quitte après avoir été connecté, on referme aussi notre propre vue
    // d'appel au lieu de revenir silencieusement à un écran "en attente" trompeur.
    effect(() => {
      if (this.hasRemote()) {
        this.everConnected = true;
        return;
      }
      if (!this.everConnected) return;
      this.everConnected = false;
      this.callService.leaveRoom();
      this.hangup.emit({ wasConnected: true });
    });
  }

  ngOnInit(): void {
    this.callService.joinRoom(this.roomId()).then(() => {
      if (!this.audioOnly()) return;
      this.cameraEnabled = false;
      this.callService.setCameraEnabled(false);
    });
  }

  ngOnDestroy(): void {
    // Filet de sécurité si le composant est démonté autrement qu'en cliquant sur raccrocher
    // (ex: l'overlay est retiré par un autre chemin) — leaveRoom() est idempotent.
    this.callService.leaveRoom();
  }

  toggleMic(): void {
    this.micEnabled = !this.micEnabled;
    this.callService.setMicEnabled(this.micEnabled);
  }

  toggleCamera(): void {
    this.cameraEnabled = !this.cameraEnabled;
    this.callService.setCameraEnabled(this.cameraEnabled);
  }

  hangUp(): void {
    const wasConnected = this.hasRemote();
    this.everConnected = false;
    this.callService.leaveRoom();
    this.hangup.emit({ wasConnected });
  }
}
