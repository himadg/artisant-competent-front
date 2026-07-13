import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { getCity, City, CITIES_MAP } from '../../data/cities';
import { TRADES } from '../../data/trades';
import { TradeInfo } from '../../shared/interfaces/trade-info';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, TranslocoModule],
  templateUrl: './city.html',
  styleUrl: './city.scss',
})
export class CityPage implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly meta = inject(Meta);
  private readonly titleService = inject(Title);
  private readonly transloco = inject(TranslocoService);
  private readonly cdr = inject(ChangeDetectorRef);
  private paramsSub?: Subscription;

  city: City | null = null;
  nearbyCities: City[] = [];
  readonly trades: TradeInfo[] = TRADES;

  ngOnInit(): void {
    this.paramsSub = this.route.paramMap.subscribe(params => {
      const citySlug = params.get('city') ?? '';
      this.city = getCity(citySlug) ?? null;

      if (!this.city) {
        this.cdr.markForCheck();
        return;
      }

      const { city } = this;

      this.nearbyCities = city.nearbyCities
        .map(slug => CITIES_MAP.get(slug))
        .filter((c): c is City => !!c);

      const title = this.transloco.translate<string>('city.title', { city: city.name });
      const description = this.transloco.translate<string>('city.description', { city: city.name });

      this.titleService.setTitle(title);
      this.meta.updateTag({ name: 'description', content: description });
      this.meta.updateTag({ property: 'og:title', content: title });
      this.meta.updateTag({ property: 'og:description', content: description });
      this.meta.updateTag({ name: 'robots', content: 'index, follow' });

      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.paramsSub?.unsubscribe();
  }

  getJobCityUrl(tradeSlug: string, citySlug: string): string {
    return `/job/${tradeSlug}/${citySlug}`;
  }
}
