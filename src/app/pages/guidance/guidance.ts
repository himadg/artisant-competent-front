import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { Accordion } from '../../shared/components/accordion';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule, RouterModule, Accordion],
  templateUrl: './guidance.html',
  styleUrl: './guidance.scss',
})
export class GuidancePage {}
