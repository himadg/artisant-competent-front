import { Component, ChangeDetectionStrategy, computed, effect, inject, input, signal, DestroyRef, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { Subject, switchMap, debounceTime, filter } from 'rxjs';
import { TradeApiService } from '../../../core/services/trade-api.service';
import { GeocodingService } from '../../../core/services/geocoding.service';
import { AddressSuggestion } from '../../interfaces/address-suggestion';
import { Trade } from '../../interfaces/trade';

// Ce composant n'a besoin que du label et des coordonnées, jamais des champs d'adresse structurée
// (streetNumber/streetName/postalCode/city) — type étroit plutôt que d'emprunter AddressSuggestion en entier.
interface SelectedAddress {
  label: string;
  latitude: number;
  longitude: number;
}

@Component({
  selector: 'search-pro-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, TranslocoModule],
  templateUrl: './search-pro-form.html',
  styleUrl: './search-pro-form.scss',
})
export class SearchProForm {
  private readonly tradeApi = inject(TradeApiService);
  private readonly geocodingService = inject(GeocodingService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly trades = signal<Trade[]>([]);
  readonly addressSuggestions = signal<AddressSuggestion[]>([]);
  readonly addressOpen = signal(false);
  readonly highlightedIndex = signal(-1);
  readonly ranges = [5, 10, 15, 20, 30, 50];

  readonly addressListboxId = 'search-pro-address-listbox';
  readonly activeDescendantId = computed(() => {
    const index = this.highlightedIndex();
    return index >= 0 ? this.optionId(index) : null;
  });

  // Pré-remplissage optionnel : utilisé par la page /search-pro pour refléter la recherche en cours.
  readonly initialAddress = input<string>('');
  readonly initialLat = input<number | null>(null);
  readonly initialLng = input<number | null>(null);
  readonly initialTrade = input<string>('');
  readonly initialRadius = input<number | null>(null);

  address = '';
  selectedAddress: SelectedAddress | null = null;
  trade = '';
  kilometersIndex = 0;

  private readonly addressSearch$ = new Subject<string>();

  constructor() {
    if (this.isBrowser) {
      this.tradeApi.getAll()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(trades => this.trades.set(trades));
    }

    this.addressSearch$.pipe(
      debounceTime(200),
      filter(q => q.length >= 3),
      switchMap(address => this.geocodingService.search(address)),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(suggestions => {
      this.addressSuggestions.set(suggestions);
      this.addressOpen.set(suggestions.length > 0);
      this.highlightedIndex.set(-1);
    });

    effect(() => {
      const address = this.initialAddress();
      const lat = this.initialLat();
      const lng = this.initialLng();
      const trade = this.initialTrade();
      const radius = this.initialRadius();

      if (address && lat !== null && lng !== null) {
        this.address = address;
        this.selectedAddress = { label: address, latitude: lat, longitude: lng };
      }
      if (trade) this.trade = trade;
      if (radius !== null) {
        const index = this.ranges.indexOf(radius);
        if (index !== -1) this.kilometersIndex = index;
      }
    });
  }

  get sliderPercent(): number {
    const p = (this.kilometersIndex / (this.ranges.length - 1)) * 100;
    return Math.max(0, Math.min(100, p));
  }

  get kilometers(): number {
    return this.ranges[this.kilometersIndex] ?? this.ranges[0];
  }

  onAddressInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.address = value;
    this.selectedAddress = null;
    this.highlightedIndex.set(-1);
    if (!value.trim()) {
      this.addressSuggestions.set([]);
      this.addressOpen.set(false);
      return;
    }
    this.addressSearch$.next(value);
  }

  onAddressKeydown(event: KeyboardEvent): void {
    const suggestions = this.addressSuggestions();
    if (!this.addressOpen() || !suggestions.length) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.highlightedIndex.update((i) => (i + 1) % suggestions.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.highlightedIndex.update((i) => (i - 1 + suggestions.length) % suggestions.length);
        break;
      case 'Enter':
        if (this.highlightedIndex() >= 0) {
          event.preventDefault();
          this.selectAddress(suggestions[this.highlightedIndex()]);
        }
        break;
      case 'Escape':
        this.addressOpen.set(false);
        this.highlightedIndex.set(-1);
        break;
    }
  }

  selectAddress(suggestion: SelectedAddress): void {
    this.selectedAddress = suggestion;
    this.address = suggestion.label;
    this.addressSuggestions.set([]);
    this.addressOpen.set(false);
    this.highlightedIndex.set(-1);
  }

  closeAddressSuggestions(): void {
    setTimeout(() => this.addressOpen.set(false), 150);
  }

  optionId(index: number): string {
    return `search-pro-address-option-${index}`;
  }

  submit(): void {
    if (!this.selectedAddress || !this.trade) return;
    this.router.navigate(['/search-pro'], {
      queryParams: {
        lat: this.selectedAddress.latitude,
        lng: this.selectedAddress.longitude,
        radius: this.kilometers,
        trade: this.trade,
        address: this.selectedAddress.label,
      },
    });
  }
}
