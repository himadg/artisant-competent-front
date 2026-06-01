import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'good-practices-individual',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './good-practices-individual.html',
  styleUrl: './good-practices-individual.scss',
})
export class GoodPracticesIndividual {
  private readonly translocoService = inject(TranslocoService);

  readonly goodPractices = toSignal(
    this.translocoService.selectTranslateObject<any>('goodPractices.individual'),
    { initialValue: null },
  );

}
