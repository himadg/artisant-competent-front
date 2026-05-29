import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { TranslocoModule } from '@jsverse/transloco';
import { getTrade, TradeInfo, TRADES_MAP } from '../../data/trades';
import { getCity, City, CITIES_MAP } from '../../data/cities';
import { JobCitiesSection } from '../../shared/components/job-cities-section/job-cities-section';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, TranslocoModule, JobCitiesSection],
  templateUrl: './job-city.html',
  styleUrl: './job-city.scss',
})
export class JobCityPage implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly meta = inject(Meta);
  private readonly titleService = inject(Title);
  private readonly document = inject(DOCUMENT);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly platformId = inject(PLATFORM_ID);
  private paramsSub?: Subscription;

  trade: TradeInfo | null = null;
  city: City | null = null;
  nearbyCities: { city: City; tradeSlug: string }[] = [];

  ngOnInit(): void {
    this.paramsSub = this.route.paramMap.subscribe(params => {
      const tradeSlug = params.get('trade') ?? '';
      const citySlug = params.get('city') ?? '';

      this.trade = getTrade(tradeSlug) ?? null;
      this.city = getCity(citySlug) ?? null;

      if (!this.trade || !this.city) {
        this.cdr.markForCheck();
        return;
      }

      const { trade, city } = this;

      this.titleService.setTitle(trade.metaTitle(city.name));
      this.meta.updateTag({ name: 'description', content: trade.metaDescription(city.name) });
      this.meta.updateTag({ name: 'keywords', content: trade.keywords(city.name) });
      this.meta.updateTag({ property: 'og:title', content: trade.metaTitle(city.name) });
      this.meta.updateTag({ property: 'og:description', content: trade.metaDescription(city.name) });
      this.meta.updateTag({ property: 'og:type', content: 'website' });
      this.meta.updateTag({ name: 'robots', content: 'index, follow' });

      this.nearbyCities = city.nearbyCities
        .map(slug => CITIES_MAP.get(slug))
        .filter((c): c is City => !!c)
        .map(c => ({ city: c, tradeSlug }));

      this.injectJsonLd(trade, city);
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.paramsSub?.unsubscribe();
  }

  private injectJsonLd(trade: TradeInfo, city: City): void {
    if (isPlatformBrowser(this.platformId)) return;

    const existing = this.document.getElementById('job-city-jsonld');
    if (existing) existing.remove();

    const script = this.document.createElement('script');
    script.id = 'job-city-jsonld';
    script.type = 'application/ld+json';
    script.appendChild(this.document.createTextNode(JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: `${trade.name} à ${city.name}`,
      description: trade.metaDescription(city.name),
      areaServed: {
        '@type': 'City',
        name: city.name,
        containedInPlace: {
          '@type': 'AdministrativeArea',
          name: city.region,
        },
      },
      provider: {
        '@type': 'Organization',
        name: 'Artisan Compétent',
        url: 'https://www.artisant-competent.com',
      },
      serviceType: trade.longName,
    })));
    this.document.head.appendChild(script);
  }

  getTradeUrl(tradeSlug: string, citySlug: string): string {
    return `/job/${tradeSlug}/${citySlug}`;
  }

  getAllTradesForCity(): { name: string; slug: string }[] {
    return [...TRADES_MAP.values()].map(t => ({ name: t.name, slug: t.slug }));
  }
}
