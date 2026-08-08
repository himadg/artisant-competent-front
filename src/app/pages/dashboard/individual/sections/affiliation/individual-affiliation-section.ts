import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { PlatformLocation } from '@angular/common';
import { IndividualDashboardStateService } from '../../individual-dashboard-state.service';
import { LocalizedDatePipe } from '../../../../../shared/pipes/localized-date.pipe';

@Component({
  selector: 'individual-affiliation-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TranslocoModule, LocalizedDatePipe],
  templateUrl: './individual-affiliation-section.html',
  styleUrl: './individual-affiliation-section.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class IndividualAffiliationSection implements OnInit {
  private readonly state = inject(IndividualDashboardStateService);
  private readonly platformLocation = inject(PlatformLocation);

  readonly affiliationData = this.state.affiliationData;
  readonly affiliationLoading = this.state.affiliationLoading;
  readonly codeCopied = signal(false);

  ngOnInit(): void {
    if (!this.affiliationData()) {
      this.state.loadAffiliationDashboard();
    }
  }

  generateAffiliateCode(): void {
    this.state.generateAffiliateCode();
  }

  copyAffiliateCode(code: string): void {
    navigator.clipboard.writeText(code).then(() => {
      this.codeCopied.set(true);
      setTimeout(() => this.codeCopied.set(false), 2000);
    });
  }

  affiliateShareUrl(code: string): string {
    const { protocol, hostname, port } = this.platformLocation;
    const origin = `${protocol}//${hostname}${port ? ':' + port : ''}`;
    return `${origin}/affiliation?ref=${code}`;
  }
}
