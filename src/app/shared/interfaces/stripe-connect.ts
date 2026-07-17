export interface StripeConnectAccount {
  accountId: string;
  created: boolean;
}

export interface StripeConnectStatus {
  hasAccount: boolean;
  detailsSubmitted: boolean;
  transfersEnabled: boolean;
  payoutsEnabled: boolean;
  lastSyncedAt: string | null;
}
