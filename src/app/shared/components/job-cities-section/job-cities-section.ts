import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CITIES } from '../../../data/cities';

@Component({
  selector: 'job-cities-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule],
  templateUrl: './job-cities-section.html',
})
export class JobCitiesSection {
  readonly tradeSlug = input.required<string>();
  readonly cities = CITIES;
}
