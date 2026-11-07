import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'coming-soon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule],
  templateUrl: './coming-soon.html',
  styleUrl: './coming-soon.scss',
})
export class ComingSoon {

}
