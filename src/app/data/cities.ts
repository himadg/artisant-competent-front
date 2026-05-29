export type { City } from '../shared/interfaces/city';
import type { City } from '../shared/interfaces/city';

export const CITIES: City[] = [
  // Paris & Île-de-France
  { slug: 'paris', name: 'Paris', region: 'Île-de-France', nearbyCities: ['versailles', 'boulogne-billancourt', 'nanterre', 'montreuil', 'saint-denis', 'creteil'] },
  { slug: 'versailles', name: 'Versailles', region: 'Île-de-France', nearbyCities: ['paris', 'boulogne-billancourt', 'nanterre'] },
  { slug: 'boulogne-billancourt', name: 'Boulogne-Billancourt', region: 'Île-de-France', nearbyCities: ['paris', 'versailles', 'nanterre'] },
  { slug: 'nanterre', name: 'Nanterre', region: 'Île-de-France', nearbyCities: ['paris', 'boulogne-billancourt', 'versailles'] },
  { slug: 'montreuil', name: 'Montreuil', region: 'Île-de-France', nearbyCities: ['paris', 'saint-denis', 'creteil'] },
  { slug: 'saint-denis', name: 'Saint-Denis', region: 'Île-de-France', nearbyCities: ['paris', 'montreuil', 'nanterre'] },
  { slug: 'creteil', name: 'Créteil', region: 'Île-de-France', nearbyCities: ['paris', 'montreuil', 'vincennes'] },
  { slug: 'vincennes', name: 'Vincennes', region: 'Île-de-France', nearbyCities: ['paris', 'creteil', 'montreuil'] },

  // Lyon & environs
  { slug: 'lyon', name: 'Lyon', region: 'Auvergne-Rhône-Alpes', nearbyCities: ['villeurbanne', 'venissieux', 'caluire-et-cuire', 'bron', 'decines-charpieu', 'ecully'] },
  { slug: 'villeurbanne', name: 'Villeurbanne', region: 'Auvergne-Rhône-Alpes', nearbyCities: ['lyon', 'caluire-et-cuire', 'bron'] },
  { slug: 'venissieux', name: 'Vénissieux', region: 'Auvergne-Rhône-Alpes', nearbyCities: ['lyon', 'bron', 'saint-etienne'] },
  { slug: 'caluire-et-cuire', name: 'Caluire-et-Cuire', region: 'Auvergne-Rhône-Alpes', nearbyCities: ['lyon', 'villeurbanne'] },
  { slug: 'bron', name: 'Bron', region: 'Auvergne-Rhône-Alpes', nearbyCities: ['lyon', 'villeurbanne', 'venissieux'] },
  { slug: 'decines-charpieu', name: 'Décines-Charpieu', region: 'Auvergne-Rhône-Alpes', nearbyCities: ['lyon', 'bron', 'villeurbanne'] },

  // Marseille & environs
  { slug: 'marseille', name: 'Marseille', region: 'Provence-Alpes-Côte d\'Azur', nearbyCities: ['aix-en-provence', 'aubagne', 'martigues', 'vitrolles', 'istres'] },
  { slug: 'aix-en-provence', name: 'Aix-en-Provence', region: 'Provence-Alpes-Côte d\'Azur', nearbyCities: ['marseille', 'aubagne', 'vitrolles'] },
  { slug: 'aubagne', name: 'Aubagne', region: 'Provence-Alpes-Côte d\'Azur', nearbyCities: ['marseille', 'aix-en-provence'] },
  { slug: 'martigues', name: 'Martigues', region: 'Provence-Alpes-Côte d\'Azur', nearbyCities: ['marseille', 'istres', 'vitrolles'] },
  { slug: 'vitrolles', name: 'Vitrolles', region: 'Provence-Alpes-Côte d\'Azur', nearbyCities: ['marseille', 'aix-en-provence', 'martigues'] },

  // Toulouse & environs
  { slug: 'toulouse', name: 'Toulouse', region: 'Occitanie', nearbyCities: ['blagnac', 'colomiers', 'tournefeuille', 'cugnaux', 'labege'] },
  { slug: 'blagnac', name: 'Blagnac', region: 'Occitanie', nearbyCities: ['toulouse', 'colomiers'] },
  { slug: 'colomiers', name: 'Colomiers', region: 'Occitanie', nearbyCities: ['toulouse', 'blagnac', 'tournefeuille'] },
  { slug: 'tournefeuille', name: 'Tournefeuille', region: 'Occitanie', nearbyCities: ['toulouse', 'colomiers'] },
  { slug: 'cugnaux', name: 'Cugnaux', region: 'Occitanie', nearbyCities: ['toulouse', 'tournefeuille'] },

  // Nice & environs
  { slug: 'nice', name: 'Nice', region: 'Provence-Alpes-Côte d\'Azur', nearbyCities: ['antibes', 'cannes', 'cagnes-sur-mer', 'grasse', 'menton'] },
  { slug: 'antibes', name: 'Antibes', region: 'Provence-Alpes-Côte d\'Azur', nearbyCities: ['nice', 'cannes', 'cagnes-sur-mer'] },
  { slug: 'cannes', name: 'Cannes', region: 'Provence-Alpes-Côte d\'Azur', nearbyCities: ['nice', 'antibes', 'grasse'] },
  { slug: 'cagnes-sur-mer', name: 'Cagnes-sur-Mer', region: 'Provence-Alpes-Côte d\'Azur', nearbyCities: ['nice', 'antibes'] },
  { slug: 'grasse', name: 'Grasse', region: 'Provence-Alpes-Côte d\'Azur', nearbyCities: ['nice', 'cannes'] },
  { slug: 'menton', name: 'Menton', region: 'Provence-Alpes-Côte d\'Azur', nearbyCities: ['nice'] },

  // Bordeaux & environs
  { slug: 'bordeaux', name: 'Bordeaux', region: 'Nouvelle-Aquitaine', nearbyCities: ['merignac', 'pessac', 'talence', 'begles', 'le-bouscat'] },
  { slug: 'merignac', name: 'Mérignac', region: 'Nouvelle-Aquitaine', nearbyCities: ['bordeaux', 'pessac', 'le-bouscat'] },
  { slug: 'pessac', name: 'Pessac', region: 'Nouvelle-Aquitaine', nearbyCities: ['bordeaux', 'merignac', 'talence'] },
  { slug: 'talence', name: 'Talence', region: 'Nouvelle-Aquitaine', nearbyCities: ['bordeaux', 'pessac', 'begles'] },
  { slug: 'begles', name: 'Bègles', region: 'Nouvelle-Aquitaine', nearbyCities: ['bordeaux', 'talence'] },

  // Nantes & environs
  { slug: 'nantes', name: 'Nantes', region: 'Pays de la Loire', nearbyCities: ['saint-herblain', 'reze', 'orvault', 'vertou', 'saint-nazaire'] },
  { slug: 'saint-herblain', name: 'Saint-Herblain', region: 'Pays de la Loire', nearbyCities: ['nantes', 'orvault'] },
  { slug: 'reze', name: 'Rezé', region: 'Pays de la Loire', nearbyCities: ['nantes', 'vertou'] },
  { slug: 'orvault', name: 'Orvault', region: 'Pays de la Loire', nearbyCities: ['nantes', 'saint-herblain'] },
  { slug: 'saint-nazaire', name: 'Saint-Nazaire', region: 'Pays de la Loire', nearbyCities: ['nantes'] },

  // Strasbourg & environs
  { slug: 'strasbourg', name: 'Strasbourg', region: 'Grand Est', nearbyCities: ['schiltigheim', 'illkirch-graffenstaden', 'haguenau', 'obernai'] },
  { slug: 'schiltigheim', name: 'Schiltigheim', region: 'Grand Est', nearbyCities: ['strasbourg', 'illkirch-graffenstaden'] },
  { slug: 'illkirch-graffenstaden', name: 'Illkirch-Graffenstaden', region: 'Grand Est', nearbyCities: ['strasbourg', 'schiltigheim'] },
  { slug: 'haguenau', name: 'Haguenau', region: 'Grand Est', nearbyCities: ['strasbourg'] },

  // Montpellier & environs
  { slug: 'montpellier', name: 'Montpellier', region: 'Occitanie', nearbyCities: ['nimes', 'lunel', 'sete', 'beziers'] },
  { slug: 'nimes', name: 'Nîmes', region: 'Occitanie', nearbyCities: ['montpellier', 'ales'] },
  { slug: 'sete', name: 'Sète', region: 'Occitanie', nearbyCities: ['montpellier'] },
  { slug: 'beziers', name: 'Béziers', region: 'Occitanie', nearbyCities: ['montpellier', 'nimes'] },

  // Lille & environs
  { slug: 'lille', name: 'Lille', region: 'Hauts-de-France', nearbyCities: ['roubaix', 'tourcoing', 'villeneuve-dascq', 'dunkerque', 'arras'] },
  { slug: 'roubaix', name: 'Roubaix', region: 'Hauts-de-France', nearbyCities: ['lille', 'tourcoing'] },
  { slug: 'tourcoing', name: 'Tourcoing', region: 'Hauts-de-France', nearbyCities: ['lille', 'roubaix'] },
  { slug: 'villeneuve-dascq', name: 'Villeneuve-d\'Ascq', region: 'Hauts-de-France', nearbyCities: ['lille', 'roubaix'] },
  { slug: 'dunkerque', name: 'Dunkerque', region: 'Hauts-de-France', nearbyCities: ['lille'] },

  // Rennes & environs
  { slug: 'rennes', name: 'Rennes', region: 'Bretagne', nearbyCities: ['saint-malo', 'brest', 'vannes', 'lorient'] },
  { slug: 'brest', name: 'Brest', region: 'Bretagne', nearbyCities: ['rennes', 'lorient'] },
  { slug: 'saint-malo', name: 'Saint-Malo', region: 'Bretagne', nearbyCities: ['rennes'] },
  { slug: 'vannes', name: 'Vannes', region: 'Bretagne', nearbyCities: ['rennes', 'lorient'] },
  { slug: 'lorient', name: 'Lorient', region: 'Bretagne', nearbyCities: ['rennes', 'vannes', 'brest'] },

  // Grenoble & environs
  { slug: 'grenoble', name: 'Grenoble', region: 'Auvergne-Rhône-Alpes', nearbyCities: ['echirolles', 'saint-martin-dheres', 'voiron'] },
  { slug: 'echirolles', name: 'Échirolles', region: 'Auvergne-Rhône-Alpes', nearbyCities: ['grenoble', 'saint-martin-dheres'] },
  { slug: 'saint-martin-dheres', name: 'Saint-Martin-d\'Hères', region: 'Auvergne-Rhône-Alpes', nearbyCities: ['grenoble', 'echirolles'] },

  // Toulon & environs
  { slug: 'toulon', name: 'Toulon', region: 'Provence-Alpes-Côte d\'Azur', nearbyCities: ['la-seyne-sur-mer', 'hyeres', 'frejus'] },
  { slug: 'la-seyne-sur-mer', name: 'La Seyne-sur-Mer', region: 'Provence-Alpes-Côte d\'Azur', nearbyCities: ['toulon', 'hyeres'] },
  { slug: 'hyeres', name: 'Hyères', region: 'Provence-Alpes-Côte d\'Azur', nearbyCities: ['toulon', 'la-seyne-sur-mer'] },
  { slug: 'frejus', name: 'Fréjus', region: 'Provence-Alpes-Côte d\'Azur', nearbyCities: ['toulon', 'nice'] },

  // Saint-Étienne & environs
  { slug: 'saint-etienne', name: 'Saint-Étienne', region: 'Auvergne-Rhône-Alpes', nearbyCities: ['lyon', 'venissieux', 'roanne'] },
  { slug: 'roanne', name: 'Roanne', region: 'Auvergne-Rhône-Alpes', nearbyCities: ['saint-etienne', 'lyon'] },
];

export const CITIES_MAP = new Map<string, City>(CITIES.map(c => [c.slug, c]));

export function getCity(slug: string): City | undefined {
  return CITIES_MAP.get(slug);
}
