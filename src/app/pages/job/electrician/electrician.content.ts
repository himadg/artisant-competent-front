import type { JobPageContent } from '../_shared/job-content.types';

export const electricianContent: Record<'fr' | 'en', JobPageContent> = {
  fr: {
    imagePath: 'assets/img/electricien.jpg',
    imageAlt: 'Électricien vérifié',
    h1: 'Électricien vérifié, du devis à la mise sous tension encadrée',
    slogan: 'Cette page liste les interventions traitées par les électriciens vérifiés d’Artisan Compétent, y compris la domotique, les bornes de recharge et les mises aux normes NF C 15-100, et le mécanisme qui encadre votre paiement de la signature du devis à la libération des fonds 48h après la fin du chantier.',
    metaTitle: 'Électricien vérifié, du devis à la mise sous tension encadrée | Artisan Compétent',
    metaDescription: 'Sur Artisan Compétent, un électricien vérifié a son SIRET, ses assurances et son habilitation électrique NF C 18-510 contrôlés en amont, et tout son…',
    body: [
      {
        kind: 'callout',
        title: 'En une phrase',
        body: 'Sur Artisan Compétent, un électricien vérifié a son SIRET, ses assurances et son habilitation électrique NF C 18-510 contrôlés en amont, et tout son chantier est encadré par un séquestre de fonds Stripe qui retient le paiement jusqu’à 48h après la mise sous tension. Vous payez seulement si l’installation est conforme au devis et aux normes.',
      },
      {
        kind: 'p',
        text: 'Un électricien vérifié sur Artisan Compétent a son SIRET contrôlé, ses assurances RC pro et décennale à jour, et son habilitation électrique en règle pour les interventions sous tension selon NF C 18-510. Les chantiers de rénovation complète sont conformes à la norme NF C 15-100 et terminés par un visa Consuel lorsque la réglementation l’impose. Tout le process est encadré par un séquestre de fonds Stripe : il reste bloqué jusqu’à 48h après la fin du chantier, fenêtre pendant laquelle vous pouvez signaler un abus, une non-conformité ou un matériel non conforme au devis.',
      },
      {
        kind: 'callout',
        title: 'En bref',
        body: 'Un électricien vérifié sur Artisan Compétent a son SIRET contrôlé, ses assurances RC pro et décennale à jour, son habilitation électrique selon NF C 18-510 pour les interventions sous tension, sa qualification IRVE pour les bornes de recharge et la qualification Qualifelec affichée si déclarée. Process encadré par séquestre Stripe : 48h après la fin du chantier pour signaler un abus. Couverture France métropolitaine, DOM-TOM et Corse sur 38 zones, rayon de 30 km par ville.',
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
        emphasis: true,
        text: 'Chaque électricien référencé sur Artisan Compétent voit son SIRET contrôlé sur les bases publiques (Annuaire des Entreprises, INSEE/SIRENE) et ses assurances vérifiées avant validation.',
      },
      {
        kind: 'p',
        text: 'La vérification couvre trois éléments : SIRET actif, attestation d’assurance RC pro couvrant l’activité d’électricien, attestation d’assurance décennale obligatoire sur les installations électriques durables. L’habilitation électrique selon NF C 18-510 est exigée pour les interventions sous tension. La qualification Qualifelec, quand elle est détenue par l’artisan, est mise en avant sur son profil. La qualification IRVE est exigée pour la pose de bornes de recharge. Un électricien dont les documents manquent ou sont périmés n’est pas validé sur Artisan Compétent.',
      },
      {
        kind: 'p',
        text: 'Une fois le devis signé, l’artisan dépose obligatoirement ses documents légaux (attestations d’assurance, habilitation NF C 18-510, qualification IRVE le cas échéant) dans son tableau de bord. Ces documents sont consultables par le client dans son espace personnel. Le client est invité à revérifier en amont les pièces sensibles, notamment l’habilitation électrique et l’attestation IRVE pour la pose d’une borne de recharge.',
      },
      {
        kind: 'p',
        emphasis: true,
        text: 'Le séquestre de fonds est un compte tiers géré via Stripe qui encadre tout le process, du devis à la libération des fonds.',
      },
      {
        kind: 'p',
        text: 'Le paiement quitte votre compte au moment où vous validez le devis de l’électricien, mais reste bloqué sur un compte séquestre Stripe. Les fonds sont libérés à l’artisan 48h après la fin du chantier, sans contestation. Cette mise en attente vous laisse le temps de tester l’installation, de vérifier que les modifications correspondent au devis signé et, le cas échéant, de demander un visa Consuel si la rénovation l’exige. Pour les chantiers en plusieurs phases (dépose, passage de gaines, raccordement, mise sous tension), le paiement peut être découpé par jalons, chacun encadré par le séquestre.',
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
        kind: 'p',
        text: 'CMOD (Conseiller Maître Ouvrage Digital) est un service payant et optionnel. Deux dispositifs d’appels offerts existent, activés uniquement en cas de litige signalé après échec d’un règlement amiable avec l’artisan :',
      },
      {
        kind: 'list',
        items: [
          'Sur les devis entre 2 000 € et 5 000 €, un appel de 20 minutes est offert.',
          'Au-delà de 5 000 €, l’appel offert passe à 45 minutes.',
        ],
      },
      {
        kind: 'p',
        text: 'Pour les interventions sous 2 000 €, le CMOD gratuit n’est pas automatique. Le client peut écrire à Artisan Compétent, qui traite la demande sous 24 à 48h selon la charge. Le suivi complet en amont du chantier (relecture du devis, points d’étape, contrôle du visa Consuel, vérification NF C 15-100) reste sur option payante. Pour l’électricité, le CMOD payant est précieux sur les rénovations complètes de tableau, l’installation d’une borne de recharge IRVE, ou la rénovation lourde d’un appartement ancien.',
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
        text: 'Artisan Compétent impose un devis chiffré détaillé et accepté avant toute intervention non-urgence. La fourchette horaire indicative de l’électricien sera précisée dès que les données métier auront été consolidées. Klarna 3 fois sans frais peut être proposé par l’artisan, négociation client · artisan.',
      },
      { kind: 'h2', text: 'Comparatif : Artisan Compétent vs autres plateformes vs Google direct' },
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
          ['Paiement encadré', 'Non', 'Séquestre de fonds Stripe, libération à 48h', ''],
          ['Recours en cas d’abus', 'Limité', 'Aucun', 'Retenue jusqu’à 250 € sur signalement < 48h'],
          ['Conformité NF C 15-100 et Consuel', 'Variable', 'Aucune', 'Imposée et tracée'],
          ['Conseiller maître d’ouvrage', 'Non', 'CMOD disponible sur option', ''],
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
        text: 'Une rénovation complète de tableau ou la création d’une nouvelle installation imposent un visa Consuel avant mise sous tension par Enedis. Un électricien qui shunte cette étape, soit en omettant de demander le visa, soit en réutilisant un visa antérieur, expose le client à une installation non couverte par l’assurance habitation et à une régularisation à sa charge. Le devis devrait mentionner explicitement le visa Consuel et son coût.',
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
        text: 'En cas de signalement d’abus dans les 48h suivant la fin du chantier (matériel non conforme, installation dangereuse, devis non respecté), Artisan Compétent peut retenir jusqu’à 250 € sur la facturation de l’artisan avant validation du paiement, conformément aux CGU et CGV. Pour une installation présentant un risque sécurité, un contrôle par un électricien tiers ou un visa Consuel peut être exigé avant libération des fonds.',
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
        text: 'Artisan Compétent couvre la France métropolitaine, les DOM-TOM et la Corse, soit 38 zones avec un rayon d’intervention de 30 km autour de chaque ville référencée.',
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
      { kind: 'h2', text: 'Klarna : comment ça marche' },
      {
        kind: 'p',
        text: 'Klarna est un service de paiement échelonné en 3 fois sans frais. Artisan Compétent met cet outil à disposition dans le parcours de paiement. Son activation se négocie entre le client et l’artisan : ce n’est pas automatique.',
      },
      {
        kind: 'p',
        text: 'Si l’artisan accepte de proposer Klarna sur votre devis, le mécanisme du séquestre de fonds reste actif et le paiement reste protégé jusqu’à validation du chantier à 48h. Pour les chantiers plus importants (rénovation complète de tableau, pose de borne IRVE avec génie civil), un découpage par jalons négocié avec l’artisan est souvent plus adapté qu’un échelonnement Klarna automatique.',
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
              'Klarna 3 fois sans frais peut être proposé par l’artisan dans le respect des plafonds Klarna en vigueur. L’activation n’est pas automatique : elle se négocie entre vous et l’artisan. Le séquestre de fonds reste actif : le paiement échelonné est tout de même protégé jusqu’à validation du chantier à 48h. Pour les chantiers plus importants, le découpage par jalons négocié avec l’artisan est généralement plus adapté qu’un paiement Klarna automatique.',
            ],
          },
          {
            question: 'À quoi sert CMOD pour un chantier électrique ?',
            answers: [
              'CMOD est un service payant et optionnel d’accompagnement par un conseiller maître d’ouvrage à distance. Un appel de 20 minutes est offert pour les devis entre 2 000 € et 5 000 € en cas de litige signalé après échec d’un règlement amiable, 45 minutes au-delà de 5 000 € dans les mêmes conditions. Sous 2 000 €, le client peut écrire à Artisan Compétent pour demander une intervention CMOD, traitée sous 24 à 48h. Le suivi complet en amont (relecture du devis, points d’étape, contrôle Consuel, vérification NF C 15-100) reste sur option payante.',
            ],
          },
          {
            question: 'Mon assurance habitation peut-elle rembourser des travaux électriques d’urgence ?',
            answers: [
              'En cas de sinistre lié à l’installation électrique (court-circuit ayant causé un dommage, incendie d’origine électrique), votre assurance habitation peut prendre en charge tout ou partie de l’intervention de mise en sécurité. C’est à vous de contacter directement votre assureur après réception du devis. L’attestation Consuel et les photos du tableau avant et après intervention facilitent généralement la prise en charge.',
            ],
          },
          {
            question: 'Que faire si l’électricien ne respecte pas le devis ou laisse une installation dangereuse ?',
            answers: [
              'Vous signalez l’abus ou la non-conformité dans les 48h suivant la fin du chantier, via le tableau de bord partagé. Les fonds restent bloqués en séquestre tant que cette fenêtre court. Artisan Compétent peut retenir jusqu’à 250 € sur la facturation de l’artisan avant validation. Pour une installation présentant un risque sécurité, un contrôle par un électricien tiers ou un visa Consuel peut être exigé avant libération des fonds.',
            ],
          },
          {
            question: 'Quelles villes sont couvertes par Artisan Compétent pour l’électricité ?',
            answers: [
              'Artisan Compétent couvre la France métropolitaine, les DOM-TOM et la Corse, soit 38 zones, avec un rayon d’intervention de 30 km autour de chaque ville référencée. Les grandes métropoles (Paris, Marseille, Lyon, Toulouse, Nice, Nantes, Montpellier, Strasbourg, Bordeaux, Lille) sont couvertes ainsi que de nombreuses villes moyennes.',
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
      { kind: 'h2', text: 'Pour aller plus loin' },
      {
        kind: 'p',
        text: 'Une panne générale qui revient toutes les semaines, un tableau électrique d’un autre âge, une borne de recharge IRVE à installer, une installation domotique à déployer ou une mise en conformité avant vente : dans chaque cas, l’enjeu est de trouver un électricien vérifié et de garder la main sur le devis. Artisan Compétent encadre la vérification de l’artisan et tout votre process par séquestre jusqu’à 48h après la fin du chantier.',
      },
      {
        kind: 'p',
        text: 'Électricien vérifié SIRET, RC pro et décennale. Habilitation NF C 18-510 contrôlée. Qualification IRVE pour bornes de recharge. Process encadré par séquestre Stripe. Retenue jusqu’à 250 € en cas de signalement d’abus.',
      },
    ],
  },

  en: {
    imagePath: 'assets/img/electricien.jpg',
    imageAlt: 'Verified electrician',
    h1: 'Verified electrician, from quote to overseen energising',
    slogan: 'This page lists the call-outs handled by the verified electricians on Artisan Compétent, including home automation, EV charging stations and NF C 15-100 compliance upgrades, and the mechanism that oversees your payment from the signed quote to the release of funds 48 hours after the project ends.',
    metaTitle: 'Verified electrician, from quote to overseen energising | Artisan Compétent',
    metaDescription: 'On Artisan Compétent, a verified electrician has their SIRET, insurance and NF C 18-510 electrical authorisation checked upfront, and the whole project…',
    body: [
      {
        kind: 'callout',
        title: 'In one sentence',
        body: 'On Artisan Compétent, a verified electrician has their SIRET, insurance and NF C 18-510 electrical authorisation checked upfront, and the whole project is overseen by a Stripe fund escrow that withholds payment until 48 hours after energising. You only pay if the installation matches the quote and the standards.',
      },
      {
        kind: 'p',
        text: 'A verified electrician on Artisan Compétent has their SIRET checked, their professional liability and ten-year warranty insurance up to date, and their electrical authorisation valid for live work under NF C 18-510. Full renovation projects comply with the NF C 15-100 standard and end with a Consuel sign-off when the regulation requires it. The whole process is overseen by a Stripe fund escrow: it stays held until 48 hours after the project ends, a window during which you can flag abuse, non-compliance or equipment that does not match the quote.',
      },
      {
        kind: 'callout',
        title: 'In short',
        body: 'A verified electrician on Artisan Compétent has their SIRET checked, their professional liability and ten-year warranty insurance up to date, their NF C 18-510 electrical authorisation for live work, the IRVE qualification for EV charging stations and the Qualifelec qualification displayed when declared. Process overseen by Stripe escrow: 48 hours after the project ends to flag abuse. Coverage across mainland France, the French overseas territories and Corsica, with 38 zones and a 30 km radius per city.',
      },
      { kind: 'h2', text: 'When to call on a verified electrician' },
      {
        kind: 'p',
        text: 'A verified electrician handles breakdowns, the electrical panel, NF C 15-100 compliance upgrades, NF C 18-510 electrical authorisation work, home automation and IRVE-qualified EV charging stations. Emergencies concern general power failures and recurring short circuits.',
      },
      {
        kind: 'p',
        text: 'The electricians listed on Artisan Compétent cover quick repairs, compliance upgrades and full renovation. A few typical cases that justify a verified professional rather than a DIYer:',
      },
      {
        kind: 'list',
        items: [
          'General or partial power failure, main breaker that will not reset',
          'Recurring short circuit, socket that heats up, burnt smell at a light fitting',
          'Replacement or full renovation of the electrical panel with 30 mA differentials',
          'NF C 15-100 compliance upgrade of an old installation (earthing, isolation, residual-current devices)',
          'NF C 18-510 electrical authorisation for any live work: legally mandatory',
          'Fitting additional sockets, light points, switches, two-way switches',
          'Home automation install: centralised control of lighting, roller shutters, heating, scenes, voice integration',
          'IRVE EV charging station installation requiring a specific qualification (Qualifelec IRVE) and a Consuel declaration',
          'Full electrical diagnosis before a sale, a tenancy or signing a home insurance policy',
        ],
      },
      {
        kind: 'p',
        text: 'All these call-outs engage the electrician’s ten-year liability on durable installations. NF C 18-510 electrical authorisation is mandatory as soon as live work is involved. The IRVE qualification is mandatory for installing charging stations above 3.7 kW. That is what makes verifying the tradesperson essential before the quote is signed.',
      },
      { kind: 'h2', text: 'Why go through Artisan Compétent for your electrical work' },
      {
        kind: 'p',
        text: 'Artisan Compétent verifies the electrician upfront, oversees your payment via a Stripe fund escrow, and gives you 48 hours to validate the compliance of the project before any release of funds.',
      },
      {
        kind: 'p',
        emphasis: true,
        text: 'Every electrician listed on Artisan Compétent has their SIRET checked against the public registers (Annuaire des Entreprises, INSEE/SIRENE) and their insurance verified before approval.',
      },
      {
        kind: 'p',
        text: 'The verification covers three items: an active SIRET, a professional liability insurance certificate covering electrician activity, and the mandatory ten-year warranty insurance certificate on durable electrical installations. NF C 18-510 electrical authorisation is required for live work. The Qualifelec qualification, when held by the tradesperson, is highlighted on their profile. The IRVE qualification is required for installing charging stations. An electrician whose documents are missing or expired is not approved on Artisan Compétent.',
      },
      {
        kind: 'p',
        text: 'Once the quote is signed, the tradesperson is required to upload their legal documents (insurance certificates, NF C 18-510 authorisation, IRVE qualification if applicable) into their dashboard. These documents are available to the client from their personal account area. Clients are invited to recheck the sensitive items upfront, especially the electrical authorisation and the IRVE certificate when installing a charging station.',
      },
      {
        kind: 'p',
        emphasis: true,
        text: 'The fund escrow is a third-party account managed via Stripe that oversees the whole process, from quote to release of funds.',
      },
      {
        kind: 'p',
        text: 'The payment leaves your account when you approve the electrician’s quote, but stays held in a Stripe escrow account. The funds are released to the tradesperson 48 hours after the project ends, with no dispute. This hold gives you time to test the installation, to check that the changes match the signed quote and, where relevant, to request a Consuel sign-off if the renovation requires it. For multi-phase projects (strip-out, conduit pulling, hook-up, energising), the payment can be split by milestone, each one overseen by the escrow.',
      },
      {
        kind: 'p',
        emphasis: true,
        text: 'The 48-hour countdown is structured: completion report, window for reservations, end-of-window notification.',
      },
      {
        kind: 'p',
        text: 'Concretely, the 48 hours do not run in a vacuum. At the end of the project, a completion report is issued on the platform. That report opens the 48-hour window during which you can raise reservations: a defect noted, non-compliance with the quote, a missing finish, a document promised but not provided. 8 hours before the end of the window, a notification email (which acts as a formal notice to inspect the project) is sent to you so that funds are not released by simple oversight. With no reservation raised by the end of the 48 hours, the funds are released automatically to the tradesperson. With a reservation, the escrow stays active until the contradictory handling of the dispute.',
      },
      {
        kind: 'p',
        emphasis: true,
        text: 'CMOD is a paid, optional service of remote support by a project-owner advisor. Two free calls under specific conditions.',
      },
      {
        kind: 'p',
        text: 'CMOD (Digital Project Owner Advisor) is a paid, optional service. Two free-call schemes exist, activated only in case of a dispute reported after an amicable settlement with the tradesperson has failed:',
      },
      {
        kind: 'list',
        items: [
          'On quotes between €2,000 and €5,000, a 20-minute call is included.',
          'Above €5,000, the included call extends to 45 minutes.',
        ],
      },
      {
        kind: 'p',
        text: 'For call-outs below €2,000, free CMOD is not automatic. The client can write to Artisan Compétent, who handles the request within 24 to 48 hours depending on workload. Full upstream support during the project (quote review, check-ins, Consuel sign-off check, NF C 15-100 verification) remains a paid option. For electrical work, paid CMOD is especially useful for full panel renovations, IRVE charging station installs, or heavy renovation of an older flat.',
      },
      { kind: 'h2', text: 'How much does an electrical repair or renovation cost' },
      {
        kind: 'p',
        text: 'No reliable flat rate exists in electrical work: only a detailed quote from a verified electrician commits the professional to the real cost of a call-out. An indicative hourly range remains to be confirmed by Artisan Compétent and will be added in a future iteration.',
      },
      {
        kind: 'p',
        text: 'The price of an electrical project depends on five variables that add up. The elements that move the quote:',
      },
      {
        kind: 'list',
        items: [
          'The nature of the call-out (simple repair, adding electrical points, panel renovation, full compliance upgrade, charging station installation)',
          'Urgency: call-out during business hours, at night, on weekends or public holidays',
          'Travel and access (dense urban area, walk-up flat with no lift, access to the service shaft)',
          'The equipment fitted: entry-level or industrial panel, brand and rating of differentials, quality of sockets and accessories, hard-wired or mode-3 charging station',
          'Regulatory obligations: NF C 15-100 compliance, Consuel sign-off on a new installation or full renovation, Enedis declaration for IRVE charging stations above 3.7 kW',
        ],
      },
      {
        kind: 'p',
        text: 'Artisan Compétent requires a detailed, priced and accepted quote before any non-emergency call-out. The indicative hourly range for electricians will be specified once the industry data has been consolidated. Klarna in 3 interest-free instalments can be offered by the tradesperson, negotiated between client and tradesperson.',
      },
      { kind: 'h2', text: 'Comparison: Artisan Compétent vs other platforms vs direct Google' },
      {
        kind: 'p',
        text: 'Three ways to find an electrician in France. Three radically different levels of protection, especially on regulatory compliance.',
      },
      {
        kind: 'table',
        headers: ['Criterion', 'Other platforms', 'Direct Google', 'Artisan Compétent'],
        rows: [
          ['Tradesperson SIRET check', 'Variable', 'None', 'Systematic before approval'],
          ['Insurance and NF C 18-510 authorisation check', 'Rare', 'None', 'Professional liability, ten-year, authorisation, IRVE if applicable'],
          ['Overseen payment', 'No', 'Stripe fund escrow, release at 48 hours', ''],
          ['Recourse in case of abuse', 'Limited', 'None', 'Up to €250 withheld on a report under 48 hours'],
          ['NF C 15-100 and Consuel compliance', 'Variable', 'None', 'Required and traced'],
          ['Project-owner advisor', 'No', 'CMOD available as an option', ''],
        ],
      },
      { kind: 'h2', text: 'The 3 pitfalls to avoid when looking for an electrician' },
      {
        kind: 'p',
        text: 'Electrical work concentrates high safety risks and significant renovation costs. Three pitfalls keep coming back.',
      },
      { kind: 'h3', text: 'Pitfall 1: Oversizing the compliance upgrade' },
      {
        kind: 'p',
        text: 'An electrician diagnoses an old installation and recommends a full compliance upgrade when only a partial safety upgrade is legally necessary. The quote climbs by several thousand euros for work with low pay-off. A serious diagnosis distinguishes what is mandatory (safety upgrade in the sense of the Borloo Act), what is recommended (full NF C 15-100 compliance) and what is comfort. The quote should always present these levels separately.',
      },
      { kind: 'h3', text: 'Pitfall 2: An installation without a Consuel sign-off on a major renovation' },
      {
        kind: 'p',
        text: 'A full panel renovation or the creation of a new installation requires a Consuel sign-off before energising by Enedis. An electrician who skips this step, either by failing to request the sign-off or by reusing an earlier one, exposes the client to an installation not covered by home insurance and to a remediation at the client’s own cost. The quote should explicitly mention the Consuel sign-off and its cost.',
      },
      { kind: 'h3', text: 'Pitfall 3: Equipment swapped between quote and installation' },
      {
        kind: 'p',
        text: 'A quote specifies a precise brand of differential, panel or IRVE charging station. At installation, the tradesperson fits a generic reference at the price of a premium brand. The difference shows in use (nuisance tripping, reduced lifespan, weaker manufacturer warranty). The quote must state the exact brand, reference and rating. The escrow lets you block the release if the delivered equipment does not match.',
      },
      { kind: 'h2', text: 'Your role in monitoring the project' },
      {
        kind: 'p',
        text: 'Escrow protection relies on a written contradictory record. Your active participation conditions the quality of the recourse in case of a dispute: no paper trail, no leverage.',
      },
      {
        kind: 'p',
        text: 'For projects lasting more than one day (panel renovation, full compliance upgrade, IRVE charging station install), the tradesperson uploads progress photos every day into the shared client · tradesperson dashboard. You comment, validate or flag in that same space, which establishes a written contradictory record in case of a later dispute. Document things on your side too: photos of the panel before the call-out, photos of the equipment delivered on site (labels, references), photos at the end of each day.',
      },
      {
        kind: 'p',
        text: 'In case of an abuse report within 48 hours after the end of the project (non-compliant equipment, unsafe installation, quote not respected), Artisan Compétent can withhold up to €250 from the tradesperson’s billing before payment is approved, in accordance with the platform’s Terms and Conditions. For an installation presenting a safety risk, an inspection by a third-party electrician or a Consuel sign-off may be required before the release of funds.',
      },
      { kind: 'h2', text: 'Home insurance and reimbursement' },
      {
        kind: 'p',
        text: 'In case of an incident linked to the electrical installation (fire, damage, observed wear), your home insurance may reimburse all or part of the call-out. The procedure is your responsibility with your insurer. Artisan Compétent does not intervene in the indemnification procedure.',
      },
      {
        kind: 'p',
        text: 'Several common situations open the door to indemnification by home insurance: a short circuit that caused damage, a fire of electrical origin, damage following a faulty installation, an emergency safety call-out after an incident. It is up to you to contact your insurer directly after receiving the quote to check eligibility (excess, cap, possible expert assessment). The Consuel certificate and the project photos uploaded into the dashboard usually make the claim easier.',
      },
      {
        kind: 'p',
        text: 'Artisan Compétent does not advance funds, does not act in place of your insurer and does not suspend the escrow to wait for indemnification. The call-out runs through the usual path; you then handle your insurer in parallel.',
      },
      { kind: 'h2', text: 'How it works in 3 steps' },
      {
        kind: 'p',
        text: 'The journey on Artisan Compétent has three steps: describing the need, approving the quote with payment placed in escrow, the call-out itself and release of funds after 48 hours.',
      },
      {
        kind: 'p',
        text: 'Step 1. You describe your need (repair, compliance upgrade, renovation, IRVE install, home automation) on Artisan Compétent and receive a detailed quote from a verified electrician in your area.',
      },
      {
        kind: 'p',
        text: 'Step 2. You approve the quote, the payment goes into escrow via Stripe, the call-out is scheduled.',
      },
      {
        kind: 'p',
        text: 'Step 3. The electrician carries out the call-out. At the end of the project, a completion report is issued on the platform: it opens a 48-hour window during which you can raise reservations on compliance, safety or non-respect of the quote. A notification email is sent to you 8 hours before the end of the window. With no reservation, the funds are released automatically to the tradesperson.',
      },
      { kind: 'h2', text: 'Emergency electrician 24/7' },
      {
        kind: 'p',
        text: 'Artisan Compétent covers emergency electrical work 24/7 across all served zones. The 48-hour rule to flag abuse still applies, even for a night-time call-out.',
      },
      {
        kind: 'p',
        text: 'The electrician is one of the five trades covered around the clock on Artisan Compétent, together with the plumber, the locksmith, the heating engineer and the drain unblocker. A general failure that will not come back on, a breaker that will not reset, a burnt smell at the panel: these situations call for an immediate response. The protocol stays identical for a night-time call-out: priced quote, payment placed in escrow via Stripe, call-out, 48-hour window to flag abuse.',
      },
      { kind: 'h2', text: 'Find a verified electrician in your city' },
      {
        kind: 'p',
        text: 'Artisan Compétent covers mainland France, the French overseas territories and Corsica, with 38 zones and a 30 km call-out radius around each listed city.',
      },
      {
        kind: 'p',
        text: 'You can look for a verified electrician in the main French cities. Every listed tradesperson has their SIRET checked and their insurance verified before approval on the platform.',
      },
      {
        kind: 'cities',
        items: [
          'Electrician in Paris',
          'Electrician in Marseille',
          'Electrician in Lyon',
          'Electrician in Toulouse',
          'Electrician in Nice',
          'Electrician in Nantes',
          'Electrician in Montpellier',
          'Electrician in Strasbourg',
          'Electrician in Bordeaux',
          'Electrician in Lille',
        ],
      },
      { kind: 'h2', text: 'Klarna: how it works' },
      {
        kind: 'p',
        text: 'Klarna is a payment service that splits the amount into 3 interest-free instalments. Artisan Compétent makes this tool available in the payment journey. Its activation is negotiated between the client and the tradesperson: it is not automatic.',
      },
      {
        kind: 'p',
        text: 'If the tradesperson agrees to offer Klarna on your quote, the fund-escrow mechanism stays in place and the payment stays protected until the project is validated at 48 hours. For larger projects (full panel renovation, IRVE charging station install with civil engineering), a milestone-based split negotiated with the tradesperson is often more suitable than an automatic Klarna instalment plan.',
      },
      { kind: 'h2', text: 'Frequently asked questions' },
      {
        kind: 'p',
        text: 'This FAQ gathers the questions most often asked by individuals looking for a verified electrician on Artisan Compétent.',
      },
      {
        kind: 'faq',
        items: [
          {
            question: 'What is the difference between a safety upgrade and a full electrical compliance upgrade?',
            answers: [
              'A safety upgrade covers the items strictly needed to avoid an immediate hazard (30 mA residual-current protection on sensitive circuits, earthing, isolation). A full NF C 15-100 compliance upgrade goes further: number of sockets per room, cable sections, equipotential bonding, dedicated circuit distribution. A serious diagnosis distinguishes these two levels. The safety upgrade is generally required at a sale or tenancy; the full compliance upgrade is a renovation choice.',
            ],
          },
          {
            question: 'Is a Consuel sign-off always required after electrical work?',
            answers: [
              'The Consuel sign-off is mandatory for any new installation or for a full renovation involving a new connection or a significant reworking of the panel. For a simple repair or a limited addition of points, it is not required. The verified electrician knows the exact scope and states it on the quote. A missing Consuel sign-off on an installation that requires one can block the Enedis connection and weaken insurance cover.',
            ],
          },
          {
            question: 'What exactly is NF C 18-510 electrical authorisation?',
            answers: [
              'NF C 18-510 is the French standard that frames operations on electrical installations. It defines authorisation levels (B0, B1V, B2V, BR, BC, etc.) according to the type of work (de-energised, live, low voltage, high voltage, isolation). Any electrician carrying out live work must hold the corresponding authorisation. On Artisan Compétent, the authorisation is verified upfront and uploaded into the tradesperson’s dashboard.',
            ],
          },
          {
            question: 'How much does installing an EV charging station cost?',
            answers: [
              'The cost depends on the charging station’s power (3.7 kW, 7.4 kW, 11 kW, 22 kW), the communication mode (mode 2 or mode 3), the distance between the panel and the location, any civil engineering, and the Enedis declaration. No reliable national flat rate exists and Artisan Compétent does not publish a made-up range. The IRVE qualification is mandatory for charging stations above 3.7 kW. The tax credit and Advenir subsidies can cover part of the installation.',
            ],
          },
          {
            question: 'Is Klarna in 3 interest-free instalments available for an electrical renovation?',
            answers: [
              'Klarna in 3 interest-free instalments can be offered by the tradesperson within Klarna’s applicable limits. Activation is not automatic: it is negotiated between you and the tradesperson. The fund escrow stays in place: the instalment payment is still protected until the project is validated at 48 hours. For larger projects, a milestone-based split negotiated with the tradesperson is generally more suitable than an automatic Klarna instalment plan.',
            ],
          },
          {
            question: 'What is CMOD for on an electrical project?',
            answers: [
              'CMOD is a paid, optional remote support service by a project-owner advisor. A 20-minute call is included for quotes between €2,000 and €5,000 in case of a dispute reported after an amicable settlement has failed, 45 minutes above €5,000 under the same conditions. Below €2,000, the client can write to Artisan Compétent to request a CMOD intervention, handled within 24 to 48 hours. Full upstream support (quote review, check-ins, Consuel sign-off check, NF C 15-100 verification) remains a paid option.',
            ],
          },
          {
            question: 'Can my home insurance reimburse emergency electrical work?',
            answers: [
              'In case of an incident linked to the electrical installation (a short circuit that caused damage, a fire of electrical origin), your home insurance may cover all or part of the safety call-out. It is up to you to contact your insurer directly after receiving the quote. The Consuel certificate and the photos of the panel before and after the call-out usually make the claim easier.',
            ],
          },
          {
            question: 'What if the electrician does not respect the quote or leaves an unsafe installation?',
            answers: [
              'You flag the abuse or non-compliance within 48 hours after the end of the project, via the shared dashboard. The funds stay held in escrow as long as that window is open. Artisan Compétent can withhold up to €250 from the tradesperson’s billing before approval. For an installation presenting a safety risk, an inspection by a third-party electrician or a Consuel sign-off may be required before the release of funds.',
            ],
          },
          {
            question: 'Which cities are covered by Artisan Compétent for electrical work?',
            answers: [
              'Artisan Compétent covers mainland France, the French overseas territories and Corsica, with 38 zones and a 30 km call-out radius around each listed city. The major cities (Paris, Marseille, Lyon, Toulouse, Nice, Nantes, Montpellier, Strasbourg, Bordeaux, Lille) are covered, together with many mid-sized cities.',
            ],
          },
          {
            question: 'Do I need a Qualifelec certificate for a simple electrical repair?',
            answers: [
              'No, the Qualifelec qualification is not mandatory to practise as an electrician. It remains a strong indicator of competence recognised by the ecosystem (insurers, building managers, contractors). On the other hand, NF C 18-510 electrical authorisation is legally required for any live work. On Artisan Compétent, insurance and SIRET are verified, and Qualifelec, when held, is highlighted on the profile.',
            ],
          },
        ],
      },
      { kind: 'h2', text: 'Going further' },
      {
        kind: 'p',
        text: 'A general failure that comes back every week, an electrical panel from another era, an IRVE charging station to install, a home-automation system to roll out or a compliance upgrade before a sale: in each case, the goal is to find a verified electrician and stay in control of the quote. Artisan Compétent oversees verifying the tradesperson and your whole process by escrow until 48 hours after the end of the project.',
      },
      {
        kind: 'p',
        text: 'Verified electrician with SIRET, professional liability and ten-year warranty. NF C 18-510 authorisation checked. IRVE qualification for charging stations. Process overseen by Stripe escrow. Up to €250 withheld in case of an abuse report.',
      },
    ],
  },
};
