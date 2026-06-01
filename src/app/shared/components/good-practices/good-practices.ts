import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { GoodPracticesPro } from './good-practices-pro/good-practices-pro';
import { GoodPracticesIndividual } from './good-practices-individual/good-practices-individual';

@Component({
  selector: 'good-practices',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GoodPracticesPro, GoodPracticesIndividual],
  templateUrl: './good-practices.html'
})
export class GoodPractices {
  readonly userType = input.required<'professional' | 'individual'>();
}
