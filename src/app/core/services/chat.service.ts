import { Injectable, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Socket } from 'socket.io-client';
import { ConversationMessage, ConversationSummary } from '../../shared/interfaces/conversation';
import { AuthService } from './auth.service';
import { SocketConnectionService } from './socket-connection.service';

const BASE_URL = '/conversations';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly socketConnection = inject(SocketConnectionService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private socket: Socket | null = null;

  readonly conversations = signal<ConversationSummary[]>([]);
  /** Message reçu en temps réel, à destination du composant actuellement en train d'afficher la conversation. */
  readonly incomingMessage = signal<ConversationMessage | null>(null);
  /** Nombre de conversations non lues (et non le total de messages non lus), pour le badge de l'enveloppe. */
  readonly unreadConversationsCount = computed(() => this.conversations().filter((c) => c.unreadCount > 0).length);

  constructor() {
    if (!this.isBrowser) return;
    effect(() => {
      if (this.authService.isAuthenticated()) {
        this.connect();
      } else {
        this.disconnect();
      }
    });
  }

  async loadConversations(): Promise<void> {
    try {
      this.conversations.set(await firstValueFrom(this.http.get<ConversationSummary[]>(BASE_URL)));
    } catch (err) {
      console.error('Erreur lors du chargement des conversations', err);
    }
  }

  findOrCreateConversation(demandId: string): Promise<ConversationSummary> {
    return firstValueFrom(this.http.post<ConversationSummary>(`/demands/${demandId}/conversations`, {}));
  }

  /**
   * La liste (GET /conversations) ne contient pas `demandDescription` (jusqu'à 2000 caractères,
   * inutile pour l'affichage en liste) : ce champ n'est chargé qu'à l'ouverture d'une conversation.
   */
  async loadConversationDetail(conversationId: string): Promise<ConversationSummary> {
    const conversation = await firstValueFrom(this.http.get<ConversationSummary>(`${BASE_URL}/${conversationId}`));
    this.conversations.update((list) => {
      const exists = list.some((c) => c.id === conversationId);
      return exists ? list.map((c) => (c.id === conversationId ? conversation : c)) : [conversation, ...list];
    });
    return conversation;
  }

  loadMessages(conversationId: string, before?: string, limit = 50): Promise<ConversationMessage[]> {
    const params: Record<string, string> = { limit: String(limit) };
    if (before) params['before'] = before;
    return firstValueFrom(this.http.get<ConversationMessage[]>(`${BASE_URL}/${conversationId}/messages`, { params }));
  }

  async sendMessage(conversationId: string, content: string): Promise<ConversationMessage> {
    const message = await firstValueFrom(
      this.http.post<ConversationMessage>(`${BASE_URL}/${conversationId}/messages`, { content }),
    );
    this.touchConversation(conversationId, message);
    return message;
  }

  async sendAttachment(conversationId: string, file: File): Promise<ConversationMessage> {
    const form = new FormData();
    form.append('file', file);
    const message = await firstValueFrom(
      this.http.post<ConversationMessage>(`${BASE_URL}/${conversationId}/messages/attachment`, form),
    );
    this.touchConversation(conversationId, message);
    return message;
  }

  async markAsRead(conversationId: string): Promise<void> {
    try {
      await firstValueFrom(this.http.patch(`${BASE_URL}/${conversationId}/read`, {}));
      this.conversations.update((list) =>
        list.map((c) => (c.id === conversationId ? { ...c, unreadCount: 0 } : c)),
      );
    } catch (err) {
      console.error(`Erreur lors du marquage comme lue de la conversation ${conversationId}`, err);
    }
  }

  private touchConversation(conversationId: string, message: ConversationMessage): void {
    this.conversations.update((list) =>
      list.map((c) =>
        c.id === conversationId
          ? { ...c, lastMessage: { content: message.content, type: message.type, createdAt: message.createdAt } }
          : c,
      ),
    );
  }

  private connect(): void {
    if (this.socket) return;

    void this.loadConversations();

    this.socket = this.socketConnection.acquire();
    if (!this.socket) return;
    this.socket.on('message:new', (message: ConversationMessage) => {
      const isKnownConversation = this.conversations().some((c) => c.id === message.conversationId);
      if (!isKnownConversation) {
        // Première conversation reçue côté client (ex: un pro contacte un particulier pour la
        // première fois) : elle n'existe pas encore dans la liste, on va chercher son résumé complet
        // (unreadCount déjà à jour côté backend au moment de l'émission de l'événement).
        void this.loadConversationDetail(message.conversationId);
      } else {
        this.touchConversation(message.conversationId, message);
        if (!message.isOwnMessage) {
          this.conversations.update((list) =>
            list.map((c) => (c.id === message.conversationId ? { ...c, unreadCount: c.unreadCount + 1 } : c)),
          );
        }
      }
      this.incomingMessage.set(message);
    });
    this.socket.on('connect_error', (err) => console.warn('Connexion WebSocket messagerie échouée', err));
  }

  private disconnect(): void {
    if (!this.socket) return;
    this.socket.off('message:new');
    this.socket.off('connect_error');
    this.socket = null;
    this.socketConnection.release();
    this.conversations.set([]);
    this.incomingMessage.set(null);
  }
}
