import { Address } from './address';
import { DemandAddress } from './demand';

export type MaterialOrigin = 'new' | 'refurbished' | 'custom';
export type QuoteStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'DECLINED';

export interface QuoteLineItem {
  description: string;
  amountHT: number | null;
  vatRate: number;
  materialOrigin?: MaterialOrigin[];
}

/** Uniquement pour les lignes de matériaux : `amountHT` y est calculé automatiquement
 * (quantity × unitPriceHT) plutôt que saisi à la main, contrairement aux lignes de
 * main-d'œuvre/logistique qui restent au forfait. */
export interface QuoteMaterialLineItem extends QuoteLineItem {
  quantity: number | null;
  unitPriceHT: number | null;
}

/** Document déjà sauvegardé lors d'un précédent enregistrement (fileKey connu). */
export interface QuoteDocument {
  name: string;
  fileKey: string;
}

/** État local d'une ligne de document dans le formulaire : soit déjà sauvegardée (`fileKey` connu,
 * `file` null), soit tout juste sélectionnée par le pro et pas encore uploadée (`file` renseigné,
 * `fileKey` null) — l'upload n'a lieu qu'au moment d'enregistrer/envoyer le devis (cf. QuoteService). */
export interface QuoteDocumentDraft {
  name: string;
  fileKey: string | null;
  file: File | null;
  fileName: string | null;
}

/** Payload envoyé à la sauvegarde du brouillon — volontairement permissif, un brouillon peut être incomplet. */
export interface SaveQuoteDraftPayload {
  quoteNumber: string;
  validUntil: string | null;
  materialLines: QuoteMaterialLineItem[];
  laborLines: QuoteLineItem[];
  logisticsLines: QuoteLineItem[];
  nightWorkSurcharge: boolean | null;
  estimatedStartDate: string | null;
  estimatedEndDate: string | null;
  documents: QuoteDocument[];
  remarks: string;
  // Références d'assurance saisies par le pro (mention obligatoire sur le devis BTP, arrêté du 19 mars 2013)
  decennaleInsurer: string;
  decennalePolicyNumber: string;
  decennaleCoverageArea: string;
  rcProInsurer: string;
  rcProPolicyNumber: string;
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

/** Identité du professionnel telle qu'affichée sur le devis (sous-ensemble de ProfessionalProfile). */
export interface QuotePreviewProfessional {
  companyName: string;
  siret: string;
  legalForm: string;
  managerPhone: string;
  professionalEmail: string | null;
  logoUrl: string | null;
  workAddress: Address;
}

/** Identité du client telle qu'affichée sur le devis — l'adresse reste masquée (ville/code postal
 * uniquement) tant que le devis n'est pas payé, cf. DemandAddressHidden dans demand.ts. */
export interface QuotePreviewClient {
  firstName: string;
  lastName: string;
  address: DemandAddress | null;
}

/** Réponse de `GET /quotes/:quoteId` (client, cmod plus tard) — le devis identifié par son id précis
 * (jamais "le devis courant" d'une conversation), enrichi de l'identité pro/client puisque ce viewer
 * n'a pas accès à ces données par ailleurs (contrairement au pro qui les a via son dashboard). */
export interface QuoteViewerData extends Quote {
  professional: QuotePreviewProfessional;
  client: QuotePreviewClient;
  isDemandAuthor: boolean;
}

/** Réponse des endpoints déclenchant une signature YouTrust (`send`, `signature-link`) — `null` si
 * pas encore le tour du signataire concerné (cf. QuoteService.getClientSignatureLink backend). */
export interface SignatureLinkResult {
  signatureLink: string | null;
  isSandbox: boolean;
}

/** Données assemblées pour l'aperçu HTML du devis (quote-preview) : snapshot du brouillon en cours
 * d'édition + identité pro/client récupérées séparément. Sera réutilisée telle quelle pour
 * l'impression PDF finale (Playwright) une fois le devis signé. */
export interface QuotePreviewData {
  quoteNumber: string;
  createdAt: string;
  validUntil: string | null;
  professional: QuotePreviewProfessional;
  client: QuotePreviewClient;
  materialLines: QuoteMaterialLineItem[];
  laborLines: QuoteLineItem[];
  logisticsLines: QuoteLineItem[];
  nightWorkSurcharge: boolean | null;
  estimatedStartDate: string | null;
  estimatedEndDate: string | null;
  // Simple liste de noms : à ce stade, certains documents peuvent être sélectionnés localement et
  // pas encore uploadés (pas de fileKey), l'aperçu n'a de toute façon besoin que du nom affiché.
  documents: { name: string }[];
  remarks: string;
  decennaleInsurer: string;
  decennalePolicyNumber: string;
  decennaleCoverageArea: string;
  rcProInsurer: string;
  rcProPolicyNumber: string;
  klarnaAccepted: boolean;
  vatExempt: boolean;
}
