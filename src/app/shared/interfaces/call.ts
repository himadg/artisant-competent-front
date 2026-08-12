export type CallType = 'VIDEO' | 'AUDIO';

export interface IncomingCall {
  conversationId: string;
  roomId: string;
  callType: CallType;
  fromUserId: string;
  fromName: string;
  fromPhotoUrl: string | null;
}
