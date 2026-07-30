import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, computed, inject, input, output, signal } from '@angular/core';
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

  readonly back = output<void>();
  readonly sendMessage = output<string>();
  readonly declineOffer = output<void>();
  readonly createQuote = output<void>();
  readonly leaveReview = output<void>();
  readonly reportDispute = output<void>();
  readonly openDemand = output<string>();
  readonly sendAttachment = output<File>();

  readonly draft = signal('');
  readonly actionsMenuOpen = signal(false);
  readonly docToPreview = signal<PreviewDocument | null>(null);

  readonly demandPreview = computed(() => {
    const description = this.conversation().demandDescription;
    return description.length > 100 ? `${description.slice(0, 100)}…` : description;
  });

  /** Affichage façon Messenger : DOM du plus récent au plus ancien, combiné à
   * `flex-direction: column-reverse` en CSS pour un ancrage naturel en bas (aucun scroll
   * impératif nécessaire, y compris quand un nouveau message arrive pendant la lecture). */
  readonly reversedMessages = computed(() => [...this.messages()].reverse());

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
