import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'good-practices-pro',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './good-practices-pro.html',
  styleUrl: './good-practices-pro.scss',
})
export class GoodPracticesPro {
  private readonly translocoService = inject(TranslocoService);

  readonly goodPractices = toSignal(
    this.translocoService.selectTranslateObject<any>('goodPractices.pro'),
    { initialValue: null },
  );
}
