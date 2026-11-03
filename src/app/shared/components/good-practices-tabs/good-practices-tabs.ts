import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  HostListener,
  afterNextRender,
  computed,
  effect,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

export type GoodPracticesAudience = 'pro' | 'individual';

interface GoodPracticesTopic {
  id: string;
  labelKey: string;
  imgs: string[];
}

const PRO_TOPICS: GoodPracticesTopic[] = [
  {
    id: 'pro-guide',
    labelKey: 'dashboard.goodPractices.pro.guide',
    imgs: [
      'assets/img/help-good-practices-for-pro-1.png',
      'assets/img/help-good-practices-for-pro-2.png',
      'assets/img/help-good-practices-for-pro-3.png',
    ],
  },
  { id: 'description', labelKey: 'dashboard.goodPractices.pro.description', imgs: ['assets/img/help-company-description.jpeg'] },
  { id: 'mediator', labelKey: 'dashboard.goodPractices.pro.mediator', imgs: ['assets/img/help-consumer-ombudsman.png'] },
  { id: 'geolocation', labelKey: 'dashboard.goodPractices.pro.geolocation', imgs: ['assets/img/help-working-address.png'] },
  { id: 'hours', labelKey: 'dashboard.goodPractices.pro.hours', imgs: ['assets/img/help-hours-vacations-oncalls.png'] },
  { id: 'cmod', labelKey: 'dashboard.goodPractices.pro.cmod', imgs: ['assets/img/help-cmod.jpeg'] },
];

const INDIVIDUAL_TOPICS: GoodPracticesTopic[] = [
  {
    id: 'individual-guide',
    labelKey: 'dashboard.goodPractices.individual.guide',
    imgs: ['assets/img/help-good-practices-for-ind-1.png', 'assets/img/help-good-practices-for-ind-2.png'],
  },
];

const SHARED_TOPICS: GoodPracticesTopic[] = [
  {
    id: 'doc-obligations',
    labelKey: 'dashboard.goodPractices.shared.docObligations',
    imgs: ['assets/img/help-documentation-insurance-by-trade.png'],
  },
  { id: 'flat-rate', labelKey: 'dashboard.goodPractices.shared.flatRate', imgs: ['assets/img/help-pro-flate-rate-pricing.png'] },
  { id: 'hourly-rate', labelKey: 'dashboard.goodPractices.shared.hourlyRate', imgs: ['assets/img/help-pro-hourly-rating.png'] },
  { id: 'vat', labelKey: 'dashboard.goodPractices.shared.vat', imgs: ['assets/img/help-vat.png'] },
];

@Component({
  selector: 'good-practices-tabs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule],
  templateUrl: './good-practices-tabs.html',
  styleUrl: './good-practices-tabs.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GoodPracticesTabs {
  readonly audience = input.required<GoodPracticesAudience>();

  readonly topics = computed<GoodPracticesTopic[]>(() => [
    ...(this.audience() === 'pro' ? PRO_TOPICS : INDIVIDUAL_TOPICS),
    ...SHARED_TOPICS,
  ]);

  private readonly activeId = signal<string>(PRO_TOPICS[0].id);
  private readonly pageIndex = signal(0);

  // ───────────────────────── Défilement horizontal des onglets ─────────────────────────
  // La barre de scroll native n'est pas fiable comme indice visuel (masquée par défaut sur
  // macOS/iOS, s'efface après quelques secondes sur Chrome desktop et Firefox mobile) : des
  // flèches ‹ › explicites, désactivées aux bornes (même traitement que la pagination des
  // images ci-dessous), remplacent ce rôle de façon fiable sur toutes les plateformes.
  private readonly tabsRow = viewChild<ElementRef<HTMLDivElement>>('tabsRow');

  readonly canScrollTabsLeft = signal(false);
  readonly canScrollTabsRight = signal(false);

  constructor() {
    afterNextRender(() => this.updateTabsScrollState());

    // Recalcule l'état des flèches quand la liste d'onglets change (changement d'audience) —
    // microtask pour laisser Angular finir de rendre les nouveaux onglets avant de mesurer.
    effect(() => {
      this.topics();
      queueMicrotask(() => this.updateTabsScrollState());
    });
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.updateTabsScrollState();
  }

  onTabsScroll(): void {
    this.updateTabsScrollState();
  }

  scrollTabsBy(direction: 1 | -1): void {
    const el = this.tabsRow()?.nativeElement;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.7, behavior: 'smooth' });
  }

  private updateTabsScrollState(): void {
    const el = this.tabsRow()?.nativeElement;
    if (!el) return;
    this.canScrollTabsLeft.set(el.scrollLeft > 1);
    this.canScrollTabsRight.set(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }

  // Si l'id courant n'appartient pas à la liste active (ex: juste après un changement
  // d'audience), on retombe proprement sur le premier onglet plutôt que d'afficher un vide.
  readonly activeTopic = computed(() => {
    const topics = this.topics();
    return topics.find((t) => t.id === this.activeId()) ?? topics[0];
  });

  // Protège contre un pageIndex resté trop grand si jamais le topic actif change de longueur.
  readonly currentPage = computed(() => Math.min(this.pageIndex(), this.activeTopic().imgs.length - 1));
  readonly pageCount = computed(() => this.activeTopic().imgs.length);
  readonly currentImg = computed(() => this.activeTopic().imgs[this.currentPage()]);

  // Pagination non circulaire : pas de retour de la dernière page à la première, ni l'inverse.
  readonly hasPrevPage = computed(() => this.currentPage() > 0);
  readonly hasNextPage = computed(() => this.currentPage() < this.pageCount() - 1);

  setActive(id: string): void {
    this.activeId.set(id);
    this.pageIndex.set(0);
  }

  prevPage(): void {
    if (this.hasPrevPage()) this.pageIndex.update((i) => i - 1);
  }

  nextPage(): void {
    if (this.hasNextPage()) this.pageIndex.update((i) => i + 1);
  }
}
