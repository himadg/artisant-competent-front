import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule],
  templateUrl: './locksmith-metaller.html',
  styleUrl: './locksmith-metaller.scss',
})
export class LocksmithMetallerPage {}
