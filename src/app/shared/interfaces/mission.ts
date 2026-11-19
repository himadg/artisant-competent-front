export type MissionStatus = 'IN_PROGRESS' | 'DISPUTED' | 'STOPPED' | 'AWAITING_PAYMENT' | 'COMPLETED';

export interface MissionSummary {
  id: string;
  reference: string;
  status: MissionStatus;
  createdAt: string;
  demand: { description: string };
}

export interface MissionDetail {
  id: string;
  reference: string;
  status: MissionStatus;
  createdAt: string;
  completionReportKey: string | null;
  invoiceKey: string | null;
  demand: {
    id: string;
    description: string;
    photoKeys: string[];
    address: unknown;
    trade: { id: string; name: string };
    individualProfile:
      | { photoKey: string | null; user: { firstName: string; lastName: string; email: string } }
      | null;
    professionalProfile:
      | {
          companyName: string;
          companyLogoKey: string | null;
          user: { firstName: string; lastName: string; email: string };
        }
      | null;
  };
  quote: {
    id: string;
    quoteNumber: string;
    status: string;
  };
  conversation: {
    id: string;
    recipientProfessionalProfile: {
      id: string;
      companyName: string;
      companyLogoKey: string | null;
      managerPhone: string;
      user: { firstName: string; lastName: string };
    };
  };
  cmodProfile: { id: string; companyName: string; user: { firstName: string; lastName: string } } | null;
}

export interface MissionFollowUpEntry {
  id: string;
  missionId: string;
  date: string | null;
  note: string | null;
  photoKeys: string[];
  photos: { key: string; url: string }[];
  authorUserId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MissionDocumentAttachment {
  key?: string;
  id?: string;
  type?: string;
  createdAt?: string;
  url: string | null;
}

export interface MissionDocuments {
  completionReportUrl: string | null;
  invoiceUrl: string | null;
  quoteSignedPdfUrl: string | null;
  demandPhotos: MissionDocumentAttachment[];
  messageAttachments: MissionDocumentAttachment[];
}
