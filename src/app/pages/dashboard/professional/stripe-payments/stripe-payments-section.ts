import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  computed,
  effect,
  inject,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { StripeApiService } from '../../../../core/services/stripe-api.service';
import { StripeConnectService } from '../../../../core/services/stripe-connect.service';
import { StripeConnectStatus } from '../../../../shared/interfaces/stripe-connect';

@Component({
  selector: 'stripe-payments-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule],
  templateUrl: './stripe-payments-section.html',
  styleUrl: './stripe-payments-section.scss',
})
export class StripePaymentsSection implements OnInit {
  private readonly stripeApi = inject(StripeApiService);
  private readonly stripeConnect = inject(StripeConnectService);

  readonly status = signal<StripeConnectStatus | null>(null);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly onboarded = computed(() => this.status()?.detailsSubmitted === true);

  readonly statusChanged = output<StripeConnectStatus>();

  private readonly onboardingContainer = viewChild<ElementRef<HTMLDivElement>>('onboardingContainer');
  private readonly bannerContainer = viewChild<ElementRef<HTMLDivElement>>('bannerContainer');
  private readonly balancesContainer = viewChild<ElementRef<HTMLDivElement>>('balancesContainer');
  private readonly payoutsContainer = viewChild<ElementRef<HTMLDivElement>>('payoutsContainer');
  private readonly managementContainer = viewChild<ElementRef<HTMLDivElement>>('managementContainer');

  constructor() {
    // Monte les composants embarqués Stripe dès que leurs conteneurs apparaissent dans le DOM
    effect(() => {
      const onboarding = this.onboardingContainer()?.nativeElement;
      if (onboarding) this.mountOnboarding(onboarding);

      this.mount(this.bannerContainer()?.nativeElement, 'notification-banner');
      this.mount(this.balancesContainer()?.nativeElement, 'balances');
      this.mount(this.payoutsContainer()?.nativeElement, 'payouts');
      this.mount(this.managementContainer()?.nativeElement, 'account-management');
    });
  }

  ngOnInit() {
    this.init();
  }

  init() {
    this.loading.set(true);
    this.error.set(false);
    this.stripeApi.createAccount().subscribe({
      next: () => {
        this.stripeApi.getStatus().subscribe({
          next: (status) => {
            this.setStatus(status);
            this.loading.set(false);
          },
          error: () => this.fail(),
        });
      },
      error: () => this.fail(),
    });
  }

  refreshStatus() {
    this.stripeApi.getStatus(true).subscribe({
      next: (status) => this.setStatus(status),
    });
  }

  private setStatus(status: StripeConnectStatus) {
    this.status.set(status);
    this.statusChanged.emit(status);
  }

  private fail() {
    this.error.set(true);
    this.loading.set(false);
  }

  private mountOnboarding(el: HTMLDivElement) {
    if (el.dataset['mounted']) return;
    el.dataset['mounted'] = 'true';
    const component = this.stripeConnect.getInstance().create('account-onboarding');
    // Déclenché quand l'artisan quitte/termine le flow : resynchronise les flags côté backend
    component.setOnExit(() => this.refreshStatus());
    el.appendChild(component);
  }

  private mount(el: HTMLDivElement | undefined, name: 'notification-banner' | 'balances' | 'payouts' | 'account-management') {
    if (!el || el.dataset['mounted']) return;
    el.dataset['mounted'] = 'true';
    el.appendChild(this.stripeConnect.getInstance().create(name));
  }
}
