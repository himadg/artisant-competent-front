export interface TradeInfo {
  slug: string;
  name: string;
  longName: string;
  isOnCall: boolean;
  image: string;
  h1: (city: string) => string;
  intro: (city: string) => string;
  i18nKey: string;
}
