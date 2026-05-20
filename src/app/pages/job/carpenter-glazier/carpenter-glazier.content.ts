import type { JobPageContent } from '../_shared/job-content.types';

export const carpenterGlazierContent: JobPageContent = {
    imagePath: 'assets/img/vitrier.jpg',
    imageAlt: 'Vitrier vérifié',
    h1: 'Vitrier vérifié, du devis à la libération des fonds encadrée',
    slogan: 'Cette page liste les interventions de vitrerie traitées par les vitriers vérifiés d’Artisan Compétent et le mécanisme qui encadre votre paiement de bout en bout, du devis chiffré à la libération des fonds 48h après la fin du chantier.',
    metaTitle: 'Vitrier vérifié, du devis à la libération des fonds encadrée | Artisan Compétent',
    metaDescription: 'Sur Artisan Compétent, un vitrier vérifié a son SIRET et ses assurances contrôlés en amont, et toute son intervention (pose de vitrage, remplacement de…',
    body: [
      {
        kind: 'callout',
        title: 'En une phrase',
        body: 'Sur Artisan Compétent, un vitrier vérifié a son SIRET et ses assurances contrôlés en amont, et toute son intervention (pose de vitrage, remplacement de double vitrage, dépannage bris de glace, miroirs, vitrines, garde-corps verre) est encadrée par un séquestre de fonds Stripe qui retient le paiement jusqu’à 48h après la fin du chantier. Vous payez seulement si le travail est conforme au devis signé.',
      },
      {
        kind: 'p',
        text: 'Un vitrier vérifié sur Artisan Compétent a son SIRET contrôlé, ses assurances RC pro et décennale à jour et, le cas échéant, les certifications spécifiques aux ouvrages techniques (vitrages feuilletés de sécurité, garde-corps en verre soumis à la norme NF P01-013). Le séquestre de fonds Stripe encadre la totalité du processus : le paiement quitte votre compte à la validation du devis, reste bloqué pendant l’intervention, puis 48h supplémentaires après la fin du chantier. C’est ce délai de 48h qui vous laisse signaler une malfaçon (vitrage rayé, joint mal posé, double vitrage qui s’embue) ou un non-respect du devis avant que les fonds soient libérés au vitrier.',
      },
      {
        kind: 'callout',
        title: 'En bref',
        body: 'Un vitrier vérifié sur Artisan Compétent a son SIRET contrôlé, ses assurances RC pro et décennale à jour, et la certification correspondant aux vitrages techniques posés. Tout le process est encadré par un séquestre de fonds via Stripe : devis, intervention, libération des fonds 48h après la fin du chantier. Couverture France métropolitaine, DOM-TOM et Corse sur 38 zones, rayon de 30 km par ville. Périmètre : vitrerie et miroiterie. La menuiserie (encadrement, bâti dormant) n’est pas couverte en V1.',
      },
      {
        kind: 'h2',
        text: 'Pourquoi Artisan Compétent ne couvre pas la menuiserie en V1',
      },
      {
        kind: 'p',
        text: 'La menuiserie sur mesure implique des cycles longs, incompatibles avec le calibrage actuel du séquestre. Le périmètre Artisan Compétent V1 reste centré sur la vitrerie miroiterie. Des partenariats spécifiques sont à l’étude pour de futures versions.',
      },
      {
        kind: 'p',
        text: 'Plusieurs raisons concrètes justifient ce choix de périmètre, qu’il est important de poser clairement avant tout devis :',
      },
      {
        kind: 'list',
        items: [
          'La menuiserie sur mesure implique des délais longs. Entre la prise de mesures, la commande en usine, la fabrication et la pose, plusieurs mois peuvent s’écouler. Sur des fenêtres techniques (bois massif, mixte, sur-mesure non standard), les délais constructeur dépassent souvent les six à huit semaines.',
          'Le séquestre de fonds est conçu pour des cycles d’intervention courts. Le mécanisme actuel d’Artisan Compétent retient les fonds jusqu’à 48h après la fin du chantier, dans une logique d’intervention en jours ou en semaines. Cette mécanique n’est pas adaptée à une commande dont l’exécution s’étale sur plusieurs mois, avec acompte fabricant et risque d’aléa industriel.',
          'Les délais de la menuiserie sont incompatibles avec le séquestre tel qu’il est calibré aujourd’hui. Maintenir des fonds en séquestre sur plusieurs mois entraînerait des contraintes opérationnelles et juridiques (trésorerie client, blocage de paiement fournisseur, gestion des annulations) qu’Artisan Compétent ne couvre pas en V1.',
          'Des partenariats spécifiques cas par cas sont à l’étude pour de futures versions. L’objectif est d’identifier des fabricants ou poseurs de menuiserie dont la fiabilité de délai et la qualité des engagements permettent d’intégrer un séquestre adapté.',
        ],
      },
      {
        kind: 'p',
        text: 'Cas de chevauchement à connaître. Si un devis vitrier intègre le remplacement de l’encadrement (menuiserie), seule la partie vitrerie miroiterie est suivie par Artisan Compétent. La partie menuiserie reste hors périmètre, sans couverture séquestre et sans recours plateforme. Le client en est informé en amont par l’artisan, et le devis doit décomposer clairement la part vitrerie de la part menuiserie. C’est cette décomposition qui permet à Artisan Compétent de ne séquestrer que la portion couverte.',
      },
      {
        kind: 'h2',
        text: 'Quand faire appel à un vitrier vérifié',
      },
      {
        kind: 'p',
        text: 'Un vitrier vérifié intervient sur la pose et le remplacement de vitrages (simple, double, feuilleté de sécurité), sur les miroirs et vitrines, sur les garde-corps en verre et sur le dépannage en urgence après bris de glace.',
      },
      {
        kind: 'p',
        text: 'Les cas typiques traités par les vitriers référencés sur Artisan Compétent couvrent à la fois le dépannage rapide et les chantiers programmés. Quelques exemples concrets qui justifient l’intervention d’un professionnel vérifié plutôt que d’un poseur improvisé :',
      },
      {
        kind: 'list',
        items: [
          'Bris de glace en urgence (effraction, choc, casse accidentelle) avec sécurisation rapide et remplacement de la vitre',
          'Remplacement de double vitrage défectueux (vitrage embué entre les deux verres, joint d’étanchéité défaillant)',
          'Pose de vitrage feuilleté de sécurité (escalier, balustrade, vitrage anti-effraction)',
          'Installation ou remplacement de fenêtre PVC ou aluminium hors encadrement (le bâti dormant existant est conservé, seul le vantail vitré est remplacé)',
          'Pose de miroirs intérieurs (salle de bain, dressing, hall) sur mesure',
          'Installation de vitrines pour commerces (vitrine simple, double vitrage feuilleté de sécurité, vitrine anti-effraction)',
          'Pose de garde-corps en verre (escalier, mezzanine, balcon) avec respect de la norme NF P01-013',
          'Remplacement de vitrage pour véranda ou verrière (hors structure menuisée)',
        ],
      },
      {
        kind: 'p',
        text: 'Sont exclus du périmètre V1 : la pose ou le remplacement complet de fenêtres avec leur encadrement (bâti dormant à déposer puis à reposer), la fabrication sur mesure de menuiseries bois ou alu, les travaux d’isolation par menuiserie qui supposent une intervention sur le gros œuvre. Ces interventions seront étudiées pour de futures versions de la plateforme via partenariats spécifiques.',
      },
      {
        kind: 'p',
        text: 'Chaque intervention de vitrerie engage la responsabilité décennale du vitrier sur les ouvrages durables intégrés au bâti (vitrages feuilletés sécurité, garde-corps verre) et la garantie biennale sur les équipements posés. C’est cette responsabilité qui rend la vérification de l’assurance et du SIRET indispensable avant toute pose.',
      },
      {
        kind: 'h2',
        text: 'Pourquoi passer par Artisan Compétent pour vos travaux de vitrerie',
      },
      {
        kind: 'p',
        text: 'Artisan Compétent vérifie le vitrier en amont, encadre votre paiement par séquestre Stripe et vous laisse 48h pour valider le chantier avant toute libération des fonds.',
      },
      {
        kind: 'p',
        text: 'Chaque vitrier référencé sur Artisan Compétent voit son SIRET contrôlé sur les bases publiques (Annuaire des Entreprises, INSEE/SIRENE) et ses assurances vérifiées avant validation.',
        emphasis: true,
      },
      {
        kind: 'p',
        text: 'La vérification porte sur trois points concrets : SIRET actif et à jour, attestation d’assurance RC pro couvrant l’activité de vitrerie miroiterie, attestation d’assurance décennale obligatoire sur les ouvrages durables (vitrages feuilletés de sécurité, garde-corps en verre, vitrines techniques). Les certifications spécifiques sont exigées en plus pour les ouvrages techniques : conformité à la norme NF P01-013 pour les garde-corps verre, certification pour les vitrages anti-effraction de classe P. Un vitrier dont l’un de ces documents manque ou est expiré n’est tout simplement pas validé sur la plateforme.',
      },
      {
        kind: 'p',
        text: 'Une fois le devis signé, l’artisan dépose obligatoirement ses documents légaux (attestations d’assurance, certifications spécifiques aux ouvrages techniques) dans son tableau de bord Artisan Compétent. Ces documents sont consultables par le client dans son espace personnel. Le client est néanmoins invité à revérifier en amont les pièces sensibles : assurance décennale en cours de validité, certification produit pour les vitrages techniques posés. Cette double vérification protège des cas marginaux où une attestation aurait expiré entre la validation initiale et le démarrage du chantier.',
      },
      {
        kind: 'p',
        text: 'Le séquestre de fonds est un compte tiers géré via Stripe qui encadre tout le process, du devis à la libération des fonds.',
        emphasis: true,
      },
      {
        kind: 'p',
        text: 'Quand vous validez le devis du vitrier, le paiement quitte votre compte mais n’arrive pas sur celui de l’artisan : il reste bloqué sur un compte séquestre Stripe. Cette mise en attente dure jusqu’à la fin de l’intervention, plus un délai de 48h pendant lequel vous pouvez signaler un abus, un défaut de qualité (vitrage rayé, joint mal posé) ou un non-respect du devis. Sans contestation, les fonds sont libérés au vitrier au terme de ces 48h. Pendant la fenêtre de 48h, le séquestre joue son rôle de levier : c’est la motivation la plus efficace pour qu’un artisan reprenne un défaut visible à la livraison.',
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
          'Pour les devis compris entre 2 000 € et 5 000 €, un appel de 20 minutes est offert.',
          'Au-delà de 5 000 €, l’appel offert passe à 45 minutes.',
        ],
      },
      {
        kind: 'p',
        text: 'En dehors de ces conditions, le suivi CMOD reste sur option payante. Pour les interventions sous le seuil des 2 000 €, le CMOD gratuit n’est pas automatique : le client peut écrire à Artisan Compétent qui traite la demande sous 24 à 48h selon la charge. Sur les chantiers vitrerie à enjeu (remplacement de vitrines commerciales, garde-corps verre, vitrages anti-effraction sur villa, miroiterie sur mesure pour bureau ou commerce), CMOD est particulièrement utile pour valider la conformité du produit posé et le respect des normes applicables.',
      },
      {
        kind: 'h2',
        text: 'Combien coûte une intervention de vitrier',
      },
      {
        kind: 'p',
        text: 'Le coût d’une intervention dépend du type de vitrage, de la dimension, de la complexité de la pose et de l’urgence. Aucun forfait national fiable n’existe : seul un devis chiffré du vitrier vérifié engage l’artisan.',
      },
      {
        kind: 'p',
        text: 'Les variables structurantes du tarif d’un vitrier :',
      },
      {
        kind: 'list',
        items: [
          'La nature du vitrage : simple vitrage, double vitrage standard, double vitrage à isolation renforcée, vitrage feuilleté de sécurité, vitrage anti-effraction (classes P1A à P8B). L’écart de prix entre un double vitrage standard et un vitrage feuilleté anti-effraction peut être significatif.',
          'La dimension et la forme : un vitrage rectangulaire standard est moins coûteux qu’un vitrage de grande dimension, qu’un vitrage cintré ou qu’un vitrage en forme spéciale.',
          'La complexité de la pose : un remplacement à la même cote dans un cadre existant est plus rapide qu’une pose neuve nécessitant des ajustements ou des reprises de calfeutrement.',
          'L’accessibilité : un vitrage en façade au rez-de-chaussée se pose plus vite qu’un vitrage en étage sans accès facile, ou qu’une vitrine commerciale qui impose une intervention de nuit.',
          'L’urgence : une intervention en urgence (bris de glace nuit ou week-end) majore le tarif d’intervention.',
          'La sécurisation préalable : sur les cas de bris de glace, une sécurisation rapide (planche, film de protection, vitrage temporaire) peut être facturée séparément du remplacement définitif.',
        ],
      },
      {
        kind: 'p',
        text: 'Fourchette horaire indicative : à compléter par Himad. Sur Artisan Compétent, la décomposition (déplacement, main-d’œuvre, fourniture du vitrage, sécurisation éventuelle, dépose et évacuation) est imposée avant déclenchement du paiement, ce qui sécurise la lisibilité du devis.',
      },
      {
        kind: 'h2',
        text: 'Artisan Compétent vs autres plateformes vs Google direct',
      },
      {
        kind: 'p',
        text: 'Tableau comparatif synthétique des trois canaux les plus utilisés pour trouver un vitrier. Les critères sont calés sur les points de risque réels du métier.',
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
            'Vérification SIRET de l’artisan',
            'Variable selon la plateforme',
            'Aucune par défaut',
            'Systématique avant validation du profil',
          ],
          [
            'Vérification assurances (RC pro, décennale)',
            'Rare ou déclarative',
            'Aucune',
            'RC pro et décennale exigées et vérifiées',
          ],
          [
            'Certifications ouvrages techniques (NF P01-013, vitrages anti-effraction)',
            'Rare',
            'Aucune',
            'Vérifiées et déposées au tableau de bord',
          ],
          [
            'Paiement encadré',
            'Non',
            'Séquestre de fonds Stripe, libération à 48h',
            '',
          ],
          [
            'Recours en cas de malfaçon (vitrage rayé, joint défaillant)',
            'Limité',
            'Aucun',
            'Retenue jusqu’à 250 € si signalement < 48h',
          ],
          [
            'Devis détaillé imposé avant intervention',
            'Non',
            'Variable',
            'Décomposition fourniture / pose / urgence',
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
        text: 'Les 3 pièges à éviter quand vous cherchez un vitrier',
      },
      {
        kind: 'p',
        text: 'Trois pièges concrets que rencontrent les particuliers, et comment Artisan Compétent les neutralise.',
      },
      {
        kind: 'p',
        text: 'Piège 1. Le vitrage sécurité posé sans certification. Sur les garde-corps en verre, les escaliers, les balustrades de mezzanine, le vitrage doit être feuilleté de sécurité et la pose doit respecter la norme NF P01-013. Une pose hors norme expose à un risque réel de chute et engage la responsabilité du poseur en cas d’accident. Sur Artisan Compétent, les certifications produit et la conformité à la norme sont vérifiées à la souscription pour les artisans qui interviennent sur ces ouvrages, puis déposées au tableau de bord après signature du devis.',
      },
      {
        kind: 'p',
        text: 'Piège 2. Le double vitrage qui s’embue six mois après la pose. Un double vitrage qui se condense entre les deux verres signe une défaillance d’étanchéité du scellement périphérique : c’est un défaut produit ou de pose, pas un défaut d’usage. Sur Artisan Compétent, ce défaut peut être signalé pendant la fenêtre de 48h après pose (si visible), puis relève de la garantie biennale et de la garantie constructeur (souvent 10 ans sur les doubles vitrages de marque). Le tableau de bord conserve les pièces (devis, marque, série, attestation de pose) pour activer la garantie.',
      },
      {
        kind: 'p',
        text: 'Piège 3. La facturation d’urgence opportuniste sur bris de glace. Comme pour la serrurerie, le bris de glace en urgence (nuit, week-end, jour férié) est un terrain favorable aux abus tarifaires. Sur Artisan Compétent, le tarif est annoncé avant déplacement, le devis est signé sur place avant intervention, et la décomposition (sécurisation, fourniture, pose, urgence) est imposée. Le séquestre de fonds reste actif même en urgence : le paiement n’est libéré qu’après 48h.',
      },
      {
        kind: 'h2',
        text: 'Votre rôle dans le suivi du chantier',
      },
      {
        kind: 'p',
        text: 'Sur les chantiers vitrerie, votre suivi actif est essentiel pour documenter la conformité de la pose et débloquer un recours rapide en cas de malfaçon. Voici ce que vous faites concrètement, dans le tableau de bord partagé avec l’artisan.',
      },
      {
        kind: 'p',
        text: 'Pour les chantiers d’un seul jour (remplacement de vitrage standard, dépannage bris de glace), l’artisan dépose à la fin de l’intervention des photos de l’ouvrage posé, le bon de pose et les références produit (marque, dimensions, type de vitrage). Vous validez ou signalez dans le tableau de bord partagé. Pour les chantiers plus longs (pose de plusieurs vitrines, garde-corps verre sur escalier complet, miroiterie sur mesure pour commerce), l’artisan dépose chaque jour des photos d’avancement : pose des fixations, mise en place des vitrages, calfeutrement, contrôles d’étanchéité. Vous commentez, validez ou signalez dans le même espace, ce qui établit un contradictoire écrit en cas de litige ultérieur. Vous documentez aussi : photos de la zone avant intervention (état du cadre existant, joints en place), photos après pose (calfeutrement, étanchéité, propreté de la finition), photos de la plaque signalétique du vitrage posé.',
      },
      {
        kind: 'p',
        text: 'Cette participation active conditionne la qualité du recours en cas de litige : pas de trace écrite, pas de levier. En cas de signalement d’abus dans les 48h suivant la fin du chantier, Artisan Compétent peut retenir jusqu’à 250 € sur la facturation de l’artisan avant validation du paiement, conformément aux CGU/CGV. Cette retenue couvre les cas de malfaçon avérée (vitrage rayé, joint mal posé, dimension non conforme au devis) ou de non-respect du devis signé.',
      },
      {
        kind: 'h2',
        text: 'Assurance habitation et remboursement (rubrique renforcée pour le bris de glace)',
      },
      {
        kind: 'p',
        text: 'Le bris de glace fait partie des sinistres les mieux couverts par les assurances habitation. Selon votre contrat, le remplacement de la vitre peut être pris en charge totalement ou partiellement.',
      },
      {
        kind: 'p',
        text: 'Sur les sinistres impliquant un bris de glace (effraction, choc, casse accidentelle), la quasi-totalité des contrats d’assurance habitation multirisques incluent une garantie "bris de glaces" qui couvre tout ou partie du remplacement. Certaines garanties carte bancaire premium remboursent également les bris consécutifs à un cambriolage ou à un acte de vandalisme. La démarche est à votre charge : vous contactez votre assureur dès que possible (et dans les délais prévus au contrat, souvent 5 jours ouvrés, et 48h en cas de vol ou de vandalisme avec dépôt de plainte préalable). Vous transmettez le devis du vitrier vérifié, les photos du sinistre, le cas échéant le procès-verbal de dépôt de plainte. Artisan Compétent n’intervient pas dans la procédure d’indemnisation : l’intervention peut être lancée en parallèle si elle est urgente (sécurisation immédiate puis remplacement), et le remboursement éventuel se traite directement entre vous et votre assureur après facturation.',
      },
      {
        kind: 'h2',
        text: 'Comment ça marche, en 3 étapes',
      },
      {
        kind: 'p',
        text: 'Du dépôt de votre besoin à la libération des fonds, trois étapes structurent l’intervention. Le séquestre de fonds Stripe couvre la totalité du parcours.',
      },
      {
        kind: 'list',
        items: [
          'Vous décrivez votre besoin sur Artisan Compétent. Type d’intervention (remplacement de vitrage, miroir, garde-corps verre, vitrine, dépannage bris de glace), dimensions approximatives, urgence le cas échéant. La plateforme met en relation avec un ou plusieurs vitriers vérifiés dans votre zone.',
          'L’artisan envoie un devis détaillé. Vous validez. Le paiement entre en séquestre. Le devis détaille la prestation, le type de vitrage, la fourniture, le coût de la main-d’œuvre, l’éventuelle majoration d’urgence et le total TTC. Quand vous validez, le paiement quitte votre compte mais reste bloqué sur le séquestre Stripe.',
          'L’artisan intervient, vous recevez les références produit, les fonds sont libérés 48h plus tard. Photos de l’ouvrage posé, références produit (marque, dimensions, type de vitrage), bon de pose. À la fin du chantier, un procès-verbal de réception est émis sur la plateforme : il ouvre une fenêtre de 48h pendant laquelle vous pouvez émettre des réserves (abus, malfaçon, non-respect du devis). Un mail de notification vous est envoyé 8h avant la fin du délai. Sans réserve, les fonds sont libérés automatiquement à l’artisan.',
        ],
      },
      {
        kind: 'h2',
        text: 'Trouver un vitrier vérifié dans votre ville',
      },
      {
        kind: 'p',
        text: 'Couverture France métropolitaine, DOM-TOM et Corse sur 38 zones, rayon de 30 km par ville référencée. Les grandes métropoles sont couvertes en priorité.',
      },
      {
        kind: 'cities',
        items: [
          'Vitrier Paris',
          'Vitrier Marseille',
          'Vitrier Lyon',
          'Vitrier Toulouse',
          'Vitrier Nice',
          'Vitrier Nantes',
          'Vitrier Montpellier',
          'Vitrier Strasbourg',
          'Vitrier Bordeaux',
          'Vitrier Lille',
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
        text: 'Pour les chantiers programmés (pose de plusieurs vitrines, garde-corps verre complet, miroiterie sur mesure), Klarna 3 fois sans frais peut être proposé par l’artisan dans le respect des plafonds Klarna en vigueur. Sur les dépannages d’urgence courts (bris de glace remplacé sur place), Klarna est rarement proposé du fait du caractère immédiat de l’intervention. Le mécanisme du séquestre de fonds reste actif dans tous les cas : le paiement échelonné est protégé jusqu’à validation du chantier à 48h.',
      },
      {
        kind: 'h2',
        text: 'Questions fréquentes',
      },
      {
        kind: 'p',
        text: 'Cette FAQ regroupe les questions les plus posées par les particuliers qui cherchent un vitrier vérifié sur Artisan Compétent.',
      },
      {
        kind: 'faq',
        items: [
          {
            question: 'Pourquoi Artisan Compétent ne couvre pas la menuiserie en V1 ?',
            answers: [
              'La menuiserie sur mesure (fenêtre complète avec son encadrement, bâti dormant à déposer puis à reposer) implique des cycles de commande et de fabrication longs, souvent plusieurs mois entre la prise de mesures et la pose. Le séquestre de fonds Stripe est calibré pour des interventions de quelques jours à quelques semaines, ce qui n’est pas compatible avec ces délais. Des partenariats spécifiques sont à l’étude pour de futures versions. En attendant, seule la partie vitrerie miroiterie est suivie par la plateforme.',
            ],
          },
          {
            question: 'Que se passe-t-il si mon devis vitrier inclut le remplacement de l’encadrement ?',
            answers: [
              'Seule la partie vitrerie miroiterie est suivie par Artisan Compétent et placée sous séquestre. La partie menuiserie reste hors périmètre, sans couverture séquestre et sans recours plateforme. Le devis doit décomposer clairement la part vitrerie de la part menuiserie. Vous payez la part menuiserie directement à l’artisan, hors plateforme, selon les modalités convenues entre vous.',
            ],
          },
          {
            question: 'Mon assurance habitation rembourse-t-elle un bris de glace ?',
            answers: [
              'Dans la quasi-totalité des cas, oui. La plupart des contrats d’assurance habitation multirisques incluent une garantie "bris de glaces" qui couvre tout ou partie du remplacement de la vitre, qu’il s’agisse d’une effraction, d’un choc accidentel ou d’un vandalisme. Certaines cartes bancaires premium remboursent aussi les bris consécutifs à un cambriolage. Il faut contacter votre assureur dans les délais prévus au contrat avec le devis et les photos. Artisan Compétent n’intervient pas dans la procédure : c’est vous qui pilotez la demande d’indemnisation.',
            ],
          },
          {
            question: 'Le double vitrage s’embue après quelques mois, est-ce normal ?',
            answers: [
              'Non. Un double vitrage qui se condense entre les deux verres signe une défaillance d’étanchéité du scellement périphérique. C’est un défaut produit ou de pose, pas un défaut d’usage. Si la condensation apparaît dans les 48h après pose, vous le signalez dans le tableau de bord et l’artisan doit intervenir. Au-delà, la garantie biennale ou la garantie constructeur (souvent 10 ans sur les doubles vitrages de marque) prennent le relais. Le tableau de bord Artisan Compétent conserve les pièces nécessaires pour activer la garantie.',
            ],
          },
          {
            question: 'Combien coûte un bris de glace en urgence ?',
            answers: [
              'Le coût dépend du type de vitrage, des dimensions, du moment de l’intervention (nuit, week-end, jour férié) et de la sécurisation préalable nécessaire. Aucun forfait national fiable n’existe : seul un devis chiffré du vitrier vérifié engage l’artisan. Sur Artisan Compétent, le tarif est annoncé avant déplacement, le devis est signé sur place avant intervention, et la décomposition (sécurisation, fourniture, pose, urgence) est imposée.',
            ],
          },
          {
            question: 'Le séquestre de fonds couvre-t-il aussi les interventions d’urgence sur bris de glace ?',
            answers: [
              'Oui. Toute prestation passée par Artisan Compétent, qu’il s’agisse d’un chantier programmé ou d’un dépannage en urgence, est encadrée par le séquestre de fonds Stripe : devis chiffré et signé avant intervention, paiement bloqué jusqu’à 48h après la fin de l’intervention, libération après cette fenêtre. C’est précisément sur les interventions d’urgence que le séquestre apporte le plus de garanties contre les abus tarifaires.',
            ],
          },
          {
            question: 'Faut-il une certification pour poser un garde-corps en verre ?',
            answers: [
              'La pose d’un garde-corps en verre doit respecter la norme NF P01-013 (hauteur minimale, résistance aux chocs, type de vitrage feuilleté). Le poseur doit maîtriser les exigences techniques et utiliser un vitrage certifié. Sur Artisan Compétent, les vitriers qui interviennent sur ce type d’ouvrage déposent au tableau de bord les certifications produit et la conformité de leur méthode de pose.',
            ],
          },
          {
            question: 'Que se passe-t-il si le vitrage posé est rayé à la livraison ?',
            answers: [
              'Vous signalez le défaut dans les 48h suivant la fin du chantier, via le tableau de bord partagé, photos à l’appui. Tant que ce délai court, les fonds restent en séquestre et ne sont pas libérés au vitrier. Artisan Compétent peut demander un remplacement sans facturation complémentaire ou retenir jusqu’à 250 € sur la facturation de l’artisan avant validation. La photo de réception est l’élément clé.',
            ],
          },
          {
            question: 'À quoi sert CMOD pour un chantier de vitrerie ?',
            answers: [
              'CMOD est un service payant et optionnel d’accompagnement par un conseiller maître d’ouvrage à distance. Sur les devis entre 2 000 € et 5 000 €, un appel de 20 minutes est offert en cas de litige signalé après échec d’un règlement amiable, 45 minutes au-delà dans les mêmes conditions. Sous 2 000 €, le client peut écrire à Artisan Compétent pour demander une intervention CMOD, traitée sous 24 à 48h. Le suivi complet en amont (validation du produit, conformité à la norme NF P01-013, contrôle des certifications) reste sur option payante. Utile sur les pose de vitrines commerciales, les garde-corps verre et les vitrages anti-effraction sur villa.',
            ],
          },
          {
            question: 'Quelles villes sont couvertes par Artisan Compétent pour la vitrerie ?',
            answers: [
              'Artisan Compétent couvre la France métropolitaine, les DOM-TOM et la Corse, soit 38 zones, avec un rayon d’intervention de 30 km autour de chaque ville référencée. Toutes les grandes métropoles sont couvertes (Paris, Marseille, Lyon, Toulouse, Nice, Nantes, Montpellier, Strasbourg, Bordeaux, Lille) avec une disponibilité 24h/24 en urgence sur les zones urbaines denses.',
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
        text: 'Un bris de glace après effraction, un double vitrage embué à remplacer, une vitrine commerciale endommagée, un garde-corps verre à poser sur un escalier, un miroir sur mesure pour une salle de bain : Artisan Compétent encadre la vérification du vitrier (SIRET, RC pro, décennale, certifications ouvrages techniques) et tout votre process par séquestre jusqu’à 48h après l’intervention.',
      },
      {
        kind: 'p',
        text: 'Vitrier vérifié SIRET, RC pro et décennale. Certifications déposées au tableau de bord (NF P01-013 pour garde-corps verre, vitrages feuilletés de sécurité). Process encadré par séquestre Stripe. Retenue jusqu’à 250 € en cas de signalement d’abus. Périmètre vitrerie miroiterie. Menuiserie hors périmètre en V1.',
      },
    ],
  };
