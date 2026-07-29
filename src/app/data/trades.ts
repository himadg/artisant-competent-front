export type { TradeInfo } from '../shared/interfaces/trade-info';
import type { TradeInfo } from '../shared/interfaces/trade-info';

export const TRADES: TradeInfo[] = [
  {
    slug: 'electrician',
    i18nKey: 'electrician',
    name: 'Électricité & Appareils connectés',
    longName: 'Électricité & Appareils connectés (24/7)',
    isOnCall: true,
    image: 'assets/img/electricien.jpg',
    h1: (city) => `Électricien vérifié à ${city} — du devis à la mise sous tension encadrée`,
    intro: (city) =>
      `Les électriciens référencés sur Artisan Compétent à ${city} ont leur SIRET contrôlé, leurs assurances RC pro et décennale vérifiées, leur habilitation électrique NF C 18-510 pour les interventions sous tension et leur qualification IRVE pour la pose de bornes de recharge. Dépannage, tableau électrique, mise aux normes NF C 15-100, domotique, bornes IRVE : décrivez votre besoin et recevez un devis détaillé d'un professionnel vérifié de votre zone. Le paiement est encadré et traité par Stripe : le règlement est versé 96h après la fin du chantier, sans réserve de votre part.`,
  },
  {
    slug: 'locksmith',
    i18nKey: 'locksmith',
    name: 'Serrurier',
    longName: 'Serrurier (24/7)',
    isOnCall: true,
    image: 'assets/img/serrurier.jpg',
    h1: (city) => `Serrurier à ${city} — Urgence 24h/24 et 7j/7`,
    intro: (city) =>
      `Vous cherchez un serrurier de confiance à ${city} ? Que ce soit pour une urgence (porte claquée, serrure bloquée) ou pour renforcer la sécurité de votre logement, Artisan Compétent vous connecte instantanément avec des serruriers qualifiés près de chez vous. Tarifs transparents, paiement sécurisé, zéro mauvaise surprise.`,
  },
  {
    slug: 'plumber-sanitary',
    i18nKey: 'plumberSanitary',
    name: 'Plombier sanitaire',
    longName: 'Plombier sanitaire (24/7)',
    isOnCall: true,
    image: 'assets/img/plombier.jpg',
    h1: (city) => `Plombier à ${city} — Dépannage rapide et sécurisé`,
    intro: (city) =>
      `Une fuite d'eau, un robinet défaillant ou une installation sanitaire à réaliser à ${city} ? Artisan Compétent vous met en relation avec des plombiers qualifiés disponibles rapidement. Comparez les propositions, choisissez le meilleur rapport qualité/prix et bénéficiez de notre paiement encadré : vous ne payez que si les travaux sont conformes.`,
  },
  {
    slug: 'heating',
    i18nKey: 'heating',
    name: 'Chauffagiste & VMC & Pompe à chaleur',
    longName: 'Chauffagiste & VMC & Pompe à chaleur',
    isOnCall: true,
    image: 'assets/img/chauffagiste.jpg',
    h1: (city) => `Chauffagiste & VMC & Pompe à chaleur à ${city}`,
    intro: (city) =>
      `Besoin d'un chauffagiste compétent à ${city} ? Qu'il s'agisse d'installer une nouvelle chaudière, d'entretenir votre VMC, de poser une pompe à chaleur ou de réparer un système de chauffage en panne, Artisan Compétent vous met en contact avec des professionnels certifiés. Intervention rapide, garantie de résultat, paiement encadré.`,
  },
  {
    slug: 'drain-unblocker',
    i18nKey: 'drainUnblocker',
    name: 'Déboucheur de canalisations',
    longName: 'Déboucheur de canalisations (24/7)',
    isOnCall: true,
    image: 'assets/img/deboucheur-canalisation.jpg',
    h1: (city) => `Débouchage de canalisation à ${city} — Intervention rapide`,
    intro: (city) =>
      `Un évier bouché, des toilettes obstruées ou une canalisation engorgée à ${city} ? Artisan Compétent vous connecte avec des techniciens en débouchage disponibles rapidement. Avec des outils professionnels et un savoir-faire éprouvé, votre problème est résolu efficacement. Paiement sécurisé et libéré uniquement après votre accord.`,
  },
  {
    slug: 'hvac',
    i18nKey: 'hvac',
    name: 'Technicien climatisation & Frigoriste',
    longName: 'Technicien climatisation & Frigoriste',
    isOnCall: false,
    image: 'assets/img/installeur-clim.jpg',
    h1: (city) => `Technicien climatisation & Frigoriste à ${city}`,
    intro: (city) =>
      `Vous souhaitez installer ou faire réparer votre système de climatisation à ${city} ? Artisan Compétent vous connecte avec des techniciens frigoristes qualifiés RGE, maîtrisant les normes en vigueur. Mise en service, entretien préventif ou réparation d'urgence : recevez plusieurs devis et choisissez en toute transparence.`,
  },
  {
    slug: 'glazier',
    i18nKey: 'glazier',
    name: 'Vitrerie & Miroiterie',
    longName: 'Vitrerie & Miroiterie',
    isOnCall: false,
    image: 'assets/img/vitrier.jpg',
    h1: (city) => `Vitrerie & Miroiterie à ${city}`,
    intro: (city) =>
      `Pour tous vos travaux de vitrerie et miroiterie à ${city} — remplacement de vitrage, pose de miroirs, verrières, fenêtres — Artisan Compétent vous met en relation avec des artisans qualifiés. Finitions soignées et durabilité garanties. Comparez les devis et bénéficiez de notre paiement sécurisé.`,
  },
  {
    slug: 'pest-control',
    i18nKey: 'pestControl',
    name: 'Traitement anti-nuisibles',
    longName: 'Traitement anti-nuisibles (rongeurs, punaises...)',
    isOnCall: false,
    image: 'assets/img/anti-nuisibles.jpg',
    h1: (city) => `Traitement anti-nuisibles à ${city} — Intervention rapide`,
    intro: (city) =>
      `Une infestation de rongeurs, punaises de lit, cafards ou guêpes à ${city} ? Artisan Compétent vous met en relation avec des techniciens en traitement des nuisibles certifiés. Identification de la source, traitement adapté et prévention des récidives. Intervention rapide, efficace et discrète. Paiement sécurisé — libéré après validation.`,
  },
];

export const TRADES_MAP = new Map<string, TradeInfo>(TRADES.map((t) => [t.slug, t]));

export function getTrade(slug: string): TradeInfo | undefined {
  return TRADES_MAP.get(slug);
}
