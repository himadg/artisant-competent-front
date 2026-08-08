import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { ConversationList } from './conversation-list/conversation-list';
import { ConversationView } from './conversation-view/conversation-view';
import { ConversationMessage } from '../../interfaces/conversation';
import { ChatService } from '../../../core/services/chat.service';

const MESSAGES_PAGE_SIZE = 50;

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
  readonly loadingMoreMessages = signal(false);
  readonly hasMoreMessages = signal(true);

  readonly selectedConversation = computed(
    () => this.conversations().find((c) => c.id === this.selectedConversationId()) ?? null,
  );

  // Fenêtre de messages déjà chargée par conversation (historique paginé + arrivées temps réel),
  // conservée pour la durée de la session : revenir sur une conversation déjà visitée ne doit pas
  // perdre les pages plus anciennes chargées via loadMoreMessages, ni refaire un aller-retour réseau.
  private readonly messagesCache = new Map<string, ConversationMessage[]>();
  private readonly hasMoreCache = new Map<string, boolean>();

  constructor() {
    effect(() => {
      const id = this.initialConversationId();
      if (id && id !== this.selectedConversationId()) this.selectConversation(id);
    });

    effect(() => {
      const message = this.chatService.incomingMessage();
      if (message?.conversationId !== this.selectedConversationId()) return;

      this.messages.update((list) => (list.some((m) => m.id === message.id) ? list : [...list, message]));
      if (!message.isOwnMessage) void this.chatService.markAsRead(message.conversationId);
    });

    effect(() => {
      const id = this.selectedConversationId();
      const messages = this.messages();
      const hasMore = this.hasMoreMessages();
      if (!id) return;
      this.messagesCache.set(id, messages);
      this.hasMoreCache.set(id, hasMore);
    });
  }

  selectConversation(id: string): void {
    if (id === this.selectedConversationId()) {
      this.mobileShowConversation.set(true);
      return;
    }
    this.selectedConversationId.set(id);
    this.mobileShowConversation.set(true);

    const cached = this.messagesCache.get(id);
    if (cached) {
      this.messages.set(cached);
      this.hasMoreMessages.set(this.hasMoreCache.get(id) ?? true);
    } else {
      this.messagesLoading.set(true);
      this.hasMoreMessages.set(true);

      this.chatService
        .loadMessages(id, undefined, MESSAGES_PAGE_SIZE)
        .then((messages) => {
          this.messages.set(messages);
          this.hasMoreMessages.set(messages.length === MESSAGES_PAGE_SIZE);
        })
        .finally(() => this.messagesLoading.set(false));
    }

    void this.chatService.loadConversationDetail(id);
    void this.chatService.markAsRead(id);
  }

  loadMoreMessages(): void {
    const conversationId = this.selectedConversationId();
    const oldest = this.messages().at(-1);
    if (!conversationId || !oldest || this.loadingMoreMessages() || !this.hasMoreMessages()) return;

    this.loadingMoreMessages.set(true);
    this.chatService
      .loadMessages(conversationId, oldest.id, MESSAGES_PAGE_SIZE)
      .then((older) => {
        this.hasMoreMessages.set(older.length === MESSAGES_PAGE_SIZE);
        this.messages.update((list) => [...list, ...older]);
      })
      .finally(() => this.loadingMoreMessages.set(false));
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
