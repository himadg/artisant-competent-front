import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { GoodPracticesTabs } from '../../../../../shared/components/good-practices-tabs/good-practices-tabs';

@Component({
  selector: 'professional-practices-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule, GoodPracticesTabs],
  templateUrl: './professional-practices-section.html',
  styleUrl: './professional-practices-section.scss',
})
export class ProfessionalPracticesSection {}
