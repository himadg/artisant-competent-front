import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProfessionalDashboardStateService } from '../../professional-dashboard-state.service';
import { Messaging } from '../../../../../shared/components/messaging/messaging';
import { AppConfigService } from '../../../../../core/services/app-config.service';
import { ComingSoon } from '../../../../../shared/components/coming-soon/coming-soon';

@Component({
  selector: 'professional-messages-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Messaging, ComingSoon],
  templateUrl: './professional-messages-section.html',
  styleUrl: './professional-messages-section.scss',
})
export class ProfessionalMessagesSection {
  private readonly state = inject(ProfessionalDashboardStateService);
  private readonly configService = inject(AppConfigService);

  readonly comingSoonEnabled = this.configService.get('comingSoonEnabled') === 'true';

  readonly pendingConversationId = this.state.pendingConversationId;

  onOpenDemandFromMessaging(demandId: string): void {
    this.state.selectedDemandEditable.set(false);
    this.state.selectedDemandId.set(demandId);
  }

  onInitialConversationConsumed(): void {
    this.state.pendingConversationId.set(null);
  }
}
