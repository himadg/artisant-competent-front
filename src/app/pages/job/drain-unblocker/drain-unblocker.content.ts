import type { JobPageContent } from '../_shared/job-content.types';

export const drainUnblockerContent: JobPageContent = {
    imagePath: 'assets/img/deboucheur-canalisation.jpg',
    imageAlt: 'Déboucheur de canalisation vérifié',
    h1: 'Déboucheur de canalisations vérifié, du devis à la libération encadrée',
    slogan: 'Cette page liste les interventions de débouchage et d’assainissement traitées par les artisans vérifiés d’Artisan Compétent et le mécanisme qui encadre votre paiement, du devis chiffré à la libération des fonds 48h après l’intervention.',
    metaTitle: 'Déboucheur de canalisations vérifié, du devis à la libération encadrée | Artisan Compétent',
    metaDescription: 'Sur Artisan Compétent, un déboucheur vérifié a son SIRET, son assurance RC pro et son agrément préfectoral (pour les fosses septiques) contrôlés en amont…',
    body: [
      {
        kind: 'callout',
        title: 'En une phrase',
        body: 'Sur Artisan Compétent, un déboucheur vérifié a son SIRET, son assurance RC pro et son agrément préfectoral (pour les fosses septiques) contrôlés en amont, et son matériel (caméra d’inspection, hydrocureur) est tracé au tableau de bord. Tout le chantier est encadré par un séquestre de fonds Stripe qui retient le paiement jusqu’à 48h après l’intervention, fenêtre pendant laquelle vous pouvez signaler une canalisation qui se rebouche immédiatement ou un forfait gonflé sans détail des moyens utilisés.',
      },
      {
        kind: 'p',
        text: 'Un déboucheur de canalisations vérifié sur Artisan Compétent a son SIRET contrôlé, son assurance RC pro à jour, et l’agrément préfectoral requis pour l’évacuation des matières de vidange quand son activité inclut la fosse septique. Le débouchage en urgence est l’un des secteurs où la pratique du forfait gonflé sans détail des moyens utilisés est la plus fréquente : le séquestre de fonds Stripe et la fenêtre de 48h sont la réponse opérationnelle à ces abus.',
      },
      {
        kind: 'callout',
        title: 'En bref',
        body: 'Un déboucheur de canalisations vérifié sur Artisan Compétent a son SIRET contrôlé, son assurance RC pro à jour, l’agrément préfectoral pour l’évacuation des matières de vidange si son activité touche aux fosses septiques, et son matériel (caméra d’inspection, hydrocureur) tracé au tableau de bord. Process encadré par séquestre via Stripe, 48h pour signaler un abus. Couverture France métropolitaine, DOM-TOM et Corse sur 38 zones, rayon de 30 km par ville.',
      },
      {
        kind: 'h2',
        text: 'Quand faire appel à un déboucheur vérifié',
      },
      {
        kind: 'p',
        text: 'Un déboucheur vérifié intervient sur les canalisations bouchées, les WC saturés, les fosses pleines et les réseaux d’évacuation. L’urgence concerne les saturations qui remontent et les refoulements actifs.',
      },
      {
        kind: 'p',
        text: 'Les déboucheurs référencés sur Artisan Compétent couvrent à la fois le dépannage rapide et l’assainissement non collectif. Les cas typiques :',
      },
      {
        kind: 'list',
        items: [
          'Canalisation bouchée résistante au déboucheur chimique ou à la ventouse, sur évier, lavabo, douche ou baignoire',
          'WC bouché, refoulement actif, saturation du réseau d’évacuation côté logement',
          'Hydrocurage haute pression d’une canalisation principale ou d’un réseau enterré',
          'Inspection caméra du réseau pour identifier la nature du bouchon (graisse, racines, contre-pente, casse)',
          'Vidange de fosse septique avec bordereau de suivi et évacuation par professionnel agréé préfectoralement',
          'Mise en conformité d’une installation d’assainissement non collectif après contrôle SPANC',
          'Dégorgement d’un poste de relevage, d’une station de pompage ou d’un siphon de cour',
          'Recherche de cassure ou de contre-pente sur réseau d’évacuation par passage caméra',
        ],
      },
      {
        kind: 'p',
        text: 'Chacune de ces interventions est encadrée par le code de la santé publique et, pour l’assainissement non collectif, par l’arrêté du 7 septembre 2009 modifié. L’évacuation des matières de vidange impose un professionnel agréé par le préfet : c’est un point que la vérification Artisan Compétent contrôle quand le métier l’exige.',
      },
      {
        kind: 'h2',
        text: 'Pourquoi passer par Artisan Compétent pour vos travaux de débouchage et d’assainissement',
      },
      {
        kind: 'p',
        text: 'Artisan Compétent vérifie le déboucheur en amont, encadre votre paiement par séquestre Stripe et vous laisse 48h pour valider l’intervention avant toute libération des fonds.',
      },
      {
        kind: 'p',
        text: 'Chaque déboucheur de canalisations référencé sur Artisan Compétent voit son SIRET contrôlé sur les bases publiques (Annuaire des Entreprises, INSEE/SIRENE) et son assurance RC pro vérifiée avant validation.',
        emphasis: true,
      },
      {
        kind: 'p',
        text: 'Le filtre porte sur quatre éléments : SIRET actif, assurance RC pro couvrant l’activité de débouchage, agrément préfectoral pour l’évacuation des matières de vidange si l’artisan intervient sur fosse septique, et historique de l’entreprise sans antécédent connu de pratique abusive. Un déboucheur dont l’un de ces documents manque ou est expiré n’est pas validé sur la plateforme.',
      },
      {
        kind: 'p',
        text: 'Une fois le devis signé, l’artisan dépose obligatoirement ses documents légaux dans son tableau de bord Artisan Compétent : attestation d’assurance RC pro, agrément préfectoral si vidange, et justificatif du matériel utilisé (caméra d’inspection, hydrocureur, furet motorisé). Ces documents sont consultables par le client dans son espace personnel. Sur le débouchage, le justificatif matériel est un point particulièrement important : un artisan qui annonce hydrocurage sans matériel adapté est un signal d’alerte.',
      },
      {
        kind: 'p',
        text: 'Le séquestre de fonds est un compte tiers géré via Stripe qui encadre tout le process, du devis à la libération des fonds.',
        emphasis: true,
      },
      {
        kind: 'p',
        text: 'Le paiement quitte votre compte au moment où vous validez le devis du déboucheur, mais reste bloqué sur un compte séquestre Stripe. Les fonds sont libérés à l’artisan 48h après la fin de l’intervention, sans contestation. C’est cette fenêtre qui change tout en débouchage : si la canalisation se rebouche dans les deux jours, vous pouvez signaler un travail incomplet avant la libération des fonds. Le séquestre rend également inopérante la pratique du forfait verbal exigé sur place après une intervention nocturne.',
      },
      {
        kind: 'p',
        text: 'Le déclenchement des 48h est balisé : procès-verbal de réception, fenêtre de réserves, notification de fin de délai.',
        emphasis: true,
      },
      {
        kind: 'p',
        text: 'Concrètement, le délai des 48h ne court pas dans le vide. À la fin du chantier, un procès-verbal de réception est émis sur la plateforme. Ce PV ouvre la fenêtre de 48h pendant laquelle vous pouvez émettre des réserves : malfaçon constatée, non-conformité au devis, finition manquante, document promis non remis. 8h avant la fin du délai, un mail de notification (qui vaut mise en demeure d’examiner le chantier) vous est envoyé pour éviter une libération par simple oubli. Sans réserve émise au terme des 48h, les fonds sont libérés automatiquement à l’artisan. Avec réserve, le séquestre reste actif jusqu’au traitement contradictoire de la contestation.',
      },
      {
        kind: 'p',
        text: 'CMOD est un service payant et optionnel d’accompagnement par un conseiller maître d’ouvrage à distance. Deux appels offerts dans des conditions précises.',
        emphasis: true,
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
        text: 'Pour les interventions sous 2 000 € (la majorité des débouchages courants), le CMOD gratuit n’est pas automatique. Le client peut écrire à Artisan Compétent, qui traite la demande sous 24 à 48h selon la charge. Le suivi complet en amont (relecture du devis, vérification de la méthode proposée, contrôle de l’agrément préfectoral du vidangeur, validation des rapports d’inspection caméra) reste sur option payante. Le CMOD payant prend tout son sens sur les chantiers structurants : réhabilitation d’une fosse septique, remise en conformité d’un réseau après contrôle SPANC, passage caméra sur un réseau ancien.',
      },
      {
        kind: 'h2',
        text: 'Combien coûte un débouchage ou un chantier d’assainissement',
      },
      {
        kind: 'p',
        text: 'Le coût dépend de la méthode réellement nécessaire, qui n’est connue qu’après diagnostic. Des ordres de grandeur existent pour les interventions courantes (à compléter par Himad sur la base de la grille Compagnie des Déboucheurs, référence du marché), mais seul un devis chiffré du déboucheur vérifié engage l’artisan.',
      },
      {
        kind: 'p',
        text: 'Le tarif dépend de cinq variables qui se cumulent. Les éléments qui font bouger un devis :',
      },
      {
        kind: 'list',
        items: [
          'La méthode utilisée (furet manuel ou motorisé, hydrocurage haute pression, inspection caméra, vidange)',
          'L’urgence : intervention en heures ouvrées, nuit, week-end ou jour férié',
          'L’accessibilité (regard ouvert, trappe de visite, canalisation enterrée, fosse en sous-sol ou en extérieur)',
          'Le volume traité (longueur de canalisation, volume de fosse, durée d’hydrocurage)',
          'Les obligations réglementaires : agrément préfectoral pour vidange, bordereau de suivi, mise en conformité SPANC, traçabilité des matières évacuées',
        ],
      },
      {
        kind: 'p',
        text: 'Artisan Compétent impose un devis chiffré et accepté avant intervention non-urgence, et conforme à l’obligation légale du devis préalable au-delà de 150 €. La fourchette tarifaire indicative par type d’intervention sera ajoutée dans la prochaine itération, sur la base de la grille Compagnie des Déboucheurs validée par Himad. Les artisans référencés sur Artisan Compétent sont cadrés sur cette grille pour rester compétitifs et transparents.',
      },
      {
        kind: 'h2',
        text: 'Comparatif : Artisan Compétent vs autres plateformes vs Google direct',
      },
      {
        kind: 'p',
        text: 'Trois manières de trouver un déboucheur en France. Trois niveaux de protection radicalement différents.',
      },
      {
        kind: 'table',
        headers: [
          'Critère',
          'Autres plateformes',
          'Google direct',
          'Artisan Compétent',
        ],
        rows: [
          [
            'Vérification SIRET artisan',
            'Variable',
            'Aucune',
            'Systématique avant validation',
          ],
          [
            'Vérification assurance RC pro et agrément préfectoral',
            'Rare',
            'Aucune',
            'RC pro, agrément vidange, justificatif matériel',
          ],
          [
            'Paiement encadré',
            'Non',
            'Séquestre de fonds Stripe, libération à 48h',
            '',
          ],
          [
            'Recours en cas de canalisation reboucher sous 48h',
            'Limité',
            'Aucun',
            'Fonds bloqués jusqu’à validation effective',
          ],
          [
            'Recours en cas d’abus',
            'Limité',
            'Aucun',
            'Retenue jusqu’à 250 € sur signalement < 48h',
          ],
          [
            'Tarification cadrée sur référence du marché',
            'Non',
            'Aucune',
            'Grille Compagnie des Déboucheurs en cours d’intégration',
          ],
          [
            'Conseiller maître d’ouvrage',
            'Non',
            'CMOD disponible sur option',
            '',
          ],
        ],
      },
      {
        kind: 'h2',
        text: 'Les 3 pièges à éviter quand on cherche un déboucheur',
      },
      {
        kind: 'p',
        text: 'Le débouchage en urgence est l’un des secteurs où la pratique du forfait verbal et de la méthode surdimensionnée est la plus rentable pour les artisans peu scrupuleux. Trois pièges reviennent particulièrement.',
      },
      {
        kind: 'h3',
        text: 'Piège 1 : Le forfait gonflé sans détail des moyens utilisés',
      },
      {
        kind: 'p',
        text: 'Un déboucheur arrive sur appel passé sur un numéro trouvé en ligne, intervient quelques minutes, annonce un forfait global de plusieurs centaines d’euros sans préciser la méthode employée (furet ? hydrocurage ? inspection caméra ?), sans détail du déplacement, sans durée. Le devis sérieux décompose : déplacement, main-d’œuvre horaire, méthode d’intervention, matériel consommable, urgence éventuelle. Artisan Compétent impose cette décomposition avant déclenchement du paiement en séquestre.',
      },
      {
        kind: 'h3',
        text: 'Piège 2 : L’hydrocurage facturé là où un simple furet suffisait',
      },
      {
        kind: 'p',
        text: 'Un bouchon localisé en pied de sanitaire ou sur évacuation courte se traite avec un furet motorisé en quelques minutes. Le déboucheur peu scrupuleux annonce systématiquement un hydrocurage haute pression, facturé bien plus cher, sans diagnostic visuel ni inspection caméra préalables. Le devis devrait toujours partir d’un diagnostic et proposer la méthode minimale nécessaire, avec une option hydrocurage seulement si le furet est insuffisant. La traçabilité matérielle au tableau de bord (justificatif hydrocureur) protège du contraire.',
      },
      {
        kind: 'h3',
        text: 'Piège 3 : La pose de produits chimiques agressifs au lieu d’une intervention mécanique',
      },
      {
        kind: 'p',
        text: 'Certains intervenants versent un produit chimique très acide ou alcalin dans la canalisation, encaissent le forfait, et repartent. Le produit n’évacue souvent pas le bouchon réel (graisses figées, racines, contre-pente) mais dégrade les joints en plomb, le PVC ancien et les évacuations en grès. Le bouchon revient en quelques semaines avec une canalisation fragilisée. Le devis du déboucheur vérifié doit préciser la méthode mécanique retenue (furet, hydrocurage, inspection) et exclure les produits chimiques agressifs non identifiés.',
      },
      {
        kind: 'h2',
        text: 'Votre rôle dans le suivi du chantier',
      },
      {
        kind: 'p',
        text: 'La protection séquestre s’appuie sur un contradictoire écrit. Votre participation active conditionne la qualité du recours en cas de litige : pas de trace écrite, pas de levier.',
      },
      {
        kind: 'p',
        text: 'Pour les interventions de débouchage courtes (quelques heures), demandez systématiquement à l’artisan une photo du dispositif utilisé (furet motorisé, hydrocureur, caméra d’inspection) et, le cas échéant, le rapport d’inspection caméra avec image du bouchon ou de l’obstruction. Pour les chantiers de plus longue durée (réhabilitation de fosse, mise en conformité SPANC, passage caméra complet), l’artisan dépose chaque jour des photos d’avancement dans le tableau de bord partagé. Documentez aussi de votre côté la nature du désordre avant intervention (refoulement, niveau d’eau, traces) pour faciliter un éventuel contradictoire.',
      },
      {
        kind: 'p',
        text: 'En cas de signalement d’abus dans les 48h (canalisation rebouchée immédiatement, hydrocurage facturé non réalisé, agrément vidange manquant), Artisan Compétent peut retenir jusqu’à 250 € sur la facturation de l’artisan avant validation du paiement, conformément aux CGU et CGV.',
      },
      {
        kind: 'h2',
        text: 'Assurance habitation et remboursement',
      },
      {
        kind: 'p',
        text: 'C’est l’un des métiers où le remboursement par l’assurance habitation est le plus fréquent : la quasi-totalité des contrats incluent une garantie dégât des eaux qui couvre tout ou partie d’un débouchage après refoulement, fuite ou dégât. La démarche est à votre charge auprès de votre assureur. Artisan Compétent n’intervient pas dans la procédure d’indemnisation.',
      },
      {
        kind: 'p',
        text: 'Plusieurs situations courantes en débouchage ouvrent droit à indemnisation : refoulement de WC avec dégât des eaux, rupture ou contre-pente de canalisation ayant entraîné une infiltration, dégât des eaux suite à fuite sur évacuation, intervention d’urgence sur fosse pleine ayant débordé. La plupart des contrats d’assurance habitation multirisques incluent une garantie “dégâts des eaux” qui prend en charge le débouchage et la remise en état du logement, dans les limites prévues au contrat (franchise, plafond, expertise éventuelle).',
      },
      {
        kind: 'p',
        text: 'Le réflexe à avoir : avant ou immédiatement après l’intervention, ouvrez un dossier sinistre auprès de votre assurance habitation. Conservez le devis signé, la facture détaillée, le rapport d’inspection caméra le cas échéant, et les photos du sinistre. La prise en charge est conditionnée à ces pièces et au respect des délais de déclaration prévus au contrat (généralement 5 jours ouvrés).',
      },
      {
        kind: 'p',
        text: 'Artisan Compétent ne fait pas l’avance, ne se substitue pas à votre assureur et ne suspend pas le séquestre pour attendre une indemnisation. L’intervention est lancée selon le parcours habituel, vous traitez avec votre assurance en parallèle.',
      },
      {
        kind: 'h2',
        text: 'Comment ça marche en 3 étapes',
      },
      {
        kind: 'p',
        text: 'Le parcours sur Artisan Compétent compte trois étapes : description du besoin, validation du devis avec paiement en séquestre, intervention et libération des fonds après 48h.',
      },
      {
        kind: 'p',
        text: 'Étape 1. Vous décrivez votre besoin (canalisation bouchée, refoulement, vidange, passage caméra) sur Artisan Compétent et recevez un devis détaillé d’un déboucheur vérifié de votre zone.',
      },
      {
        kind: 'p',
        text: 'Étape 2. Vous validez le devis, le paiement part en séquestre via Stripe, l’intervention est planifiée.',
      },
      {
        kind: 'p',
        text: 'Étape 3. Le déboucheur intervient. À la fin de l’intervention, un procès-verbal de réception est émis sur la plateforme : il ouvre une fenêtre de 48h pendant laquelle vous pouvez émettre des réserves (bouchon non levé, dégradation des canalisations, méthode différente du devis). Un mail de notification vous est envoyé 8h avant la fin du délai. Sans réserve, les fonds sont libérés automatiquement à l’artisan.',
      },
      {
        kind: 'h2',
        text: 'Déboucheur d’urgence 24h/24, 7j/7',
      },
      {
        kind: 'p',
        text: 'Artisan Compétent couvre le débouchage en urgence 24h/24 et 7j/7 dans les zones desservies. La règle des 48h pour signaler un abus reste applicable même en sortie nocturne.',
      },
      {
        kind: 'p',
        text: 'Le déboucheur fait partie des cinq métiers couverts en urgence permanente sur Artisan Compétent, avec le plombier, l’électricien, le serrurier et le chauffagiste. Un WC qui refoule, un évier saturé un dimanche soir, une fosse pleine la veille d’un événement : autant de situations qui imposent une intervention immédiate. Le protocole reste identique en sortie nocturne : devis chiffré, paiement en séquestre via Stripe, intervention, fenêtre de 48h pour signaler un abus.',
      },
      {
        kind: 'h2',
        text: 'Trouver un déboucheur vérifié dans votre ville',
      },
      {
        kind: 'p',
        text: 'Artisan Compétent couvre la France métropolitaine, les DOM-TOM et la Corse, soit 38 zones avec un rayon d’intervention de 30 km autour de chaque ville référencée.',
      },
      {
        kind: 'p',
        text: 'Vous pouvez chercher un déboucheur vérifié dans les principales métropoles françaises. Chaque artisan référencé a son SIRET contrôlé et son assurance vérifiée avant validation sur la plateforme.',
      },
      {
        kind: 'cities',
        items: [
          'Déboucheur Paris',
          'Déboucheur Marseille',
          'Déboucheur Lyon',
          'Déboucheur Toulouse',
          'Déboucheur Nice',
          'Déboucheur Nantes',
          'Déboucheur Montpellier',
          'Déboucheur Strasbourg',
          'Déboucheur Bordeaux',
          'Déboucheur Lille',
        ],
      },
      {
        kind: 'h2',
        text: 'Klarna : comment ça marche',
      },
      {
        kind: 'p',
        text: 'Klarna est un service de paiement échelonné en 3 fois sans frais. Artisan Compétent met cet outil à disposition dans le parcours de paiement. Son activation se négocie entre le client et l’artisan : ce n’est pas automatique.',
      },
      {
        kind: 'p',
        text: 'Pour les chantiers programmés (réhabilitation de fosse, mise en conformité SPANC, passage caméra complet), Klarna 3 fois sans frais peut être proposé par l’artisan dans le respect des plafonds Klarna en vigueur. Sur les interventions d’urgence courtes (débouchage simple), Klarna est rarement proposé du fait du caractère immédiat de l’intervention. Le mécanisme du séquestre de fonds reste actif dans tous les cas : le paiement échelonné est protégé jusqu’à validation du chantier à 48h.',
      },
      {
        kind: 'h2',
        text: 'Questions fréquentes',
      },
      {
        kind: 'p',
        text: 'Cette FAQ regroupe les questions les plus posées par les particuliers qui cherchent un déboucheur vérifié sur Artisan Compétent.',
      },
      {
        kind: 'faq',
        items: [
          {
            question: 'Quand faut-il vraiment appeler un déboucheur professionnel ?',
            answers: [
              'Dès qu’une intervention domestique (ventouse, déboucheur chimique doux, démontage de siphon) reste sans effet, et dans tous les cas de refoulement actif ou de WC saturé. Les bouchons résistants traduisent souvent une accumulation de graisses, des racines, une contre-pente ou une casse de canalisation : seul un professionnel équipé (furet motorisé, hydrocureur, caméra d’inspection) peut diagnostiquer et résoudre. Sur Artisan Compétent, l’artisan vérifié arrive avec un devis chiffré et un matériel adapté tracé au tableau de bord.',
            ],
          },
          {
            question: 'Mon assurance habitation rembourse-t-elle un débouchage après refoulement ?',
            answers: [
              'Dans la majorité des cas, oui. La plupart des contrats d’assurance habitation multirisques incluent une garantie “dégâts des eaux” qui couvre tout ou partie du débouchage et de la remise en état du logement après refoulement, fuite ou dégât. Il faut ouvrir un dossier sinistre auprès de votre assureur dans les délais prévus au contrat (généralement 5 jours ouvrés), avec le devis, la facture et les photos du sinistre. C’est à vous de faire la démarche, Artisan Compétent n’intervient pas dans la procédure d’indemnisation.',
            ],
          },
          {
            question: 'Quelle est la différence entre un furet et un hydrocurage ?',
            answers: [
              'Le furet (manuel ou motorisé) est un câble mécanique souple, terminé par une tête adaptée, qui désagrège ou repousse un bouchon localisé sur évacuation courte. L’hydrocurage utilise un jet d’eau haute pression projeté par une lance dans la canalisation pour décoller les graisses, les dépôts et les obstructions sur des longueurs plus importantes. L’hydrocurage est plus puissant mais aussi plus cher. Le choix dépend du diagnostic, qui passe idéalement par une inspection caméra préalable.',
            ],
          },
          {
            question: 'Faut-il un agrément spécial pour vidanger une fosse septique ?',
            answers: [
              'Oui. L’évacuation des matières de vidange impose un professionnel agréé par le préfet, avec délivrance d’un bordereau de suivi à chaque vidange. C’est une obligation du code de la santé publique et de l’arrêté du 7 septembre 2009 modifié. Sur Artisan Compétent, l’agrément préfectoral est vérifié en amont pour les artisans qui interviennent sur fosses septiques, et déposé au tableau de bord.',
            ],
          },
          {
            question: 'Combien coûte un débouchage de canalisation ou une vidange ?',
            answers: [
              'Le coût dépend de la méthode utilisée, de l’accessibilité, de l’urgence et du volume traité. Une fourchette tarifaire indicative par type d’intervention sera ajoutée prochainement, sur la base de la grille Compagnie des Déboucheurs (référence du marché). Aucun forfait national fiable n’existe et seul un devis chiffré du déboucheur vérifié engage l’artisan. Sur Artisan Compétent, la décomposition (déplacement, main-d’œuvre, méthode, matériel) est imposée avant déclenchement du paiement.',
            ],
          },
          {
            question: 'Comment fonctionne le séquestre de fonds quand on appelle un déboucheur ?',
            answers: [
              'Le séquestre de fonds est un compte tiers géré via Stripe. Quand vous validez le devis, le paiement quitte votre compte mais reste bloqué sur le séquestre. Les fonds sont libérés 48h après l’intervention, sans contestation. Cette fenêtre est particulièrement utile en débouchage : si la canalisation se rebouche dans les deux jours, vous pouvez signaler un travail incomplet avant la libération. En cas de signalement d’abus, Artisan Compétent peut retenir jusqu’à 250 € sur la facturation de l’artisan avant validation.',
            ],
          },
          {
            question: 'Klarna 3 fois sans frais s’applique-t-il à un débouchage ?',
            answers: [
              'Sur les chantiers programmés (réhabilitation de fosse, mise en conformité SPANC, passage caméra complet), Klarna 3 fois sans frais peut être proposé par l’artisan dans le respect des plafonds Klarna en vigueur. L’activation n’est pas automatique : elle se négocie entre vous et l’artisan. Sur les interventions d’urgence courtes (débouchage simple), Klarna est rarement proposé.',
            ],
          },
          {
            question: 'À quoi sert CMOD pour un chantier de débouchage ou d’assainissement ?',
            answers: [
              'CMOD est un service payant et optionnel d’accompagnement par un conseiller maître d’ouvrage à distance. Sur les devis entre 2 000 € et 5 000 €, un appel de 20 minutes est offert en cas de litige signalé après échec d’un règlement amiable, 45 minutes au-delà dans les mêmes conditions. Sous 2 000 €, le client peut écrire à Artisan Compétent pour demander une intervention CMOD, traitée sous 24 à 48h. Le suivi complet en amont (vérification de la méthode proposée, contrôle de l’agrément préfectoral, validation des rapports d’inspection caméra) reste sur option payante. Très utile sur les réhabilitations de fosse et les mises en conformité SPANC.',
            ],
          },
          {
            question: 'Que se passe-t-il si la canalisation se rebouche dans les jours qui suivent ?',
            answers: [
              'Vous signalez le défaut dans les 48h suivant l’intervention, via le tableau de bord partagé. Tant que ce délai court, les fonds restent en séquestre et ne sont pas libérés au déboucheur. Artisan Compétent peut demander une nouvelle intervention sans facturation complémentaire ou retenir jusqu’à 250 € sur la facturation de l’artisan avant validation. Le rapport d’inspection caméra remis à la première intervention est un élément clé pour distinguer un travail incomplet d’un nouveau problème indépendant.',
            ],
          },
          {
            question: 'Quelles villes sont couvertes par Artisan Compétent pour le débouchage ?',
            answers: [
              'Artisan Compétent couvre la France métropolitaine, les DOM-TOM et la Corse, soit 38 zones, avec un rayon d’intervention de 30 km autour de chaque ville référencée. Toutes les grandes métropoles sont couvertes (Paris, Marseille, Lyon, Toulouse, Nice, Nantes, Montpellier, Strasbourg, Bordeaux, Lille) avec une disponibilité 24h/24 en urgence dans les zones urbaines denses.',
            ],
          },
        ],
      },
      {
        kind: 'h2',
        text: 'Pour aller plus loin',
      },
      {
        kind: 'p',
        text: 'Un WC qui refoule, une canalisation bouchée résistante au déboucheur chimique, une fosse à vidanger avec bordereau de suivi, un passage caméra à programmer sur un réseau ancien : Artisan Compétent encadre la vérification du déboucheur (SIRET, RC pro, agrément préfectoral, justificatif matériel) et tout votre process par séquestre jusqu’à 48h après l’intervention.',
      },
      {
        kind: 'p',
        text: 'Déboucheur vérifié SIRET, RC pro et agrément préfectoral pour vidange. Matériel tracé au tableau de bord (caméra d’inspection, hydrocureur). Process encadré par séquestre Stripe. Retenue jusqu’à 250 € en cas de signalement d’abus. Recours assurance habitation systématique après dégât des eaux.',
      },
    ],
  };
