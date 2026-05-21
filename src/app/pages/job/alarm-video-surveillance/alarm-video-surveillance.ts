import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule],
  templateUrl: './alarm-video-surveillance.html',
  styleUrl: './alarm-video-surveillance.scss',
})
export class AlarmVideoSurveillancePage {}
