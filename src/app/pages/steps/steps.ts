import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { Accordion } from '../../shared/components/accordion';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule, RouterModule, Accordion],
  templateUrl: './steps.html',
  styleUrl: './steps.scss',
})
export class StepsPage {}
