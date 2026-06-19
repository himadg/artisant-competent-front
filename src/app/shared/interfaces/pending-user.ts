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
