export type MessageType = 'TEXT' | 'IMAGE' | 'DOCUMENT';

export interface ConversationParticipant {
  userId: string;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
  companyName: string | null;
}

export interface ConversationMessage {
  id: string;
  conversationId: string;
  authorUserId: string;
  isOwnMessage: boolean;
  type: MessageType;
  content: string;
  fileUrl: string | null;
  fileWidth: number | null;
  fileHeight: number | null;
  createdAt: string;
}

export interface ConversationSummary {
  id: string;
  demandId: string;
  demandDescription: string;
  demandCreatedAt: string | null;
  otherParticipant: ConversationParticipant;
  lastMessage: { content: string; type: MessageType; createdAt: string } | null;
  unreadCount: number;
}
