import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VideoCall } from '../../shared/components/video-call/video-call';

@Component({
  selector: 'video-call-test-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, VideoCall],
  templateUrl: './video-call-test.html',
})
export class VideoCallTestPage {
  roomId = signal('');
  joined = signal(false);
  roomIdInput = 'test-room';

  join(): void {
    this.roomId.set(this.roomIdInput);
    this.joined.set(true);
  }
}
