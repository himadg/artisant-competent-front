import { Address } from './address';

export type RoleType = 'DIRECTION' | 'ADMIN' | 'INDIVIDUAL' | 'PROFESSIONAL' | 'SUPPLIER';

export interface Role {
  id: string;
  code: RoleType;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  birthDate: string;
  createdAt: string;
  roleId: string;
  role: Role;
  addressId: string;
  address: Address;
  professionalProfile?: { id: string } | null;
}

// Utilisateur connecté (AuthService.currentUser) : forme minimale, identité + autorisation
// seulement — jamais les données métier complètes (nom, adresse...), chargées à la demande
// via les endpoints dashboard dédiés (IndividualDashboardData / ProfessionalDashboardData).
export type UserStatus = 'INCOMPLETE' | 'PENDING_VALIDATION' | 'ACTIVE' | 'REJECTED';

export interface AuthUser {
  id: string;
  email: string;
  status: UserStatus;
  role: { code: RoleType };
  professionalProfile?: { id: string } | null;
}

export interface PendingUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  role: { code: string };
  professionalProfile?: {
    companyName: string;
    workAddress: { city: string; postalCode: number };
  };
}
