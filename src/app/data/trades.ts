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
    metaTitle: (city) => `Électricien vérifié à ${city} — SIRET, NF C 18-510, séquestre Stripe | Artisan Compétent`,
    metaDescription: (city) =>
      `Électricien vérifié à ${city} : SIRET contrôlé, RC pro et décennale à jour, habilitation NF C 18-510, qualification IRVE pour bornes de recharge. Paiement encadré par séquestre Stripe — fonds libérés 96h après le chantier.`,
    h1: (city) => `Électricien vérifié à ${city} — du devis à la mise sous tension encadrée`,
    intro: (city) =>
      `Les électriciens référencés sur Artisan Compétent à ${city} ont leur SIRET contrôlé, leurs assurances RC pro et décennale vérifiées, leur habilitation électrique NF C 18-510 pour les interventions sous tension et leur qualification IRVE pour la pose de bornes de recharge. Dépannage, tableau électrique, mise aux normes NF C 15-100, domotique, bornes IRVE : décrivez votre besoin et recevez un devis détaillé d'un professionnel vérifié de votre zone. Le paiement est encadré par séquestre Stripe — les fonds sont libérés 96h après la fin du chantier, sans réserve de votre part.`,
    keywords: (city) =>
      `électricien vérifié ${city}, habilitation NF C 18-510 ${city}, borne recharge IRVE ${city}, domotique ${city}, mise aux normes NF C 15-100 ${city}`,
  },
  {
    slug: 'locksmith',
    i18nKey: 'locksmith',
    name: 'Serrurier',
    longName: 'Serrurier (24/7)',
    isOnCall: true,
    image: 'assets/img/serrurier.jpg',
    metaTitle: (city) => `Serrurier à ${city} — Urgence 24h/24 | Artisan Compétent`,
    metaDescription: (city) =>
      `Serrurier disponible 24h/24 à ${city}. Porte claquée, serrure forcée, changement de serrure : intervention rapide et tarif juste. Paiement sécurisé sur Artisan Compétent.`,
    h1: (city) => `Serrurier à ${city} — Urgence 24h/24 et 7j/7`,
    intro: (city) =>
      `Vous cherchez un serrurier de confiance à ${city} ? Que ce soit pour une urgence (porte claquée, serrure bloquée) ou pour renforcer la sécurité de votre logement, Artisan Compétent vous connecte instantanément avec des serruriers qualifiés près de chez vous. Tarifs transparents, paiement sécurisé, zéro mauvaise surprise.`,
    keywords: (city) =>
      `serrurier ${city}, serrurier urgence ${city}, porte claquée ${city}, changement serrure ${city}`,
  },
  {
    slug: 'plumber-sanitary',
    i18nKey: 'plumberSanitary',
    name: 'Plombier sanitaire',
    longName: 'Plombier sanitaire (24/7)',
    isOnCall: true,
    image: 'assets/img/plombier.jpg',
    metaTitle: (city) => `Plombier à ${city} — Dépannage urgent | Artisan Compétent`,
    metaDescription: (city) =>
      `Trouvez un plombier qualifié à ${city} pour une fuite, une installation sanitaire ou un dépannage d'urgence. Devis gratuit, paiement sécurisé, disponible 24h/24.`,
    h1: (city) => `Plombier à ${city} — Dépannage rapide et sécurisé`,
    intro: (city) =>
      `Une fuite d'eau, un robinet défaillant ou une installation sanitaire à réaliser à ${city} ? Artisan Compétent vous met en relation avec des plombiers qualifiés disponibles rapidement. Comparez les propositions, choisissez le meilleur rapport qualité/prix et bénéficiez de notre paiement séquestré — vous ne payez que si les travaux sont conformes.`,
    keywords: (city) => `plombier ${city}, dépannage plomberie ${city}, fuite d'eau ${city}, plombier urgence ${city}`,
  },
  {
    slug: 'heating',
    i18nKey: 'heating',
    name: 'Chauffagiste & VMC & Pompe à chaleur',
    longName: 'Chauffagiste & VMC & Pompe à chaleur',
    isOnCall: true,
    image: 'assets/img/chauffagiste.jpg',
    metaTitle: (city) => `Chauffagiste & VMC & Pompe à chaleur à ${city} | Artisan Compétent`,
    metaDescription: (city) =>
      `Chauffagiste qualifié à ${city} pour l'installation, l'entretien ou la réparation de votre chaudière, VMC ou pompe à chaleur. Devis gratuit et paiement sécurisé.`,
    h1: (city) => `Chauffagiste & VMC & Pompe à chaleur à ${city}`,
    intro: (city) =>
      `Besoin d'un chauffagiste compétent à ${city} ? Qu'il s'agisse d'installer une nouvelle chaudière, d'entretenir votre VMC, de poser une pompe à chaleur ou de réparer un système de chauffage en panne, Artisan Compétent vous met en contact avec des professionnels certifiés. Intervention rapide, garantie de résultat, paiement séquestré.`,
    keywords: (city) => `chauffagiste ${city}, VMC ${city}, pompe à chaleur ${city}, entretien chaudière ${city}`,
  },
  {
    slug: 'drain-unblocker',
    i18nKey: 'drainUnblocker',
    name: 'Déboucheur de canalisations',
    longName: 'Déboucheur de canalisations (24/7)',
    isOnCall: true,
    image: 'assets/img/deboucheur-canalisation.jpg',
    metaTitle: (city) => `Déboucheur de canalisation à ${city} — Urgent | Artisan Compétent`,
    metaDescription: (city) =>
      `Canalisation bouchée à ${city} ? Intervention urgente d'un déboucheur qualifié. Évier, WC, canalisation engorgée : résolu rapidement avec paiement sécurisé.`,
    h1: (city) => `Débouchage de canalisation à ${city} — Intervention rapide`,
    intro: (city) =>
      `Un évier bouché, des toilettes obstruées ou une canalisation engorgée à ${city} ? Artisan Compétent vous connecte avec des techniciens en débouchage disponibles rapidement. Avec des outils professionnels et un savoir-faire éprouvé, votre problème est résolu efficacement. Paiement sécurisé et libéré uniquement après votre accord.`,
    keywords: (city) =>
      `débouchage canalisation ${city}, plombier déboucheur ${city}, canalisation bouchée ${city}, WC bouché ${city}`,
  },
  {
    slug: 'hvac',
    i18nKey: 'hvac',
    name: 'Technicien climatisation & Frigoriste',
    longName: 'Technicien climatisation & Frigoriste',
    isOnCall: false,
    image: 'assets/img/installeur-clim.jpg',
    metaTitle: (city) => `Technicien climatisation & Frigoriste à ${city} | Artisan Compétent`,
    metaDescription: (city) =>
      `Technicien climatisation et frigoriste à ${city}. Installation, entretien et réparation de climatisation. Devis gratuit, artisans certifiés, paiement sécurisé.`,
    h1: (city) => `Technicien climatisation & Frigoriste à ${city}`,
    intro: (city) =>
      `Vous souhaitez installer ou faire réparer votre système de climatisation à ${city} ? Artisan Compétent vous connecte avec des techniciens frigoristes qualifiés RGE, maîtrisant les normes en vigueur. Mise en service, entretien préventif ou réparation d'urgence : recevez plusieurs devis et choisissez en toute transparence.`,
    keywords: (city) =>
      `technicien climatisation ${city}, frigoriste ${city}, installation climatisation ${city}, réparation climatisation ${city}`,
  },
  {
    slug: 'glazier',
    i18nKey: 'glazier',
    name: 'Vitrerie & Miroiterie',
    longName: 'Vitrerie & Miroiterie',
    isOnCall: false,
    image: 'assets/img/vitrier.jpg',
    metaTitle: (city) => `Vitrerie & Miroiterie à ${city} — Devis gratuit | Artisan Compétent`,
    metaDescription: (city) =>
      `Vitrier et miroitier qualifié à ${city} pour vos vitrages, miroirs, fenêtres et verrières. Devis gratuit, paiement sécurisé sur Artisan Compétent.`,
    h1: (city) => `Vitrerie & Miroiterie à ${city}`,
    intro: (city) =>
      `Pour tous vos travaux de vitrerie et miroiterie à ${city} — remplacement de vitrage, pose de miroirs, verrières, fenêtres — Artisan Compétent vous met en relation avec des artisans qualifiés. Finitions soignées et durabilité garanties. Comparez les devis et bénéficiez de notre paiement sécurisé.`,
    keywords: (city) => `vitrier ${city}, miroitier ${city}, remplacement vitrage ${city}, pose miroir ${city}`,
  },
  {
    slug: 'pest-control',
    i18nKey: 'pestControl',
    name: 'Traitement anti-nuisibles',
    longName: 'Traitement anti-nuisibles (rongeurs, punaises...)',
    isOnCall: false,
    image: 'assets/img/anti-nuisibles.jpg',
    metaTitle: (city) => `Traitement anti-nuisibles à ${city} — Rongeurs, punaises | Artisan Compétent`,
    metaDescription: (city) =>
      `Spécialiste en traitement des nuisibles à ${city}. Rongeurs, punaises de lit, cafards, guêpes : intervention rapide et efficace. Paiement sécurisé sur Artisan Compétent.`,
    h1: (city) => `Traitement anti-nuisibles à ${city} — Intervention rapide`,
    intro: (city) =>
      `Une infestation de rongeurs, punaises de lit, cafards ou guêpes à ${city} ? Artisan Compétent vous met en relation avec des techniciens en traitement des nuisibles certifiés. Identification de la source, traitement adapté et prévention des récidives. Intervention rapide, efficace et discrète. Paiement sécurisé — libéré après validation.`,
    keywords: (city) => `nuisibles ${city}, dératisation ${city}, punaises de lit ${city}, désinsectisation ${city}`,
  },
];

export const TRADES_MAP = new Map<string, TradeInfo>(TRADES.map((t) => [t.slug, t]));

export function getTrade(slug: string): TradeInfo | undefined {
  return TRADES_MAP.get(slug);
}
