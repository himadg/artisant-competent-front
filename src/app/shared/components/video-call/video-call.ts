import { Component, ChangeDetectionStrategy, input, inject, OnInit, OnDestroy, ElementRef, viewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoCallService } from '../../../core/services/video-call.service';
import { StreamSourceDirective } from './stream-source.directive';

@Component({
  selector: 'video-call',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, StreamSourceDirective],
  templateUrl: './video-call.html',
  styleUrl: './video-call.scss',
})
export class VideoCall implements OnInit, OnDestroy {
  readonly callService = inject(VideoCallService);

  roomId = input.required<string>();
  localVideo = viewChild<ElementRef<HTMLVideoElement>>('localVideo');

  micEnabled = true;
  cameraEnabled = true;

  constructor() {
    effect(() => {
      const stream = this.callService.localVideoStream();
      const videoEl = this.localVideo()?.nativeElement;
      if (videoEl && stream) videoEl.srcObject = stream;
    });
  }

  ngOnInit(): void {
    void this.callService.joinRoom(this.roomId());
  }

  ngOnDestroy(): void {
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
    this.callService.leaveRoom();
  }
}
