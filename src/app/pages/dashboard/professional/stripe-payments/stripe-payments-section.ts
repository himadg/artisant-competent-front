import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { switchMap } from 'rxjs';
import { StripeApiService } from '../../../../core/services/stripe-api.service';
import { StripeConnectService } from '../../../../core/services/stripe-connect.service';
import { ProfessionalDashboardStateService } from '../professional-dashboard-state.service';

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
  private readonly dashboardState = inject(ProfessionalDashboardStateService);

  readonly loading = signal(true);
  readonly error = signal(false);
  // Source unique : l'état du dashboard, que chaque lecture de statut Stripe met à jour. Le shell
  // n'affiche le router-outlet qu'une fois ces données chargées, elles sont donc toujours présentes ici.
  readonly onboarded = computed(
    () => this.dashboardState.data()?.professionalProfile.stripeDetailsSubmitted === true,
  );

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
    this.stripeApi
      .createAccount()
      // La section Paiements doit toujours repartir de l'état Stripe courant : cela répare
      // aussi les flags locaux si un webhook a été retardé ou manqué.
      .pipe(switchMap(() => this.stripeApi.getStatus(true)))
      .subscribe({
        next: (status) => {
          this.dashboardState.updateStripeStatus(status);
          this.loading.set(false);
        },
        error: () => this.fail(),
      });
  }

  refreshStatus() {
    this.stripeApi.getStatus(true).subscribe({
      next: (status) => this.dashboardState.updateStripeStatus(status),
    });
  }

  private fail() {
    this.error.set(true);
    this.loading.set(false);
  }

  private mountOnboarding(el: HTMLDivElement) {
    if (el.dataset['mounted']) return;
    el.dataset['mounted'] = 'true';
    const component = this.stripeConnect.getInstance().create('account-onboarding');
    // Collecte dès l'onboarding les informations actuellement ou éventuellement requises,
    // y compris les futures exigences connues de Stripe.
    component.setCollectionOptions({ fields: 'eventually_due', futureRequirements: 'include' });
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
