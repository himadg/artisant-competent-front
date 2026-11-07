import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import { ProfessionalDashboardStateService, RequestsTab } from '../../professional-dashboard-state.service';
import { LocalizedDatePipe } from '../../../../../shared/pipes/localized-date.pipe';
import { AppConfigService } from '../../../../../core/services/app-config.service';
import { ComingSoon } from '../../../../../shared/components/coming-soon/coming-soon';

@Component({
  selector: 'professional-requests-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TranslocoModule, RouterLink, LocalizedDatePipe, ComingSoon],
  templateUrl: './professional-requests-section.html',
  styleUrl: './professional-requests-section.scss',
})
export class ProfessionalRequestsSection implements OnInit {
  private readonly state = inject(ProfessionalDashboardStateService);
  private readonly configService = inject(AppConfigService);

  readonly comingSoonEnabled = this.configService.get('comingSoonEnabled') === 'true';

  readonly requestsTab = this.state.requestsTab;
  readonly myDemands = this.state.myDemands;
  readonly receivedDemands = this.state.receivedDemands;
  readonly demandsLoading = this.state.demandsLoading;
  readonly selectedDemandId = this.state.selectedDemandId;
  readonly selectedDemandEditable = this.state.selectedDemandEditable;

  ngOnInit(): void {
    if (this.comingSoonEnabled) return;
    this.state.loadDemands();
  }

  setRequestsTab(tab: RequestsTab): void {
    this.requestsTab.set(tab);
  }

  selectMine(demandId: string): void {
    this.selectedDemandId.set(demandId);
    this.selectedDemandEditable.set(true);
  }

  selectReceived(demandId: string): void {
    this.selectedDemandId.set(demandId);
    this.selectedDemandEditable.set(false);
  }
}
