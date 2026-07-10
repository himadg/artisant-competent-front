import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { AuthService } from '../../core/services/auth.service';
import { ProfessionalDashboard } from './professional/professional-dashboard';
import { IndividualDashboard } from './individual/individual-dashboard';
import { AdminDashboard } from './admin/admin-dashboard';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProfessionalDashboard, IndividualDashboard, AdminDashboard, TranslocoModule],
  templateUrl: './dashboard.html',
})
export class DashboardPage {
  private readonly authService = inject(AuthService);
  readonly currentUser = computed(() => this.authService.currentUser());
  readonly role = computed(() => this.authService.currentUser()?.role?.code ?? null);
}
