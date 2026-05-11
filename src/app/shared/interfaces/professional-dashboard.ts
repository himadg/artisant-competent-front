import { Address } from './address';
import { Role } from './user';

export interface Trade { id: string; name: string; }
export interface Service { id: string; description: string; }

export interface OpeningHoursInterval { start: string; end: string; }
export interface OpeningHoursDay { day: string; closed: boolean; intervals: OpeningHoursInterval[]; }
export interface OpeningHours { days: OpeningHoursDay[]; }

export interface ProfessionalProfile {
  companyName: string;
  description: string;
  managerPhone: string;
  professionalEmail: string | null;
  photoKey: string;
  photoUrl: string | null;
  companyLogoKey: string;
  logoUrl: string | null;
  idFrontKey: string;
  idFrontUrl: string | null;
  idBackKey: string;
  idBackUrl: string | null;
  insuranceDocKey: string;
  insuranceDocUrl: string | null;
  diplomaDocKey: string;
  diplomaDocUrl: string | null;
  ribKey: string;
  ribUrl: string | null;
  insuranceName: string;
  insuranceNumber: string;
  insuranceExpiry: string;
  siret: string;
  yearsExperience: number;
  isCmod: boolean;
  onCall: boolean;
  openingHours: OpeningHours | null;
  trustedContactName: string | null;
  trustedContactPhone: string | null;
  suppliers: string[];
  workAddress: Address;
  trades: Trade[];
  services: Service[];
}

export interface ProfessionalDashboardData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  birthDate: string;
  createdAt: string;
  role: Role;
  address: Address;
  professionalProfile: ProfessionalProfile;
}
