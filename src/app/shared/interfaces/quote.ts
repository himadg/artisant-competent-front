export type MaterialOrigin = 'new' | 'refurbished' | 'custom' | 'none';
export type QuoteStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'DECLINED';

export interface QuoteLineItem {
  description: string;
  amountHT: number | null;
  vatRate: number;
  materialOrigin?: MaterialOrigin[];
}

// Métadonnée seule pour l'instant (pas de fileKey) : l'upload des pièces jointes du devis n'est pas
// encore câblé, à l'image des documents de demande.
export interface QuoteDocument {
  name: string;
}

/** `QuoteDocument` + l'état local du <input type="file"> avant upload (pas encore câblé, donc
 * jamais envoyé à l'API — seul `name` fait partie du payload, cf. buildDraftPayload dans quote-modal). */
export interface QuoteDocumentDraft extends QuoteDocument {
  file: File | null;
  fileName: string | null;
}

/** Payload envoyé à la sauvegarde du brouillon — volontairement permissif, un brouillon peut être incomplet. */
export interface SaveQuoteDraftPayload {
  quoteNumber: string;
  materialLines: QuoteLineItem[];
  laborLines: QuoteLineItem[];
  logisticsLines: QuoteLineItem[];
  nightWorkSurcharge: boolean | null;
  estimatedStartDate: string | null;
  estimatedEndDate: string | null;
  documents: QuoteDocument[];
  remarks: string;
  klarnaAccepted: boolean;
  vatExempt: boolean;
  quoteAgreementAccepted: boolean;
  earlyStartAccepted: boolean;
}

export interface Quote extends SaveQuoteDraftPayload {
  id: string;
  status: QuoteStatus;
  demandId: string;
  professionalProfileId: string;
  createdAt: string;
  updatedAt: string;
}
