import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { ConversationSummary } from '../../../interfaces/conversation';
import { UserAvatar } from '../../user-avatar/user-avatar';
import { LangService } from '../../../../core/services/lang.service';
import { DATE_STYLE_DAY_MONTH, formatLocalizedDate, formatLocalizedTime } from '../../../../core/utils/date-format';

@Component({
  selector: 'conversation-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TranslocoModule, UserAvatar],
  templateUrl: './conversation-list.html',
  styleUrl: './conversation-list.scss',
})
export class ConversationList {
  private readonly langService = inject(LangService);

  readonly conversations = input.required<ConversationSummary[]>();
  readonly selectedId = input<string | null>(null);
  readonly selected = output<string>();

  readonly search = signal('');

  readonly filteredConversations = computed(() => {
    const query = this.search().trim().toLowerCase();
    if (!query) return this.conversations();
    return this.conversations().filter((c) => {
      const fullName = `${c.otherParticipant.firstName} ${c.otherParticipant.lastName}`.toLowerCase();
      const company = c.otherParticipant.companyName?.toLowerCase() ?? '';
      return fullName.includes(query) || company.includes(query);
    });
  });

  onSearchInput(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  lastMessagePreview(conversation: ConversationSummary): string {
    const message = conversation.lastMessage;
    if (!message) return '';
    switch (message.type) {
      case 'IMAGE':
        return '📷 Photo';
      case 'DOCUMENT':
        return `📄 ${message.content}`;
      default:
        return message.content;
    }
  }

  formatTimestamp(iso: string): string {
    const date = new Date(iso);
    const now = new Date();
    const isSameDay =
      date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
    const lang = this.langService.lang();
    return isSameDay ? formatLocalizedTime(date, lang) : formatLocalizedDate(date, lang, DATE_STYLE_DAY_MONTH);
  }
}
