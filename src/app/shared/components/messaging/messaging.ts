import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { ConversationList } from './conversation-list/conversation-list';
import { ConversationView } from './conversation-view/conversation-view';
import { ConversationMessage } from '../../interfaces/conversation';
import { ChatService } from '../../../core/services/chat.service';

@Component({
  selector: 'messaging',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TranslocoModule, ConversationList, ConversationView],
  templateUrl: './messaging.html',
  styleUrl: './messaging.scss',
})
export class Messaging {
  private readonly chatService = inject(ChatService);

  /** Permet à un appelant externe (ex: bouton "envoyer un message" sur une demande) de préselectionner une conversation. */
  readonly initialConversationId = input<string | null>(null);
  readonly openDemand = output<string>();

  readonly conversations = this.chatService.conversations;
  readonly selectedConversationId = signal<string | null>(null);
  readonly mobileShowConversation = signal(false);
  readonly messages = signal<ConversationMessage[]>([]);
  readonly messagesLoading = signal(false);

  readonly selectedConversation = computed(
    () => this.conversations().find((c) => c.id === this.selectedConversationId()) ?? null,
  );

  constructor() {
    effect(() => {
      const id = this.initialConversationId();
      if (id && id !== this.selectedConversationId()) this.selectConversation(id);
    });

    effect(() => {
      const message = this.chatService.incomingMessage();
      if (!message || message.conversationId !== this.selectedConversationId()) return;

      this.messages.update((list) => (list.some((m) => m.id === message.id) ? list : [...list, message]));
      if (!message.isOwnMessage) void this.chatService.markAsRead(message.conversationId);
    });
  }

  selectConversation(id: string): void {
    this.selectedConversationId.set(id);
    this.mobileShowConversation.set(true);
    this.messagesLoading.set(true);

    this.chatService
      .loadMessages(id)
      .then((messages) => this.messages.set(messages))
      .finally(() => this.messagesLoading.set(false));

    void this.chatService.loadConversationDetail(id);
    void this.chatService.markAsRead(id);
  }

  closeConversation(): void {
    this.mobileShowConversation.set(false);
    // Sans ça, les messages reçus pour cette conversation continueraient à être marqués lus
    // automatiquement (cf. effect ci-dessus) alors que l'utilisateur est revenu sur la liste.
    this.selectedConversationId.set(null);
  }

  async sendMessage(content: string): Promise<void> {
    const conversationId = this.selectedConversationId();
    if (!conversationId) return;

    const message = await this.chatService.sendMessage(conversationId, content);
    this.messages.update((list) => (list.some((m) => m.id === message.id) ? list : [...list, message]));
  }

  async sendAttachment(file: File): Promise<void> {
    const conversationId = this.selectedConversationId();
    if (!conversationId) return;

    const message = await this.chatService.sendAttachment(conversationId, file);
    this.messages.update((list) => (list.some((m) => m.id === message.id) ? list : [...list, message]));
  }
}
