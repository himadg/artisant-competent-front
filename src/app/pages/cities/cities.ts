import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { CITIES } from '../../data/cities';
import { City } from '../../shared/interfaces/city';
import { CityGroup } from '../../shared/interfaces/city-group';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, TranslocoModule],
  templateUrl: './cities.html',
  styleUrl: './cities.scss',
})
export class CitiesPage {
  readonly cityGroups: CityGroup[] = this.buildGroups();

  private buildGroups(): CityGroup[] {
    const map = new Map<string, City[]>();
    for (const city of CITIES) {
      const group = map.get(city.region) ?? [];
      group.push(city);
      map.set(city.region, group);
    }
    return [...map.entries()].map(([region, cities]) => ({ region, cities }));
  }
}
