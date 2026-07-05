import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule, PlatformLocation } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { Subject, debounceTime, distinctUntilChanged, filter, forkJoin, switchMap } from 'rxjs';
import { GeocodingService } from '../../../core/services/geocoding.service';
import { AddressSuggestion } from '../../../shared/interfaces/address-suggestion';
import { DashboardApiService } from '../../../core/services/dashboard-api.service';
import { AuthService } from '../../../core/services/auth.service';
import { UserApiService } from '../../../core/services/user-api.service';
import { AffiliationApiService } from '../../../core/services/affiliation-api.service';
import { StoryApiService, Story } from '../../../core/services/story-api.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProfessionalDashboardData, OpeningHoursDay } from '../../../shared/interfaces/professional-dashboard';
import { AffiliationDashboard } from '../../../shared/interfaces/affiliation';
import { LangToggle } from '../../../shared/components/lang-toggle/lang-toggle';
import { ThemeToggle } from '../../../shared/components/theme-toggle/theme-toggle';
import { LegalModal } from '../../../shared/components/legal-modal/legal-modal';
import { DocModal } from '../../../shared/components/doc-modal/doc-modal';
import { StoryViewer } from '../../../shared/components/story-viewer/story-viewer';
import { PreviewDocument } from '../../../shared/interfaces/preview-document';
import { UploadService } from '../../../core/services/upload.service';

export type ProSection = 'requests' | 'quotes' | 'invoices' | 'profile' | 'legal' | 'practices' | 'affiliation';
export type ProTab = 'presentation' | 'missions' | 'reviews' | 'documents';

const WEEK_DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

