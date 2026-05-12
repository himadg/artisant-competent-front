import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { DashboardApiService } from '../../../core/services/dashboard-api.service';
import { AuthService } from '../../../core/services/auth.service';
import { UserApiService } from '../../../core/services/user-api.service';
import { IndividualDashboardData } from '../../../shared/interfaces/individual-dashboard';
import { LangToggle } from '../../../shared/components/lang-toggle/lang-toggle';
import { ThemeToggle } from '../../../shared/components/theme-toggle/theme-toggle';

export type IndividualSection = 'profile' | 'requests' | 'quotes' | 'invoices' | 'legal' | 'practices';

@Component({
  selector: 'dashboard-individual',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslocoModule, LangToggle, ThemeToggle],
  templateUrl: './individual-dashboard.html',
  styleUrl: './individual-dashboard.scss',
})
export class IndividualDashboard implements OnInit {
  private readonly dashboardApi = inject(DashboardApiService);
  private readonly userApi = inject(UserApiService);
  readonly authService = inject(AuthService);

  readonly data = signal<IndividualDashboardData | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly activeSection = signal<IndividualSection>('profile');
  readonly moreMenuOpen = signal(false);

  readonly editMode = signal(false);
  readonly saving = signal(false);
  editFields = { firstName: '', lastName: '', email: '', birthDate: '', gender: '' };

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

  enterEditMode() {
    const d = this.data();
    if (!d) return;
    this.editFields = {
      firstName: d.firstName,
      lastName: d.lastName,
      email: d.email,
      birthDate: d.birthDate.slice(0, 10),
      gender: d.gender,
    };
    this.editMode.set(true);
  }

  cancelEdit() { this.editMode.set(false); }

  saveEdit() {
    const d = this.data();
    if (!d) return;
    this.saving.set(true);
    this.userApi.updateUser(d.id, { ...this.editFields }).subscribe({
      next: () => {
        this.data.update(prev => prev ? {
          ...prev,
          firstName: this.editFields.firstName,
          lastName: this.editFields.lastName,
          email: this.editFields.email,
          birthDate: new Date(this.editFields.birthDate).toISOString(),
          gender: this.editFields.gender,
        } : prev);
        this.editMode.set(false);
        this.saving.set(false);
      },
      error: () => this.saving.set(false),
    });
  }
}
