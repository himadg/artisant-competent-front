export interface SupplierProfile {
  id: string;
  userId: string;
  companyName: string;
  logo: string;
  openingHours: Record<string, unknown>;
  siret: string;
  ribKey: string;
  services: string[];
}
