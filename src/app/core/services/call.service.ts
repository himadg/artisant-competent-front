import { Injectable, PLATFORM_ID, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Socket } from 'socket.io-client';
import { CallType, IncomingCall } from '../../shared/interfaces/call';
import { AuthService } from './auth.service';
import { SocketConnectionService } from './socket-connection.service';

const BASE_URL = '/conversations';

export interface ActiveCall {
  conversationId: string;
  roomId: string;
  callType: CallType;
  peerName: string;
  peerPhotoUrl: string | null;
}

@Injectable({ providedIn: 'root' })
export class CallService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly socketConnection = inject(SocketConnectionService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private socket: Socket | null = null;

  readonly incomingCall = signal<IncomingCall | null>(null);
  readonly activeCall = signal<ActiveCall | null>(null);
  readonly callEndedByPeer = signal<{ conversationId: string } | null>(null);

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

  async startCall(conversationId: string, callType: CallType, peer: { name: string; photoUrl: string | null }): Promise<void> {
    const { roomId } = await firstValueFrom(
      this.http.post<{ success: boolean; roomId: string }>(`${BASE_URL}/${conversationId}/call/invite`, { callType }),
    );
    this.activeCall.set({ conversationId, roomId, callType, peerName: peer.name, peerPhotoUrl: peer.photoUrl });
  }

  acceptIncomingCall(): void {
    const call = this.incomingCall();
    if (!call) return;
    this.incomingCall.set(null);
    this.activeCall.set({
      conversationId: call.conversationId,
      roomId: call.roomId,
      callType: call.callType,
      peerName: call.fromName,
      peerPhotoUrl: call.fromPhotoUrl,
    });
  }

  declineIncomingCall(): void {
    const call = this.incomingCall();
    if (!call) return;
    this.incomingCall.set(null);
    void firstValueFrom(this.http.post(`${BASE_URL}/${call.conversationId}/call/end`, {})).catch(() => {});
  }

  endCall(wasConnected: boolean): void {
    const call = this.activeCall();
    this.activeCall.set(null);
    if (call && !wasConnected) {
      void firstValueFrom(this.http.post(`${BASE_URL}/${call.conversationId}/call/end`, {})).catch(() => {});
    }
  }

  clearCallEndedByPeer(): void {
    this.callEndedByPeer.set(null);
  }

  private connect(): void {
    if (this.socket) return;
    this.socket = this.socketConnection.acquire();
    if (!this.socket) return;

    this.socket.on('call:incoming', (payload: IncomingCall) => this.incomingCall.set(payload));

    this.socket.on('call:ended', (payload: { conversationId: string }) => {
      if (this.incomingCall()?.conversationId === payload.conversationId) {
        this.incomingCall.set(null);
      }
      if (this.activeCall()?.conversationId === payload.conversationId) {
        this.activeCall.set(null);
        this.callEndedByPeer.set(payload);
      }
    });
  }

  private disconnect(): void {
    if (!this.socket) return;
    this.socket.off('call:incoming');
    this.socket.off('call:ended');
    this.socket = null;
    this.socketConnection.release();
    this.incomingCall.set(null);
    this.activeCall.set(null);
    this.callEndedByPeer.set(null);
  }
}
