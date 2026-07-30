import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'individual-practices-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule],
  templateUrl: './individual-practices-section.html',
  styleUrl: './individual-practices-section.scss',
})
export class IndividualPracticesSection {}
