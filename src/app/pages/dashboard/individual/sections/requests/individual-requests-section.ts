import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import { IndividualDashboardStateService } from '../../individual-dashboard-state.service';
import { LocalizedDatePipe } from '../../../../../shared/pipes/localized-date.pipe';
import { AppConfigService } from '../../../../../core/services/app-config.service';
import { ComingSoon } from '../../../../../shared/components/coming-soon/coming-soon';

@Component({
  selector: 'individual-requests-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TranslocoModule, RouterLink, LocalizedDatePipe, ComingSoon],
  templateUrl: './individual-requests-section.html',
  styleUrl: './individual-requests-section.scss',
})
export class IndividualRequestsSection implements OnInit {
  private readonly state = inject(IndividualDashboardStateService);
  private readonly configService = inject(AppConfigService);

  readonly comingSoonEnabled = this.configService.get('comingSoonEnabled') === 'true';

  readonly myDemands = this.state.myDemands;
  readonly demandsLoading = this.state.demandsLoading;
  readonly selectedDemandId = this.state.selectedDemandId;

  ngOnInit(): void {
    if (this.comingSoonEnabled) return;
    this.state.loadDemands();
  }
}
