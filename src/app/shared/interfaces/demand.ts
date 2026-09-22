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

/** Avant paiement du devis (liste des demandes, aperçu du devis) : seules city/postalCode sont
 * exposées au pro — jamais la rue ni les coordonnées, tant que le client n'a pas payé. */
export interface DemandAddressHidden {
  kind: 'hidden';
  city: string;
  postalCode: string;
}

/** Une fois le devis payé : adresse complète révélée dans le devis final, mais sans les
 * coordonnées (latitude/longitude ne servent qu'en interne — carte, calcul de distance — jamais
 * exposées à l'utilisateur). */
export interface DemandAddressFull {
  kind: 'full';
  label: string;
  streetNumber: string;
  streetName: string;
  postalCode: string;
  city: string;
}

export type DemandAddress = DemandAddressHidden | DemandAddressFull;

export interface Demand {
  id: string;
  description: string;
  status: DemandStatus;
  createdAt: string;
  address: DemandAddress | null;
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
