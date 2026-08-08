import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ProfessionalDashboardStateService, ProTab, ProStoryType } from '../professional-dashboard-state.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ChatService } from '../../../../core/services/chat.service';
import { LangService } from '../../../../core/services/lang.service';
import { DATE_STYLE_MONTH_YEAR, formatLocalizedDate } from '../../../../core/utils/date-format';
import { DemandDetail } from '../../../../shared/interfaces/demand';
import { LangToggle } from '../../../../shared/components/lang-toggle/lang-toggle';
import { ThemeToggle } from '../../../../shared/components/theme-toggle/theme-toggle';
import { NotificationBell } from '../../../../shared/components/notification-bell/notification-bell';
import { UserAvatar } from '../../../../shared/components/user-avatar/user-avatar';
import { DocModal } from '../../../../shared/components/doc-modal/doc-modal';
import { DemandDetailsModal } from '../../../../shared/components/demand-details-modal/demand-details-modal';
import { StoryViewer } from '../../../../shared/components/story-viewer/story-viewer';
import { StoryRecorder } from '../../../../shared/components/story-recorder/story-recorder';

@Component({
  selector: 'dashboard-professional-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProfessionalDashboardStateService],
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
    DocModal,
    DemandDetailsModal,
    StoryViewer,
    StoryRecorder,
  ],
  templateUrl: './professional-dashboard-shell.html',
  styleUrl: './professional-dashboard-shell.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProfessionalDashboardShell implements OnInit {
  private readonly state = inject(ProfessionalDashboardStateService);
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
  readonly selectedDemandEditable = this.state.selectedDemandEditable;
  readonly activeTab = this.state.activeTab;
  readonly workCity = this.state.workCity;

  readonly docToPreview = this.state.docToPreview;

  readonly presentationStories = this.state.presentationStories;
  readonly tipsStories = this.state.tipsStories;
  readonly canAddPresentationStory = this.state.canAddPresentationStory;
  readonly canAddTipsStory = this.state.canAddTipsStory;
  readonly uploadingStoryType = this.state.uploadingStoryType;
  readonly storyUploadError = this.state.storyUploadError;
  readonly viewingStory = this.state.viewingStory;
  readonly viewingStoryUrl = this.state.viewingStoryUrl;
  readonly viewingIndex = this.state.viewingIndex;
  readonly viewingStories = this.state.viewingStories;
  readonly hasPrevStory = this.state.hasPrevStory;
  readonly hasNextStory = this.state.hasNextStory;
  readonly recordingStoryType = this.state.recordingStoryType;

  readonly moreMenuOpen = signal(false);
  readonly moreMenuContentDisplayed = signal(false);

  /** La barre de sous-onglets ne concerne que la section profil (rendue par un composant routé
   * distinct) : on la dérive de l'URL courante plutôt que d'un signal de section local. */
  readonly isProfileSection = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(() => this.router.url.startsWith('/dashboard/profile')),
    ),
    { initialValue: this.router.url.startsWith('/dashboard/profile') },
  );

  readonly inscriptionDate = () => {
    const data = this.data();
    if (!data) return '';
    return formatLocalizedDate(data.createdAt, this.langService.lang(), DATE_STYLE_MONTH_YEAR);
  };

  ngOnInit(): void {
    this.state.load();

    // Deep link depuis une notification (ex: nouvelle demande) : /dashboard/requests?d=xxx
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const demandId = params.get('d');
      if (!demandId) return;

      this.selectedDemandId.set(demandId);
      this.state.selectedDemandEditable.set(false);
      this.state.requestsTab.set('received');
      this.router.navigate([], { relativeTo: this.route, queryParams: { d: null }, queryParamsHandling: 'merge', replaceUrl: true });
    });
  }

  constructor() {
    inject(BreakpointObserver)
      .observe('(orientation: landscape)')
      .pipe(takeUntilDestroyed())
      .subscribe(({ matches }) => {
        if (matches) {
          this.moreMenuOpen.set(false);
          this.moreMenuContentDisplayed.set(false);
        }
      });
  }

  setTab(tab: ProTab): void {
    this.activeTab.set(tab);
  }

  onDemandUpdated(updated: DemandDetail): void {
    this.state.onDemandUpdated(updated);
  }

  onMessageStarted(conversationId: string): void {
    this.selectedDemandId.set(null);
    this.state.pendingConversationId.set(conversationId);
    this.router.navigate(['/dashboard', 'messages']);
  }

  toggleMoreMenu(): void { this.moreMenuOpen.update((v) => !v); }
  toggleMoreMenuContent(): void { this.moreMenuContentDisplayed.update((v) => !v); }
  closeMoreMenu(): void { this.moreMenuOpen.set(false); }

  onStoryCircleClick(type: ProStoryType): void { this.state.onStoryCircleClick(type); }
  onAddStoryClick(event: Event, type: ProStoryType): void {
    event.stopPropagation();
    this.state.onAddStoryClick(type);
  }
  closeRecorder(): void { this.state.closeRecorder(); }
  onStoryFileReady(file: File): void { this.state.onStoryFileReady(file); }
  closeStoryViewer(): void { this.state.closeStoryViewer(); }
  deleteViewingStory(): void { this.state.deleteViewingStory(); }
  prevStory(): void { this.state.prevStory(); }
  nextStory(): void { this.state.nextStory(); }
}
