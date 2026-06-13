import { ChangeDetectionStrategy, Component, inject, OnInit, signal, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule, PlatformLocation } from '@angular/common';
import { FormsModule, Validators } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { DashboardApiService } from '../../../core/services/dashboard-api.service';
import { AuthService } from '../../../core/services/auth.service';
import { UserApiService, IndividualDocumentKeys } from '../../../core/services/user-api.service';
import { AffiliationApiService } from '../../../core/services/affiliation-api.service';
import { MissionService } from '../../../core/services/mission.service';
import { QuoteService, QuoteListItem } from '../../../shared/services/quote.service';
import { IndividualDashboardData } from '../../../shared/interfaces/individual-dashboard';
import { AffiliationDashboard } from '../../../shared/interfaces/affiliation';
import { LangToggle } from '../../../shared/components/lang-toggle/lang-toggle';
import { ThemeToggle } from '../../../shared/components/theme-toggle/theme-toggle';
import { LegalModal } from '../../../shared/components/legal-modal/legal-modal';
import { QuotePreviewComponent } from '../../../shared/components/quote-preview/quote-preview.component';
import { FileUpload } from '../../../shared/components/file-upload/file-upload';
import { RouterLink } from "@angular/router";

export type IndividualSection = 'profile' | 'documents' | 'requests' | 'quotes' | 'invoices' | 'legal' | 'practices' | 'affiliation';

@Component({
  selector: 'dashboard-individual',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, TranslocoModule, LangToggle, ThemeToggle, LegalModal, QuotePreviewComponent, RouterLink, FileUpload],
  templateUrl: './individual-dashboard.html',
  styleUrl: './individual-dashboard.scss',
})
export class IndividualDashboard implements OnInit {
  private readonly dashboardApi = inject(DashboardApiService);
  private readonly userApi = inject(UserApiService);
  private readonly affiliationApi = inject(AffiliationApiService);
  private readonly missionApi = inject(MissionService);
  private readonly quoteApi = inject(QuoteService);
  private readonly platformLocation = inject(PlatformLocation);
  readonly authService = inject(AuthService);

  readonly data = signal<IndividualDashboardData | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly activeSection = signal<IndividualSection>('profile');
  readonly moreMenuOpen = signal(false);

  /** Clé du champ document en cours d'enregistrement (feedback UI). */
  readonly docSaving = signal<keyof IndividualDocumentKeys | null>(null);

  readonly affiliationData = signal<AffiliationDashboard | null>(null);
  readonly affiliationLoading = signal(false);
  readonly codeCopied = signal(false);

  readonly requests = signal<any[]>([]);
  readonly requestsLoading = signal(false);
  readonly selectedRequest = signal<any | null>(null);

  readonly quotes = signal<QuoteListItem[]>([]);
  readonly quotesLoading = signal(false);
  readonly selectedQuote = signal<QuoteListItem | null>(null);
  readonly previewQuote = signal<QuoteListItem | null>(null);
  readonly previewQuoteData = signal<any | null>(null);
  readonly previewLoading = signal(false);
  readonly rejectingQuote = signal<QuoteListItem | null>(null);
  readonly rejectMessage = signal('');
  readonly rejectSubmitting = signal(false);

  readonly editMode = signal(false);
  readonly saving = signal(false);
  editFields = { firstName: '', lastName: '', email: '', phone: '', birthDate: '', gender: '' };

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
    if (section === 'requests') {
      this.loadRequests();
    }
    if (section === 'quotes') {
      this.loadQuotes();
    }
  }

  /**
   * Persiste un changement de document (ajout/remplacement/suppression) émis par
   * un `ac-file-upload`. `key === null` (fichier retiré) → chaîne vide au backend.
   * Met à jour `data()` localement pour refléter la nouvelle clé sans recharger.
   */
  onDocChange(field: keyof IndividualDocumentKeys, key: string | null) {
    const d = this.data();
    if (!d) return;
    this.docSaving.set(field);
    this.userApi.updateIndividualDocuments(d.id, { [field]: key ?? '' }).subscribe({
      next: () => {
        this.data.update((prev) =>
          prev
            ? { ...prev, individualProfile: { ...prev.individualProfile, [field]: key ?? '' } }
            : prev,
        );
        this.docSaving.set(null);
      },
      error: () => this.docSaving.set(null),
    });
  }

  loadRequests() {
    this.requestsLoading.set(true);
    this.missionApi.getForClient().subscribe({
      next: (r) => { this.requests.set(r); this.requestsLoading.set(false); },
      error: () => { this.requests.set([]); this.requestsLoading.set(false); },
    });
  }

  openRequestModal(request: any) {
    this.selectedRequest.set(request);
  }

  closeRequestModal() {
    this.selectedRequest.set(null);
  }

  loadQuotes() {
    this.quotesLoading.set(true);
    this.quoteApi.getQuotesForClient().subscribe({
      next: (q) => { this.quotes.set(q); this.quotesLoading.set(false); },
      error: () => { this.quotes.set([]); this.quotesLoading.set(false); },
    });
  }

  openQuoteModal(quote: QuoteListItem) {
    this.selectedQuote.set(quote);
  }

  closeQuoteModal() {
    this.selectedQuote.set(null);
  }

  openQuotePreview(quote: QuoteListItem) {
    this.previewLoading.set(true);
    this.previewQuote.set(quote);
    this.quoteApi.getQuote(quote.id).subscribe({
      next: (full) => {
        const payload = full.payload;
        // If the quote payload doesn't have the client's phone, add it from the mission data.
        if (quote.mission.client && !payload.coordinates.client.phone) {
            if (!payload.coordinates.client) payload.coordinates.client = {};
            payload.coordinates.client.phone = quote.mission.client.phone;
        }
        this.previewQuoteData.set({ ...payload, quoteNumber: full.quoteNumber });
        this.previewLoading.set(false);
      },
      error: () => this.previewLoading.set(false),
    });
  }

  closeQuotePreview() {
    this.previewQuoteData.set(null);
    this.previewQuote.set(null);
  }

  onQuoteAccepted() {
    this.closeQuotePreview();
    this.loadQuotes();
  }

  openRejectModal(quote: QuoteListItem) {
    this.rejectingQuote.set(quote);
    this.rejectMessage.set('');
  }

  closeRejectModal() {
    this.rejectingQuote.set(null);
    this.rejectMessage.set('');
  }

  confirmReject() {
    const quote = this.rejectingQuote();
    if (!quote) return;
    this.rejectSubmitting.set(true);
    const message = this.rejectMessage().trim();
    this.quoteApi.rejectQuote(quote.id, message || undefined).subscribe({
      next: () => {
        this.rejectSubmitting.set(false);
        this.closeRejectModal();
        this.loadQuotes();
      },
      error: () => this.rejectSubmitting.set(false),
    });
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
      phone: d.phone || '',
      birthDate: d.birthDate.slice(0, 10),
      gender: d.gender,
    };
    this.editMode.set(true);
  }

  cancelEdit() { this.editMode.set(false); }

  saveEdit() {
    const phonePattern = new RegExp('^0[1-9]([ .-]?[0-9]{2}){4}$');
    if (!phonePattern.test(this.editFields.phone)) {
      alert('Le format du numéro de téléphone est invalide.');
      return;
    }

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
          phone: this.editFields.phone,
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
