import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { EMPTY, switchMap } from 'rxjs';
import { ProfessionalService } from '../../core/services/professional.service';
import { ProfessionalSearchResult } from '../../shared/interfaces/professional-profile';
import { ProCard } from '../../shared/components/pro-card/pro-card';
import { SearchPro } from '../../shared/components/search-pro/search-pro';
import { AuthService } from '../../core/services/auth.service';
import { SearchStateService } from '../../core/services/search-state.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TranslocoModule, ProCard, SearchPro],
  templateUrl: './search-pro-results.html',
  styleUrl: './search-pro-results.scss',
})
export class SearchProResultsPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly professionalService = inject(ProfessionalService);
  private readonly authService = inject(AuthService);
  private readonly searchStateService = inject(SearchStateService);
  private readonly destroyRef = inject(DestroyRef);

  readonly results = signal<ProfessionalSearchResult[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly selectedIds = signal<Set<string>>(new Set());
  readonly currentUser = this.authService.currentUser;

  address = '';
  trade = '';
  radius = 0;

  ngOnInit(): void {
    this.route.queryParamMap.pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap(params => {
        const lat = parseFloat(params.get('lat') ?? '');
        const lng = parseFloat(params.get('lng') ?? '');
        this.radius = parseFloat(params.get('radius') ?? '0');
        this.trade = params.get('trade') ?? '';
        this.address = params.get('address') ?? '';

        this.loading.set(true);
        this.error.set(false);
        this.selectedIds.set(new Set());

        if (isNaN(lat) || isNaN(lng) || !this.trade) {
          this.loading.set(false);
          this.error.set(true);
          return EMPTY;
        }

        return this.professionalService.searchNearby(lat, lng, this.radius, this.trade);
      }),
    ).subscribe({
      next: results => {
        this.results.set(results);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  toggleSelection(id: string): void {
    this.selectedIds.update(set => {
      const next = new Set(set);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  clearSelection(): void {
    this.selectedIds.set(new Set());
  }

  proceedToRequest(): void {
    if (this.currentUser()) {
      this.searchStateService.setState({
        professionalIds: Array.from(this.selectedIds()),
        tradeId: this.trade, // Assuming trade name is the ID for now
        location: this.address,
      });
      this.router.navigate(['/demande']);
    } else {
      // Stocker la sélection pour la reprendre après connexion
      this.searchStateService.setState({
        professionalIds: Array.from(this.selectedIds()),
        tradeId: this.trade,
        location: this.address,
      });
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: '/demande' } });
    }
  }
}
