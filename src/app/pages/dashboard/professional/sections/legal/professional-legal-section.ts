import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LegalModal } from '../../../../../shared/components/legal-modal/legal-modal';

@Component({
  selector: 'professional-legal-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LegalModal],
  templateUrl: './professional-legal-section.html',
})
export class ProfessionalLegalSection {}
