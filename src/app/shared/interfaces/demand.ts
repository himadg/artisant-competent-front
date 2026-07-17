import { RoleType } from './user';

export type DemandStatus = 'AVAILABLE' | 'UNAVAILABLE' | 'CANCELLED';

export interface DemandAuthor {
  id: string;
  firstName: string;
  lastName: string;
  role: RoleType;
}

export interface DemandProfessional {
  id: string;
  companyName: string;
}

export interface DemandProfessionalWithLogo extends DemandProfessional {
  companyLogoKey: string;
}

export interface Demand {
  id: string;
  description: string;
  status: DemandStatus;
  createdAt: string;
  author: DemandAuthor;
  professionals: DemandProfessional[];
}

export interface DemandSummary extends Demand {
  photoKeys: string[];
}

export interface DemandDetail extends Omit<Demand, 'professionals'> {
  photoKeys: string[];
  photos: string[];
  professionals: DemandProfessionalWithLogo[];
}

export interface CreateDemandResponse {
  id: string;
}
