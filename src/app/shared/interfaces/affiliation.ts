import { User } from "./user";

export interface AffiliationReferral {
  id: string;
  affiliateFirstName: string;
  affiliateLastName: string;
  affiliateRole: 'INDIVIDUAL' | 'PROFESSIONAL';
  status: 'PENDING' | 'ACTIVE' | 'EXPIRED';
  createdAt: string;
  expiresAt: string | null;
  commissionsCount: number;
  commissionsTotal: number;
}

export interface AffiliationDashboard {
  affiliateCode: string | null;
  totalReferrals: number;
  activeReferrals: number;
  totalEarned: number;
  pendingEarnings: number;
  referrals: AffiliationReferral[];
  myReferrer: User | null;
}
