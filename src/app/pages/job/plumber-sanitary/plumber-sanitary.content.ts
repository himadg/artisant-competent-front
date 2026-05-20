import type { JobPageContent } from '../_shared/job-content.types';

export const plumberSanitaryContent: Record<'fr' | 'en', JobPageContent> = {
  fr: {
    imagePath: 'assets/img/plombier.jpg',
    imageAlt: 'Plombier sanitaire vérifié',
    h1: 'Plombier sanitaire vérifié, du devis à la libération des fonds encadrée',
    slogan: 'Cette page liste les interventions traitées par les plombiers vérifiés d’Artisan Compétent et le mécanisme qui encadre votre paiement de bout en bout, du devis chiffré à la libération des fonds 48h après la fin du chantier.',
    metaTitle: 'Plombier sanitaire vérifié, du devis à la libération des fonds encadrée | Artisan Compétent',
    metaDescription: 'Sur Artisan Compétent, un plombier vérifié a son SIRET et ses assurances contrôlés en amont, et toute son intervention est encadrée par un séquestre de…',
    body: [
      {
        kind: 'callout',
        title: 'En une phrase',
        body: 'Sur Artisan Compétent, un plombier vérifié a son SIRET et ses assurances contrôlés en amont, et toute son intervention est encadrée par un séquestre de fonds Stripe qui retient le paiement jusqu’à 48h après la fin du chantier. Vous payez seulement si le travail est conforme au devis signé.',
      },
      {
        kind: 'p',
        text: 'Un plombier vérifié sur Artisan Compétent a son SIRET contrôlé, ses assurances RC pro et décennale à jour, et la qualification PG si son activité touche au gaz. Le séquestre de fonds Stripe encadre la totalité du processus : le paiement quitte votre compte à la validation du devis, reste bloqué pendant l’intervention, puis 48h supplémentaires après la fin du chantier. C’est ce délai de 48h qui vous laisse signaler une malfaçon, un abus ou un non-respect du devis avant que les fonds soient libérés au plombier.',
      },
      {
        kind: 'callout',
        title: 'En bref',
        body: 'Un plombier vérifié sur Artisan Compétent a son SIRET contrôlé, ses assurances RC pro et décennale à jour, sa qualification PG pour les interventions gaz et, le cas échéant, sa qualification RGE pour les pompes à chaleur et la climatisation éligibles aux aides publiques. Tout le process est encadré par un séquestre de fonds via Stripe : devis, intervention, libération des fonds 48h après la fin du chantier. Couverture France métropolitaine, DOM-TOM et Corse sur 38 zones, rayon de 30 km par ville.',
      },
      { kind: 'h2', text: 'Quand faire appel à un plombier vérifié' },
      {
        kind: 'p',
        text: 'Un plombier vérifié intervient sur les fuites, les équipements sanitaires, le chauffe-eau et le réseau gaz domestique. Selon ses qualifications, il intervient aussi sur la climatisation et les pompes à chaleur RGE. L’urgence concerne les fuites actives et les pannes critiques d’eau chaude.',
      },
      {
        kind: 'p',
        text: 'Les cas typiques traités par les plombiers sanitaires référencés sur Artisan Compétent couvrent à la fois le dépannage rapide et les chantiers de rénovation plus longs. Quelques exemples concrets qui justifient l’intervention d’un professionnel vérifié plutôt que d’un bricoleur :',
      },
      {
        kind: 'list',
        items: [
          'Fuite d’eau active sous évier, sous lavabo, dans un mur ou au plafond, avec risque de dégât des eaux immédiat',
          'Recherche de fuite encastrée (caméra thermique, gaz traceur, méthode électroacoustique) avant ouverture des cloisons',
          'Panne ou remplacement de chauffe-eau électrique, gaz ou thermodynamique',
          'Débouchage de canalisation simple, remplacement de siphons et d’évacuations',
          'Rénovation complète d’une salle de bain : pose de douche, baignoire, WC, robinetterie',
          'Intervention sur réseau gaz domestique (raccordement chaudière, robinet de coupure) avec qualification PG',
          'Mise en conformité d’une installation sanitaire ancienne ou défectueuse',
          'Installation d’un adoucisseur d’eau, d’un osmoseur ou d’un filtre central',
        ],
      },
      {
        kind: 'p',
        text: 'Beaucoup de plombiers sanitaires interviennent aussi sur la climatisation résidentielle (split mural, multi-split) et, lorsqu’ils sont qualifiés RGE, sur l’installation de pompes à chaleur éligibles à MaPrimeRénov’ et aux CEE. La qualification RGE n’est pas réservée au chauffagiste : un plombier RGE peut installer des équipements éligibles aux aides de l’État. Le périmètre exact du professionnel (clim, pompes à chaleur, qualification RGE) est vérifié à la souscription artisan sur la plateforme.',
      },
      {
        kind: 'p',
        text: 'Chacune de ces interventions engage la responsabilité décennale du plombier sur les installations sanitaires durables et la garantie biennale sur les équipements. C’est cette responsabilité qui rend la vérification de l’assurance et du SIRET indispensable avant de confier les clés.',
      },
      { kind: 'h2', text: 'Pourquoi passer par Artisan Compétent pour vos travaux de plomberie' },
      {
        kind: 'p',
        text: 'Artisan Compétent vérifie le plombier en amont, encadre votre paiement par séquestre Stripe et vous laisse 48h pour valider le chantier avant toute libération des fonds.',
      },
      {
        kind: 'p',
        emphasis: true,
        text: 'Chaque plombier référencé sur Artisan Compétent voit son SIRET contrôlé sur les bases publiques (Annuaire des Entreprises, INSEE/SIRENE) et ses assurances vérifiées avant validation.',
      },
      {
        kind: 'p',
        text: 'La vérification porte sur trois points concrets : SIRET actif et à jour, attestation d’assurance RC pro couvrant l’activité de plombier sanitaire, attestation d’assurance décennale obligatoire sur les installations sanitaires durables. La qualification PG est exigée en plus pour les artisans qui interviennent sur le réseau gaz, la qualification RGE pour ceux qui posent des équipements éligibles aux aides publiques. Un plombier dont l’un de ces documents manque ou est expiré n’est tout simplement pas validé sur la plateforme. Cette vérification se fait avant la mise en ligne du profil, jamais après une plainte client.',
      },
      {
        kind: 'p',
        text: 'Une fois le devis signé, l’artisan dépose obligatoirement ses documents légaux (attestations d’assurance, certifications, qualification RGE le cas échéant) dans son tableau de bord Artisan Compétent. Ces documents sont consultables par le client dans son espace personnel. Le client est néanmoins invité à revérifier en amont les pièces sensibles : assurance décennale en cours de validité, qualification PG si intervention gaz, qualification RGE si éligibilité aux aides de l’État. Cette double vérification protège des cas marginaux où une attestation aurait expiré entre la validation initiale et le démarrage du chantier.',
      },
      {
        kind: 'p',
        emphasis: true,
        text: 'Le séquestre de fonds est un compte tiers géré via Stripe qui encadre tout le process, du devis à la libération des fonds.',
      },
      {
        kind: 'p',
        text: 'Quand vous validez le devis du plombier, le paiement quitte votre compte mais n’arrive pas sur celui de l’artisan : il reste bloqué sur un compte séquestre Stripe. Cette mise en attente dure jusqu’à la fin de l’intervention, plus un délai de 48h pendant lequel vous pouvez signaler un abus, un défaut de qualité ou un non-respect du devis. Sans contestation, les fonds sont libérés au plombier au terme de ces 48h. Pendant la fenêtre de 48h, le séquestre joue son rôle de levier : c’est la motivation la plus efficace pour qu’un artisan termine proprement son chantier.',
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
        text: 'Pour les interventions sous le seuil de 2 000 €, le CMOD gratuit n’est pas automatique. Le client peut écrire à Artisan Compétent, qui traite la demande sous 24 à 48h selon la charge. Le suivi complet (relecture détaillée du devis, points d’étape pendant le chantier, contrôle de fin de chantier) reste sur option payante. Pour la plomberie, le CMOD payant est particulièrement adapté aux rénovations de salle de bain complètes, aux réfections d’évacuations sur un appartement ancien, ou aux remplacements de chauffe-eau couplés à une mise en conformité gaz.',
      },
      { kind: 'h2', text: 'Combien coûte une intervention de plombier' },
      {
        kind: 'p',
        text: 'Le tarif horaire d’un plombier sanitaire varie selon l’expérience et la zone : ordre de grandeur indicatif de 60 à 80 € de l’heure, hors urgence et hors matériel. Seul un devis détaillé d’un plombier vérifié engage le professionnel sur le prix final.',
      },
      {
        kind: 'p',
        text: 'Le tarif d’une intervention dépend de cinq facteurs qui ne se compensent pas. Les variables qui font bouger le devis :',
      },
      {
        kind: 'list',
        items: [
          'La nature de l’intervention (dépannage simple, recherche de fuite, remplacement d’équipement, chantier de rénovation)',
          'L’urgence : intervention en heures ouvrées, nuit, week-end ou jour férié',
          'Le déplacement (zone urbaine dense, zone rurale, étage sans ascenseur)',
          'Le matériel posé : robinetterie d’entrée de gamme ou haut de gamme, chauffe-eau standard ou thermodynamique',
          'La conformité réglementaire à respecter (intervention sur gaz avec qualification PG, mise aux normes, raccordement aux évacuations)',
        ],
      },
      {
        kind: 'p',
        text: 'À titre indicatif, le tarif horaire main-d’œuvre constaté pour un plombier sanitaire en France se situe entre 60 et 80 € de l’heure selon l’expérience, hors urgence et hors matériel. Cette fourchette ne préjuge ni du déplacement, ni du matériel, ni des heures de nuit ou de week-end. Artisan Compétent impose un devis chiffré détaillé et accepté avant toute intervention non-urgence.',
      },
      { kind: 'h2', text: 'Comparatif : Artisan Compétent vs autres plateformes vs Google direct' },
      {
        kind: 'p',
        text: 'Trois manières de trouver un plombier en France. Trois niveaux de protection radicalement différents.',
      },
      {
        kind: 'table',
        headers: ['Critère', 'Autres plateformes', 'Google direct', 'Artisan Compétent'],
        rows: [
          ['Vérification SIRET artisan', 'Variable', 'Aucune', 'Systématique avant validation'],
          ['Vérification assurances', 'Rare', 'Aucune', 'RC pro, décennale, PG, RGE si applicable'],
          ['Paiement encadré', 'Non', 'Séquestre de fonds Stripe, libération à 48h', ''],
          ['Recours en cas d’abus', 'Limité', 'Aucun', 'Retenue jusqu’à 250 € sur signalement < 48h'],
          ['Tarif horaire transparent', 'Non', 'Variable', 'Devis détaillé imposé avant intervention'],
          ['Conseiller maître d’ouvrage', 'Non', 'CMOD disponible sur option', ''],
        ],
      },
      { kind: 'h2', text: 'Les 3 pièges à éviter quand on cherche un plombier' },
      {
        kind: 'p',
        text: 'La plomberie en urgence concentre une grande partie des litiges du secteur. Trois pièges reviennent en boucle, surtout lors des sorties nocturnes ou de week-end.',
      },
      { kind: 'h3', text: 'Piège 1 : Le devis qui double la nuit' },
      {
        kind: 'p',
        text: 'Un appel nocturne sur un numéro trouvé sur Google. Un artisan arrive rapidement, fait un diagnostic verbal, annonce un montant trois à quatre fois supérieur au tarif horaire de jour, et exige un paiement immédiat avant intervention. Le client sous pression accepte. Le devis n’est jamais signé ou signé après coup. Le séquestre de fonds rend cette pratique inopérante : aucun paiement n’est versé avant validation du devis sur Artisan Compétent, et le devis nocturne reste tracé dans la plateforme.',
      },
      { kind: 'h3', text: 'Piège 2 : Le remplacement de pièce non nécessaire' },
      {
        kind: 'p',
        text: 'Le plombier annonce qu’un chauffe-eau, un robinet thermostatique ou une vanne d’arrêt doit être changé alors qu’une réparation suffirait. La pièce est facturée au prix d’un produit neuf haut de gamme, posée sans démonstration de la défaillance de l’ancienne, et l’ancienne pièce disparaît. Un plombier vérifié documente ce qu’il remplace ; un plombier opportuniste évite la trace écrite.',
      },
      { kind: 'h3', text: 'Piège 3 : Le forfait gonflé sans tarif horaire' },
      {
        kind: 'p',
        text: 'Pas de détail dans le devis : un montant global pour une intervention vague, par exemple “débouchage canalisation : 480 €”. Pas de durée annoncée, pas de matériel chiffré, pas de mention du déplacement. Le client n’a aucun moyen de vérifier que le tarif est cohérent avec le temps passé. Artisan Compétent impose la décomposition du devis (déplacement, main-d’œuvre, matériel, urgence) avant validation et paiement en séquestre.',
      },
      { kind: 'h2', text: 'Votre rôle dans le suivi du chantier' },
      {
        kind: 'p',
        text: 'La protection séquestre est puissante mais elle s’appuie sur un contradictoire écrit. Votre participation active conditionne la qualité du recours en cas de litige : pas de trace écrite, pas de levier.',
      },
      {
        kind: 'p',
        text: 'Pour les chantiers de plus d’un jour, l’artisan dépose chaque jour des photos d’avancement dans le tableau de bord partagé client · artisan. Vous commentez, vous validez ou vous signalez dans le même espace, ce qui établit un contradictoire écrit en cas de litige ultérieur. De votre côté, documentez aussi : photos de la zone avant intervention, photos à la fin de chaque journée, observations écrites courtes mais datées.',
      },
      {
        kind: 'p',
        text: 'En cas de signalement d’abus dans les 48h suivant la fin du chantier, Artisan Compétent peut retenir jusqu’à 250 € sur la facturation de l’artisan avant validation du paiement, conformément aux CGU et CGV. Cette retenue couvre les cas de malfaçon avérée ou de non-respect du devis signé. Au-delà des 48h, les garanties légales prennent le relais (garantie de parfait achèvement à un an, biennale sur les équipements, décennale sur les installations durables).',
      },
      { kind: 'h2', text: 'Assurance habitation et remboursement' },
      {
        kind: 'p',
        text: 'Selon le sinistre, votre assurance habitation peut rembourser tout ou partie de l’intervention. La démarche est à votre charge auprès de votre assureur. Artisan Compétent n’intervient pas dans la procédure d’indemnisation.',
      },
      {
        kind: 'p',
        text: 'Dans plusieurs cas typiques de la plomberie, l’assurance habitation rembourse partiellement ou totalement l’intervention : dégât des eaux, recherche de fuite après sinistre, rupture de canalisation, intervention d’urgence après dégât. C’est à vous de contacter directement votre assurance après réception du devis pour vérifier l’éligibilité de votre situation et les modalités de prise en charge (franchise, plafond, expertise éventuelle). Certaines garanties incluses dans des cartes bancaires premium peuvent aussi couvrir l’intervention.',
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
        text: 'Étape 1. Vous décrivez votre besoin (panne, dépannage ou chantier complet) sur Artisan Compétent et recevez un devis détaillé d’un plombier vérifié de votre zone.',
      },
      {
        kind: 'p',
        text: 'Étape 2. Vous validez le devis, le paiement part en séquestre via Stripe, l’intervention est planifiée.',
      },
      {
        kind: 'p',
        text: 'Étape 3. Le plombier intervient. À la fin du chantier, un procès-verbal de réception est émis sur la plateforme : il ouvre une fenêtre de 48h pendant laquelle vous pouvez émettre des réserves. Un mail de notification vous est envoyé 8h avant la fin du délai pour vous rappeler l’échéance. Sans réserve, les fonds sont libérés automatiquement à l’artisan.',
      },
      { kind: 'h2', text: 'Plombier d’urgence 24h/24, 7j/7' },
      {
        kind: 'p',
        text: 'Artisan Compétent couvre la plomberie en urgence 24h/24 et 7j/7 sur l’ensemble des zones desservies. La règle des 48h pour signaler un abus reste applicable même en sortie nocturne.',
      },
      {
        kind: 'p',
        text: 'Le plombier sanitaire fait partie des cinq métiers couverts en urgence permanente sur Artisan Compétent, avec l’électricien, le serrurier, le chauffagiste et le déboucheur de canalisations. Une fuite active, un chauffe-eau hors service en plein hiver ou une rupture de canalisation ne peuvent pas attendre le lendemain matin. L’intervention nocturne suit le même protocole que l’intervention de jour : devis chiffré, paiement en séquestre via Stripe, intervention, validation sous 48h. Le séquestre de fonds est particulièrement protecteur dans ces situations où la pression de l’urgence pousse certains professionnels à surfacturer.',
      },
      { kind: 'h2', text: 'Trouver un plombier vérifié dans votre ville' },
      {
        kind: 'p',
        text: 'Artisan Compétent couvre la France métropolitaine, les DOM-TOM et la Corse, soit 38 zones avec un rayon d’intervention de 30 km autour de chaque ville référencée.',
      },
      {
        kind: 'p',
        text: 'Vous pouvez chercher un plombier vérifié dans les principales métropoles françaises. Chaque artisan référencé a son SIRET contrôlé et ses assurances vérifiées avant validation sur la plateforme.',
      },
      {
        kind: 'cities',
        items: [
          'Plombier Paris',
          'Plombier Marseille',
          'Plombier Lyon',
          'Plombier Toulouse',
          'Plombier Nice',
          'Plombier Nantes',
          'Plombier Montpellier',
          'Plombier Strasbourg',
          'Plombier Bordeaux',
          'Plombier Lille',
        ],
      },
      { kind: 'h2', text: 'Klarna : comment ça marche' },
      {
        kind: 'p',
        text: 'Klarna est un service de paiement échelonné en 3 fois sans frais. Artisan Compétent met cet outil à disposition dans le parcours de paiement. Son activation se négocie entre le client et l’artisan : ce n’est pas automatique.',
      },
      {
        kind: 'p',
        text: 'Si l’artisan accepte de proposer Klarna sur votre devis, le mécanisme du séquestre de fonds reste actif et le paiement reste protégé jusqu’à validation du chantier à 48h. Sur des chantiers plus importants (rénovation salle de bain complète), un découpage par jalons négocié avec l’artisan peut être préférable à l’échelonnement Klarna standard. Klarna est un confort de paiement, pas un substitut au séquestre.',
      },
      { kind: 'h2', text: 'Questions fréquentes' },
      {
        kind: 'p',
        text: 'Cette FAQ regroupe les questions les plus posées par les particuliers qui cherchent un plombier vérifié sur Artisan Compétent.',
      },
      {
        kind: 'faq',
        items: [
          {
            question: 'Quel est le délai d’intervention d’un plombier en urgence à Paris ou en région ?',
            answers: [
              'Un plombier vérifié sur Artisan Compétent peut intervenir 24h/24 et 7j/7 pour les pannes critiques : fuite d’eau active, rupture de canalisation, panne de chauffe-eau bloquante. Le délai dépend de la disponibilité réelle des artisans de la zone et n’est jamais promis à l’avance sans confirmation. La règle des 48h pour signaler un abus reste applicable même en intervention nocturne.',
            ],
          },
          {
            question: 'Comment vérifier qu’un plombier est sérieux avant de signer un devis ?',
            answers: [
              'Trois éléments doivent être contrôlables : le numéro SIRET (vérifiable sur l’Annuaire des Entreprises et la base INSEE/SIRENE), l’attestation d’assurance décennale en cours de validité, et la qualification PG si l’intervention touche un réseau gaz. Sur Artisan Compétent, ces trois éléments sont vérifiés en amont. Vous pouvez les revérifier dans le tableau de bord de l’artisan une fois le devis signé.',
            ],
          },
          {
            question: 'Comment fonctionne le séquestre de fonds quand on fait appel à un plombier ?',
            answers: [
              'Le séquestre de fonds est un compte tiers géré via Stripe. Lorsque le client valide le devis, le paiement part en séquestre et reste bloqué tant que le chantier n’est pas terminé. Une fois l’intervention finie, le client dispose de 48h pour valider le travail ou signaler un abus. Sans contestation, les fonds sont libérés au plombier. En cas de signalement d’abus, Artisan Compétent peut retenir jusqu’à 250 € sur la facturation de l’artisan avant validation.',
            ],
          },
          {
            question: 'Puis-je payer une intervention plombier en plusieurs fois avec Klarna ?',
            answers: [
              'Klarna 3 fois sans frais peut être proposé par l’artisan dans le respect des plafonds Klarna en vigueur. L’activation n’est pas automatique : elle se négocie entre vous et l’artisan. Le mécanisme du séquestre de fonds reste actif : le paiement est protégé jusqu’à la validation finale du chantier à 48h.',
            ],
          },
          {
            question: 'À quoi sert le service CMOD pour un chantier de plomberie ?',
            answers: [
              'CMOD est un service payant et optionnel d’accompagnement par un conseiller maître d’ouvrage à distance, par visioconférence. Sur les devis entre 2 000 € et 5 000 €, un appel de 20 minutes est offert en cas de litige signalé après échec d’un règlement amiable avec l’artisan. Au-delà de 5 000 €, l’appel offert passe à 45 minutes dans les mêmes conditions. Sous 2 000 €, le client peut écrire à Artisan Compétent pour demander une intervention CMOD, traitée sous 24 à 48h. Le suivi complet en amont du chantier reste sur option payante.',
            ],
          },
          {
            question: 'Mon assurance habitation peut-elle rembourser l’intervention du plombier ?',
            answers: [
              'Selon le sinistre (dégât des eaux, rupture de canalisation, intervention d’urgence après sinistre), votre assurance habitation peut prendre en charge tout ou partie de l’intervention. C’est à vous de contacter directement votre assureur après réception du devis pour vérifier l’éligibilité. Artisan Compétent n’intervient pas dans la procédure d’indemnisation : l’intervention est lancée selon le parcours habituel, vous traitez avec votre assurance en parallèle.',
            ],
          },
          {
            question: 'Que se passe-t-il si le plombier ne respecte pas le devis signé ?',
            answers: [
              'Vous signalez l’abus dans les 48h suivant la fin du chantier, via le tableau de bord partagé. Tant que ce délai court, les fonds restent en séquestre et ne sont pas libérés au plombier. Artisan Compétent peut retenir jusqu’à 250 € sur la facturation de l’artisan avant validation, conformément aux CGU et CGV. Les photos quotidiennes du chantier, déposées par l’artisan et complétées par vos propres observations, servent de contradictoire écrit.',
            ],
          },
          {
            question: 'Un plombier peut-il aussi installer une climatisation ou une pompe à chaleur ?',
            answers: [
              'Oui, dans beaucoup de cas. Un plombier sanitaire intervient fréquemment sur la climatisation résidentielle (split mural, multi-split) et, s’il est qualifié RGE, sur l’installation de pompes à chaleur éligibles à MaPrimeRénov’ et aux CEE. La qualification RGE n’est pas réservée au chauffagiste. Sur Artisan Compétent, le périmètre exact (clim, pompes à chaleur, RGE) est vérifié à la souscription artisan.',
            ],
          },
          {
            question: 'Quelles villes sont couvertes par Artisan Compétent pour la plomberie ?',
            answers: [
              'Artisan Compétent couvre la France métropolitaine, les DOM-TOM et la Corse, soit 38 zones, avec un rayon d’intervention de 30 km autour de chaque ville référencée. Toutes les grandes métropoles sont couvertes (Paris, Marseille, Lyon, Toulouse, Nice, Nantes, Montpellier, Strasbourg, Bordeaux, Lille) ainsi qu’un maillage régional étendu.',
            ],
          },
          {
            question: 'Faut-il une qualification spéciale pour un plombier qui intervient sur le gaz ?',
            answers: [
              'Oui. La qualification PG (Professionnel Gaz) est requise pour toute intervention sur un réseau gaz naturel ou propane, qu’il s’agisse du raccordement d’une chaudière, du remplacement d’un robinet de coupure ou de la pose d’une cuisinière au gaz. Les plombiers référencés sur Artisan Compétent qui interviennent sur le gaz justifient de cette qualification, contrôlée en amont.',
            ],
          },
        ],
      },
      { kind: 'h2', text: 'Pour aller plus loin' },
      {
        kind: 'p',
        text: 'Une fuite qui s’aggrave, un chauffe-eau qui lâche un dimanche soir, une salle de bain à refaire de zéro, une pompe à chaleur à installer avec MaPrimeRénov’ : dans chacun de ces cas, l’enjeu est de trouver un plombier vérifié sans subir la pression du devis express. Artisan Compétent encadre les deux : la vérification de l’artisan en amont, et tout votre process par séquestre jusqu’à 48h après la fin du chantier.',
      },
      {
        kind: 'p',
        text: 'Plombier vérifié SIRET, RC pro, décennale et PG. Qualification RGE affichée pour clim et pompes à chaleur. Process encadré par séquestre Stripe. 48h pour valider avant libération des fonds. Retenue jusqu’à 250 € en cas de signalement d’abus.',
      },
    ],
  },

  en: {
    imagePath: 'assets/img/plombier.jpg',
    imageAlt: 'Verified sanitary plumber',
    h1: 'Verified sanitary plumber, from quote to overseen release of funds',
    slogan: 'This page lists the call-outs handled by the verified plumbers on Artisan Compétent and the mechanism that oversees your payment end to end, from the priced quote to the release of funds 48 hours after the project ends.',
    metaTitle: 'Verified sanitary plumber, from quote to overseen release of funds | Artisan Compétent',
    metaDescription: 'On Artisan Compétent, a verified plumber has their SIRET and insurance checked upfront, and the whole call-out is overseen by a Stripe fund escrow…',
    body: [
      {
        kind: 'callout',
        title: 'In one sentence',
        body: 'On Artisan Compétent, a verified plumber has their SIRET and insurance checked upfront, and the whole call-out is overseen by a Stripe fund escrow that withholds payment until 48 hours after the project ends. You only pay if the work matches the signed quote.',
      },
      {
        kind: 'p',
        text: 'A verified plumber on Artisan Compétent has their SIRET checked, their professional liability and ten-year warranty insurance up to date, and the PG (Gas Professional) qualification if their activity involves gas. The Stripe fund escrow oversees the whole process: payment leaves your account when you approve the quote, stays held during the call-out, then for 48 additional hours after the project ends. That 48-hour window is what lets you flag a defect, abuse or non-compliance with the quote before the funds are released to the plumber.',
      },
      {
        kind: 'callout',
        title: 'In short',
        body: 'A verified plumber on Artisan Compétent has their SIRET checked, their professional liability and ten-year warranty insurance up to date, the PG qualification for gas call-outs and, where applicable, the RGE certification for heat pumps and air conditioning eligible for public subsidies. The whole process is overseen by a Stripe fund escrow: quote, call-out, release of funds 48 hours after the project ends. Coverage across mainland France, the French overseas territories and Corsica, with 38 zones and a 30 km radius per city.',
      },
      { kind: 'h2', text: 'When to call on a verified plumber' },
      {
        kind: 'p',
        text: 'A verified plumber handles leaks, sanitary equipment, water heaters and the domestic gas network. Depending on their qualifications, they also handle air conditioning and RGE-certified heat pumps. Emergencies concern active leaks and critical hot-water failures.',
      },
      {
        kind: 'p',
        text: 'The typical cases handled by the sanitary plumbers listed on Artisan Compétent cover both quick repairs and longer renovation projects. A few concrete examples that justify calling a verified professional rather than a DIYer:',
      },
      {
        kind: 'list',
        items: [
          'Active water leak under a sink, under a washbasin, in a wall or ceiling, with an immediate risk of water damage',
          'Concealed leak detection (thermal camera, tracer gas, electroacoustic method) before opening walls',
          'Breakdown or replacement of an electric, gas or thermodynamic water heater',
          'Simple pipe unblocking, replacement of traps and drainage fittings',
          'Full bathroom renovation: installation of shower, bathtub, toilet, taps',
          'Work on the domestic gas network (boiler hook-up, shut-off valve) with PG qualification',
          'Bringing an old or faulty sanitary installation into compliance',
          'Installation of a water softener, a reverse-osmosis unit or a central filter',
        ],
      },
      {
        kind: 'p',
        text: 'Many sanitary plumbers also work on residential air conditioning (wall-mounted splits, multi-splits) and, when RGE-certified, on installing heat pumps eligible for MaPrimeRénov’ and CEE subsidies. RGE certification is not reserved for heating engineers: an RGE-certified plumber can install equipment eligible for state subsidies. The exact scope of the professional (AC, heat pumps, RGE certification) is checked when the tradesperson signs up to the platform.',
      },
      {
        kind: 'p',
        text: 'Each of these call-outs engages the plumber’s ten-year liability on durable sanitary installations and the two-year warranty on equipment. That liability is what makes verifying the insurance and SIRET essential before handing over the keys.',
      },
      { kind: 'h2', text: 'Why go through Artisan Compétent for your plumbing work' },
      {
        kind: 'p',
        text: 'Artisan Compétent verifies the plumber upfront, oversees your payment via a Stripe fund escrow, and gives you 48 hours to validate the project before any release of funds.',
      },
      {
        kind: 'p',
        emphasis: true,
        text: 'Every plumber listed on Artisan Compétent has their SIRET checked against the public registers (Annuaire des Entreprises, INSEE/SIRENE) and their insurance verified before approval.',
      },
      {
        kind: 'p',
        text: 'The verification covers three concrete points: an active and up-to-date SIRET, a professional liability insurance certificate covering sanitary plumbing, and the mandatory ten-year warranty insurance certificate on durable sanitary installations. PG qualification is required in addition for tradespeople who work on the gas network, and RGE certification for those who install equipment eligible for public subsidies. A plumber whose documents are missing or expired is simply not approved on the platform. This verification happens before the profile goes live, never after a client complaint.',
      },
      {
        kind: 'p',
        text: 'Once the quote is signed, the tradesperson is required to upload their legal documents (insurance certificates, qualifications, RGE certification if applicable) into their Artisan Compétent dashboard. These documents are available to the client from their personal account area. Clients are nevertheless invited to recheck the sensitive items upfront: a valid ten-year warranty certificate, PG qualification if gas work is involved, RGE certification if eligible for state subsidies. This double check protects against the edge cases where a certificate has expired between the initial approval and the project start.',
      },
      {
        kind: 'p',
        emphasis: true,
        text: 'The fund escrow is a third-party account managed via Stripe that oversees the whole process, from quote to release of funds.',
      },
      {
        kind: 'p',
        text: 'When you approve the plumber’s quote, the payment leaves your account but does not reach the tradesperson’s: it stays held in a Stripe escrow account. This hold lasts until the call-out ends, plus a 48-hour window during which you can flag abuse, a quality defect or non-compliance with the quote. With no dispute, the funds are released to the plumber at the end of those 48 hours. During that 48-hour window, the escrow does its job as leverage: it is the most effective motivation for a tradesperson to finish their project cleanly.',
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
        text: 'For call-outs below the €2,000 threshold, free CMOD is not automatic. The client can write to Artisan Compétent, who handles the request within 24 to 48 hours depending on workload. Full support (detailed review of the quote, check-ins during the project, end-of-project inspection) remains a paid option. For plumbing, paid CMOD is especially useful for full bathroom renovations, drainage refits in an older flat, or water-heater replacements combined with bringing gas work into compliance.',
      },
      { kind: 'h2', text: 'How much does a plumber call-out cost' },
      {
        kind: 'p',
        text: 'The hourly rate of a sanitary plumber varies by experience and area: an indicative range of €60 to €80 per hour, excluding emergencies and materials. Only a detailed quote from a verified plumber commits the professional to the final price.',
      },
      {
        kind: 'p',
        text: 'The price of a call-out depends on five factors that do not offset each other. The variables that move the quote:',
      },
      {
        kind: 'list',
        items: [
          'The nature of the call-out (simple repair, leak detection, equipment replacement, renovation project)',
          'Urgency: call-out during business hours, at night, on weekends or public holidays',
          'Travel charge (dense urban area, rural area, walk-up flat with no lift)',
          'The equipment fitted: entry-level or high-end taps, standard or thermodynamic water heater',
          'Regulatory compliance to be met (gas work requiring PG qualification, bringing up to standard, drainage hook-up)',
        ],
      },
      {
        kind: 'p',
        text: 'As an indication, the reported hourly labour rate for a sanitary plumber in France ranges from €60 to €80 per hour depending on experience, excluding emergencies and materials. This range does not account for travel, materials, or night or weekend hours. Artisan Compétent requires a detailed, priced and accepted quote before any non-emergency call-out.',
      },
      { kind: 'h2', text: 'Comparison: Artisan Compétent vs other platforms vs direct Google' },
      {
        kind: 'p',
        text: 'Three ways to find a plumber in France. Three radically different levels of protection.',
      },
      {
        kind: 'table',
        headers: ['Criterion', 'Other platforms', 'Direct Google', 'Artisan Compétent'],
        rows: [
          ['Tradesperson SIRET check', 'Variable', 'None', 'Systematic before approval'],
          ['Insurance check', 'Rare', 'None', 'Professional liability, ten-year, PG, RGE if applicable'],
          ['Overseen payment', 'No', 'Stripe fund escrow, release at 48 hours', ''],
          ['Recourse in case of abuse', 'Limited', 'None', 'Up to €250 withheld on a report under 48 hours'],
          ['Transparent hourly rate', 'No', 'Variable', 'Detailed quote required before call-out'],
          ['Project-owner advisor', 'No', 'CMOD available as an option', ''],
        ],
      },
      { kind: 'h2', text: 'The 3 pitfalls to avoid when looking for a plumber' },
      {
        kind: 'p',
        text: 'Emergency plumbing concentrates a large share of the sector’s disputes. Three pitfalls keep coming back, especially during night-time or weekend call-outs.',
      },
      { kind: 'h3', text: 'Pitfall 1: The quote that doubles at night' },
      {
        kind: 'p',
        text: 'A night-time call to a number found on Google. A tradesperson shows up quickly, makes a verbal diagnosis, announces an amount three to four times the daytime hourly rate, and demands immediate payment before the call-out. The client, under pressure, agrees. The quote is never signed, or signed after the fact. The fund escrow makes this practice ineffective: no payment is released before the quote is approved on Artisan Compétent, and the night-time quote stays traced in the platform.',
      },
      { kind: 'h3', text: 'Pitfall 2: The unnecessary part replacement' },
      {
        kind: 'p',
        text: 'The plumber claims that a water heater, a thermostatic tap or a shut-off valve must be replaced when a repair would suffice. The part is invoiced at the price of a brand-new high-end product, fitted without proof that the old one was failing, and the old part disappears. A verified plumber documents what they replace; an opportunistic plumber avoids the paper trail.',
      },
      { kind: 'h3', text: 'Pitfall 3: The inflated flat fee with no hourly rate' },
      {
        kind: 'p',
        text: 'No detail in the quote: a single global amount for a vague call-out, for example “pipe unblocking: €480”. No duration stated, no materials priced, no mention of the travel charge. The client has no way to verify that the rate is consistent with the time spent. Artisan Compétent requires a breakdown of the quote (travel, labour, materials, urgency) before approval and escrow payment.',
      },
      { kind: 'h2', text: 'Your role in monitoring the project' },
      {
        kind: 'p',
        text: 'Escrow protection is powerful but relies on a written contradictory record. Your active participation conditions the quality of the recourse in case of a dispute: no paper trail, no leverage.',
      },
      {
        kind: 'p',
        text: 'For projects lasting more than one day, the tradesperson uploads progress photos every day into the shared client · tradesperson dashboard. You comment, validate or flag in that same space, which establishes a written contradictory record in case of a later dispute. On your side, document things too: photos of the area before the call-out, photos at the end of each day, short but dated written observations.',
      },
      {
        kind: 'p',
        text: 'In case of an abuse report within 48 hours after the end of the project, Artisan Compétent can withhold up to €250 from the tradesperson’s billing before payment is approved, in accordance with the platform’s Terms and Conditions. This withholding covers cases of established defect or non-compliance with the signed quote. Beyond 48 hours, the legal warranties take over (one-year completion warranty, two-year warranty on equipment, ten-year warranty on durable installations).',
      },
      { kind: 'h2', text: 'Home insurance and reimbursement' },
      {
        kind: 'p',
        text: 'Depending on the incident, your home insurance may reimburse all or part of the call-out. The procedure is your responsibility with your insurer. Artisan Compétent does not intervene in the indemnification procedure.',
      },
      {
        kind: 'p',
        text: 'In several typical plumbing situations, home insurance reimburses the call-out partially or fully: water damage, leak detection following an incident, burst pipe, emergency call-out after damage. It is up to you to contact your insurer directly after receiving the quote to check eligibility for your situation and the terms of cover (excess, cap, possible expert assessment). Some guarantees included in premium credit cards may also cover the call-out.',
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
        text: 'Step 1. You describe your need (breakdown, repair or full project) on Artisan Compétent and receive a detailed quote from a verified plumber in your area.',
      },
      {
        kind: 'p',
        text: 'Step 2. You approve the quote, the payment goes into escrow via Stripe, the call-out is scheduled.',
      },
      {
        kind: 'p',
        text: 'Step 3. The plumber carries out the call-out. At the end of the project, a completion report is issued on the platform: it opens a 48-hour window during which you can raise reservations. A notification email is sent to you 8 hours before the end of the window to remind you of the deadline. With no reservation, the funds are released automatically to the tradesperson.',
      },
      { kind: 'h2', text: 'Emergency plumber 24/7' },
      {
        kind: 'p',
        text: 'Artisan Compétent covers emergency plumbing 24/7 across all served zones. The 48-hour rule to flag abuse still applies, even for a night-time call-out.',
      },
      {
        kind: 'p',
        text: 'The sanitary plumber is one of the five trades covered around the clock on Artisan Compétent, together with the electrician, the locksmith, the heating engineer and the drain unblocker. An active leak, a water heater out of order in the middle of winter or a burst pipe cannot wait until the next morning. The night-time call-out follows the same protocol as a daytime call-out: priced quote, payment placed in escrow via Stripe, call-out, validation within 48 hours. The fund escrow is especially protective in those situations where the pressure of urgency pushes some professionals to overcharge.',
      },
      { kind: 'h2', text: 'Find a verified plumber in your city' },
      {
        kind: 'p',
        text: 'Artisan Compétent covers mainland France, the French overseas territories and Corsica — 38 zones with a 30 km call-out radius around each listed city.',
      },
      {
        kind: 'p',
        text: 'You can look for a verified plumber in the main French cities. Every listed tradesperson has their SIRET checked and their insurance verified before approval on the platform.',
      },
      {
        kind: 'cities',
        items: [
          'Plumber in Paris',
          'Plumber in Marseille',
          'Plumber in Lyon',
          'Plumber in Toulouse',
          'Plumber in Nice',
          'Plumber in Nantes',
          'Plumber in Montpellier',
          'Plumber in Strasbourg',
          'Plumber in Bordeaux',
          'Plumber in Lille',
        ],
      },
      { kind: 'h2', text: 'Klarna: how it works' },
      {
        kind: 'p',
        text: 'Klarna is a payment service that splits the amount into 3 interest-free instalments. Artisan Compétent makes this tool available in the payment journey. Its activation is negotiated between the client and the tradesperson: it is not automatic.',
      },
      {
        kind: 'p',
        text: 'If the tradesperson agrees to offer Klarna on your quote, the fund-escrow mechanism stays in place and the payment stays protected until the project is validated at 48 hours. For larger projects (full bathroom renovation), a milestone-based split negotiated with the tradesperson can be preferable to the standard Klarna instalment plan. Klarna is a payment convenience, not a substitute for the escrow.',
      },
      { kind: 'h2', text: 'Frequently asked questions' },
      {
        kind: 'p',
        text: 'This FAQ gathers the questions most often asked by individuals looking for a verified plumber on Artisan Compétent.',
      },
      {
        kind: 'faq',
        items: [
          {
            question: 'What is the response time of an emergency plumber in Paris or elsewhere in France?',
            answers: [
              'A verified plumber on Artisan Compétent can respond 24/7 for critical breakdowns: active water leak, burst pipe, blocking water-heater failure. The response time depends on the actual availability of the tradespeople in the zone and is never promised in advance without confirmation. The 48-hour rule to flag abuse still applies, even for a night-time call-out.',
            ],
          },
          {
            question: 'How do I check that a plumber is reliable before signing a quote?',
            answers: [
              'Three elements should be verifiable: the SIRET number (checkable on the Annuaire des Entreprises and the INSEE/SIRENE register), a valid ten-year warranty insurance certificate, and the PG qualification if the call-out involves a gas network. On Artisan Compétent, these three elements are verified upfront. You can recheck them in the tradesperson’s dashboard once the quote is signed.',
            ],
          },
          {
            question: 'How does the fund escrow work when you call on a plumber?',
            answers: [
              'The fund escrow is a third-party account managed via Stripe. When the client approves the quote, the payment moves into escrow and stays held as long as the project is not finished. Once the call-out is done, the client has 48 hours to validate the work or flag abuse. With no dispute, the funds are released to the plumber. In case of an abuse report, Artisan Compétent can withhold up to €250 from the tradesperson’s billing before approval.',
            ],
          },
          {
            question: 'Can I pay for a plumber call-out in instalments with Klarna?',
            answers: [
              'Klarna in 3 interest-free instalments can be offered by the tradesperson within Klarna’s applicable limits. Activation is not automatic: it is negotiated between you and the tradesperson. The fund-escrow mechanism stays in place: the payment is protected until the final validation of the project at 48 hours.',
            ],
          },
          {
            question: 'What is the CMOD service for on a plumbing project?',
            answers: [
              'CMOD is a paid, optional remote support service by a project-owner advisor, by video call. On quotes between €2,000 and €5,000, a 20-minute call is included in case of a dispute reported after an amicable settlement with the tradesperson has failed. Above €5,000, the included call extends to 45 minutes under the same conditions. Below €2,000, the client can write to Artisan Compétent to request a CMOD intervention, handled within 24 to 48 hours. Full upstream support during the project remains a paid option.',
            ],
          },
          {
            question: 'Can my home insurance reimburse the plumber’s call-out?',
            answers: [
              'Depending on the incident (water damage, burst pipe, emergency call-out after damage), your home insurance may cover all or part of the call-out. It is up to you to contact your insurer directly after receiving the quote to check eligibility. Artisan Compétent does not intervene in the indemnification procedure: the call-out runs through the usual path, and you handle your insurer in parallel.',
            ],
          },
          {
            question: 'What happens if the plumber does not respect the signed quote?',
            answers: [
              'You flag the abuse within 48 hours after the end of the project, via the shared dashboard. As long as that window is open, the funds stay in escrow and are not released to the plumber. Artisan Compétent can withhold up to €250 from the tradesperson’s billing before approval, in accordance with the platform’s Terms and Conditions. The daily project photos uploaded by the tradesperson and completed by your own observations serve as a written contradictory record.',
            ],
          },
          {
            question: 'Can a plumber also install air conditioning or a heat pump?',
            answers: [
              'Yes, in many cases. A sanitary plumber often works on residential air conditioning (wall-mounted splits, multi-splits) and, when RGE-certified, on installing heat pumps eligible for MaPrimeRénov’ and CEE subsidies. RGE certification is not reserved for heating engineers. On Artisan Compétent, the exact scope (AC, heat pumps, RGE) is checked at tradesperson sign-up.',
            ],
          },
          {
            question: 'Which cities are covered by Artisan Compétent for plumbing?',
            answers: [
              'Artisan Compétent covers mainland France, the French overseas territories and Corsica — 38 zones with a 30 km call-out radius around each listed city. All the major cities are covered (Paris, Marseille, Lyon, Toulouse, Nice, Nantes, Montpellier, Strasbourg, Bordeaux, Lille) together with an extended regional network.',
            ],
          },
          {
            question: 'Is a special qualification required for a plumber working on gas?',
            answers: [
              'Yes. The PG (Gas Professional) qualification is required for any work on a natural-gas or propane network, whether hooking up a boiler, replacing a shut-off valve or installing a gas cooker. The plumbers listed on Artisan Compétent who work on gas hold this qualification, which is checked upfront.',
            ],
          },
        ],
      },
      { kind: 'h2', text: 'Going further' },
      {
        kind: 'p',
        text: 'A leak that is getting worse, a water heater that fails on a Sunday evening, a bathroom to redo from scratch, a heat pump to install with MaPrimeRénov’: in each of these cases, the goal is to find a verified plumber without enduring the pressure of an express quote. Artisan Compétent oversees both: verifying the tradesperson upfront, and your whole process by escrow until 48 hours after the end of the project.',
      },
      {
        kind: 'p',
        text: 'Verified plumber with SIRET, professional liability, ten-year warranty and PG qualification. RGE certification displayed for AC and heat pumps. Process overseen by Stripe escrow. 48 hours to validate before release of funds. Up to €250 withheld in case of an abuse report.',
      },
    ],
  },
};
