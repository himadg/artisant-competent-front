import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { DashboardDataService } from '../../../core/services/dashboard-data.service';
import { UserApiService } from '../../../core/services/user-api.service';
import { AffiliationApiService } from '../../../core/services/affiliation-api.service';
import { DemandService } from '../../../core/services/demand.service';
import { IndividualDashboardData } from '../../../shared/interfaces/individual-dashboard';
import { AffiliationDashboard } from '../../../shared/interfaces/affiliation';
import { DemandDetail, DemandSummary } from '../../../shared/interfaces/demand';

export interface ProfileEditFields {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  gender: string;
  phone: string;
  address: { streetNumber: string; streetName: string; additionalInfo: string; postalCode: string; city: string };
}

/**
 * État partagé entre le shell et les sections routées du dashboard particulier (fourni une seule
 * fois par le shell, cf. `providers` de IndividualDashboardShell — chaque section injecte la même
 * instance, pas de rechargement des données au changement d'onglet).
 */
@Injectable()
export class IndividualDashboardStateService {
  private readonly dashboardData = inject(DashboardDataService);
  private readonly userApi = inject(UserApiService);
  private readonly affiliationApi = inject(AffiliationApiService);
  private readonly demandService = inject(DemandService);

  readonly data = signal<IndividualDashboardData | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly selectedDemandId = signal<string | null>(null);

  readonly myDemands = signal<DemandSummary[] | null>(null);
  readonly demandsLoading = signal(false);

  readonly affiliationData = signal<AffiliationDashboard | null>(null);
  readonly affiliationLoading = signal(false);

  load(): void {
    this.dashboardData.loadOwn<IndividualDashboardData>()
      .then((data) => { this.data.set(data); this.loading.set(false); })
      .catch(() => { this.error.set('dashboard.errors.load'); this.loading.set(false); });
  }

  loadDemands(): void {
    this.demandsLoading.set(true);
    this.demandService.getMine()
      .then((mine) => this.myDemands.set(mine))
      .finally(() => this.demandsLoading.set(false));
  }

  onDemandUpdated(updated: DemandDetail): void {
    this.myDemands.update((list) => (list
      ? list.map((d) => (d.id === updated.id
          ? { ...d, description: updated.description, status: updated.status, photoKeys: updated.photoKeys }
          : d))
      : list));
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

  async saveProfile(fields: ProfileEditFields): Promise<void> {
    const individual = this.data();
    if (!individual) return;
    const addressPayload = {
      streetNumber: fields.address.streetNumber,
      streetName: fields.address.streetName,
      additionalInfo: fields.address.additionalInfo || null,
      postalCode: fields.address.postalCode,
      city: fields.address.city,
    };
    await Promise.all([
      firstValueFrom(this.userApi.updateUser(individual.id, {
        firstName: fields.firstName,
        lastName: fields.lastName,
        email: fields.email,
        birthDate: fields.birthDate,
        gender: fields.gender,
        address: addressPayload,
      })),
      firstValueFrom(this.userApi.updateIndividualProfile(individual.id, { phone: fields.phone })),
    ]);
    this.data.update((prev) => prev ? {
      ...prev,
      firstName: fields.firstName,
      lastName: fields.lastName,
      email: fields.email,
      birthDate: new Date(fields.birthDate).toISOString(),
      gender: fields.gender,
      individualProfile: { ...prev.individualProfile, phone: fields.phone },
      address: {
        ...prev.address,
        streetNumber: addressPayload.streetNumber,
        streetName: addressPayload.streetName,
        additionalInfo: addressPayload.additionalInfo ?? undefined,
        postalCode: Number(addressPayload.postalCode) || prev.address.postalCode,
        city: addressPayload.city,
      },
    } : prev);
  }
}
