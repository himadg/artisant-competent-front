import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule],
  templateUrl: './drain-unblocker.html',
  styleUrl: './drain-unblocker.scss',
})
export class DrainUnblockerPage {}
