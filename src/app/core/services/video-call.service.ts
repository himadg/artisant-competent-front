import { Injectable, signal, inject } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { AppConfigService } from './app-config.service';
import { AuthService } from './auth.service';

interface RemoteParticipant {
  socketId: string;
  stream: MediaStream;
}

@Injectable({ providedIn: 'root' })
export class VideoCallService {
  private readonly appConfig = inject(AppConfigService);
  private readonly authService = inject(AuthService);

  private socket: Socket | null = null;
  private roomId: string | null = null;
  private localStream: MediaStream | null = null;
  private readonly peerConnections = new Map<string, RTCPeerConnection>();
  private readonly ICE_SERVERS: RTCIceServer[] = [{ urls: 'stun:stun.l.google.com:19302' }];

  readonly localVideoStream = signal<MediaStream | null>(null);
  readonly remoteParticipants = signal<RemoteParticipant[]>([]);
  readonly connected = signal(false);
  readonly errorMessage = signal<string | null>(null);

  async joinRoom(roomId: string): Promise<void> {
    this.roomId = roomId;

    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    } catch {
      try {
        // Caméra indisponible (ex: déjà utilisée par un autre onglet) : on retente en audio seul.
        this.localStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
        this.errorMessage.set('Caméra indisponible, audio seul.');
      } catch {
        this.errorMessage.set("Impossible d'accéder à la caméra ou au micro.");
        return;
      }
    }

    this.localVideoStream.set(this.localStream);

    const apiUrl = this.appConfig.get('apiUrl');
    this.socket = io(`${apiUrl}/call`, {
      auth: { token: this.authService.accessToken },
    });

    this.socket.on('connect', () => {
      this.connected.set(true);
      this.socket!.emit('join-room', { roomId });
    });

    this.socket.on('error', (payload: { message: string }) => this.errorMessage.set(payload.message));
    this.socket.on('room-full', () => this.errorMessage.set('Cette room est déjà pleine.'));

    this.socket.on('room-participants', (payload: { participants: { socketId: string }[] }) => {
      for (const participant of payload.participants) {
        this.createPeerConnection(participant.socketId, true);
      }
    });

    this.socket.on('participant-joined', (payload: { socketId: string }) => {
      this.createPeerConnection(payload.socketId, false);
    });

    this.socket.on('participant-left', (payload: { socketId: string }) => {
      this.peerConnections.get(payload.socketId)?.close();
      this.peerConnections.delete(payload.socketId);
      this.remoteParticipants.update((list) => list.filter((p) => p.socketId !== payload.socketId));
    });

    this.socket.on('signal', async (payload: { from: string; data: RTCSessionDescriptionInit | RTCIceCandidateInit }) => {
      await this.handleSignal(payload.from, payload.data);
    });
  }

  private createPeerConnection(socketId: string, isInitiator: boolean): void {
    const pc = new RTCPeerConnection({ iceServers: this.ICE_SERVERS });
    this.peerConnections.set(socketId, pc);

    for (const track of this.localStream!.getTracks()) {
      pc.addTrack(track, this.localStream!);
    }

    pc.onicecandidate = (event) => {
      if (event.candidate) this.sendSignal(socketId, event.candidate.toJSON());
    };

    pc.ontrack = (event) => {
      const [stream] = event.streams;
      this.remoteParticipants.update((list) => {
        const withoutThis = list.filter((p) => p.socketId !== socketId);
        return [...withoutThis, { socketId, stream }];
      });
    };

    if (isInitiator) {
      pc.onnegotiationneeded = async () => {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        this.sendSignal(socketId, offer);
      };
    }
  }

  private async handleSignal(from: string, data: RTCSessionDescriptionInit | RTCIceCandidateInit): Promise<void> {
    const pc = this.peerConnections.get(from);
    if (!pc) return;

    if ('type' in data && data.type === 'offer') {
      await pc.setRemoteDescription(new RTCSessionDescription(data));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      this.sendSignal(from, answer);
    } else if ('type' in data && data.type === 'answer') {
      await pc.setRemoteDescription(new RTCSessionDescription(data));
    } else if ('candidate' in data) {
      await pc.addIceCandidate(new RTCIceCandidate(data));
    }
  }

  private sendSignal(to: string, data: unknown): void {
    this.socket?.emit('signal', { to, data });
  }

  setMicEnabled(enabled: boolean): void {
    this.localStream?.getAudioTracks().forEach((track) => (track.enabled = enabled));
  }

  setCameraEnabled(enabled: boolean): void {
    this.localStream?.getVideoTracks().forEach((track) => (track.enabled = enabled));
  }

  leaveRoom(): void {
    if (this.roomId) this.socket?.emit('leave-room', { roomId: this.roomId });
    this.socket?.disconnect();
    this.socket = null;
    this.roomId = null;

    for (const pc of this.peerConnections.values()) pc.close();
    this.peerConnections.clear();

    this.localStream?.getTracks().forEach((track) => track.stop());
    this.localStream = null;

    this.localVideoStream.set(null);
    this.remoteParticipants.set([]);
    this.connected.set(false);
    this.errorMessage.set(null);
  }
}
