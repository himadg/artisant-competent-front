import type { JobPageContent } from '../_shared/job-content.types';

export const locksmithMetallerContent: JobPageContent = {
    imagePath: 'assets/img/serrurier-metallier.jpg',
    imageAlt: 'Serrurier vérifié',
    h1: 'Serrurier vérifié, sans subir le devis nocturne',
    slogan: 'Cette page liste les interventions traitées par les serruriers et métalliers vérifiés d’Artisan Compétent et le mécanisme anti-arnaque qui encadre votre paiement, du devis signé à la libération des fonds 48h après l’intervention.',
    metaTitle: 'Serrurier vérifié, sans subir le devis nocturne | Artisan Compétent',
    metaDescription: 'Sur Artisan Compétent, un serrurier vérifié remet un devis chiffré avant intervention (obligatoire au-delà de 150 € à domicile) et tout son chantier est…',
    body: [
      {
        kind: 'callout',
        title: 'En une phrase',
        body: 'Sur Artisan Compétent, un serrurier vérifié remet un devis chiffré avant intervention (obligatoire au-delà de 150 € à domicile) et tout son chantier est encadré par un séquestre de fonds Stripe qui retient le paiement jusqu’à 48h après la fin de l’intervention. C’est la réponse opérationnelle à la première source d’arnaque en BTP : la sortie nocturne avec devis verbal et paiement comptant.',
      },
      {
        kind: 'p',
        text: 'La serrurerie en urgence est le secteur le plus exposé aux pratiques abusives. Un serrurier vérifié sur Artisan Compétent a son SIRET contrôlé, son assurance RC pro à jour, et accepte le devis chiffré préalable imposé par l’article L. 111-1 du Code de la consommation pour toute intervention à domicile au-delà de 150 €. Tout le process est encadré par un séquestre de fonds Stripe : il reste bloqué jusqu’à 48h après l’intervention, fenêtre pendant laquelle vous pouvez signaler un perçage abusif, un cylindre surfacturé ou un devis non respecté.',
      },
      {
        kind: 'callout',
        title: 'En bref',
        body: 'Un serrurier vérifié sur Artisan Compétent a son SIRET contrôlé, son assurance RC pro à jour, et remet un devis chiffré préalable comme l’impose le Code de la consommation pour toute intervention au-delà de 150 €. Process encadré par séquestre via Stripe, 48h pour signaler un abus. Couverture France métropolitaine, DOM-TOM et Corse sur 38 zones, rayon de 30 km par ville.',
      },
      {
        kind: 'h2',
        text: 'Quand faire appel à un serrurier vérifié',
      },
      {
        kind: 'p',
        text: 'Un serrurier vérifié intervient sur les ouvertures, les remplacements de serrure, les blindages et les travaux de métallerie. L’urgence concerne les portes claquées, les serrures bloquées et les remises en sécurité après effraction.',
      },
      {
        kind: 'p',
        text: 'Les serruriers et métalliers référencés sur Artisan Compétent traitent à la fois l’urgence et le chantier programmé. Les cas typiques :',
      },
      {
        kind: 'list',
        items: [
          'Ouverture de porte claquée, simple ou multipoints, sans effraction',
          'Ouverture après perte ou bris de clés, sans dégradation du cylindre quand c’est techniquement possible',
          'Remplacement de cylindre standard ou A2P après vol, perte de clé ou changement de locataire',
          'Pose ou remplacement d’une serrure multipoints A2P sur porte d’entrée',
          'Pose d’une porte blindée avec serrure certifiée et bloc de huisserie renforcé',
          'Installation et ouverture de coffres-forts domestiques A2P',
          'Travaux de métallerie : garde-corps, grilles de protection, barreaudage de fenêtre, escaliers, ferronnerie',
          'Réparation ou remplacement de gâche, paumelles, ferme-portes après tentative d’effraction',
        ],
      },
      {
        kind: 'p',
        text: 'Chacune de ces interventions a un impact direct sur la sécurité du logement et sur la couverture d’assurance habitation, en particulier pour la pose de serrures A2P. Un devis détaillé, signé avant intervention, et un artisan vérifié sont les deux protections de base.',
      },
      {
        kind: 'h2',
        text: 'Pourquoi passer par Artisan Compétent pour vos travaux de serrurerie et de métallerie',
      },
      {
        kind: 'p',
        text: 'Artisan Compétent vérifie le serrurier en amont, impose le devis préalable obligatoire et encadre votre paiement par séquestre Stripe avec une fenêtre de 48h pour signaler un abus.',
      },
      {
        kind: 'p',
        text: 'Chaque serrurier référencé sur Artisan Compétent voit son SIRET contrôlé sur les bases publiques (Annuaire des Entreprises, INSEE/SIRENE, répertoire des métiers) et son assurance RC pro vérifiée avant validation.',
        emphasis: true,
      },
      {
        kind: 'p',
        text: 'La serrurerie est régie par l’obligation d’inscription au répertoire des métiers et par une assurance RC pro à jour. Sur les interventions de pose de portes ou de blindage, l’assurance décennale peut s’appliquer selon la nature du chantier. Le filtre Artisan Compétent porte sur trois éléments : SIRET actif, assurance vérifiée, et historique de l’entreprise. Les serruriers connus pour des pratiques abusives ne passent pas la validation.',
      },
      {
        kind: 'p',
        text: 'Une fois le devis signé, l’artisan dépose obligatoirement ses documents légaux (attestations d’assurance, certifications A2P fabricant le cas échéant) dans son tableau de bord Artisan Compétent. Ces documents sont consultables par le client. Le client est invité à revérifier en amont l’assurance RC pro et, sur les chantiers structurants, l’attestation A2P du matériel posé.',
      },
      {
        kind: 'p',
        text: 'Le séquestre de fonds est un compte tiers géré via Stripe qui encadre tout le process, du devis à la libération des fonds.',
        emphasis: true,
      },
      {
        kind: 'p',
        text: 'C’est en serrurerie que le séquestre joue son rôle anti-arnaque le plus visible. Au moment où vous validez le devis du serrurier, le paiement quitte votre compte mais n’arrive pas chez l’artisan : il reste bloqué sur un compte séquestre Stripe. Les fonds sont libérés 48h après l’intervention, sans contestation. Cette mise en attente neutralise la pratique du paiement comptant exigé sur place après une intervention nocturne surfacturée. Si le serrurier a percé un cylindre alors qu’une ouverture fine était possible, ou facturé un cylindre standard au prix d’un A2P, vous avez 48h pour le signaler.',
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
        text: 'Pour les interventions sous 2 000 € (ce qui est très fréquent en serrurerie d’urgence), le CMOD gratuit n’est pas automatique. Le client peut écrire à Artisan Compétent, qui traite la demande sous 24 à 48h selon la charge. Le suivi complet en amont (relecture du devis, vérification du niveau A2P du matériel, contrôle de la pose) reste sur option payante. Le CMOD payant est particulièrement utile pour les chantiers structurants : pose d’une porte blindée complète, installation d’un coffre-fort scellé, travaux de métallerie sur mesure.',
      },
      {
        kind: 'h2',
        text: 'Combien coûte une intervention de serrurerie',
      },
      {
        kind: 'p',
        text: 'Les prix d’ouverture de porte varient fortement selon l’urgence, l’heure et le type de serrure : un ordre de grandeur existe pour les interventions courantes, mais seul un devis chiffré du serrurier vérifié engage l’artisan. Le devis préalable est légalement obligatoire au-delà de 150 € à domicile.',
      },
      {
        kind: 'p',
        text: 'Le tarif d’une intervention dépend de cinq facteurs qui se cumulent. Les éléments qui font varier un devis :',
      },
      {
        kind: 'list',
        items: [
          'La nature de l’intervention (ouverture fine, perçage si réellement nécessaire, remplacement de cylindre, pose complète de porte blindée, métallerie)',
          'L’urgence : intervention en heures ouvrées, nuit, week-end ou jour férié, avec barème de majoration encadré par le Code de la consommation',
          'Le déplacement (zone urbaine dense, périurbain, accès complexe, étage élevé)',
          'Le matériel posé : cylindre standard, cylindre A2P un, deux ou trois étoiles, serrure multipoints, porte blindée certifiée, coffre A2P',
          'Les obligations réglementaires : devis préalable signé au-delà de 150 €, normalisation A2P exigée par certaines assurances habitation',
        ],
      },
      {
        kind: 'p',
        text: 'Artisan Compétent impose le devis chiffré préalable comme prérequis avant déclenchement du paiement en séquestre. La fourchette horaire indicative reste à confirmer par Artisan Compétent et sera ajoutée dans une prochaine itération.',
      },
      {
        kind: 'h2',
        text: 'Comparatif : Artisan Compétent vs autres plateformes vs Google direct',
      },
      {
        kind: 'p',
        text: 'Trois manières de trouver un serrurier en France. Trois niveaux de protection radicalement différents, particulièrement en sortie nocturne.',
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
            'Vérification assurance RC pro',
            'Rare',
            'Aucune',
            'Vérifiée avant validation, déposée au tableau de bord',
          ],
          [
            'Risque arnaque urgence nocturne',
            'Élevé',
            'Très élevé',
            'Neutralisé par devis préalable et séquestre',
          ],
          [
            'Paiement encadré',
            'Non',
            'Séquestre de fonds Stripe, libération à 48h',
            '',
          ],
          [
            'Recours en cas d’abus',
            'Limité',
            'Aucun',
            'Retenue jusqu’à 250 € sur signalement < 48h',
          ],
          [
            'Devis chiffré préalable',
            'Variable',
            'Très rare',
            'Imposé avant intervention',
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
        text: 'Les 3 pièges à éviter quand on cherche un serrurier',
      },
      {
        kind: 'p',
        text: 'La serrurerie en urgence est, statistiquement, le métier des travaux où les abus sont les plus fréquents. Trois pratiques reviennent en boucle, particulièrement en sortie nocturne ou de week-end.',
      },
      {
        kind: 'h3',
        text: 'Piège 1 : Le devis non remis avant intervention',
      },
      {
        kind: 'p',
        text: 'Un serrurier arrive sur appel passé via une annonce trouvée sur Google, attaque immédiatement la porte sans écrit préalable, puis présente une facture verbale après ouverture. Le client paie sur place sous pression. Le Code de la consommation impose pourtant un devis détaillé préalable pour toute intervention à domicile au-delà de 150 €, y compris la nuit. Sur Artisan Compétent, le devis chiffré est transmis avant le déplacement et conditionne le déclenchement du paiement en séquestre.',
      },
      {
        kind: 'h3',
        text: 'Piège 2 : Le perçage abusif d’une serrure ouvrable autrement',
      },
      {
        kind: 'p',
        text: 'Le serrurier annonce que la serrure ne peut être ouverte que par perçage, remplacement complet du cylindre à la clé. Dans une majorité de cas, une ouverture fine au moyen de techniques de crochetage ou de cartes adaptées suffit, sans destruction. Le perçage coûte plus cher (matériel neuf à poser) et arrange l’artisan. Le devis devrait toujours mentionner la méthode d’ouverture envisagée et expliquer pourquoi un perçage est nécessaire si c’est le cas.',
      },
      {
        kind: 'h3',
        text: 'Piège 3 : La surfacturation d’un cylindre standard présenté comme A2P',
      },
      {
        kind: 'p',
        text: 'Le serrurier installe un cylindre d’entrée de gamme tout en facturant le prix d’un cylindre certifié A2P (un, deux ou trois étoiles selon le niveau annoncé). Le client ne peut pas vérifier en direct sans le poinçon de certification visible sur le cylindre posé. C’est l’un des abus les plus difficiles à détecter et les plus rentables. Le devis devrait toujours préciser la marque, la référence et le niveau A2P du cylindre.',
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
        text: 'Pour les chantiers structurants (pose d’une porte blindée, installation d’un coffre, travaux de métallerie), l’artisan dépose des photos d’avancement dans le tableau de bord partagé client · artisan. Vous commentez, vous validez ou vous signalez dans le même espace. Sur les interventions d’urgence courte (ouverture, remplacement de cylindre), demandez systématiquement une photo du matériel posé (poinçon A2P, étiquette fabricant, référence cylindre) avant de valider la fin de chantier.',
      },
      {
        kind: 'p',
        text: 'En cas de signalement d’abus dans les 48h suivant l’intervention (cylindre standard facturé en A2P, perçage non justifié, devis non respecté), Artisan Compétent peut retenir jusqu’à 250 € sur la facturation de l’artisan avant validation du paiement, conformément aux CGU et CGV. Pour les abus avérés en sortie nocturne, cette retenue est une protection concrète et un précédent dissuasif pour l’artisan.',
      },
      {
        kind: 'h2',
        text: 'Assurance habitation et remboursement',
      },
      {
        kind: 'p',
        text: 'La serrurerie est le métier où le remboursement par l’assurance est le plus fréquent : effraction, perte ou vol de clés, intervention de mise en sécurité ouvrent dans de nombreux cas droit à une prise en charge totale ou partielle, par l’assurance habitation ou par les garanties carte bancaire premium. La démarche est à votre charge, Artisan Compétent n’intervient pas dans la procédure d’indemnisation.',
      },
      {
        kind: 'p',
        text: 'Plusieurs situations courantes en serrurerie ouvrent droit à indemnisation : effraction avec dépôt de plainte préalable, perte ou vol des clés (avec ou sans dépôt de plainte selon les contrats), tentative d’effraction nécessitant remplacement de cylindre ou de serrure, intervention de mise en sécurité après cambriolage. La plupart des contrats d’assurance habitation multirisques incluent une garantie “vol et tentative de vol” qui couvre tout ou partie de l’intervention serrurier. Certaines cartes bancaires premium (Visa Premier, Mastercard World Elite, American Express) incluent également une assistance avec prise en charge ou remboursement de l’intervention dans des plafonds définis.',
      },
      {
        kind: 'p',
        text: 'Le réflexe à avoir : avant de payer, ou immédiatement après l’intervention, ouvrez un dossier sinistre auprès de votre assurance habitation et de votre carte bancaire si applicable. Conservez le devis signé, la facture détaillée, le procès-verbal de dépôt de plainte le cas échéant, et les photos du sinistre. La prise en charge est conditionnée à ces pièces et au respect des délais de déclaration prévus au contrat (généralement 5 jours ouvrés).',
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
        text: 'Étape 1. Vous décrivez votre besoin (ouverture, remplacement de serrure, pose blindée, métallerie) sur Artisan Compétent et recevez un devis détaillé d’un serrurier vérifié de votre zone.',
      },
      {
        kind: 'p',
        text: 'Étape 2. Vous validez le devis, le paiement part en séquestre via Stripe, l’intervention est planifiée.',
      },
      {
        kind: 'p',
        text: 'Étape 3. Le serrurier intervient. À la fin de l’intervention, un procès-verbal de réception est émis sur la plateforme : il ouvre une fenêtre de 48h pendant laquelle vous pouvez émettre des réserves (porte mal posée, cylindre non conforme au devis, matériel facturé non remis). Un mail de notification vous est envoyé 8h avant la fin du délai. Sans réserve, les fonds sont libérés automatiquement à l’artisan.',
      },
      {
        kind: 'h2',
        text: 'Serrurier d’urgence 24h/24, 7j/7',
      },
      {
        kind: 'p',
        text: 'Artisan Compétent couvre la serrurerie en urgence 24h/24 et 7j/7 dans les zones desservies. C’est le métier où le séquestre de fonds est le plus protecteur, parce que c’est celui où les abus sont les plus fréquents.',
      },
      {
        kind: 'p',
        text: 'Le serrurier fait partie des cinq métiers couverts en urgence permanente sur Artisan Compétent, avec le plombier, l’électricien, le chauffagiste et le déboucheur de canalisations. Une porte claquée à 2h du matin, une serrure bloquée après tentative d’effraction, une perte de clés un dimanche : ces situations sont précisément celles où la pression pousse à accepter n’importe quel prix. Le protocole reste identique en sortie nocturne : devis chiffré transmis avant action (obligatoire au-delà de 150 €), paiement en séquestre via Stripe, intervention, fenêtre de 48h pour signaler un abus.',
      },
      {
        kind: 'h2',
        text: 'Trouver un serrurier vérifié dans votre ville',
      },
      {
        kind: 'p',
        text: 'Artisan Compétent couvre la France métropolitaine, les DOM-TOM et la Corse, soit 38 zones avec un rayon d’intervention de 30 km autour de chaque ville référencée.',
      },
      {
        kind: 'p',
        text: 'Vous pouvez chercher un serrurier vérifié dans les principales métropoles françaises. Chaque artisan référencé a son SIRET contrôlé et son assurance vérifiée avant validation sur la plateforme.',
      },
      {
        kind: 'cities',
        items: [
          'Serrurier Paris',
          'Serrurier Marseille',
          'Serrurier Lyon',
          'Serrurier Toulouse',
          'Serrurier Nice',
          'Serrurier Nantes',
          'Serrurier Montpellier',
          'Serrurier Strasbourg',
          'Serrurier Bordeaux',
          'Serrurier Lille',
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
        text: 'Si l’artisan accepte de proposer Klarna sur votre devis (essentiellement sur des chantiers programmés : pose de porte blindée, métallerie), le mécanisme du séquestre de fonds reste actif et le paiement reste protégé jusqu’à validation du chantier à 48h. Sur les interventions d’urgence (ouverture de porte, remplacement de cylindre), Klarna est rarement proposé du fait du caractère immédiat de l’intervention.',
      },
      {
        kind: 'h2',
        text: 'Questions fréquentes',
      },
      {
        kind: 'p',
        text: 'Cette FAQ regroupe les questions les plus posées par les particuliers qui cherchent un serrurier vérifié sur Artisan Compétent.',
      },
      {
        kind: 'faq',
        items: [
          {
            question: 'Comment éviter une arnaque de serrurier en urgence à Paris ou ailleurs ?',
            answers: [
              'Le serrurier en urgence concentre la grande majorité des litiges du secteur. Trois réflexes protègent : exiger un devis signé avant intervention (obligatoire par le Code de la consommation pour toute prestation supérieure à 150 € à domicile), refuser tout perçage de cylindre tant qu’une ouverture fine n’a pas été tentée, et vérifier le SIRET et l’assurance RC pro de l’artisan. Sur Artisan Compétent, ces trois éléments sont vérifiés en amont et le paiement passe par un séquestre Stripe encadré.',
            ],
          },
          {
            question: 'Un serrurier peut-il intervenir 24h/24, et la nuit ?',
            answers: [
              'Oui. Le serrurier vérifié sur Artisan Compétent est disponible 24h/24 et 7j/7 pour les ouvertures de porte claquée, blocages de serrure et tentatives d’effraction. La règle des 48h pour signaler un abus reste applicable même en sortie nocturne. Le séquestre de fonds est particulièrement précieux en urgence : c’est la situation où la pression psychologique pousse le plus à accepter des prix anormaux.',
            ],
          },
          {
            question: 'Mon assurance habitation rembourse-t-elle un serrurier après effraction ?',
            answers: [
              'Dans la grande majorité des cas, oui. La plupart des contrats d’assurance habitation multirisques incluent une garantie “vol et tentative de vol” qui couvre tout ou partie de l’intervention serrurier après effraction ou tentative d’effraction. Certaines cartes bancaires premium ont également une assistance avec prise en charge. Il faut ouvrir un dossier auprès de votre assureur dans les délais prévus au contrat (généralement 5 jours ouvrés), avec le procès-verbal de dépôt de plainte, le devis et la facture. C’est à vous de faire la démarche, Artisan Compétent n’intervient pas dans la procédure d’indemnisation.',
            ],
          },
          {
            question: 'Quel est l’ordre de grandeur pour une ouverture de porte claquée ?',
            answers: [
              'Un ordre de grandeur existe pour les interventions courantes en heures ouvrées, mais le prix réel dépend de l’urgence (jour, nuit, week-end, jour férié), du type de serrure (simple, multipoints, A2P), de la difficulté technique de l’ouverture (fine ou avec perçage justifié) et du déplacement. Le Code de la consommation impose un devis chiffré préalable au-delà de 150 €, y compris en sortie nocturne. Sur Artisan Compétent, ce devis est transmis avant le déplacement et conditionne le paiement en séquestre.',
            ],
          },
          {
            question: 'Pourquoi installer une serrure ou un cylindre A2P plutôt qu’une serrure standard ?',
            answers: [
              'La certification A2P (Assurance Prévention Protection) est délivrée par le CNPP et qualifie la résistance d’une serrure ou d’un cylindre à l’effraction. Le niveau A2P un, deux ou trois étoiles correspond à un temps de résistance respectivement de 5, 10 et 15 minutes. Plusieurs assureurs habitation exigent une serrure A2P pour appliquer la garantie vol, particulièrement dans les zones urbaines à forte sinistralité. Le devis du serrurier vérifié doit toujours préciser la marque, la référence et le niveau A2P du cylindre ou de la serrure posée.',
            ],
          },
          {
            question: 'Comment fonctionne le séquestre de fonds pour une intervention en urgence ?',
            answers: [
              'Le séquestre de fonds est un compte tiers géré via Stripe. Quand vous validez le devis, le paiement quitte votre compte mais reste bloqué sur le séquestre. Les fonds sont libérés 48h après l’intervention, sans contestation. Cette fenêtre vous laisse le temps de vérifier le matériel posé (poinçon A2P, référence du cylindre, qualité de la pose) et de signaler un abus. En cas de signalement d’abus dans les 48h, Artisan Compétent peut retenir jusqu’à 250 € sur la facturation de l’artisan avant validation du paiement.',
            ],
          },
          {
            question: 'Klarna 3 fois sans frais est-il disponible pour un chantier serrurerie ?',
            answers: [
              'Sur les chantiers programmés (pose de porte blindée, métallerie, coffre-fort scellé), Klarna 3 fois sans frais peut être proposé par l’artisan dans le respect des plafonds Klarna en vigueur. L’activation n’est pas automatique : elle se négocie entre vous et l’artisan. Sur les interventions d’urgence (ouverture de porte, remplacement de cylindre), Klarna est rarement proposé du fait du caractère immédiat de l’intervention.',
            ],
          },
          {
            question: 'À quoi sert CMOD pour un chantier de serrurerie ?',
            answers: [
              'CMOD est un service payant et optionnel d’accompagnement par un conseiller maître d’ouvrage à distance. Sur les devis entre 2 000 € et 5 000 €, un appel de 20 minutes est offert en cas de litige signalé après échec d’un règlement amiable, 45 minutes au-delà dans les mêmes conditions. Sous 2 000 €, le client peut écrire à Artisan Compétent pour demander une intervention CMOD, traitée sous 24 à 48h. CMOD payant est particulièrement utile pour les chantiers structurants : pose d’une porte blindée complète, installation d’un coffre A2P scellé, travaux de métallerie sur mesure.',
            ],
          },
          {
            question: 'Que faire si le serrurier a percé alors qu’une ouverture fine était possible ?',
            answers: [
              'Vous signalez l’abus dans les 48h suivant l’intervention, via le tableau de bord partagé. Les fonds restent bloqués en séquestre tant que cette fenêtre court. Artisan Compétent demande les éléments factuels (devis signé, photos du cylindre percé, témoignages éventuels) et peut retenir jusqu’à 250 € sur la facturation de l’artisan avant validation. Le devis du serrurier vérifié doit toujours mentionner la méthode d’ouverture envisagée et expliquer pourquoi un perçage est nécessaire si c’est le cas.',
            ],
          },
          {
            question: 'Quelles villes sont couvertes par Artisan Compétent pour la serrurerie ?',
            answers: [
              'Artisan Compétent couvre la France métropolitaine, les DOM-TOM et la Corse, soit 38 zones, avec un rayon d’intervention de 30 km autour de chaque ville référencée. Toutes les grandes métropoles sont couvertes (Paris, Marseille, Lyon, Toulouse, Nice, Nantes, Montpellier, Strasbourg, Bordeaux, Lille) avec une disponibilité 24h/24 en sortie nocturne dans les zones urbaines denses.',
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
        text: 'Une porte claquée à 2h du matin, une tentative d’effraction à sécuriser le lendemain, un déménagement qui impose un changement de cylindre, une porte blindée à poser, un coffre A2P à installer : dans chacun de ces cas, l’enjeu est d’éviter le devis verbal et le paiement comptant exigé sur place. Artisan Compétent encadre la vérification du serrurier en amont et tout votre process par séquestre jusqu’à 48h après l’intervention.',
      },
      {
        kind: 'p',
        text: 'Serrurier vérifié SIRET et RC pro. Devis chiffré préalable obligatoire au-delà de 150 €. Process encadré par séquestre Stripe. Retenue jusqu’à 250 € en cas de signalement d’abus. Recours assurance habitation systématique après effraction.',
      },
    ],
  };
