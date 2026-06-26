import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { TRADES, TradeInfo } from '../../data/trades';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule, RouterModule],
  templateUrl: './urgences.html',
  styleUrl: './urgences.scss',
})
export class UrgencesPage {
  readonly trades: TradeInfo[] = TRADES.filter((t) => t.isOnCall);
}
