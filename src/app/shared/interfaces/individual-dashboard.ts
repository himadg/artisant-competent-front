import { Address } from './address';
import { Role } from './user';

export interface IndividualProfileWithUrls {
  id: string;
  userId: string;
  phone: string;
  photoKey: string | null;
  idFrontKey: string | null;
  idBackKey: string | null;
  ribKey: string | null;
  offersServices: boolean;
  trades: string[];
  photoUrl: string | null;
  idFrontUrl: string | null;
  idBackUrl: string | null;
  ribUrl: string | null;
}

export interface IndividualDashboardData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  birthDate: string;
  createdAt: string;
  role: Role;
  address: Address;
  individualProfile: IndividualProfileWithUrls;
}