@Component({
  selector: 'dashboard-professional',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, RouterLink, TranslocoModule, LangToggle, ThemeToggle, LegalModal, DocModal, StoryViewer],
  templateUrl: './professional-dashboard.html',
  styleUrl: './professional-dashboard.scss',
})
export class ProfessionalDashboard implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly geocodingService = inject(GeocodingService);
  private readonly dashboardApi = inject(DashboardApiService);
  private readonly userApi = inject(UserApiService);
  private readonly affiliationApi = inject(AffiliationApiService);
  private readonly storyApi = inject(StoryApiService);
  private readonly uploadService = inject(UploadService);
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

  // ── Stories ────────────────────────────────────────────────────────────────
  // Le cercle bleu (photo) déclenche la story "Présentation", le cercle blanc (logo) la story "Tips".
  readonly myStories = signal<Story[]>([]);
  readonly uploadingStoryType = signal<'PRESENTATION' | 'TIPS' | null>(null);
  readonly storyUploadError = signal<string | null>(null);

  readonly presentationStory = computed(() => this.myStories().find((s) => s.type === 'PRESENTATION') ?? null);
  readonly tipsStory = computed(() => this.myStories().find((s) => s.type === 'TIPS') ?? null);

  readonly viewingStory = signal<Story | null>(null);
  readonly viewingStoryUrl = signal<string | null>(null);

  loadStories() {
    this.storyApi.getMine().subscribe({ next: (stories) => this.myStories.set(stories) });
  }

  onStoryCircleClick(type: 'PRESENTATION' | 'TIPS', fileInput: HTMLInputElement) {
    const existing = type === 'PRESENTATION' ? this.presentationStory() : this.tipsStory();
    if (existing) {
      this.openStoryViewer(existing);
    } else {
      fileInput.click();
    }
  }

  openStoryViewer(story: Story) {
    this.viewingStory.set(story);
    this.viewingStoryUrl.set(null);
    this.uploadService.getSignedUrl(story.videoKey).subscribe({
      next: (url) => this.viewingStoryUrl.set(url),
    });
  }

  closeStoryViewer() {
    this.viewingStory.set(null);
    this.viewingStoryUrl.set(null);
  }

  deleteViewingStory() {
    const story = this.viewingStory();
    if (!story) return;
    this.deleteStory(story.id);
    this.closeStoryViewer();
  }

  onStoryFileSelected(event: Event, type: 'PRESENTATION' | 'TIPS') {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploadingStoryType.set(type);
    this.storyUploadError.set(null);
    this.storyApi.upload(file, type).subscribe({
      next: () => {
        this.uploadingStoryType.set(null);
        input.value = '';
        this.loadStories();
      },
      error: (err) => {
        this.uploadingStoryType.set(null);
        input.value = '';
        this.storyUploadError.set(err?.error?.message ?? "Erreur lors de l'envoi de la vidéo");
      },
    });
  }

  deleteStory(id: string) {
    this.storyApi.delete(id).subscribe({ next: () => this.loadStories() });
  }

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
        if (!userId) this.loadStories();
      },
      error: () => {
        this.error.set('dashboard.errors.load');
        this.loading.set(false);
      },
    });
  }

  // ── Address autocomplete ──────────────────────────────────────────────────
  private readonly personalAddressSearch$ = new Subject<string>();
  private readonly workAddressSearch$ = new Subject<string>();
  readonly personalAddressSuggestions = signal<AddressSuggestion[]>([]);
  readonly personalAddressOpen = signal(false);
  readonly workAddressSuggestions = signal<AddressSuggestion[]>([]);
  readonly workAddressOpen = signal(false);

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

    this.personalAddressSearch$.pipe(
      debounceTime(300), distinctUntilChanged(),
      filter(q => q.length >= 3),
      switchMap(q => this.geocodingService.search(q)),
      takeUntilDestroyed(),
    ).subscribe(s => this.personalAddressSuggestions.set(s));

    this.workAddressSearch$.pipe(
      debounceTime(300), distinctUntilChanged(),
      filter(q => q.length >= 3),
      switchMap(q => this.geocodingService.search(q)),
      takeUntilDestroyed(),
    ).subscribe(s => this.workAddressSuggestions.set(s));
  }

  onPersonalAddressSearch(e: Event) {
    const q = (e.target as HTMLInputElement).value;
    if (q.length < 3) { this.personalAddressSuggestions.set([]); return; }
    this.personalAddressSearch$.next(q);
  }

  selectPersonalAddress(addr: AddressSuggestion) {
    this.personalAddressSuggestions.set([]);
    this.personalAddressOpen.set(false);
    if (addr.streetNumber) this.editPersonalInfo.address.streetNumber = addr.streetNumber;
    this.editPersonalInfo.address.streetName = addr.streetName;
    this.editPersonalInfo.address.postalCode = addr.postalCode;
    this.editPersonalInfo.address.city = addr.city;
  }

  closePersonalAddressSuggestions() {
    setTimeout(() => this.personalAddressOpen.set(false), 150);
  }

  onPersonalPostalCodeInput(e: Event) {
    const code = (e.target as HTMLInputElement).value;
    if (code.length !== 5) return;
    this.geocodingService.lookupCity(code).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(city => {
      if (city) this.editPersonalInfo.address.city = city;
    });
  }

  onWorkAddressSearch(e: Event) {
    const q = (e.target as HTMLInputElement).value;
    if (q.length < 3) { this.workAddressSuggestions.set([]); return; }
    this.workAddressSearch$.next(q);
  }

  selectWorkAddress(addr: AddressSuggestion) {
    this.workAddressSuggestions.set([]);
    this.workAddressOpen.set(false);
    if (addr.streetNumber) this.editCompanyExtra.workAddress.streetNumber = addr.streetNumber;
    this.editCompanyExtra.workAddress.streetName = addr.streetName;
    this.editCompanyExtra.workAddress.postalCode = addr.postalCode;
    this.editCompanyExtra.workAddress.city = addr.city;
  }

  closeWorkAddressSuggestions() {
    setTimeout(() => this.workAddressOpen.set(false), 150);
  }

  onWorkPostalCodeInput(e: Event) {
    const code = (e.target as HTMLInputElement).value;
    if (code.length !== 5) return;
    this.geocodingService.lookupCity(code).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(city => {
      if (city) this.editCompanyExtra.workAddress.city = city;
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
      this.editHours.set(WEEK_DAYS.map((day) => ({ day, closed: true, onCall: false, intervals: [] })));
    }
    this.editHoursMode.set(true);
  }

  cancelEditHours() {
    this.editHoursMode.set(false);
  }

  toggleDay(index: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.editHours.update((days) => days.map((day, i) => (i !== index ? day : { ...day, closed: !checked, onCall: false })));
  }

  toggleOnCall(index: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.editHours.update((days) => days.map((d, i) => i !== index ? d : { ...d, onCall: checked }));
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

  // ── Personal info ─────────────────────────────────────────────────────────
  readonly editPersonalInfoMode = signal(false);
  readonly savingPersonalInfo = signal(false);
  editPersonalInfo = {
    gender: '', lastName: '', firstName: '', birthDate: '', email: '', professionalEmail: '', managerPhone: '',
    address: { streetNumber: '', streetName: '', additionalInfo: '', postalCode: '', city: '' },
  };

  enterEditPersonalInfo() {
    const d = this.data();
    if (!d) return;
    const p = d.professionalProfile;
    this.editPersonalInfo = {
      gender: d.gender,
      lastName: d.lastName,
      firstName: d.firstName,
      birthDate: d.birthDate ? d.birthDate.slice(0, 10) : '',
      email: d.email,
      professionalEmail: p.professionalEmail ?? '',
      managerPhone: p.managerPhone,
      address: {
        streetNumber: d.address?.streetNumber ?? '',
        streetName: d.address?.streetName ?? '',
        additionalInfo: d.address?.additionalInfo ?? '',
        postalCode: String(d.address?.postalCode ?? ''),
        city: d.address?.city ?? '',
      },
    };
    this.editPersonalInfoMode.set(true);
  }

  cancelEditPersonalInfo() { this.editPersonalInfoMode.set(false); }

  saveEditPersonalInfo() {
    const d = this.data();
    if (!d) return;
    const { gender, lastName, firstName, birthDate, email, professionalEmail, managerPhone, address } = this.editPersonalInfo;
    const addressPayload = {
      streetNumber: address.streetNumber,
      streetName: address.streetName,
      additionalInfo: address.additionalInfo || null,
      postalCode: address.postalCode,
      city: address.city,
    };
    this.savingPersonalInfo.set(true);
    forkJoin([
      this.userApi.updateUser(d.id, { gender, lastName, firstName, birthDate, email, address: addressPayload }),
      this.userApi.updateProfessional(d.id, { managerPhone, professionalEmail: professionalEmail || null }),
    ]).subscribe({
      next: () => {
        this.data.update((prev) =>
          prev ? {
            ...prev,
            gender, lastName, firstName, birthDate, email,
            address: prev.address ? {
              ...prev.address,
              streetNumber: addressPayload.streetNumber,
              streetName: addressPayload.streetName,
              additionalInfo: addressPayload.additionalInfo ?? undefined,
              postalCode: Number(addressPayload.postalCode) || prev.address.postalCode,
              city: addressPayload.city,
            } : prev.address,
            professionalProfile: { ...prev.professionalProfile, managerPhone, professionalEmail: professionalEmail || null },
          } : prev,
        );
        this.editPersonalInfoMode.set(false);
        this.savingPersonalInfo.set(false);
      },
      error: () => this.savingPersonalInfo.set(false),
    });
  }

  // ── Mediator ──────────────────────────────────────────────────────────────
  readonly editMediatorMode = signal(false);
  readonly savingMediator = signal(false);
  editMediator = { mediatorName: '', mediatorAddress: '', mediatorWebsite: '', mediatorContactMethod: '', mediatorAdditionalInfo: '' };

  enterEditMediator() {
    const p = this.data()?.professionalProfile;
    if (!p) return;
    this.editMediator = {
      mediatorName: p.mediatorName ?? '',
      mediatorAddress: p.mediatorAddress ?? '',
      mediatorWebsite: p.mediatorWebsite ?? '',
      mediatorContactMethod: p.mediatorContactMethod ?? '',
      mediatorAdditionalInfo: p.mediatorAdditionalInfo ?? '',
    };
    this.editMediatorMode.set(true);
  }

  cancelEditMediator() { this.editMediatorMode.set(false); }

  saveEditMediator() {
    const d = this.data();
    if (!d) return;
    const { mediatorName, mediatorAddress, mediatorWebsite, mediatorContactMethod, mediatorAdditionalInfo } = this.editMediator;
    this.savingMediator.set(true);
    this.userApi.updateProfessional(d.id, {
      mediatorName: mediatorName || null,
      mediatorAddress: mediatorAddress || null,
      mediatorWebsite: mediatorWebsite || null,
      mediatorContactMethod: mediatorContactMethod || null,
      mediatorAdditionalInfo: mediatorAdditionalInfo || null,
    }).subscribe({
      next: () => {
        this.data.update((prev) =>
          prev ? {
            ...prev,
            professionalProfile: {
              ...prev.professionalProfile,
              mediatorName: mediatorName || null,
              mediatorAddress: mediatorAddress || null,
              mediatorWebsite: mediatorWebsite || null,
              mediatorContactMethod: mediatorContactMethod || null,
              mediatorAdditionalInfo: mediatorAdditionalInfo || null,
            },
          } : prev,
        );
        this.editMediatorMode.set(false);
        this.savingMediator.set(false);
      },
      error: () => this.savingMediator.set(false),
    });
  }

  // ── Additional remarks ────────────────────────────────────────────────────
  readonly editAdditionalRemarksMode = signal(false);
  readonly savingAdditionalRemarks = signal(false);
  editAdditionalRemarksText = '';

  enterEditAdditionalRemarks() {
    this.editAdditionalRemarksText = this.data()?.professionalProfile.additionalRemarks ?? '';
    this.editAdditionalRemarksMode.set(true);
  }

  cancelEditAdditionalRemarks() { this.editAdditionalRemarksMode.set(false); }

  saveEditAdditionalRemarks() {
    const d = this.data();
    if (!d) return;
    const text = this.editAdditionalRemarksText;
    this.savingAdditionalRemarks.set(true);
    this.userApi.updateProfessional(d.id, { additionalRemarks: text || null }).subscribe({
      next: () => {
        this.data.update((prev) =>
          prev ? { ...prev, professionalProfile: { ...prev.professionalProfile, additionalRemarks: text || null } } : prev,
        );
        this.editAdditionalRemarksMode.set(false);
        this.savingAdditionalRemarks.set(false);
      },
      error: () => this.savingAdditionalRemarks.set(false),
    });
  }

  // ── Company extra (yearsExperience, onCall) ───────────────────────────────
  readonly editCompanyExtraMode = signal(false);
  readonly savingCompanyExtra = signal(false);
  editCompanyExtra = {
    yearsExperience: 0, onCall: false,
    workAddress: { streetNumber: '', streetName: '', additionalInfo: '', postalCode: '', city: '' },
  };

  enterEditCompanyExtra() {
    const p = this.data()?.professionalProfile;
    if (!p) return;
    this.editCompanyExtra = {
      yearsExperience: p.yearsExperience,
      onCall: p.onCall,
      workAddress: {
        streetNumber: p.workAddress?.streetNumber ?? '',
        streetName: p.workAddress?.streetName ?? '',
        additionalInfo: p.workAddress?.additionalInfo ?? '',
        postalCode: String(p.workAddress?.postalCode ?? ''),
        city: p.workAddress?.city ?? '',
      },
    };
    this.editCompanyExtraMode.set(true);
  }

  cancelEditCompanyExtra() { this.editCompanyExtraMode.set(false); }

  saveEditCompanyExtra() {
    const d = this.data();
    if (!d) return;
    const { yearsExperience, onCall, workAddress } = this.editCompanyExtra;
    const workAddressPayload = {
      streetNumber: workAddress.streetNumber,
      streetName: workAddress.streetName,
      additionalInfo: workAddress.additionalInfo || null,
      postalCode: workAddress.postalCode,
      city: workAddress.city,
    };
    this.savingCompanyExtra.set(true);
    this.userApi.updateProfessional(d.id, { yearsExperience, onCall, workAddress: workAddressPayload }).subscribe({
      next: () => {
        this.data.update((prev) =>
          prev ? {
            ...prev,
            professionalProfile: {
              ...prev.professionalProfile,
              yearsExperience, onCall, isCmod: yearsExperience >= 3,
              workAddress: prev.professionalProfile.workAddress ? {
                ...prev.professionalProfile.workAddress,
                streetNumber: workAddressPayload.streetNumber,
                streetName: workAddressPayload.streetName,
                additionalInfo: workAddressPayload.additionalInfo ?? undefined,
                postalCode: Number(workAddressPayload.postalCode) || prev.professionalProfile.workAddress.postalCode,
                city: workAddressPayload.city,
              } : prev.professionalProfile.workAddress,
            },
          } : prev,
        );
        this.editCompanyExtraMode.set(false);
        this.savingCompanyExtra.set(false);
      },
      error: () => this.savingCompanyExtra.set(false),
    });
  }

  // ── Company remarks ───────────────────────────────────────────────────────
  readonly editCompanyRemarksMode = signal(false);
  readonly savingCompanyRemarks = signal(false);
  editCompanyRemarksText = '';

  enterEditCompanyRemarks() {
    this.editCompanyRemarksText = this.data()?.professionalProfile.companyRemarks ?? '';
    this.editCompanyRemarksMode.set(true);
  }

  cancelEditCompanyRemarks() { this.editCompanyRemarksMode.set(false); }

  saveEditCompanyRemarks() {
    const d = this.data();
    if (!d) return;
    const text = this.editCompanyRemarksText;
    this.savingCompanyRemarks.set(true);
    this.userApi.updateProfessional(d.id, { companyRemarks: text || null }).subscribe({
      next: () => {
        this.data.update((prev) =>
          prev ? { ...prev, professionalProfile: { ...prev.professionalProfile, companyRemarks: text || null } } : prev,
        );
        this.editCompanyRemarksMode.set(false);
        this.savingCompanyRemarks.set(false);
      },
      error: () => this.savingCompanyRemarks.set(false),
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
