import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { DashboardApiService } from '../../../core/services/dashboard-api.service';
import { AuthService } from '../../../core/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ProfessionalDashboardData } from '../../../shared/interfaces/professional-dashboard';
import { LangToggle } from '../../../shared/components/lang-toggle/lang-toggle';
import { ThemeToggle } from '../../../shared/components/theme-toggle/theme-toggle';

export type ProSection = 'requests' | 'quotes' | 'invoices' | 'profile' | 'legal' | 'practices';
export type ProTab = 'presentation' | 'services' | 'missions' | 'reviews' | 'documents';

@Component({
  selector: 'dashboard-professional',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoModule, LangToggle, ThemeToggle],
  templateUrl: './professional-dashboard.html',
  styleUrl: './professional-dashboard.scss',
})
export class ProfessionalDashboard implements OnInit {
  private readonly dashboardApi = inject(DashboardApiService);
  private readonly route = inject(ActivatedRoute);
  readonly authService = inject(AuthService);

  readonly data = signal<ProfessionalDashboardData | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly activeSection = signal<ProSection>('profile');
  readonly activeTab = signal<ProTab>('presentation');

  readonly inscriptionDate = computed(() => {
    const data = this.data();
    if (!data) return '';
    return new Date(data.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  });

  readonly workCity = computed(() => {
    const professional = this.data()?.professionalProfile;
    if (!professional) return '';
    return `${professional.workAddress.additionalInfo ?? ''} ${professional.workAddress.streetNumber}
      ${professional.workAddress.streetName}, ${professional.workAddress.postalCode} ${professional.workAddress.city}`;
  });

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('userId');
    const request$ = userId
      ? this.dashboardApi.getProDashboard(userId)
      : this.dashboardApi.getOwnDashboard();

    request$.subscribe({
      next: (data) => { this.data.set(data); this.loading.set(false); },
      error: () => { this.error.set('dashboard.errors.load'); this.loading.set(false); },
    });
  }

  readonly moreMenuOpen = signal(false);

  setSection(section: ProSection) { this.activeSection.set(section); }
  setTab(tab: ProTab) { this.activeTab.set(tab); }
  toggleMoreMenu() { this.moreMenuOpen.update(v => !v); }
  closeMoreMenu() { this.moreMenuOpen.set(false); }
}
