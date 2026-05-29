export interface TradeInfo {
  slug: string;
  name: string;
  longName: string;
  isOnCall: boolean;
  image: string;
  metaTitle: (city: string) => string;
  metaDescription: (city: string) => string;
  h1: (city: string) => string;
  intro: (city: string) => string;
  keywords: (city: string) => string;
  i18nKey: string;
}
