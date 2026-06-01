import { ChangeDetectionStrategy, Component, inject, OnInit, signal, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule, PlatformLocation } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { DashboardApiService } from '../../../core/services/dashboard-api.service';
import { AuthService } from '../../../core/services/auth.service';
import { UserApiService } from '../../../core/services/user-api.service';
import { AffiliationApiService } from '../../../core/services/affiliation-api.service';
import { IndividualDashboardData } from '../../../shared/interfaces/individual-dashboard';
import { AffiliationDashboard } from '../../../shared/interfaces/affiliation';
import { LangToggle } from '../../../shared/components/lang-toggle/lang-toggle';
import { ThemeToggle } from '../../../shared/components/theme-toggle/theme-toggle';
import { LegalModal } from '../../../shared/components/legal-modal/legal-modal';
import { RouterLink } from "@angular/router";
import { GoodPractices } from '../../../shared/components/good-practices/good-practices';

export type IndividualSection = 'profile' | 'requests' | 'quotes' | 'invoices' | 'legal' | 'practices' | 'affiliation';

@Component({
  selector: 'dashboard-individual',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, TranslocoModule, LangToggle, ThemeToggle, LegalModal, RouterLink, GoodPractices],
  templateUrl: './individual-dashboard.html',
  styleUrl: './individual-dashboard.scss',
})
export class IndividualDashboard implements OnInit {
  private readonly dashboardApi = inject(DashboardApiService);
  private readonly userApi = inject(UserApiService);
  private readonly affiliationApi = inject(AffiliationApiService);
  private readonly platformLocation = inject(PlatformLocation);
  readonly authService = inject(AuthService);

  readonly data = signal<IndividualDashboardData | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly activeSection = signal<IndividualSection>('profile');
  readonly moreMenuOpen = signal(false);

  readonly affiliationData = signal<AffiliationDashboard | null>(null);
  readonly affiliationLoading = signal(false);
  readonly codeCopied = signal(false);

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

  constructor() {
    inject(BreakpointObserver)
      .observe('(orientation: landscape)')
      .pipe(takeUntilDestroyed())
      .subscribe(({ matches }) => { if (matches) this.moreMenuOpen.set(false); });
  }

  setSection(section: IndividualSection) {
    this.activeSection.set(section);
    if (section === 'affiliation' && !this.affiliationData()) {
      this.loadAffiliationDashboard();
    }
  }

  loadAffiliationDashboard() {
    this.affiliationLoading.set(true);
    this.affiliationApi.getDashboard().subscribe({
      next: (data) => { this.affiliationData.set(data); this.affiliationLoading.set(false); },
      error: () => this.affiliationLoading.set(false),
    });
  }

  generateAffiliateCode() {
    this.affiliationApi.generateCode().subscribe({
      next: () => this.loadAffiliationDashboard(),
    });
  }

  copyAffiliateCode(code: string) {
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
    const individual = this.data();
    if (!individual) return;
    this.saving.set(true);
    this.userApi.updateUser(individual.id, { ...this.editFields }).subscribe({
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
