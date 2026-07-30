import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IndividualDashboardStateService } from '../../individual-dashboard-state.service';
import { Messaging } from '../../../../../shared/components/messaging/messaging';

@Component({
  selector: 'individual-messages-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Messaging],
  templateUrl: './individual-messages-section.html',
  styleUrl: 'individual-messages-section.scss'
})
export class IndividualMessagesSection {
  private readonly state = inject(IndividualDashboardStateService);

  onOpenDemandFromMessaging(demandId: string): void {
    this.state.selectedDemandId.set(demandId);
  }
}
