import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import { IndividualDashboardStateService } from '../../individual-dashboard-state.service';
import { LocalizedDatePipe } from '../../../../../shared/pipes/localized-date.pipe';

@Component({
  selector: 'individual-requests-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TranslocoModule, RouterLink, LocalizedDatePipe],
  templateUrl: './individual-requests-section.html',
  styleUrl: './individual-requests-section.scss',
})
export class IndividualRequestsSection implements OnInit {
  private readonly state = inject(IndividualDashboardStateService);

  readonly myDemands = this.state.myDemands;
  readonly demandsLoading = this.state.demandsLoading;
  readonly selectedDemandId = this.state.selectedDemandId;

  ngOnInit(): void {
    this.state.loadDemands();
  }
}
