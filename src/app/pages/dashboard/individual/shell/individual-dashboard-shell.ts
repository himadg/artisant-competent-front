import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IndividualDashboardStateService } from '../individual-dashboard-state.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ChatService } from '../../../../core/services/chat.service';
import { LangService } from '../../../../core/services/lang.service';
import { DATE_STYLE_MONTH_YEAR, formatLocalizedDate } from '../../../../core/utils/date-format';
import { DemandDetail } from '../../../../shared/interfaces/demand';
import { LangToggle } from '../../../../shared/components/lang-toggle/lang-toggle';
import { ThemeToggle } from '../../../../shared/components/theme-toggle/theme-toggle';
import { NotificationBell } from '../../../../shared/components/notification-bell/notification-bell';
import { UserAvatar } from '../../../../shared/components/user-avatar/user-avatar';
import { DemandDetailsModal } from '../../../../shared/components/demand-details-modal/demand-details-modal';

@Component({
  selector: 'dashboard-individual-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [IndividualDashboardStateService],
  imports: [
    CommonModule,
    TranslocoModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    LangToggle,
    ThemeToggle,
    NotificationBell,
    UserAvatar,
    DemandDetailsModal,
  ],
  templateUrl: './individual-dashboard-shell.html',
  styleUrl: './individual-dashboard-shell.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class IndividualDashboardShell implements OnInit {
  private readonly state = inject(IndividualDashboardStateService);
  private readonly langService = inject(LangService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  readonly authService = inject(AuthService);
  readonly chatService = inject(ChatService);

  readonly data = this.state.data;
  readonly loading = this.state.loading;
  readonly error = this.state.error;
  readonly selectedDemandId = this.state.selectedDemandId;

  readonly moreMenuOpen = signal(false);

  readonly inscriptionDate = computed(() => {
    const data = this.data();
    if (!data) return '';
    return formatLocalizedDate(data.createdAt, this.langService.lang(), DATE_STYLE_MONTH_YEAR);
  });

  readonly homeAddress = computed(() => {
    const address = this.data()?.address;
    if (!address) return '';
    const parts = [address.additionalInfo, address.streetNumber, address.streetName].filter(Boolean);
    return `${parts.join(' ')}, ${address.postalCode} ${address.city}`;
  });

  ngOnInit(): void {
    this.state.load();

    // Deep link depuis une notification (ex: nouvelle demande) : /dashboard/requests?d=xxx
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const demandId = params.get('d');
      if (!demandId) return;

      this.selectedDemandId.set(demandId);
      this.router.navigate([], { relativeTo: this.route, queryParams: { d: null }, queryParamsHandling: 'merge', replaceUrl: true });
    });
  }

  constructor() {
    inject(BreakpointObserver)
      .observe('(orientation: landscape)')
      .pipe(takeUntilDestroyed())
      .subscribe(({ matches }) => { if (matches) this.moreMenuOpen.set(false); });
  }

  onDemandUpdated(updated: DemandDetail): void {
    this.state.onDemandUpdated(updated);
  }

  toggleMoreMenu(): void { this.moreMenuOpen.update((v) => !v); }
  closeMoreMenu(): void { this.moreMenuOpen.set(false); }
}
