import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LegalModal } from '../../../../../shared/components/legal-modal/legal-modal';

@Component({
  selector: 'individual-legal-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LegalModal],
  templateUrl: './individual-legal-section.html',
  styleUrl: './individual-legal-section.scss',
})
export class IndividualLegalSection {}
