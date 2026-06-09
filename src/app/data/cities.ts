export type { City } from '../shared/interfaces/city';
import type { City } from '../shared/interfaces/city';

export const CITIES: City[] = [
  // Paris & Île-de-France (toutes < 25 km)
  { slug: 'paris', name: 'Paris', region: 'Île-de-France', nearbyCities: ['versailles', 'boulogne-billancourt', 'nanterre', 'montreuil', 'saint-denis', 'creteil'] },
  { slug: 'versailles', name: 'Versailles', region: 'Île-de-France', nearbyCities: ['paris', 'boulogne-billancourt', 'nanterre'] },
  { slug: 'boulogne-billancourt', name: 'Boulogne-Billancourt', region: 'Île-de-France', nearbyCities: ['paris', 'versailles', 'nanterre'] },
  { slug: 'nanterre', name: 'Nanterre', region: 'Île-de-France', nearbyCities: ['paris', 'boulogne-billancourt', 'versailles'] },
  { slug: 'montreuil', name: 'Montreuil', region: 'Île-de-France', nearbyCities: ['paris', 'saint-denis', 'creteil'] },
  { slug: 'saint-denis', name: 'Saint-Denis', region: 'Île-de-France', nearbyCities: ['paris', 'montreuil', 'nanterre'] },
  { slug: 'creteil', name: 'Créteil', region: 'Île-de-France', nearbyCities: ['paris', 'montreuil', 'vincennes'] },
  { slug: 'vincennes', name: 'Vincennes', region: 'Île-de-France', nearbyCities: ['paris', 'creteil', 'montreuil'] },

  // Lyon & environs (toutes < 15 km)
  // Écully (~8 km) et Saint-Étienne (~60 km) retirés : non définis ou hors périmètre
  { slug: 'lyon', name: 'Lyon', region: 'Auvergne-Rhône-Alpes', nearbyCities: ['villeurbanne', 'venissieux', 'caluire-et-cuire', 'bron', 'decines-charpieu'] },
  { slug: 'villeurbanne', name: 'Villeurbanne', region: 'Auvergne-Rhône-Alpes', nearbyCities: ['lyon', 'caluire-et-cuire', 'bron'] },
  { slug: 'venissieux', name: 'Vénissieux', region: 'Auvergne-Rhône-Alpes', nearbyCities: ['lyon', 'bron'] },
  { slug: 'caluire-et-cuire', name: 'Caluire-et-Cuire', region: 'Auvergne-Rhône-Alpes', nearbyCities: ['lyon', 'villeurbanne'] },
  { slug: 'bron', name: 'Bron', region: 'Auvergne-Rhône-Alpes', nearbyCities: ['lyon', 'villeurbanne', 'venissieux'] },
  { slug: 'decines-charpieu', name: 'Décines-Charpieu', region: 'Auvergne-Rhône-Alpes', nearbyCities: ['lyon', 'bron', 'villeurbanne'] },

  // Marseille & environs (toutes < 45 km)
  // Istres (~45 km, non défini) retiré
  { slug: 'marseille', name: 'Marseille', region: 'Provence-Alpes-Côte d\'Azur', nearbyCities: ['aix-en-provence', 'aubagne', 'martigues', 'vitrolles'] },
  { slug: 'aix-en-provence', name: 'Aix-en-Provence', region: 'Provence-Alpes-Côte d\'Azur', nearbyCities: ['marseille', 'aubagne', 'vitrolles'] },
  { slug: 'aubagne', name: 'Aubagne', region: 'Provence-Alpes-Côte d\'Azur', nearbyCities: ['marseille', 'aix-en-provence'] },
  { slug: 'martigues', name: 'Martigues', region: 'Provence-Alpes-Côte d\'Azur', nearbyCities: ['marseille', 'vitrolles'] },
  { slug: 'vitrolles', name: 'Vitrolles', region: 'Provence-Alpes-Côte d\'Azur', nearbyCities: ['marseille', 'aix-en-provence', 'martigues'] },

  // Toulouse & environs (toutes < 20 km)
  // Labège (~10 km) retiré : non défini dans les villes
  { slug: 'toulouse', name: 'Toulouse', region: 'Occitanie', nearbyCities: ['blagnac', 'colomiers', 'tournefeuille', 'cugnaux'] },
  { slug: 'blagnac', name: 'Blagnac', region: 'Occitanie', nearbyCities: ['toulouse', 'colomiers'] },
  { slug: 'colomiers', name: 'Colomiers', region: 'Occitanie', nearbyCities: ['toulouse', 'blagnac', 'tournefeuille'] },
  { slug: 'tournefeuille', name: 'Tournefeuille', region: 'Occitanie', nearbyCities: ['toulouse', 'colomiers'] },
  { slug: 'cugnaux', name: 'Cugnaux', region: 'Occitanie', nearbyCities: ['toulouse', 'tournefeuille'] },

  // Nice & environs (toutes < 35 km)
  { slug: 'nice', name: 'Nice', region: 'Provence-Alpes-Côte d\'Azur', nearbyCities: ['antibes', 'cannes', 'cagnes-sur-mer', 'grasse', 'menton'] },
  { slug: 'antibes', name: 'Antibes', region: 'Provence-Alpes-Côte d\'Azur', nearbyCities: ['nice', 'cannes', 'cagnes-sur-mer'] },
  // Fréjus (~35 km de Cannes) ajouté ici ; Nice→Fréjus ~65 km retiré
  { slug: 'cannes', name: 'Cannes', region: 'Provence-Alpes-Côte d\'Azur', nearbyCities: ['nice', 'antibes', 'grasse', 'frejus'] },
  { slug: 'cagnes-sur-mer', name: 'Cagnes-sur-Mer', region: 'Provence-Alpes-Côte d\'Azur', nearbyCities: ['nice', 'antibes'] },
  { slug: 'grasse', name: 'Grasse', region: 'Provence-Alpes-Côte d\'Azur', nearbyCities: ['nice', 'cannes'] },
  { slug: 'menton', name: 'Menton', region: 'Provence-Alpes-Côte d\'Azur', nearbyCities: ['nice'] },

  // Bordeaux & environs (toutes < 15 km)
  // Le Bouscat (~6 km) retiré : non défini dans les villes
  { slug: 'bordeaux', name: 'Bordeaux', region: 'Nouvelle-Aquitaine', nearbyCities: ['merignac', 'pessac', 'talence', 'begles'] },
  { slug: 'merignac', name: 'Mérignac', region: 'Nouvelle-Aquitaine', nearbyCities: ['bordeaux', 'pessac'] },
  { slug: 'pessac', name: 'Pessac', region: 'Nouvelle-Aquitaine', nearbyCities: ['bordeaux', 'merignac', 'talence'] },
  { slug: 'talence', name: 'Talence', region: 'Nouvelle-Aquitaine', nearbyCities: ['bordeaux', 'pessac', 'begles'] },
  { slug: 'begles', name: 'Bègles', region: 'Nouvelle-Aquitaine', nearbyCities: ['bordeaux', 'talence'] },

  // Nantes & environs (toutes < 10 km)
  // Saint-Nazaire (~58 km) et Vertou (non défini) retirés
  { slug: 'nantes', name: 'Nantes', region: 'Pays de la Loire', nearbyCities: ['saint-herblain', 'reze', 'orvault'] },
  { slug: 'saint-herblain', name: 'Saint-Herblain', region: 'Pays de la Loire', nearbyCities: ['nantes', 'orvault'] },
  { slug: 'reze', name: 'Rezé', region: 'Pays de la Loire', nearbyCities: ['nantes'] },
  { slug: 'orvault', name: 'Orvault', region: 'Pays de la Loire', nearbyCities: ['nantes', 'saint-herblain'] },
  // Saint-Nazaire isolée (~58 km de Nantes)
  { slug: 'saint-nazaire', name: 'Saint-Nazaire', region: 'Pays de la Loire', nearbyCities: [] },

  // Strasbourg & environs (toutes < 30 km)
  // Obernai (~28 km, non défini) retiré
  { slug: 'strasbourg', name: 'Strasbourg', region: 'Grand Est', nearbyCities: ['schiltigheim', 'illkirch-graffenstaden', 'haguenau'] },
  { slug: 'schiltigheim', name: 'Schiltigheim', region: 'Grand Est', nearbyCities: ['strasbourg', 'illkirch-graffenstaden'] },
  { slug: 'illkirch-graffenstaden', name: 'Illkirch-Graffenstaden', region: 'Grand Est', nearbyCities: ['strasbourg', 'schiltigheim'] },
  { slug: 'haguenau', name: 'Haguenau', region: 'Grand Est', nearbyCities: ['strasbourg'] },

  // Montpellier & environs
  // Nîmes (~53 km), Béziers (~75 km) et Lunel (non défini) retirés de Montpellier
  { slug: 'montpellier', name: 'Montpellier', region: 'Occitanie', nearbyCities: ['sete'] },
  { slug: 'sete', name: 'Sète', region: 'Occitanie', nearbyCities: ['montpellier'] },
  // Nîmes et Béziers : villes isolées (aucune voisine dans la DB à < 50 km)
  { slug: 'nimes', name: 'Nîmes', region: 'Occitanie', nearbyCities: [] },
  { slug: 'beziers', name: 'Béziers', region: 'Occitanie', nearbyCities: [] },

  // Lille & environs (toutes < 15 km)
  // Dunkerque (~75 km) et Arras (~55 km, non défini) retirés
  { slug: 'lille', name: 'Lille', region: 'Hauts-de-France', nearbyCities: ['roubaix', 'tourcoing', 'villeneuve-dascq'] },
  { slug: 'roubaix', name: 'Roubaix', region: 'Hauts-de-France', nearbyCities: ['lille', 'tourcoing', 'villeneuve-dascq'] },
  { slug: 'tourcoing', name: 'Tourcoing', region: 'Hauts-de-France', nearbyCities: ['lille', 'roubaix'] },
  { slug: 'villeneuve-dascq', name: 'Villeneuve-d\'Ascq', region: 'Hauts-de-France', nearbyCities: ['lille', 'roubaix'] },
  // Dunkerque isolée (~75 km de Lille)
  { slug: 'dunkerque', name: 'Dunkerque', region: 'Hauts-de-France', nearbyCities: [] },

  // Bretagne — villes trop éloignées les unes des autres (> 50 km entre chacune)
  { slug: 'rennes', name: 'Rennes', region: 'Bretagne', nearbyCities: [] },
  { slug: 'brest', name: 'Brest', region: 'Bretagne', nearbyCities: [] },
  { slug: 'saint-malo', name: 'Saint-Malo', region: 'Bretagne', nearbyCities: [] },
  { slug: 'vannes', name: 'Vannes', region: 'Bretagne', nearbyCities: [] },
  { slug: 'lorient', name: 'Lorient', region: 'Bretagne', nearbyCities: [] },

  // Grenoble & environs (toutes < 8 km)
  // Voiron (~28 km, non défini) retiré
  { slug: 'grenoble', name: 'Grenoble', region: 'Auvergne-Rhône-Alpes', nearbyCities: ['echirolles', 'saint-martin-dheres'] },
  { slug: 'echirolles', name: 'Échirolles', region: 'Auvergne-Rhône-Alpes', nearbyCities: ['grenoble', 'saint-martin-dheres'] },
  { slug: 'saint-martin-dheres', name: 'Saint-Martin-d\'Hères', region: 'Auvergne-Rhône-Alpes', nearbyCities: ['grenoble', 'echirolles'] },

  // Toulon & environs (toutes < 25 km)
  // Fréjus (~68 km) retiré
  { slug: 'toulon', name: 'Toulon', region: 'Provence-Alpes-Côte d\'Azur', nearbyCities: ['la-seyne-sur-mer', 'hyeres'] },
  { slug: 'la-seyne-sur-mer', name: 'La Seyne-sur-Mer', region: 'Provence-Alpes-Côte d\'Azur', nearbyCities: ['toulon', 'hyeres'] },
  { slug: 'hyeres', name: 'Hyères', region: 'Provence-Alpes-Côte d\'Azur', nearbyCities: ['toulon', 'la-seyne-sur-mer'] },
  // Fréjus rattaché à Cannes (~35 km) ; Toulon (~68 km) et Nice (~65 km) retirés
  { slug: 'frejus', name: 'Fréjus', region: 'Provence-Alpes-Côte d\'Azur', nearbyCities: ['cannes'] },

  // Saint-Étienne — aucune ville voisine dans la DB à < 50 km
  // Lyon (~60 km), Vénissieux (~55 km) et Roanne (~75 km) retirés
  { slug: 'saint-etienne', name: 'Saint-Étienne', region: 'Auvergne-Rhône-Alpes', nearbyCities: [] },
  { slug: 'roanne', name: 'Roanne', region: 'Auvergne-Rhône-Alpes', nearbyCities: [] },
];

export const CITIES_MAP = new Map<string, City>(CITIES.map(c => [c.slug, c]));

export function getCity(slug: string): City | undefined {
  return CITIES_MAP.get(slug);
}

export function getAllCities() {
  return CITIES.map((c) => c.slug);
}
