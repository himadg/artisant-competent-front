import { Injectable, PLATFORM_ID, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { AppNotification } from '../../shared/interfaces/notification';
import { AppConfigService } from './app-config.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly appConfig = inject(AppConfigService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private socket: Socket | null = null;

  readonly notifications = signal<AppNotification[]>([]);
  readonly unreadCount = signal(0);

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

  // Les erreurs HTTP sont déjà remontées à l'utilisateur (message traduit) par httpErrorInterceptor.
  // On les attrape ici uniquement pour éviter les promesses non gérées et garder un état local cohérent.

  async loadAll(): Promise<void> {
    try {
      this.notifications.set(await firstValueFrom(this.http.get<AppNotification[]>('/notifications')));
    } catch (err) {
      console.error('Erreur lors du chargement des notifications', err);
    }
  }

  async markAsRead(id: string): Promise<void> {
    try {
      await firstValueFrom(this.http.patch(`/notifications/${id}/read`, {}));
      this.notifications.update((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)));
      void this.refreshUnreadCount();
    } catch (err) {
      console.error(`Erreur lors du marquage comme lu de la notification ${id}`, err);
    }
  }

  async markAllAsRead(): Promise<void> {
    try {
      await firstValueFrom(this.http.patch('/notifications/read-all', {}));
      this.notifications.update((list) => list.map((n) => ({ ...n, read: true })));
      this.unreadCount.set(0);
    } catch (err) {
      console.error('Erreur lors du marquage de toutes les notifications comme lues', err);
    }
  }

  private async refreshUnreadCount(): Promise<void> {
    try {
      this.unreadCount.set(await firstValueFrom(this.http.get<number>('/notifications/unread-count')));
    } catch (err) {
      console.error('Erreur lors de la récupération du nombre de notifications non lues', err);
    }
  }

  private connect(): void {
    if (this.socket) return;

    void this.refreshUnreadCount();
    void this.loadAll();

    this.socket = io(`${this.appConfig.get('apiUrl')}/notifications`, {
      // Fonction plutôt qu'objet statique : ré-évalue le token à chaque tentative de connexion,
      // ce qui couvre nativement le cas d'un token rafraîchi entre deux reconnexions.
      auth: (cb) => cb({ token: this.authService.accessToken }),
    });
    this.socket.on('connect', () => void this.refreshUnreadCount());
    this.socket.on('notification', (notification: AppNotification) => {
      this.notifications.update((list) => [notification, ...list]);
      this.unreadCount.update((n) => n + 1);
    });
    // Pas de message utilisateur ici : socket.io-client réessaie automatiquement avec backoff,
    // et afficher un toast à chaque tentative serait plus gênant qu'utile.
    this.socket.on('connect_error', (err) => console.warn('Connexion WebSocket notifications échouée', err));
  }

  private disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
    this.notifications.set([]);
    this.unreadCount.set(0);
  }
}
