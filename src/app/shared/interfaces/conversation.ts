import { DemandStatus } from './demand';
import { QuoteStatus } from './quote';

export type MessageType = 'TEXT' | 'IMAGE' | 'DOCUMENT' | 'QUOTE';

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
  // Uniquement pour type = QUOTE : id du devis précis annoncé par CE message, jamais "le devis
  // courant" — un devis refusé puis remplacé par un nouveau ne doit jamais changer ce que ce
  // message donne à voir en le rouvrant.
  quoteId: string | null;
  quoteStatus: QuoteStatus | null;
  createdAt: string;
}

export interface ConversationSummary {
  id: string;
  demandId: string;
  demandDescription: string;
  demandCreatedAt: string | null;
  demandStatus: DemandStatus | null;
  quoteStatus: QuoteStatus | null;
  isAuthor: boolean;
  otherParticipant: ConversationParticipant;
  lastMessage: { content: string; type: MessageType; createdAt: string } | null;
  unreadCount: number;
}
