import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { CITIES } from '../../../data/cities';

@Component({
  selector: 'job-cities-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, TranslocoModule],
  templateUrl: './job-cities-section.html',
})
export class JobCitiesSection {
  readonly tradeSlug = input.required<string>();
  readonly cities = CITIES;
}
