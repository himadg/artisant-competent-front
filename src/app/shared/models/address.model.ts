export interface Address {
  id: string;
  streetNumber: string;
  streetName: string;
  additionalInfo?: string;
  postalCode: number;
  city: string;
  latitude: number;
  longitude: number;
}
