import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule],
  templateUrl: './carpenter-glazier.html',
  styleUrl: './carpenter-glazier.scss',
})
export class CarpenterGlazierPage {}
