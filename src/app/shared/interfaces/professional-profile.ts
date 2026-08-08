import { Address } from './address';

export interface OpeningHoursInterval {
  start: string;
  end: string;
}

export interface OpeningHoursDay {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  closed: boolean;
  onCall: boolean;
  intervals: OpeningHoursInterval[];
}

export interface OpeningHours {
  timezone?: string;
  days: OpeningHoursDay[];
}

export interface ProfessionalProfile {
  id: string;
  userId: string;
  managerPhone: string;
  professionalEmail: string;
  photoKey: string;
  idFrontKey: string;
  idBackKey: string;
  diplomas: { id: string; documentName: string; expiryDate: string; fileKey: string }[];
  companyLogoKey: string;
  companyName: string;
  workAddressId: string;
  workAddress: Address;
  siret: string;
  companyStatus: 'COMPANY' | 'INDIVIDUAL';
  ribKey: string;
  trades: string[];
  yearsExperience: number;
  isCmod: boolean;
  onCall: boolean;
  openingHours: OpeningHours;
  description: string;
  trustedContactName?: string;
  trustedContactPhone?: string;
  suppliers: string[];
}

export interface ProfessionalSearchResult extends Omit<ProfessionalProfile, 'trades'> {
  distance: number;
  trades: { id: string; name: string }[];
}
