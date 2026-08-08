import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';
import { DashboardDataService } from '../../../core/services/dashboard-data.service';
import { UserApiService } from '../../../core/services/user-api.service';
import { AffiliationApiService } from '../../../core/services/affiliation-api.service';
import { DemandService } from '../../../core/services/demand.service';
import { StoryApiService, Story } from '../../../core/services/story-api.service';
import { UploadService } from '../../../core/services/upload.service';
import { ProfessionalDashboardData, OpeningHoursDay } from '../../../shared/interfaces/professional-dashboard';
import { AffiliationDashboard } from '../../../shared/interfaces/affiliation';
import { DemandDetail, DemandSummary } from '../../../shared/interfaces/demand';
import { PreviewDocument } from '../../../shared/interfaces/preview-document';

export type ProSection = 'profile' | 'requests' | 'messages' | 'practices' | 'legal' | 'affiliation';
export type ProTab = 'presentation' | 'missions' | 'reviews' | 'documents';
export type RequestsTab = 'mine' | 'received';
export type ProStoryType = 'PRESENTATION' | 'TIPS';

// 1 story PRESENTATION par professionnel, TIPS illimitées
const MAX_STORIES_PER_TYPE: Record<ProStoryType, number> = {
  PRESENTATION: 1,
  TIPS: Infinity,
};

export interface PersonalInfoEditFields {
  gender: string;
  lastName: string;
  firstName: string;
  birthDate: string;
  email: string;
  professionalEmail: string;
  managerPhone: string;
  address: { streetNumber: string; streetName: string; additionalInfo: string; postalCode: string; city: string };
}

export interface CompanyExtraEditFields {
  yearsExperience: number;
  onCall: boolean;
  workAddress: { streetNumber: string; streetName: string; additionalInfo: string; postalCode: string; city: string };
}

export interface MediatorEditFields {
  mediatorName: string;
  mediatorAddress: string;
  mediatorWebsite: string;
  mediatorContactMethod: string;
  mediatorAdditionalInfo: string;
}

/**
 * État partagé entre le shell et les sections routées du dashboard pro (fourni une seule fois par
 * le shell) : données du dashboard + tout ce qui doit être lu/modifié depuis plusieurs composants
 * distincts (modale de demande dans le shell, sous-onglet piloté par le shell, etc.).
 */
@Injectable()
export class ProfessionalDashboardStateService {
  private readonly dashboardData = inject(DashboardDataService);
  private readonly userApi = inject(UserApiService);
  private readonly affiliationApi = inject(AffiliationApiService);
  private readonly demandService = inject(DemandService);
  private readonly storyApi = inject(StoryApiService);
  private readonly uploadService = inject(UploadService);
  private readonly transloco = inject(TranslocoService);

  readonly data = signal<ProfessionalDashboardData | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  /** Piloté par le shell (barre d'onglets dans l'en-tête), lu par la section profil. */
  readonly activeTab = signal<ProTab>('presentation');

  readonly requestsTab = signal<RequestsTab>('mine');
  readonly myDemands = signal<DemandSummary[] | null>(null);
  readonly receivedDemands = signal<DemandSummary[] | null>(null);
  readonly demandsLoading = signal(false);

  readonly selectedDemandId = signal<string | null>(null);
  readonly selectedDemandEditable = signal(false);
  readonly pendingConversationId = signal<string | null>(null);

  readonly affiliationData = signal<AffiliationDashboard | null>(null);
  readonly affiliationLoading = signal(false);

  /** Modale d'aperçu de document (pièce d'identité, RIB, diplôme...), déclenchée depuis l'onglet
   * "documents" de la section profil mais rendue au niveau du shell. */
  readonly docToPreview = signal<PreviewDocument | null>(null);

  openDocModal(url: string | null | undefined, labelKey: string): void {
    if (!url) return;
    this.docToPreview.set({ url, title: this.transloco.translate(labelKey) });
  }

  readonly workCity = computed(() => {
    const professional = this.data()?.professionalProfile;
    if (!professional) return '';
    return `${professional.workAddress.additionalInfo ?? ''} ${professional.workAddress.streetNumber}
      ${professional.workAddress.streetName}, ${professional.workAddress.postalCode} ${professional.workAddress.city}`;
  });

  load(): void {
    this.dashboardData.loadOwn<ProfessionalDashboardData>()
      .then((data) => { this.data.set(data); this.loading.set(false); this.loadStories(); })
      .catch(() => { this.error.set('dashboard.errors.load'); this.loading.set(false); });
  }

  // ── Stories ──────────────────────────────────────────────────────────────
  readonly myStories = signal<Story[]>([]);
  readonly uploadingStoryType = signal<ProStoryType | null>(null);
  readonly storyUploadError = signal<string | null>(null);

  readonly presentationStories = computed(() => this.myStories().filter((s) => s.type === 'PRESENTATION'));
  readonly tipsStories = computed(() => this.myStories().filter((s) => s.type === 'TIPS'));

