import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { ProfessionalDashboard } from './professional/professional-dashboard';
import { IndividualDashboard } from './individual/individual-dashboard';
// import { AdminDashboard } from './admin/admin-dashboard';

@Component({
  standalone: true,
  imports: [ProfessionalDashboard, IndividualDashboard/* , AdminDashboard */],
  templateUrl: './dashboard.html',
})
export class DashboardPage {
  private readonly authService = inject(AuthService);
  readonly role = computed(() => this.authService.currentUser()?.role?.code ?? null);
}
