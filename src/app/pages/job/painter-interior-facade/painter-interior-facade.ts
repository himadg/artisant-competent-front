import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule],
  templateUrl: './painter-interior-facade.html',
  styleUrl: './painter-interior-facade.scss',
})
export class PainterInteriorFacadePage {}
