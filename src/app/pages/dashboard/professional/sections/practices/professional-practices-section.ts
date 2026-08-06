import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'professional-practices-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule],
  templateUrl: './professional-practices-section.html',
  styleUrl: './professional-practices-section.scss',
})
export class ProfessionalPracticesSection {}
