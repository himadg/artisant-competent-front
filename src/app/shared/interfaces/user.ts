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