  readonly canAddPresentationStory = computed(() => this.presentationStories().length < MAX_STORIES_PER_TYPE.PRESENTATION);
  readonly canAddTipsStory = computed(() => this.tipsStories().length < MAX_STORIES_PER_TYPE.TIPS);

  readonly viewingStories = signal<Story[]>([]);
  readonly viewingIndex = signal(0);
  readonly viewingStoryUrl = signal<string | null>(null);
  readonly recordingStoryType = signal<ProStoryType | null>(null);

  readonly viewingStory = computed<Story | null>(() => this.viewingStories()[this.viewingIndex()] ?? null);
  readonly hasPrevStory = computed(() => this.viewingIndex() > 0);
  readonly hasNextStory = computed(() => this.viewingIndex() < this.viewingStories().length - 1);

  loadStories(): void {
    this.storyApi.getMine().subscribe({ next: (stories) => this.myStories.set(stories) });
  }

  onStoryCircleClick(type: ProStoryType): void {
    const stories = type === 'PRESENTATION' ? this.presentationStories() : this.tipsStories();
    if (stories.length > 0) {
      this.openStoryViewer(stories, 0);
    } else {
      this.recordingStoryType.set(type);
    }
  }

  onAddStoryClick(type: ProStoryType): void {
    const canAdd = type === 'PRESENTATION' ? this.canAddPresentationStory() : this.canAddTipsStory();
    if (!canAdd) return;
    this.recordingStoryType.set(type);
  }

  closeRecorder(): void {
    this.recordingStoryType.set(null);
  }

  onStoryFileReady(file: File): void {
    const type = this.recordingStoryType();
    if (!type) return;
    this.recordingStoryType.set(null);
    this.uploadStoryFile(file, type);
  }

  openStoryViewer(stories: Story[], startIndex: number): void {
    this.viewingStories.set(stories);
    this.viewingIndex.set(startIndex);
    this.loadViewingUrl();
  }

  private loadViewingUrl(): void {
    this.viewingStoryUrl.set(null);
    const story = this.viewingStory();
    if (!story) return;
    this.uploadService.getSignedUrl(story.videoKey).subscribe({
      next: (url) => this.viewingStoryUrl.set(url),
    });
  }

  nextStory(): void {
    if (!this.hasNextStory()) return;
    this.viewingIndex.update((i) => i + 1);
    this.loadViewingUrl();
  }

  prevStory(): void {
    if (!this.hasPrevStory()) return;
    this.viewingIndex.update((i) => i - 1);
    this.loadViewingUrl();
  }

  closeStoryViewer(): void {
    this.viewingStories.set([]);
    this.viewingStoryUrl.set(null);
  }

  deleteViewingStory(): void {
    const story = this.viewingStory();
    if (!story) return;
    this.storyApi.delete(story.id).subscribe({
      next: () => {
        this.loadStories();
        const remaining = this.viewingStories().filter((s) => s.id !== story.id);
        if (remaining.length === 0) {
          this.closeStoryViewer();
          return;
        }
        this.viewingStories.set(remaining);
        this.viewingIndex.set(Math.min(this.viewingIndex(), remaining.length - 1));
        this.loadViewingUrl();
      },
    });
  }

  private uploadStoryFile(file: File, type: ProStoryType): void {
    this.uploadingStoryType.set(type);
    this.storyUploadError.set(null);
    this.storyApi.upload(file, type).subscribe({
      next: () => {
        this.uploadingStoryType.set(null);
        this.loadStories();
      },
      error: (err) => {
        this.uploadingStoryType.set(null);
        this.storyUploadError.set(err?.error?.message ?? "Erreur lors de l'envoi de la vidéo");
      },
    });
  }

  loadDemands(): void {
    this.demandsLoading.set(true);
    Promise.all([this.demandService.getMine(), this.demandService.getReceived()])
      .then(([mine, received]) => {
        this.myDemands.set(mine);
        this.receivedDemands.set(received);
      })
      .finally(() => this.demandsLoading.set(false));
  }

  onDemandUpdated(updated: DemandDetail): void {
    const merge = (list: DemandSummary[]) =>
      list.map((d) => (d.id === updated.id
        ? { ...d, description: updated.description, status: updated.status, photoKeys: updated.photoKeys }
        : d));
    this.myDemands.update((list) => (list ? merge(list) : list));
    this.receivedDemands.update((list) => (list ? merge(list) : list));
  }

  loadAffiliationDashboard(): void {
    this.affiliationLoading.set(true);
    this.affiliationApi.getDashboard().subscribe({
      next: (data) => { this.affiliationData.set(data); this.affiliationLoading.set(false); },
      error: () => this.affiliationLoading.set(false),
    });
  }

  generateAffiliateCode(): void {
    this.affiliationApi.generateCode().subscribe({
      next: () => this.loadAffiliationDashboard(),
    });
  }

