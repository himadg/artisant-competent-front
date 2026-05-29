import { Component, ChangeDetectionStrategy, inject, signal, DestroyRef, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { Subject, switchMap, debounceTime, distinctUntilChanged, filter, tap } from 'rxjs';
import { TradeApiService } from '../../../core/services/trade-api.service';
import { GeocodingService, AddressSuggestion } from '../../../core/services/geocoding.service';
import { Trade } from '../../interfaces/trade';

@Component({
  selector: 'search-pro',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, TranslocoModule],
  templateUrl: './search-pro.html',
  styleUrl: './search-pro.scss',
})
export class SearchPro {
  private readonly tradeApi = inject(TradeApiService);
  private readonly geocodingService = inject(GeocodingService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly trades = signal<Trade[]>([]);
  readonly addressSuggestions = signal<AddressSuggestion[]>([]);
  readonly addressOpen = signal(false);
  readonly ranges = [5, 10, 15, 20, 25, 30];

  address = '';
  selectedAddress: AddressSuggestion | null = null;
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
      tap(q => console.log(q)),
      debounceTime(300),
      // distinctUntilChanged(),
      // filter(q => q.length >= 3),
      switchMap(q => this.geocodingService.search(q)),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(suggestions => {
      console.log(suggestions);
      this.addressSuggestions.set(suggestions);
      this.addressOpen.set(suggestions.length > 0);
    });
  }

  get sliderPercent(): number {
    const p = (this.kilometersIndex / (this.ranges.length - 1)) * 100;
    return Math.max(6, Math.min(94, p));
  }

  get kilometers(): number {
    return this.ranges[this.kilometersIndex] ?? this.ranges[0];
  }

  onAddressInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.address = value;
    this.selectedAddress = null;
    if (!value.trim()) {
      this.addressSuggestions.set([]);
      this.addressOpen.set(false);
      return;
    }
    this.addressSearch$.next(value);
  }

  selectAddress(suggestion: AddressSuggestion): void {
    this.selectedAddress = suggestion;
    this.address = suggestion.label;
    this.addressSuggestions.set([]);
    this.addressOpen.set(false);
  }

  closeAddressSuggestions(): void {
    setTimeout(() => this.addressOpen.set(false), 150);
  }

  submit(): void {
    if (!this.selectedAddress || !this.trade) return;
  }
}
