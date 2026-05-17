import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { forkJoin } from 'rxjs';
import { DashboardApiService } from '../../../core/services/dashboard-api.service';
import { AuthService } from '../../../core/services/auth.service';
import { UserApiService } from '../../../core/services/user-api.service';
import { ServiceApiService } from '../../../core/services/service-api.service';
import { ActivatedRoute } from '@angular/router';
import { ProfessionalDashboardData, OpeningHoursDay, Service } from '../../../shared/interfaces/professional-dashboard';
import { LangToggle } from '../../../shared/components/lang-toggle/lang-toggle';
import { ThemeToggle } from '../../../shared/components/theme-toggle/theme-toggle';
import { LegalModal } from '../../../shared/components/legal-modal/legal-modal';

export type ProSection = 'requests' | 'quotes' | 'invoices' | 'profile' | 'legal' | 'practices';
export type ProTab = 'presentation' | 'services' | 'missions' | 'reviews' | 'documents';

const WEEK_DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

@Component({
  selector: 'dashboard-professional',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslocoModule, LangToggle, ThemeToggle, LegalModal],
  templateUrl: './professional-dashboard.html',
  styleUrl: './professional-dashboard.scss',
})
export class ProfessionalDashboard implements OnInit {
  private readonly dashboardApi = inject(DashboardApiService);
  private readonly userApi = inject(UserApiService);
  private readonly serviceApi = inject(ServiceApiService);
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

  readonly moreMenuOpen = signal(false);
  readonly moreMenuContentDisplayed = signal(false);

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('userId');
    const request$ = userId
      ? this.dashboardApi.getDashboard<ProfessionalDashboardData>(userId)
      : this.dashboardApi.getOwnDashboard<ProfessionalDashboardData>();

