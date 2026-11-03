import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { GoodPracticesTabs } from '../../../../../shared/components/good-practices-tabs/good-practices-tabs';

@Component({
  selector: 'individual-practices-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule, GoodPracticesTabs],
  templateUrl: './individual-practices-section.html',
  styleUrl: './individual-practices-section.scss',
})
export class IndividualPracticesSection {}
