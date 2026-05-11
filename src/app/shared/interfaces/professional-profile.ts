import { Address } from './address';

export interface ProfessionalProfile {
  id: string;
  userId: string;
  managerPhone: string;
  professionalEmail: string;
  photoKey: string;
  idFrontKey: string;
  idBackKey: string;
  insuranceDocKey: string;
  insuranceName: string;
  insuranceNumber: string;
  insuranceExpiry: string;
  diplomaDocKey: string;
  companyLogoKey: string;
  companyName: string;
  workAddressId: string;
  workAddress: Address;
  siret: string;
  ribKey: string;
  trades: string[];
  yearsExperience: number;
  isCmod: boolean;
  onCall: boolean;
  openingHours: Record<string, unknown>;
  description: string;
  services: { id: string; description: string }[];
  trustedContactName?: string;
  trustedContactPhone?: string;
  suppliers: string[];
}