  async saveDescription(description: string): Promise<void> {
    const d = this.data();
    if (!d) return;
    await firstValueFrom(this.userApi.updateProfessional(d.id, { description }));
    this.data.update((prev) => prev ? { ...prev, professionalProfile: { ...prev.professionalProfile, description } } : prev);
  }

  async saveTrades(tradeIds: string[], allTrades: { id: string; name: string }[]): Promise<void> {
    const d = this.data();
    if (!d) return;
    await firstValueFrom(this.userApi.updateProfessional(d.id, { tradeIds }));
    this.data.update((prev) => prev ? {
      ...prev,
      professionalProfile: { ...prev.professionalProfile, trades: allTrades.filter((t) => tradeIds.includes(t.id)) },
    } : prev);
  }

  async saveHours(days: OpeningHoursDay[]): Promise<void> {
    const d = this.data();
    if (!d) return;
    await firstValueFrom(this.userApi.updateProfessional(d.id, { openingHours: { days } }));
    this.data.update((prev) => prev ? {
      ...prev,
      professionalProfile: { ...prev.professionalProfile, openingHours: { days } },
    } : prev);
  }

  async savePartners(suppliers: string[]): Promise<void> {
    const d = this.data();
    if (!d) return;
    await firstValueFrom(this.userApi.updateProfessional(d.id, { suppliers }));
    this.data.update((prev) => prev ? {
      ...prev,
      professionalProfile: { ...prev.professionalProfile, suppliers: [...suppliers] },
    } : prev);
  }

  async savePersonalInfo(fields: PersonalInfoEditFields): Promise<void> {
    const d = this.data();
    if (!d) return;
    const { gender, lastName, firstName, birthDate, email, professionalEmail, managerPhone, address } = fields;
    const addressPayload = {
      streetNumber: address.streetNumber,
      streetName: address.streetName,
      additionalInfo: address.additionalInfo || null,
      postalCode: address.postalCode,
      city: address.city,
    };
    await firstValueFrom(this.userApi.updateUser(d.id, { gender, lastName, firstName, birthDate, email, address: addressPayload }));
    await firstValueFrom(this.userApi.updateProfessional(d.id, { managerPhone, professionalEmail: professionalEmail || null }));
    this.data.update((prev) => prev ? {
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
    } : prev);
  }

  async saveMediator(fields: MediatorEditFields): Promise<void> {
    const d = this.data();
    if (!d) return;
    const { mediatorName, mediatorAddress, mediatorWebsite, mediatorContactMethod, mediatorAdditionalInfo } = fields;
    const payload = {
      mediatorName: mediatorName || null,
      mediatorAddress: mediatorAddress || null,
      mediatorWebsite: mediatorWebsite || null,
      mediatorContactMethod: mediatorContactMethod || null,
      mediatorAdditionalInfo: mediatorAdditionalInfo || null,
    };
    await firstValueFrom(this.userApi.updateProfessional(d.id, payload));
    this.data.update((prev) => prev ? {
      ...prev,
      professionalProfile: { ...prev.professionalProfile, ...payload },
    } : prev);
  }

  async saveAdditionalRemarks(text: string): Promise<void> {
    const d = this.data();
    if (!d) return;
    await firstValueFrom(this.userApi.updateProfessional(d.id, { additionalRemarks: text || null }));
    this.data.update((prev) => prev ? {
      ...prev,
      professionalProfile: { ...prev.professionalProfile, additionalRemarks: text || null },
    } : prev);
  }

  async saveCompanyExtra(fields: CompanyExtraEditFields): Promise<void> {
    const d = this.data();
    if (!d) return;
    const { yearsExperience, onCall, workAddress } = fields;
    const workAddressPayload = {
      streetNumber: workAddress.streetNumber,
      streetName: workAddress.streetName,
      additionalInfo: workAddress.additionalInfo || null,
      postalCode: workAddress.postalCode,
      city: workAddress.city,
    };
    await firstValueFrom(this.userApi.updateProfessional(d.id, { yearsExperience, onCall, workAddress: workAddressPayload }));
    this.data.update((prev) => prev ? {
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
    } : prev);
  }

  async saveCompanyRemarks(text: string): Promise<void> {
    const d = this.data();
    if (!d) return;
    await firstValueFrom(this.userApi.updateProfessional(d.id, { companyRemarks: text || null }));
    this.data.update((prev) => prev ? {
      ...prev,
      professionalProfile: { ...prev.professionalProfile, companyRemarks: text || null },
    } : prev);
  }

  async saveTrustedContact(name: string, phone: string): Promise<void> {
    const d = this.data();
    if (!d) return;
    const payload = { trustedContactName: name || null, trustedContactPhone: phone || null };
    await firstValueFrom(this.userApi.updateProfessional(d.id, payload));
    this.data.update((prev) => prev ? {
      ...prev,
      professionalProfile: { ...prev.professionalProfile, ...payload },
    } : prev);
  }
}
