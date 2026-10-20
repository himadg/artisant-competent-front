export interface StripeConnectAccount {
  accountId: string;
  created: boolean;
}

export interface StripeConnectStatus {
  detailsSubmitted: boolean;
  transfersEnabled: boolean;
  payoutsEnabled: boolean;
}
