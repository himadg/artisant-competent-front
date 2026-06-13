import { Address } from './address';
import { Role } from './user';

export interface Trade { id: string; name: string; }

export interface OpeningHoursInterval { start: string; end: string; }
export interface OpeningHoursDay { day: string; closed: boolean; onCall: boolean; intervals: OpeningHoursInterval[]; }
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
  diplomas: { id: string; documentName: string; expiryDate: string; fileKey: string; url: string | null }[];
  ribKey: string;
  ribUrl: string | null;
  siret: string;
  companyStatus: 'COMPANY' | 'INDIVIDUAL';
  yearsExperience: number;
  isCmod: boolean;
  onCall: boolean;
  openingHours: OpeningHours | null;
  trustedContactName: string | null;
  trustedContactPhone: string | null;
  suppliers: string[];
  workAddress: Address;
  trades: Trade[];
  mediatorName?: string | null;
  mediatorAddress?: string | null;
  mediatorWebsite?: string | null;
  mediatorContactMethod?: string | null;
  mediatorAdditionalInfo?: string | null;
  additionalRemarks?: string | null;
  companyRemarks?: string | null;
}

export interface ProfessionalDashboardData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  birthDate: string;
  createdAt: string;
  status: 'PENDING_VALIDATION' | 'ACTIVE' | 'REJECTED';
  role: Role;
  address: Address;
  professionalProfile: ProfessionalProfile;
}
