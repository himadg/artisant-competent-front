import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { ConversationMessage, ConversationSummary } from '../../../interfaces/conversation';
import { DocModal } from '../../doc-modal/doc-modal';
import { UserAvatar } from '../../user-avatar/user-avatar';
import { PreviewDocument } from '../../../interfaces/preview-document';
import { LocalizedDatePipe } from '../../../pipes/localized-date.pipe';
import { FlashMessageService } from '../../../../core/services/flash-message.service';
import { ALLOWED_DOCUMENT_TYPES } from '../../../../core/utils/file-types';
import { LangService } from '../../../../core/services/lang.service';
import { DATE_STYLE_COMPACT, formatLocalizedDate, formatLocalizedTime } from '../../../../core/utils/date-format';

@Component({
  selector: 'conversation-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, TranslocoModule, DocModal, UserAvatar, LocalizedDatePipe],
  templateUrl: './conversation-view.html',
  styleUrl: './conversation-view.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ConversationView {
  private readonly flashMessage = inject(FlashMessageService);
  private readonly langService = inject(LangService);
  private readonly transloco = inject(TranslocoService);

  readonly conversation = input.required<ConversationSummary>();
  readonly messages = input.required<ConversationMessage[]>();
  readonly loadingMore = input(false);
  readonly hasMore = input(true);

  readonly back = output<void>();
  readonly sendMessage = output<string>();
  readonly declineOffer = output<void>();
  readonly createQuote = output<void>();
  readonly leaveReview = output<void>();
  readonly reportDispute = output<void>();
  readonly openDemand = output<string>();
  readonly sendAttachment = output<File>();
  readonly loadMore = output<void>();
  readonly startVideoCall = output<void>();
  readonly startVoiceCall = output<void>();

  readonly messagesContainer = viewChild<ElementRef<HTMLDivElement>>('messagesContainer');
  readonly oldestSentinel = viewChild<ElementRef<HTMLDivElement>>('oldestSentinel');

  readonly draft = signal('');
  readonly actionsMenuOpen = signal(false);
  readonly docToPreview = signal<PreviewDocument | null>(null);

  // Hauteur de scroll capturée juste avant de déclencher le chargement des messages plus anciens,
  // pour compenser leur insertion et éviter que la vue ne saute (cf. l'effect ci-dessous).
  private pendingScrollHeight: number | null = null;

  constructor() {
    // Sentinelle observée via IntersectionObserver plutôt qu'un calcul de scrollTop : ça évite
    // toute hypothèse sur le sens réel du scroll induit par column-reverse (cf. .chat-messages).
    effect((onCleanup) => {
      const root = this.messagesContainer()?.nativeElement;
      const sentinel = this.oldestSentinel()?.nativeElement;
      if (!root || !sentinel) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (!entries[0]?.isIntersecting || this.loadingMore() || !this.hasMore()) return;
          this.pendingScrollHeight = root.scrollHeight;
          this.loadMore.emit();
        },
        { root, threshold: 0 },
      );
      observer.observe(sentinel);
      onCleanup(() => observer.disconnect());
    });

    // ResizeObserver plutôt qu'un effect sur messages() : il se déclenche au moment exact où la
    // hauteur réelle du conteneur change (donc après peinture des nouveaux messages), sans dépendre
    // du timing de propagation du signal messages() du parent vers cet input.
    effect((onCleanup) => {
      const container = this.messagesContainer()?.nativeElement;
      if (!container) return;

      const resizeObserver = new ResizeObserver(() => {
        const captured = this.pendingScrollHeight;
        if (captured === null) return;
        this.pendingScrollHeight = null;
        container.scrollTop += container.scrollHeight - captured;
      });
      resizeObserver.observe(container);
      onCleanup(() => resizeObserver.disconnect());
    });
  }

  readonly demandPreview = computed(() => {
    const description = this.conversation().demandDescription;
    return description.length > 100 ? `${description.slice(0, 100)}…` : description;
  });

  formatBubbleTime(iso: string): string {
    const date = new Date(iso);
    const now = new Date();
    const isSameDay =
      date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
    const lang = this.langService.lang();
    const time = formatLocalizedTime(date, lang);
    const day = isSameDay ? this.transloco.translate('common.today') : formatLocalizedDate(date, lang, DATE_STYLE_COMPACT);
    return `${day} - ${time}`;
  }

  onDraftInput(event: Event): void {
    this.draft.set((event.target as HTMLTextAreaElement).value);
  }

  submit(): void {
    const value = this.draft().trim();
    if (!value) return;
    this.sendMessage.emit(value);
    this.draft.set('');
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.submit();
    }
  }

  openImagePreview(message: ConversationMessage): void {
    if (!message.fileUrl) return;
    this.docToPreview.set({ url: message.fileUrl, title: message.content });
  }

  onAttachmentSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    if (!ALLOWED_DOCUMENT_TYPES.has(file.type)) {
      this.flashMessage.set({ type: 'error', key: 'dashboard.messages.invalidAttachment' });
      return;
    }
    this.sendAttachment.emit(file);
  }

  toggleActionsMenu(): void {
    this.actionsMenuOpen.update((open) => !open);
  }

  closeActionsMenu(): void {
    this.actionsMenuOpen.set(false);
  }
}
