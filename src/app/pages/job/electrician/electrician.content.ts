import type { JobPageContent } from '../_shared/job-content.types';

export const electricianContent: JobPageContent = {
    imagePath: 'assets/img/electricien.jpg',
    imageAlt: 'Électricien vérifié',
    h1: 'Électricien vérifié, du devis à la mise sous tension encadrée',
    slogan: 'Cette page liste les interventions traitées par les électriciens vérifiés d’Artisan Compétent, y compris la domotique, les bornes de recharge et les mises aux normes NF C 15-100, et le mécanisme qui encadre votre paiement de la signature du devis à la libération des fonds 48h après la fin du chantier.',
    metaTitle: 'Électricien vérifié, du devis au paiement encadré | Artisan Compétent',
    metaDescription: 'Électricien vérifié sur Artisan Compétent : SIRET, RC pro, décennale, habilitation NF C 18-510, IRVE. Paiement encadré par séquestre Stripe, 48h pour signaler un abus.',
    body: [
      {
        kind: 'callout',
        title: 'En bref',
        body: 'Un électricien vérifié sur Artisan Compétent a son SIRET contrôlé, ses assurances RC pro et décennale à jour, son habilitation électrique selon NF C 18-510 pour les interventions sous tension, sa qualification IRVE pour les bornes de recharge et la qualification Qualifelec affichée si déclarée. Process encadré par séquestre Stripe : 48h après la fin du chantier pour signaler un abus. Artisan Compétent ambitionne de couvrir toute la France, les DOM-TOM et la Corse, soit 38 zones, rayon de 30 km par ville.',
      },
      { kind: 'h2', text: 'Quand faire appel à un électricien vérifié' },
      {
        kind: 'p',
        text: 'Un électricien vérifié intervient sur les pannes, le tableau, la mise aux normes NF C 15-100, l’habilitation électrique NF C 18-510, la domotique et les bornes de recharge IRVE. L’urgence concerne les pannes générales et les courts-circuits récurrents.',
      },
      {
        kind: 'p',
        text: 'Les électriciens référencés sur Artisan Compétent traitent à la fois le dépannage rapide, la mise aux normes et la rénovation complète. Quelques cas typiques qui justifient un professionnel vérifié plutôt qu’un bricoleur :',
      },
      {
        kind: 'list',
        items: [
          'Panne de courant générale ou partielle, disjoncteur principal qui ne se réarme pas',
          'Court-circuit récurrent, prise qui chauffe, odeur de brûlé au niveau d’un point d’éclairage',
          'Remplacement ou rénovation complète du tableau électrique avec différentiels 30 mA',
          'Mise aux normes NF C 15-100 d’une installation ancienne (prises de terre, sectionnement, dispositifs différentiels)',
          'Habilitation électrique selon NF C 18-510 pour toute intervention sous tension : obligatoire légalement',
          'Pose de prises supplémentaires, points d’éclairage, interrupteurs, va-et-vient',
          'Installation domotique : pilotage centralisé éclairage, volets roulants, chauffage, scénarios, intégration vocale',
          'Pose d’une borne de recharge IRVE pour véhicule électrique avec qualification spécifique requise (Qualifelec IRVE) et déclaration Consuel',
          'Diagnostic électrique complet avant vente, location ou souscription d’une assurance habitation',
        ],
      },
      {
        kind: 'p',
        text: 'Toutes ces interventions engagent la responsabilité décennale de l’électricien sur les installations durables. L’habilitation électrique selon NF C 18-510 est obligatoire dès qu’il y a intervention sous tension. La qualification IRVE est obligatoire pour la pose de bornes de recharge supérieures à 3,7 kW. C’est ce qui rend la vérification de l’artisan indispensable avant la signature du devis.',
      },
      { kind: 'h2', text: 'Pourquoi passer par Artisan Compétent pour vos travaux d’électricité' },
      {
        kind: 'p',
        text: 'Artisan Compétent vérifie l’électricien en amont, encadre votre paiement par séquestre Stripe et vous laisse 48h pour valider la conformité du chantier avant toute libération des fonds.',
      },
      {
        kind: 'p',
        text: 'Chaque électricien référencé sur Artisan Compétent voit son SIRET contrôlé sur les bases publiques (Annuaire des Entreprises, INSEE/SIRENE) et ses assurances vérifiées avant validation du compte sur la plate-forme.',
      },
      {
        kind: 'p',
        text: 'La vérification couvre trois éléments : SIRET actif, attestation d’assurance RC pro couvrant l’activité d’électricien, attestation d’assurance décennale obligatoire sur les installations électriques durables. L’habilitation électrique selon NF C 18-510 est exigée pour les interventions sous tension. La qualification Qualifelec, quand elle est détenue par l’artisan, est mise en avant sur son profil. La qualification IRVE est exigée pour la pose de bornes de recharge. Un électricien dont les documents manquent ou sont périmés n’est pas validé sur Artisan Compétent.',
      },
      {
        kind: 'p',
        text: 'Une fois le devis signé, l’artisan dépose obligatoirement ses documents légaux (attestations d’assurance, habilitation NF C 18-510, qualification IRVE le cas échéant) dans son tableau de bord. Ces documents sont consultables par le client dans son espace personnel. Le client est invité à revérifier en amont les pièces sensibles, notamment l’habilitation électrique et l’attestation IRVE pour la pose d’une borne de recharge ainsi que les assurances.',
      },
      {
        kind: 'p',
        text: 'Le séquestre de fonds est un compte tiers géré via Stripe qui encadre tout le process, du devis à la libération des fonds.',
      },
      {
        kind: 'p',
        text: 'Le paiement quitte votre compte au moment où vous validez le devis de l’électricien, mais reste bloqué sur un compte séquestre Stripe. Les fonds sont libérés à l’artisan 48h après la fin du chantier, sans contestation.',
      },
      {
        kind: 'p',
        emphasis: true,
        text: 'Le déclenchement des 48h est balisé : procès-verbal de réception, fenêtre de réserves, notification de fin de délai.',
      },
      {
        kind: 'p',
        text: 'Concrètement, le délai des 48h ne court pas dans le vide. À la fin du chantier, un procès-verbal de réception est émis sur la plateforme. Ce PV ouvre la fenêtre de 48h pendant laquelle vous pouvez émettre des réserves : malfaçon constatée, non-conformité au devis, finition manquante, document promis non remis. 8h avant la fin du délai, un mail de notification (qui vaut mise en demeure d’examiner le chantier) vous est envoyé pour éviter une libération par simple oubli. Sans réserve émise au terme des 48h, les fonds sont libérés automatiquement à l’artisan. Avec réserve, le séquestre reste actif jusqu’au traitement contradictoire de la contestation.',
      },
      {
        kind: 'p',
        emphasis: true,
        text: 'CMOD est un service payant et optionnel d’accompagnement par un conseiller maître d’ouvrage à distance. Deux appels offerts dans des conditions précises.',
      },
      {
        kind: 'p-link',
        linkText: 'CMOD',
        linkRoute: '/cmod/formule',
        after: ' (Conseiller Maître Ouvrage Digital) est un service payant et optionnel. Deux dispositifs d’appels offerts existent, activés uniquement en cas de litige signalé après échec d’un règlement amiable avec l’artisan.',
      },
      { kind: 'h2', text: 'Combien coûte un dépannage ou une rénovation électrique' },
      {
        kind: 'p',
        text: 'Aucun prix forfaitaire fiable n’existe en électricité : seul un devis détaillé d’un électricien vérifié engage le professionnel sur le coût réel d’une intervention. Une fourchette horaire indicative reste à confirmer par Artisan Compétent et sera ajoutée dans une prochaine itération.',
      },
      {
        kind: 'p',
        text: 'Le tarif d’un chantier électrique dépend de cinq variables qui se cumulent. Les éléments qui font bouger le devis :',
      },
      {
        kind: 'list',
        items: [
          'La nature de l’intervention (dépannage simple, ajout de points électriques, rénovation de tableau, mise aux normes complète, pose de borne de recharge)',
          'L’urgence : intervention en heures ouvrées, nuit, week-end ou jour férié',
          'Le déplacement et l’accessibilité (zone urbaine dense, étage sans ascenseur, accès à la gaine technique)',
          'Le matériel posé : tableau d’entrée de gamme ou industriel, marque et calibrage des différentiels, qualité des prises et appareillages, borne de recharge filaire ou avec mode 3',
          'Les obligations réglementaires : conformité NF C 15-100, visa Consuel sur installation neuve ou rénovation complète, déclaration Enedis pour borne IRVE > 3,7 kW',
        ],
      },
      {
        kind: 'p',
        text: 'Artisan Compétent impose un devis chiffré détaillé et accepté avant toute intervention. La fourchette horaire indicative de l’électricien sera précisée dès que les données métier auront été consolidées. Klarna 3 fois sans frais peut être proposé par l’artisan, négociation client · artisan.',
      },
      { kind: 'h2', text: 'Comparatif Artisan Compétent vs autres plateformes vs Google direct' },
      {
        kind: 'p',
        text: 'Trois manières de trouver un électricien en France. Trois niveaux de protection radicalement différents, particulièrement sur la conformité réglementaire.',
      },
      {
        kind: 'table',
        headers: ['Critère', 'Autres plateformes', 'Google direct', 'Artisan Compétent'],
        rows: [
          ['Vérification SIRET artisan', 'Variable', 'Aucune', 'Systématique avant validation'],
          ['Vérification assurances et habilitation NF C 18-510', 'Rare', 'Aucune', 'RC pro, décennale, habilitation, IRVE si applicable'],
          ['Paiement encadré', 'Variable', 'Aucun', 'Séquestre de fonds Stripe, libération à 48h'],
          ['Recours en cas d’abus', 'Limité', 'Aucun', 'Retenue jusqu’à 250 € sur signalement < 48h'],
          ['Conformité NF C 15-100 et Consuel', 'Variable', 'Aucune', 'Imposée'],
          ['Conseiller maître d’ouvrage', 'Non', 'Aucun', 'CMOD disponible sur option'],
        ],
      },
      { kind: 'h2', text: 'Les 3 pièges à éviter quand on cherche un électricien' },
      {
        kind: 'p',
        text: 'L’électricité concentre des risques de sécurité élevés et des coûts importants en rénovation. Trois pièges reviennent particulièrement.',
      },
      { kind: 'h3', text: 'Piège 1 : Le surdimensionnement de la mise aux normes' },
      {
        kind: 'p',
        text: 'Un électricien diagnostique une installation ancienne et préconise une mise aux normes complète quand seule une remise en sécurité partielle est légalement nécessaire. Le devis grimpe de plusieurs milliers d’euros pour des travaux dont la rentabilité est faible. Un diagnostic sérieux distingue ce qui est obligatoire (mise en sécurité au sens de la loi Borloo), ce qui est recommandé (mise aux normes NF C 15-100 complète) et ce qui est confort. Le devis devrait toujours présenter ces niveaux séparément.',
      },
      { kind: 'h3', text: 'Piège 2 : L’installation non visée Consuel sur une rénovation lourde' },
      {
        kind: 'p',
        text: 'Une rénovation complète de tableau ou la création d’une nouvelle installation imposent un visa Consuel avant mise sous tension par Enedis. Un électricien qui ignore cette étape, soit en omettant de demander le visa, soit en réutilisant un visa antérieur, expose le client à une installation non couverte par l’assurance habitation et à une régularisation à sa charge. Le devis devrait mentionner explicitement le visa Consuel et son coût.',
      },
      { kind: 'h3', text: 'Piège 3 : Le matériel substitué entre devis et pose' },
      {
        kind: 'p',
        text: 'Un devis retient une marque précise de différentiel, de tableau ou de borne de recharge IRVE. À la pose, l’artisan installe une référence générique au prix d’une marque premium. La différence se voit à l’usage (déclenchements intempestifs, durabilité réduite, garantie constructeur moindre). Le devis doit indiquer la marque, la référence et le calibre exacts. Le séquestre permet de bloquer la libération si le matériel livré ne correspond pas.',
      },
      { kind: 'h2', text: 'Votre rôle dans le suivi du chantier' },
      {
        kind: 'p',
        text: 'La protection séquestre s’appuie sur un contradictoire écrit. Votre participation active conditionne la qualité du recours en cas de litige : pas de trace écrite, pas de levier.',
      },
      {
        kind: 'p',
        text: 'Pour les chantiers de plus d’un jour (rénovation de tableau, mise aux normes complète, pose de borne IRVE), l’artisan dépose chaque jour des photos d’avancement dans le tableau de bord partagé client · artisan. Vous commentez, vous validez ou vous signalez dans le même espace, ce qui établit un contradictoire écrit en cas de litige ultérieur. Documentez aussi de votre côté : photos du tableau avant intervention, photos du matériel livré sur site (étiquettes, références), photos à la fin de chaque journée.',
      },
      {
        kind: 'p',
        text: 'En cas de signalement d’abus dans les 48h suivant la fin du chantier (matériel non conforme, installation dangereuse, devis non respecté).',
      },
      { kind: 'h2', text: 'Assurance habitation et remboursement' },
      {
        kind: 'p',
        text: 'En cas de sinistre lié à l’installation électrique (incendie, dégât, vétusté constatée), votre assurance habitation peut rembourser tout ou partie de l’intervention. La démarche est à votre charge auprès de votre assureur. Artisan Compétent n’intervient pas dans la procédure d’indemnisation.',
      },
      {
        kind: 'p',
        text: 'Plusieurs situations courantes ouvrent droit à indemnisation par l’assurance habitation : court-circuit ayant causé un sinistre, incendie d’origine électrique, dégât suite à un défaut d’installation, intervention d’urgence pour mise en sécurité après sinistre. C’est à vous de contacter directement votre assureur après réception du devis pour vérifier l’éligibilité (franchise, plafond, expertise éventuelle). L’attestation Consuel et les photos du chantier déposées dans le tableau de bord facilitent généralement la prise en charge.',
      },
      {
        kind: 'p',
        text: 'Artisan Compétent ne fait pas l’avance, ne se substitue pas à votre assureur et ne suspend pas le séquestre pour attendre une indemnisation. L’intervention est lancée selon le parcours habituel, vous traitez ensuite avec votre assurance en parallèle.',
      },
      { kind: 'h2', text: 'Comment ça marche en 3 étapes' },
      {
        kind: 'p',
        text: 'Le parcours sur Artisan Compétent compte trois étapes : description du besoin, validation du devis avec paiement en séquestre, intervention et libération des fonds après 48h.',
      },
      {
        kind: 'p',
        text: 'Étape 1. Vous décrivez votre besoin (dépannage, mise aux normes, rénovation, pose IRVE, domotique) sur Artisan Compétent et recevez un devis détaillé d’un électricien vérifié de votre zone.',
      },
      {
        kind: 'p',
        text: 'Étape 2. Vous validez le devis, le paiement part en séquestre via Stripe, l’intervention est planifiée.',
      },
      {
        kind: 'p',
        text: 'Étape 3. L’électricien intervient. À la fin du chantier, un procès-verbal de réception est émis sur la plateforme : il ouvre une fenêtre de 48h pendant laquelle vous pouvez émettre des réserves sur la conformité, la mise en sécurité ou le non-respect du devis. Un mail de notification vous est envoyé 8h avant la fin du délai. Sans réserve, les fonds sont libérés automatiquement à l’artisan.',
      },
      { kind: 'h2', text: 'Électricien d’urgence 24h/24, 7j/7' },
      {
        kind: 'p',
        text: 'Artisan Compétent couvre l’électricité en urgence 24h/24 et 7j/7 sur l’ensemble des zones desservies. La règle des 48h pour signaler un abus reste applicable même en sortie nocturne.',
      },
      {
        kind: 'p',
        text: 'L’électricien fait partie des cinq métiers couverts en urgence permanente sur Artisan Compétent, avec le plombier, le serrurier, le chauffagiste et le déboucheur de canalisations. Une panne générale qui ne se rétablit pas, un disjoncteur qui ne se réarme pas, une odeur de brûlé au tableau : ces situations imposent une intervention immédiate. Le protocole reste identique en sortie nocturne : devis chiffré, paiement en séquestre via Stripe, intervention, fenêtre de 48h pour signaler un abus.',
      },
      { kind: 'h2', text: 'Trouver un électricien vérifié dans votre ville' },
      {
        kind: 'p',
        emphasis: true,
        text: 'Artisan Compétent ambitionne de couvrir toute la France, les DOM-TOM et la Corse, soit 38 zones, avec un rayon d’intervention de 30 km autour de chaque ville référencée.',
      },
      {
        kind: 'p',
        text: 'Vous pouvez chercher un électricien vérifié dans les principales métropoles françaises. Chaque artisan référencé a son SIRET contrôlé et ses assurances vérifiées avant validation sur la plateforme.',
      },
      {
        kind: 'cities',
        items: [
          'Électricien Paris',
          'Électricien Marseille',
          'Électricien Lyon',
          'Électricien Toulouse',
          'Électricien Nice',
          'Électricien Nantes',
          'Électricien Montpellier',
          'Électricien Strasbourg',
          'Électricien Bordeaux',
          'Électricien Lille',
        ],
      },
      { kind: 'h2', text: 'Klarna, comment ça marche' },
      {
        kind: 'p',
        text: 'Klarna est un service de paiement échelonné en 3 fois sans frais. Artisan Compétent met cet outil à disposition dans le parcours de paiement. Son activation se négocie entre le client et l’artisan : ce n’est pas automatique.',
      },
      {
        kind: 'p',
        text: 'Si l’artisan accepte de proposer Klarna sur votre devis, le mécanisme du séquestre de fonds reste actif et le paiement reste protégé jusqu’à validation du chantier à 48h. Pour les chantiers plus importants (rénovation complète de tableau, pose de borne IRVE avec génie civil).',
      },
      { kind: 'h2', text: 'Questions fréquentes' },
      {
        kind: 'p',
        text: 'Cette FAQ regroupe les questions les plus posées par les particuliers qui cherchent un électricien vérifié sur Artisan Compétent.',
      },
      {
        kind: 'faq',
        items: [
          {
            question: 'Quelle est la différence entre mise en sécurité et mise aux normes électriques ?',
            answers: [
              'La mise en sécurité couvre les points strictement nécessaires pour éviter un danger immédiat (protection différentielle 30 mA sur les circuits sensibles, prise de terre, sectionnement). La mise aux normes complète NF C 15-100 va plus loin : nombre de prises par pièce, sections de câble, équipotentialité, distribution sur circuits dédiés. Un diagnostic sérieux distingue ces deux niveaux. La mise en sécurité est généralement imposée à la vente ou à la location, la mise aux normes complète relève d’un choix de rénovation.',
            ],
          },
          {
            question: 'Faut-il toujours un visa Consuel après des travaux électriques ?',
            answers: [
              'Le visa Consuel est obligatoire pour toute nouvelle installation ou pour une rénovation complète impliquant la création d’un nouveau branchement ou une refonte significative du tableau. Pour un simple dépannage ou un ajout limité de points, il n’est pas requis. L’électricien vérifié connaît le périmètre exact et l’indique au devis. Un visa Consuel manquant sur une installation qui le requiert peut bloquer le raccordement Enedis et fragiliser la couverture assurance.',
            ],
          },
          {
            question: 'L’habilitation électrique NF C 18-510, c’est quoi exactement ?',
            answers: [
              'NF C 18-510 est la norme française qui encadre les opérations sur ouvrages électriques. Elle définit des niveaux d’habilitation (B0, B1V, B2V, BR, BC, etc.) selon le type d’intervention (hors tension, sous tension, basse tension, haute tension, consignation). Tout électricien qui intervient sous tension doit être habilité au niveau correspondant. Sur Artisan Compétent, l’habilitation est vérifiée en amont et déposée dans le tableau de bord de l’artisan.',
            ],
          },
          {
            question: 'Combien coûte une installation de borne de recharge pour véhicule électrique ?',
            answers: [
              'Le coût dépend de la puissance de la borne (3,7 kW, 7,4 kW, 11 kW, 22 kW), du mode de communication (mode 2 ou mode 3), de la distance entre le tableau et l’emplacement, du génie civil éventuel, et de la déclaration Enedis. Aucun forfait national fiable n’existe et Artisan Compétent ne communique pas de fourchette inventée. La qualification IRVE est obligatoire pour les bornes supérieures à 3,7 kW. Le crédit d’impôt et les aides Advenir peuvent prendre en charge une partie de l’installation.',
            ],
          },
          {
            question: 'Klarna 3 fois sans frais est-il disponible pour une rénovation électrique ?',
            answers: [
              'Klarna 3 fois sans frais peut être proposé par l’artisan dans le respect des plafonds Klarna en vigueur. L’activation n’est pas automatique : elle se négocie entre vous et l’artisan. Le séquestre de fonds reste actif : le paiement échelonné est tout de même protégé jusqu’à validation du chantier à 48h.',
            ],
          },
          {
            question: 'Mon assurance habitation peut-elle rembourser des travaux électriques d’urgence ?',
            answers: [
              'En cas de sinistre lié à l’installation électrique (court-circuit ayant causé un dommage, incendie d’origine électrique), votre assurance habitation peut prendre en charge tout ou partie de l’intervention de mise en sécurité. C’est à vous de contacter directement votre assureur après réception du devis. L’attestation Consuel et les photos du tableau avant et après intervention facilitent généralement la prise en charge.',
            ],
          },
          {
            question: 'Quelles villes sont couvertes par Artisan Compétent pour l’électricité ?',
            answers: [
              'Artisan Compétent ambitionne de couvrir toute la France, les DOM-TOM et la Corse, soit 38 zones, avec un rayon d’intervention de 30 km autour de chaque ville référencée. Les grandes métropoles (Paris, Marseille, Lyon, Toulouse, Nice, Nantes, Montpellier, Strasbourg, Bordeaux, Lille) sont couvertes ainsi que de nombreuses villes moyennes.',
            ],
          },
          {
            question: 'Faut-il une attestation Qualifelec pour un simple dépannage électrique ?',
            answers: [
              'Non, la qualification Qualifelec n’est pas obligatoire pour exercer en tant qu’électricien. Elle reste un indicateur fort de compétence reconnu par l’écosystème (assureurs, syndics, donneurs d’ordre). En revanche, l’habilitation électrique selon NF C 18-510 est légalement requise pour toute intervention sous tension. Sur Artisan Compétent, l’assurance et le SIRET sont vérifiés, et la Qualifelec quand elle existe est mise en avant sur le profil.',
            ],
          },
        ],
      },
    ],
};
