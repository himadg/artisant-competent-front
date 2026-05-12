import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { DashboardApiService } from '../../../core/services/dashboard-api.service';
import { AuthService } from '../../../core/services/auth.service';
import { IndividualDashboardData } from '../../../shared/interfaces/individual-dashboard';
import { LangToggle } from '../../../shared/components/lang-toggle/lang-toggle';
import { ThemeToggle } from '../../../shared/components/theme-toggle/theme-toggle';

export type IndividualSection = 'profile' | 'requests' | 'quotes' | 'invoices' | 'legal' | 'practices';

@Component({
  selector: 'dashboard-individual',
  standalone: true,
  imports: [CommonModule, TranslocoModule, LangToggle, ThemeToggle],
  templateUrl: './individual-dashboard.html',
  styleUrl: './individual-dashboard.scss',
})
export class IndividualDashboard implements OnInit {
  private readonly dashboardApi = inject(DashboardApiService);
  readonly authService = inject(AuthService);

  readonly data = signal<IndividualDashboardData | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly activeSection = signal<IndividualSection>('profile');
  readonly moreMenuOpen = signal(false);

  readonly inscriptionDate = computed(() => {
    const data = this.data();
    if (!data) return '';
    return new Date(data.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  });

  readonly birthDate = computed(() => {
    const data = this.data();
    if (!data) return '';
    return new Date(data.birthDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  });

  readonly homeAddress = computed(() => {
    const address = this.data()?.address;
    if (!address) return '';
    const parts = [address.additionalInfo, address.streetNumber, address.streetName].filter(Boolean);
    return `${parts.join(' ')}, ${address.postalCode} ${address.city}`;
  });

  ngOnInit() {
    this.dashboardApi.getOwnDashboard<IndividualDashboardData>().subscribe({
      next: (data) => { this.data.set(data); this.loading.set(false); },
      error: () => { this.error.set('dashboard.errors.load'); this.loading.set(false); },
    });
  }

  setSection(section: IndividualSection) { this.activeSection.set(section); }
  toggleMoreMenu() { this.moreMenuOpen.update(v => !v); }
  closeMoreMenu() { this.moreMenuOpen.set(false); }
}
