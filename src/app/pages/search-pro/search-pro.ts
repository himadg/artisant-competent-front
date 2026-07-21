import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { EMPTY, switchMap } from 'rxjs';
import { ProfessionalService } from '../../core/services/professional.service';
import { ProfessionalSearchResult } from '../../shared/interfaces/professional-profile';
import { ProCard } from '../../shared/components/pro-card/pro-card';
import { SearchProForm } from '../../shared/components/search-pro-form/search-pro-form';
import { AuthService } from '../../core/services/auth.service';
import { DemandService } from '../../core/services/demand.service';
import { FlashMessageService } from '../../core/services/flash-message.service';
import { DemandModal, DemandFormValue } from '../../shared/components/demand-modal/demand-modal';

const PENDING_REQUEST_KEY = 'pendingRequest';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, TranslocoModule, ProCard, SearchProForm, DemandModal],
  templateUrl: './search-pro.html',
  styleUrl: './search-pro.scss',
})
export class SearchProPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly professionalService = inject(ProfessionalService);
  private readonly authService = inject(AuthService);
  private readonly demandService = inject(DemandService);
  private readonly flash = inject(FlashMessageService);
  private readonly destroyRef = inject(DestroyRef);

  readonly results = signal<ProfessionalSearchResult[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly selectedIds = signal<Set<string>>(new Set());
  readonly showDemandModal = signal(false);
  readonly demandLoading = signal(false);

  address = '';
  trade = '';
  radius = 0;
  lat: number | null = null;
  lng: number | null = null;

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((params) => {
          const lat = Number.parseFloat(params.get('lat') ?? '');
          const lng = Number.parseFloat(params.get('lng') ?? '');
          this.lat = Number.isNaN(lat) ? null : lat;
          this.lng = Number.isNaN(lng) ? null : lng;
          this.radius = Number.parseFloat(params.get('radius') ?? '0');
          this.trade = params.get('trade') ?? '';
          this.address = params.get('address') ?? '';

          this.loading.set(true);
          this.error.set(false);
          this.selectedIds.set(new Set());

          if (
            params.keys.length !== 0 &&
            (Number.isNaN(lat) || Number.isNaN(lng) || Number.isNaN(this.radius) || !this.trade || !this.address)
          ) {
            this.loading.set(false);
            this.error.set(true);
            return EMPTY;
          }

          const ownProfessionalId = this.authService.currentUser()?.professionalProfile?.id;
          return this.professionalService.searchNearby(lat, lng, this.radius, this.trade, ownProfessionalId);
        }),
      )
      .subscribe({
        next: (results) => {
          this.results.set(results);
          this.loading.set(false);
          this.restorePendingRequest();
        },
        error: () => {
          this.error.set(true);
          this.loading.set(false);
        },
      });
  }

  toggleSelection(id: string): void {
    this.selectedIds.update((set) => {
      const next = new Set(set);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  clearSelection(): void {
    this.selectedIds.set(new Set());
  }

  openDemandModal(): void {
    if (this.selectedIds().size === 0) return;

    if (!this.authService.isAuthenticated()) {
      sessionStorage.setItem(PENDING_REQUEST_KEY, JSON.stringify([...this.selectedIds()]));
      const returnUrl = this.router.url;
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl } });
      return;
    }

    this.showDemandModal.set(true);
  }

  async submit(value: DemandFormValue): Promise<void> {
    this.demandLoading.set(true);
    try {
      const { id } = await this.demandService.create(value.description, [...this.selectedIds()]);

      if (value.files.length > 0) {
        try {
          await this.demandService.uploadPhotos(id, value.files);
        } catch {
          this.flash.set({ type: 'warning', key: 'demand.photosUploadFailed' });
          this.showDemandModal.set(false);
          this.clearSelection();
          return;
        }
      }

      this.flash.set({ type: 'success', key: 'demand.createSuccess' });
      this.showDemandModal.set(false);
      this.clearSelection();
    } catch {
      // L'intercepteur HTTP affiche déjà le toast d'erreur, on garde le modal ouvert pour retry
    } finally {
      this.demandLoading.set(false);
    }
  }

  private restorePendingRequest(): void {
    const raw = sessionStorage.getItem(PENDING_REQUEST_KEY);
    if (!raw || !this.authService.isAuthenticated()) return;

    sessionStorage.removeItem(PENDING_REQUEST_KEY);

    try {
      const ids: string[] = JSON.parse(raw);
      const validIds = ids.filter((id) => this.results().some((r) => r.id === id));
      if (validIds.length === 0) return;
      this.selectedIds.set(new Set(validIds));
      this.showDemandModal.set(true);
    } catch {
      // session corrompue, on ignore
    }
  }
}
