import { ChangeDetectionStrategy, Component, inject, OnInit, signal, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule, PlatformLocation } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { DashboardApiService } from '../../../core/services/dashboard-api.service';
import { AuthService } from '../../../core/services/auth.service';
import { UserApiService } from '../../../core/services/user-api.service';
import { AffiliationApiService } from '../../../core/services/affiliation-api.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProfessionalDashboardData, OpeningHoursDay } from '../../../shared/interfaces/professional-dashboard';
import { AffiliationDashboard } from '../../../shared/interfaces/affiliation';
import { LangToggle } from '../../../shared/components/lang-toggle/lang-toggle';
import { ThemeToggle } from '../../../shared/components/theme-toggle/theme-toggle';
import { LegalModal } from '../../../shared/components/legal-modal/legal-modal';
import { DocModal, PreviewDocument } from '../../../shared/components/doc-modal/doc-modal';

export type ProSection = 'requests' | 'quotes' | 'invoices' | 'profile' | 'legal' | 'practices' | 'affiliation';
export type ProTab = 'presentation' | 'missions' | 'reviews' | 'documents';

const WEEK_DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

@Component({
  selector: 'dashboard-professional',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, RouterLink, TranslocoModule, LangToggle, ThemeToggle, LegalModal, DocModal],
  templateUrl: './professional-dashboard.html',
  styleUrl: './professional-dashboard.scss',
})
export class ProfessionalDashboard implements OnInit {
  private readonly dashboardApi = inject(DashboardApiService);
  private readonly userApi = inject(UserApiService);
  private readonly affiliationApi = inject(AffiliationApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly platformLocation = inject(PlatformLocation);
  private readonly transloco = inject(TranslocoService);
  readonly authService = inject(AuthService);

  readonly data = signal<ProfessionalDashboardData | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly activeSection = signal<ProSection>('profile');
  readonly activeTab = signal<ProTab>('presentation');

  readonly affiliationData = signal<AffiliationDashboard | null>(null);
  readonly affiliationLoading = signal(false);
  readonly codeCopied = signal(false);

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

  readonly docToPreview = signal<PreviewDocument | null>(null);

  openDocModal(url: string | null | undefined, labelKey: string) {
    if (!url) return;
    this.docToPreview.set({ url, title: this.transloco.translate(labelKey) });
  }

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

  constructor() {
    inject(BreakpointObserver)
      .observe('(orientation: landscape)')
      .pipe(takeUntilDestroyed())
      .subscribe(({ matches }) => {
        if (matches) {
          this.moreMenuOpen.set(false);
          this.moreMenuContentDisplayed.set(false);
        }
      });
  }

  setSection(section: ProSection) {
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
    navigator.clipboard.writeText(this.affiliateShareUrl(code)).then(() => {
      this.codeCopied.set(true);
      setTimeout(() => this.codeCopied.set(false), 2000);
    });
  }

  affiliateShareUrl(code: string): string {
    const { protocol, hostname, port } = this.platformLocation;
    const origin = `${protocol}//${hostname}${port ? ':' + port : ''}`;
    return `${origin}/affiliation?ref=${code}`;
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
    const professional = this.data()?.professionalProfile;
    if (!professional) return;
    this.editTradeIds.set(professional.trades.map((trade) => trade.id));
    if (!this.allTrades().length) {
      this.loadingTrades.set(true);
      this.userApi.getAllTrades().subscribe({
        next: (trades) => {
          this.allTrades.set(trades);
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
    const professional = this.data();
    if (!professional) return;

    this.savingTrades.set(true);
    this.userApi.updateProfessional(professional.id, { tradeIds: this.editTradeIds() }).subscribe({
      next: () => {
        const selected = this.editTradeIds();
        this.data.update((prev) =>
          prev
            ? {
                ...prev,
                professionalProfile: {
                  ...prev.professionalProfile,
                  trades: this.allTrades().filter((trade) => selected.includes(trade.id)),
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
    const professional = this.data();
    if (!professional) return;
    this.savingHours.set(true);
    this.userApi.updateProfessional(professional.id, { openingHours: { days: this.editHours() } }).subscribe({
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

}
