import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { TRADES_MAP } from '../../../data/trades';
import { JobCitiesSection } from '../../../shared/components/job-cities-section/job-cities-section';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule, JobCitiesSection],
  templateUrl: './pest-control.html',
  styleUrl: './pest-control.scss',
})
export class PestControlPage implements OnInit, OnDestroy {
  private readonly meta = inject(Meta);
  private readonly titleService = inject(Title);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly transloco = inject(TranslocoService);
  private contentSub?: Subscription;

  readonly trade = TRADES_MAP.get('pest-control')!;
  tradeContent: any = null;

  ngOnInit(): void {
    this.titleService.setTitle(this.trade.name);
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    this.contentSub = this.transloco.selectTranslateObject(`jobs.list.${this.trade.i18nKey}`).subscribe(content => {
      this.tradeContent = content;
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.contentSub?.unsubscribe();
  }
}