    request$.subscribe({
      next: (data) => {
        this.data.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('dashboard.errors.load');
        this.loading.set(false);
      },
    });
  }


  setSection(section: ProSection) {
    this.activeSection.set(section);
  }

  setTab(tab: ProTab) {
    this.activeTab.set(tab);
  }

  toggleMoreMenu() {
    this.moreMenuOpen.update((value) => !value);
  }

  toggleMoreMenuContent() {
    this.moreMenuContentDisplayed.update((value) => !value);
  }

  closeMoreMenu() {
    this.moreMenuOpen.set(false);
  }

  // ── Description ──────────────────────────────────────────────────────────
  readonly editDescriptionMode = signal(false);
  readonly savingDescription = signal(false);
  editDescriptionText = '';

  enterEditDescription() {
    const p = this.data()?.professionalProfile;
    if (!p) return;
    this.editDescriptionText = p.description;
    this.editDescriptionMode.set(true);
  }

  cancelEditDescription() {
    this.editDescriptionMode.set(false);
  }

  saveEditDescription() {
    const d = this.data();
    if (!d) return;
    this.savingDescription.set(true);
    this.userApi.updateProfessional(d.id, { description: this.editDescriptionText }).subscribe({
      next: () => {
        this.data.update((prev) =>
          prev
            ? {
                ...prev,
                professionalProfile: { ...prev.professionalProfile, description: this.editDescriptionText },
              }
            : prev,
        );
        this.editDescriptionMode.set(false);
        this.savingDescription.set(false);
      },
      error: () => this.savingDescription.set(false),
    });
  }

  // ── Trades ───────────────────────────────────────────────────────────────
  readonly editTradesMode = signal(false);
  readonly savingTrades = signal(false);
  readonly loadingTrades = signal(false);
  readonly editTradeIds = signal<string[]>([]);
  readonly allTrades = signal<{ id: string; name: string }[]>([]);

  enterEditTrades() {
    const p = this.data()?.professionalProfile;
    if (!p) return;
    this.editTradeIds.set(p.trades.map((t) => t.id));
    if (!this.allTrades().length) {
      this.loadingTrades.set(true);
      this.userApi.getAllTrades().subscribe({
        next: (t) => {
          this.allTrades.set(t);
          this.loadingTrades.set(false);
        },
        error: () => this.loadingTrades.set(false),
      });
    }
    this.editTradesMode.set(true);
  }

  cancelEditTrades() {
    this.editTradesMode.set(false);
  }

  toggleTrade(id: string) {
    this.editTradeIds.update((ids) => (ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]));
  }

  saveEditTrades() {
    const d = this.data();
    if (!d) return;

    this.savingTrades.set(true);
    this.userApi.updateProfessional(d.id, { tradeIds: this.editTradeIds() }).subscribe({
      next: () => {
        const selected = this.editTradeIds();
        this.data.update((prev) =>
          prev
            ? {
                ...prev,
                professionalProfile: {
                  ...prev.professionalProfile,
                  trades: this.allTrades().filter((t) => selected.includes(t.id)),
                },
              }
            : prev,
        );
        this.editTradesMode.set(false);
        this.savingTrades.set(false);
      },
      error: () => this.savingTrades.set(false),
    });
  }

  // ── Opening hours ─────────────────────────────────────────────────────────
  readonly editHoursMode = signal(false);
  readonly savingHours = signal(false);
  readonly editHours = signal<OpeningHoursDay[]>([]);

  enterEditHours() {
    const openingHours = this.data()?.professionalProfile.openingHours;
    if (openingHours?.days?.length === 7) {
      this.editHours.set(
        (JSON.parse(JSON.stringify(openingHours.days)) as OpeningHoursDay[]).map((day) => ({
          ...day,
          intervals: day.intervals.length ? day.intervals : [],
        })),
      );
    } else {
      this.editHours.set(WEEK_DAYS.map((day) => ({ day, closed: true, intervals: [] })));
    }
    this.editHoursMode.set(true);
  }

  cancelEditHours() {
    this.editHoursMode.set(false);
  }

  toggleDay(index: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.editHours.update((days) => days.map((day, i) => (i !== index ? day : { ...day, closed: !checked })));
  }

  setHourStart(index: number, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.editHours.update((days) =>
      days.map((d, i) =>
        i === index ? { ...d, intervals: [{ start: value, end: d.intervals[0]?.end ?? '18:00' }] } : d,
      ),
    );
  }

  setHourEnd(index: number, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.editHours.update((days) =>
      days.map((d, i) =>
        i === index ? { ...d, intervals: [{ start: d.intervals[0]?.start ?? '08:00', end: value }] } : d,
      ),
    );
  }

  saveEditHours() {
    const d = this.data();
    if (!d) return;
    this.savingHours.set(true);
    this.userApi.updateProfessional(d.id, { openingHours: { days: this.editHours() } }).subscribe({
      next: () => {
        const days = this.editHours();
        this.data.update((prev) =>
          prev
            ? {
                ...prev,
                professionalProfile: {
                  ...prev.professionalProfile,
                  openingHours: { days },
                },
              }
            : prev,
        );
        this.editHoursMode.set(false);
        this.savingHours.set(false);
      },
      error: () => this.savingHours.set(false),
    });
  }

  // ── Partners ─────────────────────────────────────────────────────────────
  readonly editPartnersMode = signal(false);
  readonly savingPartners = signal(false);
  readonly editPartnerList = signal<string[]>([]);
  partnerInput = '';

  enterEditPartners() {
    this.editPartnerList.set([...(this.data()?.professionalProfile.suppliers ?? [])]);
    this.partnerInput = '';
    this.editPartnersMode.set(true);
  }

  cancelEditPartners() { this.editPartnersMode.set(false); }

  addPartnerToEdit(event: KeyboardEvent) {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    const name = this.partnerInput.trim();
    if (!name || this.editPartnerList().includes(name)) return;
    this.editPartnerList.update((list) => [...list, name]);
    this.partnerInput = '';
  }

  removePartnerFromEdit(name: string) {
    this.editPartnerList.update((list) => list.filter((p) => p !== name));
  }

  saveEditPartners() {
    const d = this.data();
    if (!d) return;
    this.savingPartners.set(true);
    this.userApi.updateProfessional(d.id, { suppliers: this.editPartnerList() }).subscribe({
      next: () => {
        const list = this.editPartnerList();
        this.data.update((prev) =>
          prev
            ? {
                ...prev,
                professionalProfile: { ...prev.professionalProfile, suppliers: [...list] },
              }
            : prev,
        );
        this.editPartnersMode.set(false);
        this.savingPartners.set(false);
      },
      error: () => this.savingPartners.set(false),
    });
  }

  // ── Trusted contact ───────────────────────────────────────────────────────
  readonly editTrustedContactMode = signal(false);
  readonly savingTrustedContact = signal(false);
  editTrustedContact = { name: '', phone: '' };

  enterEditTrustedContact() {
    const p = this.data()?.professionalProfile;
    if (!p) return;
    this.editTrustedContact = {
      name: p.trustedContactName ?? '',
      phone: p.trustedContactPhone ?? '',
    };
    this.editTrustedContactMode.set(true);
  }

  cancelEditTrustedContact() {
    this.editTrustedContactMode.set(false);
  }

  saveEditTrustedContact() {
    const d = this.data();
    if (!d) return;
    this.savingTrustedContact.set(true);
    this.userApi
      .updateProfessional(d.id, {
        trustedContactName: this.editTrustedContact.name || null,
        trustedContactPhone: this.editTrustedContact.phone || null,
      })
      .subscribe({
        next: () => {
          this.data.update((prev) =>
            prev
              ? {
                  ...prev,
                  professionalProfile: {
                    ...prev.professionalProfile,
                    trustedContactName: this.editTrustedContact.name || null,
                    trustedContactPhone: this.editTrustedContact.phone || null,
                  },
                }
              : prev,
          );
          this.editTrustedContactMode.set(false);
          this.savingTrustedContact.set(false);
        },
        error: () => this.savingTrustedContact.set(false),
      });
  }

  // ── Services ──────────────────────────────────────────────────────────────
  readonly editServicesMode = signal(false);
  readonly savingServices = signal(false);
  readonly editServiceList = signal<Service[]>([]);
  readonly pendingServiceDescriptions = signal<string[]>([]);
  serviceQuery = '';
  readonly serviceResults = signal<Service[]>([]);
  readonly searchingServices = signal(false);

  enterEditServices() {
    const services = this.data()?.professionalProfile.services;
    if (!services) return;
    this.editServiceList.set([...services]);
    this.pendingServiceDescriptions.set([]);
    this.serviceQuery = '';
    this.serviceResults.set([]);
    this.editServicesMode.set(true);
  }

  cancelEditServices() {
    this.editServicesMode.set(false);
  }

  searchServices() {
    const query = this.serviceQuery.trim();
    if (query.length < 3) {
      this.serviceResults.set([]);
      return;
    }

    this.searchingServices.set(true);
    this.userApi.searchServices(query).subscribe({
      next: (results) => {
        this.serviceResults.set(results);
        this.searchingServices.set(false);
      },
      error: () => this.searchingServices.set(false),
    });
  }

  get unselectedServiceResults(): Service[] {
    const selected = this.editServiceList();
    const pending = this.pendingServiceDescriptions();
    return this.serviceResults().filter(
      result => !selected.some(s => s.id === result.id) && !pending.includes(result.description),
    );
  }

  addServiceToEdit(service: Service) {
    if (!this.editServiceList().some(s => s.id === service.id)) {
      this.editServiceList.update(list => [...list, service]);
    }
    this.serviceQuery = '';
    this.serviceResults.set([]);
  }

  addPendingService() {
    const description = this.serviceQuery.trim();
    if (!description || this.pendingServiceDescriptions().includes(description)) return;
    this.pendingServiceDescriptions.update(list => [...list, description]);
    this.serviceQuery = '';
    this.serviceResults.set([]);
  }

  removePendingService(description: string) {
    this.pendingServiceDescriptions.update(list => list.filter(d => d !== description));
  }

  removeServiceFromEdit(id: string) {
    this.editServiceList.update(list => list.filter(s => s.id !== id));
  }

  saveEditServices() {
    const data = this.data();
    if (!data) return;

    this.savingServices.set(true);

    const persist = (serviceIds: string[]) => {
      this.userApi.updateProfessional(data.id, { serviceIds }).subscribe({
        next: () => {
          const list = this.editServiceList();
          this.data.update(prev =>
            prev ? { ...prev, professionalProfile: { ...prev.professionalProfile, services: [...list] } } : prev,
          );
          this.editServicesMode.set(false);
          this.savingServices.set(false);
        },
        error: () => this.savingServices.set(false),
      });
    };

    const pending = this.pendingServiceDescriptions();
    if (pending.length === 0) {
      persist(this.editServiceList().map(s => s.id));
      return;
    }

    forkJoin(pending.map(desc => this.serviceApi.create(desc))).subscribe({
      next: (created: Service[]) => {
        this.editServiceList.update(list => [...list, ...created]);
        persist([...this.editServiceList().map(s => s.id)]);
      },
      error: () => this.savingServices.set(false),
    });
  }
}
