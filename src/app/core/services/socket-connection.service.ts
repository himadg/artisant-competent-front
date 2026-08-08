import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { io, Socket } from 'socket.io-client';
import { AppConfigService } from './app-config.service';
import { AuthService } from './auth.service';

/**
 * Connexion WebSocket unique vers le namespace `/notifications`, partagée entre tous les
 * consommateurs (notifications, messagerie, ...) pour éviter d'ouvrir un socket par service.
 * Compte les usages actifs (`acquire`/`release`) pour ne fermer la connexion que lorsque
 * plus aucun service ne l'utilise.
 */
@Injectable({ providedIn: 'root' })
export class SocketConnectionService {
  private readonly authService = inject(AuthService);
  private readonly appConfig = inject(AppConfigService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private socket: Socket | null = null;
  private refCount = 0;

  acquire(): Socket | null {
    if (!this.isBrowser) return null;

    if (!this.socket) {
      this.socket = io(`${this.appConfig.get('apiUrl')}/notifications`, {
        auth: (cb) => cb({ token: this.authService.accessToken }),
      });
    }
    this.refCount++;
    return this.socket;
  }

  release(): void {
    if (!this.isBrowser || this.refCount === 0) return;

    this.refCount--;
    if (this.refCount === 0) {
      this.socket?.disconnect();
      this.socket = null;
    }
  }
}
