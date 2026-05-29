import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { TranslocoModule } from '@jsverse/transloco';
import { getTrade, TradeInfo } from '../../data/trades';
import { JobCitiesSection } from '../../shared/components/job-cities-section/job-cities-section';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule, JobCitiesSection],
  templateUrl: './job.html',
})
export class JobPage implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly meta = inject(Meta);
  private readonly titleService = inject(Title);
  private readonly cdr = inject(ChangeDetectorRef);
  private paramsSub?: Subscription;

  trade: TradeInfo | null = null;

  ngOnInit(): void {
    this.paramsSub = this.route.paramMap.subscribe(params => {
      const tradeSlug = params.get('trade') ?? '';
      this.trade = getTrade(tradeSlug) ?? null;

      if (this.trade) {
        this.titleService.setTitle(this.trade.name);
        this.meta.updateTag({ name: 'robots', content: 'index, follow' });
      }

      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.paramsSub?.unsubscribe();
  }
}
