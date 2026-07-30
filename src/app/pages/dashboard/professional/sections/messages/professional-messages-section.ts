import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProfessionalDashboardStateService } from '../../professional-dashboard-state.service';
import { Messaging } from '../../../../../shared/components/messaging/messaging';

@Component({
  selector: 'professional-messages-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Messaging],
  templateUrl: './professional-messages-section.html',
  styleUrl: './professional-messages-section.scss',
})
export class ProfessionalMessagesSection {
  private readonly state = inject(ProfessionalDashboardStateService);

  readonly pendingConversationId = this.state.pendingConversationId;

  onOpenDemandFromMessaging(demandId: string): void {
    this.state.selectedDemandEditable.set(false);
    this.state.selectedDemandId.set(demandId);
  }
}
