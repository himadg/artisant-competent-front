import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { TRADES_MAP } from '../../../data/trades';
import { getCity, City, CITIES_MAP, getAllCities } from '../../../data/cities';
import { JobCitiesSection } from '../../../shared/components/job-cities-section/job-cities-section';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule, JobCitiesSection, RouterModule],
  templateUrl: './locksmith.html',
  styleUrl: './locksmith.scss',
})
export class LocksmithPage implements OnInit, OnDestroy {
  private readonly meta = inject(Meta);
  private readonly titleService = inject(Title);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly transloco = inject(TranslocoService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private contentSub?: Subscription;
  private querySub?: Subscription;

  readonly trade = TRADES_MAP.get('locksmith')!;
  tradeContent: any = null;

  city: City | null = null;
  nearbyCities: { city: City; tradeSlug: string }[] = [];

  ngOnInit(): void {
    this.querySub = this.route.queryParamMap.subscribe(params => {
      const citySlug = params.get('city');

      if (citySlug && getAllCities().includes(citySlug)) {
        this.city = getCity(citySlug) ?? null;
        if (this.city) {
          this.nearbyCities = this.city.nearbyCities
            .map((slug) => CITIES_MAP.get(slug))
            .filter((c): c is City => !!c)
            .map((c) => ({ city: c, tradeSlug: this.trade.slug }));
        } else {
          this.nearbyCities = [];
        }
      } else {
        this.router.navigate(['/job', this.trade.slug]);
      }

      this.updateMetaTags();
      this.cdr.markForCheck();
    });

    this.contentSub = this.transloco.selectTranslateObject(`jobs.list.${this.trade.i18nKey}`).subscribe(content => {
      this.tradeContent = content;
      this.updateMetaTags();
      this.cdr.markForCheck();
    });
  }

  private updateMetaTags(): void {
    if (!this.tradeContent) return;

    if (this.city) {
      this.titleService.setTitle(this.trade.metaTitle(this.city.name));
      this.meta.updateTag({ name: 'description', content: this.trade.metaDescription(this.city.name) });
      this.meta.updateTag({ name: 'keywords', content: this.trade.keywords(this.city.name) });
    } else {
      this.titleService.setTitle(this.trade.name);
    }
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
  }

  ngOnDestroy(): void {
    this.contentSub?.unsubscribe();
    this.querySub?.unsubscribe();
  }

  getTradeUrl(tradeSlug: string, citySlug: string): string {
    return `/job/${tradeSlug}/${citySlug}`;
  }
}
