export type { City } from '../shared/interfaces/city';
import type { City } from '../shared/interfaces/city';

export const CITIES: City[] = [
  // ── Paris & Île-de-France (rayon 50 km par route) ─────────────────────────
  { slug: 'paris', name: 'Paris', region: 'Île-de-France',
    nearbyCities: [
      'versailles','boulogne-billancourt','nanterre','montreuil','saint-denis','creteil','vincennes',
      'argenteuil','colombes','aubervilliers','vitry-sur-seine','asnieres-sur-seine','rueil-malmaison',
      'aulnay-sous-bois','champigny-sur-marne','saint-maur-des-fosses','levallois-perret',
      'noisy-le-grand','cergy','ivry-sur-seine','neuilly-sur-seine','bobigny',
      'evry-courcouronnes','clamart','corbeil-essonnes','mantes-la-jolie','melun',
    ],
  },
  { slug: 'versailles', name: 'Versailles', region: 'Île-de-France',
    nearbyCities: ['paris','boulogne-billancourt','nanterre','rueil-malmaison','clamart',
      'neuilly-sur-seine','levallois-perret','colombes','asnieres-sur-seine','argenteuil',
      'cergy','mantes-la-jolie','ivry-sur-seine'],
  },
  { slug: 'boulogne-billancourt', name: 'Boulogne-Billancourt', region: 'Île-de-France',
    nearbyCities: ['paris','versailles','nanterre','rueil-malmaison','clamart',
      'levallois-perret','neuilly-sur-seine','ivry-sur-seine','asnieres-sur-seine','colombes'],
  },
  { slug: 'nanterre', name: 'Nanterre', region: 'Île-de-France',
    nearbyCities: ['paris','versailles','boulogne-billancourt','rueil-malmaison',
      'argenteuil','colombes','levallois-perret','neuilly-sur-seine','asnieres-sur-seine','cergy'],
  },
  { slug: 'montreuil', name: 'Montreuil', region: 'Île-de-France',
    nearbyCities: ['paris','saint-denis','creteil','vincennes','champigny-sur-marne',
      'saint-maur-des-fosses','noisy-le-grand','bobigny','aubervilliers'],
  },
  { slug: 'saint-denis', name: 'Saint-Denis', region: 'Île-de-France',
    nearbyCities: ['paris','aubervilliers','argenteuil','colombes','asnieres-sur-seine',
      'bobigny','aulnay-sous-bois','montreuil','nanterre'],
  },
  { slug: 'creteil', name: 'Créteil', region: 'Île-de-France',
    nearbyCities: ['paris','montreuil','vincennes','vitry-sur-seine','ivry-sur-seine',
      'champigny-sur-marne','saint-maur-des-fosses','noisy-le-grand','corbeil-essonnes'],
  },
  { slug: 'vincennes', name: 'Vincennes', region: 'Île-de-France',
    nearbyCities: ['paris','creteil','montreuil','champigny-sur-marne','saint-maur-des-fosses'],
  },
  { slug: 'argenteuil', name: 'Argenteuil', region: 'Île-de-France',
    nearbyCities: ['paris','nanterre','colombes','asnieres-sur-seine','saint-denis',
      'aubervilliers','rueil-malmaison','levallois-perret','neuilly-sur-seine','cergy','mantes-la-jolie'],
  },
  { slug: 'colombes', name: 'Colombes', region: 'Île-de-France',
    nearbyCities: ['paris','nanterre','argenteuil','asnieres-sur-seine','saint-denis',
      'rueil-malmaison','levallois-perret','neuilly-sur-seine','cergy'],
  },
  { slug: 'aubervilliers', name: 'Aubervilliers', region: 'Île-de-France',
    nearbyCities: ['paris','saint-denis','bobigny','aulnay-sous-bois','argenteuil',
      'asnieres-sur-seine','montreuil'],
  },
  { slug: 'vitry-sur-seine', name: 'Vitry-sur-Seine', region: 'Île-de-France',
    nearbyCities: ['paris','ivry-sur-seine','creteil','clamart','evry-courcouronnes','corbeil-essonnes'],
  },
  { slug: 'asnieres-sur-seine', name: 'Asnières-sur-Seine', region: 'Île-de-France',
    nearbyCities: ['paris','colombes','argenteuil','nanterre','levallois-perret',
      'neuilly-sur-seine','saint-denis','rueil-malmaison','boulogne-billancourt','cergy'],
  },
  { slug: 'rueil-malmaison', name: 'Rueil-Malmaison', region: 'Île-de-France',
    nearbyCities: ['paris','versailles','nanterre','boulogne-billancourt','argenteuil',
      'colombes','levallois-perret','neuilly-sur-seine','asnieres-sur-seine','cergy','mantes-la-jolie'],
  },
  { slug: 'aulnay-sous-bois', name: 'Aulnay-sous-Bois', region: 'Île-de-France',
    nearbyCities: ['paris','saint-denis','aubervilliers','bobigny','noisy-le-grand','montreuil'],
  },
  { slug: 'champigny-sur-marne', name: 'Champigny-sur-Marne', region: 'Île-de-France',
    nearbyCities: ['paris','vincennes','saint-maur-des-fosses','creteil','noisy-le-grand',
      'montreuil','corbeil-essonnes'],
  },
  { slug: 'saint-maur-des-fosses', name: 'Saint-Maur-des-Fossés', region: 'Île-de-France',
    nearbyCities: ['paris','vincennes','champigny-sur-marne','creteil','noisy-le-grand','corbeil-essonnes'],
  },
  { slug: 'levallois-perret', name: 'Levallois-Perret', region: 'Île-de-France',
    nearbyCities: ['paris','neuilly-sur-seine','boulogne-billancourt','nanterre',
      'asnieres-sur-seine','colombes','rueil-malmaison','argenteuil','versailles'],
  },
  { slug: 'noisy-le-grand', name: 'Noisy-le-Grand', region: 'Île-de-France',
    nearbyCities: ['paris','montreuil','champigny-sur-marne','saint-maur-des-fosses',
      'creteil','bobigny','aulnay-sous-bois','evry-courcouronnes','melun'],
  },
  { slug: 'cergy', name: 'Cergy', region: 'Île-de-France',
    nearbyCities: ['paris','versailles','nanterre','rueil-malmaison','argenteuil',
      'colombes','asnieres-sur-seine','mantes-la-jolie'],
  },
  { slug: 'ivry-sur-seine', name: 'Ivry-sur-Seine', region: 'Île-de-France',
    nearbyCities: ['paris','vitry-sur-seine','creteil','clamart','boulogne-billancourt','versailles'],
  },
  { slug: 'neuilly-sur-seine', name: 'Neuilly-sur-Seine', region: 'Île-de-France',
    nearbyCities: ['paris','levallois-perret','boulogne-billancourt','nanterre',
      'asnieres-sur-seine','rueil-malmaison','versailles','colombes','argenteuil'],
  },
  { slug: 'bobigny', name: 'Bobigny', region: 'Île-de-France',
    nearbyCities: ['paris','saint-denis','aubervilliers','aulnay-sous-bois','montreuil','noisy-le-grand'],
  },
  { slug: 'evry-courcouronnes', name: 'Évry-Courcouronnes', region: 'Île-de-France',
    nearbyCities: ['paris','vitry-sur-seine','corbeil-essonnes','noisy-le-grand','melun'],
  },
  { slug: 'clamart', name: 'Clamart', region: 'Île-de-France',
    nearbyCities: ['paris','boulogne-billancourt','versailles','ivry-sur-seine','vitry-sur-seine','rueil-malmaison'],
  },
  { slug: 'corbeil-essonnes', name: 'Corbeil-Essonnes', region: 'Île-de-France',
    nearbyCities: ['paris','creteil','evry-courcouronnes','melun','saint-maur-des-fosses',
      'champigny-sur-marne','vitry-sur-seine'],
  },
  { slug: 'mantes-la-jolie', name: 'Mantes-la-Jolie', region: 'Île-de-France',
    nearbyCities: ['paris','versailles','cergy','rueil-malmaison','argenteuil'],
  },
  { slug: 'melun', name: 'Melun', region: 'Île-de-France',
    nearbyCities: ['paris','creteil','noisy-le-grand','evry-courcouronnes','corbeil-essonnes'],
  },

  // ── Lyon & environs (rayon 50 km par route) ───────────────────────────────
  { slug: 'lyon', name: 'Lyon', region: 'Auvergne-Rhône-Alpes',
    nearbyCities: ['villeurbanne','venissieux','caluire-et-cuire','bron','decines-charpieu',
      'saint-priest','rillieux-la-pape','meyzieu','givors','vienne','bourgoin-jallieu'],
  },
  { slug: 'villeurbanne', name: 'Villeurbanne', region: 'Auvergne-Rhône-Alpes',
    nearbyCities: ['lyon','caluire-et-cuire','bron','saint-priest','rillieux-la-pape','decines-charpieu','meyzieu'],
  },
  { slug: 'venissieux', name: 'Vénissieux', region: 'Auvergne-Rhône-Alpes',
    nearbyCities: ['lyon','bron','saint-priest','vienne','givors'],
  },
  { slug: 'caluire-et-cuire', name: 'Caluire-et-Cuire', region: 'Auvergne-Rhône-Alpes',
    nearbyCities: ['lyon','villeurbanne','rillieux-la-pape'],
  },
  { slug: 'bron', name: 'Bron', region: 'Auvergne-Rhône-Alpes',
    nearbyCities: ['lyon','villeurbanne','venissieux','saint-priest','decines-charpieu','meyzieu'],
  },
  { slug: 'decines-charpieu', name: 'Décines-Charpieu', region: 'Auvergne-Rhône-Alpes',
    nearbyCities: ['lyon','bron','villeurbanne','meyzieu','bourgoin-jallieu'],
  },
  { slug: 'saint-priest', name: 'Saint-Priest', region: 'Auvergne-Rhône-Alpes',
    nearbyCities: ['lyon','venissieux','bron','meyzieu','vienne'],
  },
  { slug: 'rillieux-la-pape', name: 'Rillieux-la-Pape', region: 'Auvergne-Rhône-Alpes',
    nearbyCities: ['lyon','villeurbanne','caluire-et-cuire'],
  },
  { slug: 'meyzieu', name: 'Meyzieu', region: 'Auvergne-Rhône-Alpes',
    nearbyCities: ['lyon','bron','decines-charpieu','saint-priest','bourgoin-jallieu','villeurbanne'],
  },
  { slug: 'givors', name: 'Givors', region: 'Auvergne-Rhône-Alpes',
    nearbyCities: ['lyon','venissieux','vienne'],
  },
  { slug: 'vienne', name: 'Vienne', region: 'Auvergne-Rhône-Alpes',
    nearbyCities: ['lyon','venissieux','givors','saint-priest'],
  },
  // Bourgoin-Jallieu (~42 km de Lyon, ~40 km de Grenoble) : pont entre les deux clusters
  { slug: 'bourgoin-jallieu', name: 'Bourgoin-Jallieu', region: 'Auvergne-Rhône-Alpes',
    nearbyCities: ['lyon','decines-charpieu','meyzieu','grenoble'],
  },

  // ── Marseille & environs (rayon 50 km par route) ──────────────────────────
  { slug: 'marseille', name: 'Marseille', region: "Provence-Alpes-Côte d'Azur",
    nearbyCities: ['aix-en-provence','aubagne','martigues','vitrolles','la-ciotat'],
  },
  { slug: 'aix-en-provence', name: 'Aix-en-Provence', region: "Provence-Alpes-Côte d'Azur",
    nearbyCities: ['marseille','aubagne','vitrolles','la-ciotat'],
  },
  { slug: 'aubagne', name: 'Aubagne', region: "Provence-Alpes-Côte d'Azur",
    nearbyCities: ['marseille','aix-en-provence','la-ciotat','toulon'],
  },
  { slug: 'martigues', name: 'Martigues', region: "Provence-Alpes-Côte d'Azur",
    nearbyCities: ['marseille','vitrolles'],
  },
  { slug: 'vitrolles', name: 'Vitrolles', region: "Provence-Alpes-Côte d'Azur",
    nearbyCities: ['marseille','aix-en-provence','martigues'],
  },
  { slug: 'la-ciotat', name: 'La Ciotat', region: "Provence-Alpes-Côte d'Azur",
    nearbyCities: ['marseille','aubagne','aix-en-provence'],
  },

  // ── Toulouse & environs (rayon 50 km par route) ───────────────────────────
  { slug: 'toulouse', name: 'Toulouse', region: 'Occitanie',
    nearbyCities: ['blagnac','colomiers','tournefeuille','cugnaux','muret','montauban'],
  },
  { slug: 'blagnac', name: 'Blagnac', region: 'Occitanie',
    nearbyCities: ['toulouse','colomiers','muret'],
  },
  { slug: 'colomiers', name: 'Colomiers', region: 'Occitanie',
    nearbyCities: ['toulouse','blagnac','tournefeuille','muret'],
  },
  { slug: 'tournefeuille', name: 'Tournefeuille', region: 'Occitanie',
    nearbyCities: ['toulouse','colomiers','cugnaux','muret'],
  },
  { slug: 'cugnaux', name: 'Cugnaux', region: 'Occitanie',
    nearbyCities: ['toulouse','tournefeuille','muret'],
  },
  { slug: 'muret', name: 'Muret', region: 'Occitanie',
    nearbyCities: ['toulouse','blagnac','colomiers','tournefeuille','cugnaux'],
  },

  // ── Nice & environs (rayon 50 km par route) ───────────────────────────────
  { slug: 'nice', name: 'Nice', region: "Provence-Alpes-Côte d'Azur",
    nearbyCities: ['antibes','cannes','cagnes-sur-mer','grasse','menton'],
  },
  { slug: 'antibes', name: 'Antibes', region: "Provence-Alpes-Côte d'Azur",
    nearbyCities: ['nice','cannes','cagnes-sur-mer','grasse'],
  },
  { slug: 'cannes', name: 'Cannes', region: "Provence-Alpes-Côte d'Azur",
    nearbyCities: ['nice','antibes','grasse','frejus'],
  },
  { slug: 'cagnes-sur-mer', name: 'Cagnes-sur-Mer', region: "Provence-Alpes-Côte d'Azur",
    nearbyCities: ['nice','antibes'],
  },
  { slug: 'grasse', name: 'Grasse', region: "Provence-Alpes-Côte d'Azur",
    nearbyCities: ['nice','cannes','antibes'],
  },
  { slug: 'menton', name: 'Menton', region: "Provence-Alpes-Côte d'Azur",
    nearbyCities: ['nice'],
  },

  // ── Bordeaux & environs (rayon 50 km par route) ───────────────────────────
  { slug: 'bordeaux', name: 'Bordeaux', region: 'Nouvelle-Aquitaine',
    nearbyCities: ['merignac','pessac','talence','begles','libourne'],
  },
  { slug: 'merignac', name: 'Mérignac', region: 'Nouvelle-Aquitaine',
    nearbyCities: ['bordeaux','pessac'],
  },
  { slug: 'pessac', name: 'Pessac', region: 'Nouvelle-Aquitaine',
    nearbyCities: ['bordeaux','merignac','talence'],
  },
  { slug: 'talence', name: 'Talence', region: 'Nouvelle-Aquitaine',
    nearbyCities: ['bordeaux','pessac','begles'],
  },
  { slug: 'begles', name: 'Bègles', region: 'Nouvelle-Aquitaine',
    nearbyCities: ['bordeaux','talence'],
  },
  { slug: 'libourne', name: 'Libourne', region: 'Nouvelle-Aquitaine',
    nearbyCities: ['bordeaux'],
  },

  // ── Nantes & environs ─────────────────────────────────────────────────────
  { slug: 'nantes', name: 'Nantes', region: 'Pays de la Loire',
    nearbyCities: ['saint-herblain','reze','orvault'],
  },
  { slug: 'saint-herblain', name: 'Saint-Herblain', region: 'Pays de la Loire',
    nearbyCities: ['nantes','orvault'],
  },
  { slug: 'reze', name: 'Rezé', region: 'Pays de la Loire',
    nearbyCities: ['nantes'],
  },
  { slug: 'orvault', name: 'Orvault', region: 'Pays de la Loire',
    nearbyCities: ['nantes','saint-herblain'],
  },
  // Saint-Nazaire isolée (~58 km de Nantes par route)
  { slug: 'saint-nazaire', name: 'Saint-Nazaire', region: 'Pays de la Loire', nearbyCities: [] },

  // ── Strasbourg & environs (rayon 50 km par route) ─────────────────────────
  { slug: 'strasbourg', name: 'Strasbourg', region: 'Grand Est',
    nearbyCities: ['schiltigheim','illkirch-graffenstaden','haguenau'],
  },
  { slug: 'schiltigheim', name: 'Schiltigheim', region: 'Grand Est',
    nearbyCities: ['strasbourg','illkirch-graffenstaden'],
  },
  { slug: 'illkirch-graffenstaden', name: 'Illkirch-Graffenstaden', region: 'Grand Est',
    nearbyCities: ['strasbourg','schiltigheim'],
  },
  { slug: 'haguenau', name: 'Haguenau', region: 'Grand Est',
    nearbyCities: ['strasbourg'],
  },
  // ── Montpellier & environs (rayon 50 km par route) ────────────────────────
  { slug: 'montpellier', name: 'Montpellier', region: 'Occitanie',
    nearbyCities: ['sete','lunel','agde'],
  },
  { slug: 'sete', name: 'Sète', region: 'Occitanie',
    nearbyCities: ['montpellier','agde','lunel','beziers'],
  },
  // Nîmes (~54 km de Montpellier par route) : connectée via Lunel, jamais directement à Montpellier
  { slug: 'nimes', name: 'Nîmes', region: 'Occitanie',
    nearbyCities: ['lunel','ales','avignon'],
  },
  { slug: 'ales', name: 'Alès', region: 'Occitanie', nearbyCities: ['nimes'] },
  { slug: 'beziers', name: 'Béziers', region: 'Occitanie',
    nearbyCities: ['agde','sete','narbonne'],
  },
  { slug: 'lunel', name: 'Lunel', region: 'Occitanie',
    nearbyCities: ['montpellier','nimes','sete'],
  },
  { slug: 'agde', name: 'Agde', region: 'Occitanie',
    nearbyCities: ['montpellier','sete','beziers'],
  },

  // ── Lille & environs (rayon 50 km par route) ──────────────────────────────
  { slug: 'lille', name: 'Lille', region: 'Hauts-de-France',
    nearbyCities: ['roubaix','tourcoing','villeneuve-dascq','lens','douai','bethune','valenciennes'],
  },
  { slug: 'roubaix', name: 'Roubaix', region: 'Hauts-de-France',
    nearbyCities: ['lille','tourcoing','villeneuve-dascq','lens'],
  },
  { slug: 'tourcoing', name: 'Tourcoing', region: 'Hauts-de-France',
    nearbyCities: ['lille','roubaix'],
  },
  { slug: 'villeneuve-dascq', name: "Villeneuve-d'Ascq", region: 'Hauts-de-France',
    nearbyCities: ['lille','roubaix','lens'],
  },
  // Dunkerque isolée (~75 km de Lille par route)
  { slug: 'dunkerque', name: 'Dunkerque', region: 'Hauts-de-France', nearbyCities: [] },
  { slug: 'lens', name: 'Lens', region: 'Hauts-de-France',
    nearbyCities: ['lille','bethune','douai','roubaix','villeneuve-dascq'],
  },
  { slug: 'douai', name: 'Douai', region: 'Hauts-de-France',
    nearbyCities: ['lille','lens','valenciennes'],
  },
  { slug: 'bethune', name: 'Béthune', region: 'Hauts-de-France',
    nearbyCities: ['lille','lens'],
  },
  // Valenciennes (~50 km de Lille par route)
  { slug: 'valenciennes', name: 'Valenciennes', region: 'Hauts-de-France',
    nearbyCities: ['lille','douai'],
  },

  // ── Bretagne (villes isolées, > 50 km les unes des autres par route) ──────
  { slug: 'rennes', name: 'Rennes', region: 'Bretagne', nearbyCities: [] },
  { slug: 'brest', name: 'Brest', region: 'Bretagne', nearbyCities: [] },
  { slug: 'saint-malo', name: 'Saint-Malo', region: 'Bretagne', nearbyCities: [] },
  { slug: 'vannes', name: 'Vannes', region: 'Bretagne', nearbyCities: [] },
  { slug: 'lorient', name: 'Lorient', region: 'Bretagne', nearbyCities: [] },

  // ── Grenoble & environs ───────────────────────────────────────────────────
  // Chambéry (~55 km de Grenoble par route) : zone explicitement groupée malgré le léger dépassement
  { slug: 'grenoble', name: 'Grenoble', region: 'Auvergne-Rhône-Alpes',
    nearbyCities: ['echirolles','saint-martin-dheres','bourgoin-jallieu','chambery'],
  },
  { slug: 'echirolles', name: 'Échirolles', region: 'Auvergne-Rhône-Alpes',
    nearbyCities: ['grenoble','saint-martin-dheres'],
  },
  { slug: 'saint-martin-dheres', name: "Saint-Martin-d'Hères", region: 'Auvergne-Rhône-Alpes',
    nearbyCities: ['grenoble','echirolles'],
  },

  // ── Toulon & environs (rayon 50 km par route) ─────────────────────────────
  { slug: 'toulon', name: 'Toulon', region: "Provence-Alpes-Côte d'Azur",
    nearbyCities: ['la-seyne-sur-mer','hyeres','six-fours-les-plages','la-garde','aubagne'],
  },
  { slug: 'la-seyne-sur-mer', name: 'La Seyne-sur-Mer', region: "Provence-Alpes-Côte d'Azur",
    nearbyCities: ['toulon','hyeres','six-fours-les-plages','la-garde'],
  },
  { slug: 'hyeres', name: 'Hyères', region: "Provence-Alpes-Côte d'Azur",
    nearbyCities: ['toulon','la-seyne-sur-mer'],
  },
  // Fréjus rattaché au cluster Nice/Cannes (~35 km de Cannes) + micro-cluster Saint-Raphaël/Draguignan
  { slug: 'frejus', name: 'Fréjus', region: "Provence-Alpes-Côte d'Azur",
    nearbyCities: ['cannes','saint-raphael','draguignan'],
  },
  { slug: 'saint-raphael', name: 'Saint-Raphaël', region: "Provence-Alpes-Côte d'Azur", nearbyCities: ['frejus','draguignan'] },
  { slug: 'draguignan', name: 'Draguignan', region: "Provence-Alpes-Côte d'Azur", nearbyCities: ['frejus','saint-raphael'] },
  { slug: 'six-fours-les-plages', name: 'Six-Fours-les-Plages', region: "Provence-Alpes-Côte d'Azur",
    nearbyCities: ['toulon','la-seyne-sur-mer','la-garde'],
  },
  { slug: 'la-garde', name: 'La Garde', region: "Provence-Alpes-Côte d'Azur",
    nearbyCities: ['toulon','la-seyne-sur-mer','six-fours-les-plages'],
  },

  { slug: 'montauban', name: 'Montauban', region: 'Occitanie', nearbyCities: ['toulouse'] },

  { slug: 'chambery', name: 'Chambéry', region: 'Auvergne-Rhône-Alpes', nearbyCities: ['grenoble','aix-les-bains'] },
  { slug: 'aix-les-bains', name: 'Aix-les-Bains', region: 'Auvergne-Rhône-Alpes', nearbyCities: ['chambery'] },

  { slug: 'avignon', name: 'Avignon', region: "Provence-Alpes-Côte d'Azur",
    nearbyCities: ['nimes','carpentras','cavaillon','orange','isle-sur-la-sorgue'],
  },
  { slug: 'carpentras', name: 'Carpentras', region: "Provence-Alpes-Côte d'Azur", nearbyCities: ['avignon'] },
  { slug: 'cavaillon', name: 'Cavaillon', region: "Provence-Alpes-Côte d'Azur", nearbyCities: ['avignon'] },
  { slug: 'orange', name: 'Orange', region: "Provence-Alpes-Côte d'Azur", nearbyCities: ['avignon'] },
  { slug: 'isle-sur-la-sorgue', name: "L'Isle-sur-la-Sorgue", region: "Provence-Alpes-Côte d'Azur", nearbyCities: ['avignon'] },

  { slug: 'saint-etienne', name: 'Saint-Étienne', region: 'Auvergne-Rhône-Alpes', nearbyCities: [] },
  { slug: 'firminy', name: 'Firminy', region: 'Auvergne-Rhône-Alpes', nearbyCities: ['saint-etienne'] },

  // ── Reims & environs (rayon 50 km par route) ──────────────────────────────
  { slug: 'reims', name: 'Reims', region: 'Grand Est',
    nearbyCities: ['epernay','chalons-en-champagne'],
  },
  { slug: 'epernay', name: 'Épernay', region: 'Grand Est', nearbyCities: ['reims'] },
  // Châlons-en-Champagne (~45 km de Reims par route)
  { slug: 'chalons-en-champagne', name: 'Châlons-en-Champagne', region: 'Grand Est', nearbyCities: ['reims'] },

  // ── Le Havre (aucun satellite ≥20k habitants dans un rayon de 50 km) ──────
  { slug: 'le-havre', name: 'Le Havre', region: 'Normandie', nearbyCities: [] },
  { slug: 'montivilliers', name: 'Montivilliers', region: 'Normandie', nearbyCities: ['le-havre'] },

  // ── Dijon & environs (rayon 50 km) ────────────────────────────────────────
  { slug: 'dijon', name: 'Dijon', region: 'Bourgogne-Franche-Comté', nearbyCities: ['beaune'] },
  // Chalon-sur-Saône : aucun candidat ≥20k à ≤50 km à vol d'oiseau trouvé
  { slug: 'chalon-sur-saone', name: 'Chalon-sur-Saône', region: 'Bourgogne-Franche-Comté', nearbyCities: [] },
  { slug: 'beaune', name: 'Beaune', region: 'Bourgogne-Franche-Comté', nearbyCities: ['dijon'] },

  // ── Angers & environs (rayon 50 km par route) ─────────────────────────────
  { slug: 'angers', name: 'Angers', region: 'Pays de la Loire', nearbyCities: ['saumur'] },
  { slug: 'saumur', name: 'Saumur', region: 'Pays de la Loire', nearbyCities: ['angers'] },

  // ── Clermont-Ferrand & environs (rayon 50 km par route) ───────────────────
  { slug: 'clermont-ferrand', name: 'Clermont-Ferrand', region: 'Auvergne-Rhône-Alpes', nearbyCities: ['vichy'] },
  // Vichy : 47 km de Clermont-Ferrand à vol d'oiseau (dans le rayon)
  { slug: 'vichy', name: 'Vichy', region: 'Auvergne-Rhône-Alpes', nearbyCities: ['clermont-ferrand'] },

  // ── Tours & environs (rayon 50 km par route) ──────────────────────────────
  { slug: 'tours', name: 'Tours', region: 'Centre-Val de Loire', nearbyCities: ['joue-les-tours'] },
  { slug: 'joue-les-tours', name: 'Joué-lès-Tours', region: 'Centre-Val de Loire', nearbyCities: ['tours'] },

  // ── Amiens & environs (rayon 50 km par route) ─────────────────────────────
  // Amiens (aucun satellite ≥20k habitants à ≤50 km à vol d'oiseau : Beauvais à ~54 km, Albert/Corbie <20k)
  { slug: 'amiens', name: 'Amiens', region: 'Hauts-de-France', nearbyCities: [] },
  // Beauvais : aucun candidat ≥20k à ≤50 km à vol d'oiseau trouvé
  { slug: 'beauvais', name: 'Beauvais', region: 'Hauts-de-France', nearbyCities: [] },

  // ── Limoges & environs (rayon 50 km par route) ────────────────────────────
  // Limoges (aucun satellite ≥20k habitants à ≤50 km)
  { slug: 'limoges', name: 'Limoges', region: 'Nouvelle-Aquitaine', nearbyCities: [] },
  { slug: 'panazol', name: 'Panazol', region: 'Nouvelle-Aquitaine', nearbyCities: ['limoges'] },

  // ── Annecy & environs (rayon 50 km par route) ─────────────────────────────
  { slug: 'annecy', name: 'Annecy', region: 'Auvergne-Rhône-Alpes', nearbyCities: ['annemasse'] },
  { slug: 'annemasse', name: 'Annemasse', region: 'Auvergne-Rhône-Alpes', nearbyCities: ['annecy'] },

  // ── Perpignan & environs (rayon 50 km par route) ──────────────────────────
  // Perpignan (aucun satellite ≥20k habitants à ≤50 km à vol d'oiseau : Narbonne à ~56 km)
  { slug: 'perpignan', name: 'Perpignan', region: 'Occitanie', nearbyCities: [] },
  { slug: 'narbonne', name: 'Narbonne', region: 'Occitanie', nearbyCities: ['beziers'] },

  // ── Metz & environs (rayon 50 km par route) ───────────────────────────────
  { slug: 'metz', name: 'Metz', region: 'Grand Est',
    nearbyCities: ['montigny-les-metz','thionville','nancy'],
  },
  { slug: 'montigny-les-metz', name: 'Montigny-lès-Metz', region: 'Grand Est', nearbyCities: ['metz'] },
  { slug: 'thionville', name: 'Thionville', region: 'Grand Est', nearbyCities: ['metz'] },
  // Nancy : 47,5 km de Metz à vol d'oiseau (dans le rayon)
  { slug: 'nancy', name: 'Nancy', region: 'Grand Est', nearbyCities: ['metz'] },

  // Besançon (Montbéliard à ~66 km à vol d'oiseau, hors rayon et pas une ville principale)
  { slug: 'besancon', name: 'Besançon', region: 'Bourgogne-Franche-Comté', nearbyCities: [] },
  { slug: 'montbeliard', name: 'Montbéliard', region: 'Bourgogne-Franche-Comté', nearbyCities: ['belfort'] },
  { slug: 'belfort', name: 'Belfort', region: 'Bourgogne-Franche-Comté', nearbyCities: ['montbeliard'] },

  // ── Orléans & environs (rayon 50 km par route) ────────────────────────────
  { slug: 'orleans', name: 'Orléans', region: 'Centre-Val de Loire', nearbyCities: ['olivet'] },
  // Blois : aucun candidat ≥20k à ≤50 km à vol d'oiseau trouvé
  { slug: 'blois', name: 'Blois', region: 'Centre-Val de Loire', nearbyCities: [] },
  { slug: 'olivet', name: 'Olivet', region: 'Centre-Val de Loire', nearbyCities: ['orleans'] },

  // ── Mulhouse & environs (rayon 50 km par route) ───────────────────────────
  { slug: 'mulhouse', name: 'Mulhouse', region: 'Grand Est', nearbyCities: ['colmar'] },
  { slug: 'colmar', name: 'Colmar', region: 'Grand Est', nearbyCities: ['mulhouse'] },

  // ── Caen & environs (rayon 50 km par route) ───────────────────────────────
  { slug: 'caen', name: 'Caen', region: 'Normandie', nearbyCities: ['herouville-saint-clair'] },
  { slug: 'lisieux', name: 'Lisieux', region: 'Normandie', nearbyCities: ['caen'] },
  { slug: 'herouville-saint-clair', name: 'Hérouville-Saint-Clair', region: 'Normandie', nearbyCities: ['caen'] },

  // ── Ajaccio & environs (Corse, rayon 50 km par route) ─────────────────────
  { slug: 'ajaccio', name: 'Ajaccio', region: 'Corse', nearbyCities: [] },
  { slug: 'porticcio', name: 'Porticcio', region: 'Corse', nearbyCities: ['ajaccio'] },

  // ── Bastia & environs (Corse, rayon 50 km par route) ──────────────────────
  { slug: 'bastia', name: 'Bastia', region: 'Corse', nearbyCities: [] },
  { slug: 'biguglia', name: 'Biguglia', region: 'Corse', nearbyCities: ['bastia'] },

  // ── Pointe-à-Pitre & environs (Guadeloupe, rayon 50 km par route) ─────────
  { slug: 'pointe-a-pitre', name: 'Pointe-à-Pitre', region: 'Guadeloupe',
    nearbyCities: ['les-abymes','baie-mahault','le-gosier'],
  },
  { slug: 'les-abymes', name: 'Les Abymes', region: 'Guadeloupe', nearbyCities: ['pointe-a-pitre'] },
  { slug: 'baie-mahault', name: 'Baie-Mahault', region: 'Guadeloupe', nearbyCities: ['pointe-a-pitre'] },
  { slug: 'le-gosier', name: 'Le Gosier', region: 'Guadeloupe', nearbyCities: ['pointe-a-pitre'] },

  // ── Fort-de-France & environs (Martinique, rayon 50 km par route) ─────────
  { slug: 'fort-de-france', name: 'Fort-de-France', region: 'Martinique', nearbyCities: ['le-lamentin'] },
  { slug: 'le-lamentin', name: 'Le Lamentin', region: 'Martinique', nearbyCities: ['fort-de-france'] },

  // ── Cayenne & environs (Guyane, rayon 50 km par route) ────────────────────
  { slug: 'cayenne', name: 'Cayenne', region: 'Guyane',
    nearbyCities: ['matoury','remire-montjoly'],
  },
  { slug: 'matoury', name: 'Matoury', region: 'Guyane', nearbyCities: ['cayenne'] },
  { slug: 'remire-montjoly', name: 'Rémire-Montjoly', region: 'Guyane', nearbyCities: ['cayenne'] },

  // ── Saint-Denis & Saint-Pierre (La Réunion) ────────────────────────────────
  // Les deux pôles de l'île sont à ~65 km l'un de l'autre (versants opposés) : jamais reliés
  // directement, chacun garde son propre micro-cluster de 50 km. Slugs suffixés "-reunion" pour
  // éviter toute collision avec le Saint-Denis d'Île-de-France (slug 'saint-denis' déjà pris).
  { slug: 'saint-denis-reunion', name: 'Saint-Denis', region: 'La Réunion',
    nearbyCities: ['sainte-marie-reunion','le-port','la-possession'],
  },
  { slug: 'sainte-marie-reunion', name: 'Sainte-Marie', region: 'La Réunion', nearbyCities: ['saint-denis-reunion'] },
  { slug: 'le-port', name: 'Le Port', region: 'La Réunion', nearbyCities: ['saint-denis-reunion'] },
  { slug: 'la-possession', name: 'La Possession', region: 'La Réunion', nearbyCities: ['saint-denis-reunion'] },
  { slug: 'saint-pierre-reunion', name: 'Saint-Pierre', region: 'La Réunion',
    nearbyCities: ['saint-louis-reunion','le-tampon','saint-joseph-reunion'],
  },
  { slug: 'saint-louis-reunion', name: 'Saint-Louis', region: 'La Réunion', nearbyCities: ['saint-pierre-reunion'] },
  { slug: 'le-tampon', name: 'Le Tampon', region: 'La Réunion', nearbyCities: ['saint-pierre-reunion'] },
  { slug: 'saint-joseph-reunion', name: 'Saint-Joseph', region: 'La Réunion', nearbyCities: ['saint-pierre-reunion'] },

  // ── Mamoudzou & environs (Mayotte, rayon 50 km par route) ─────────────────
  { slug: 'mamoudzou', name: 'Mamoudzou', region: 'Mayotte', nearbyCities: ['koungou'] },
  { slug: 'koungou', name: 'Koungou', region: 'Mayotte', nearbyCities: ['mamoudzou'] },

  // ── Villes isolées ────────────────────────────────────────────────────────
  { slug: 'roanne', name: 'Roanne', region: 'Auvergne-Rhône-Alpes', nearbyCities: [] },
];

export const CITIES_MAP = new Map<string, City>(CITIES.map(c => [c.slug, c]));

export function getCity(slug: string): City | undefined {
  return CITIES_MAP.get(slug);
}

export function getAllCities() {
  return CITIES.map((c) => c.slug);
}
