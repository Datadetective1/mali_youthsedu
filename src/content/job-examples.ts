import type { JobExample } from '@/lib/types';

/**
 * Example job adverts used to demonstrate the analyzer.
 *
 * ALL OF THESE ARE FICTIONAL. Company names, locations and contact details are
 * invented for teaching purposes. The UI labels them as such everywhere they
 * appear — fabricating a real opening would be both dishonest and cruel to
 * someone job-hunting.
 *
 * They are written the way real West African adverts are written, because the
 * deterministic extractor must cope with that phrasing, not with a tidy
 * synthetic format.
 */
export const jobExamples: JobExample[] = [
  {
    id: 'job-mines-logistique',
    slug: 'assistant-logistique-mine',
    label: 'Support minier — Assistant logistique',
    title: 'Assistant(e) Logistique et Magasin',
    company: 'Société fictive de sous-traitance minière',
    sectorId: 'mines',
    location: 'Région de Kayes, Mali — rotation 4 semaines / 2 semaines',
    text: `ASSISTANT(E) LOGISTIQUE ET MAGASIN — SITE MINIER

Entreprise de sous-traitance intervenant sur site minier, nous recherchons un(e) Assistant(e) Logistique et Magasin pour renforcer notre équipe support basée sur site.

MISSIONS PRINCIPALES
- Assurer la réception, le contrôle et le rangement des marchandises livrées sur site
- Tenir à jour les fiches de stock et effectuer les inventaires périodiques
- Préparer les sorties de matériel et faire signer les bons de sortie
- Suivre les niveaux de stock et alerter en cas de risque de rupture
- Préparer les demandes d'achat et suivre les commandes auprès des fournisseurs
- Établir un rapport hebdomadaire d'activité à destination du superviseur logistique
- Appliquer et faire appliquer les règles de sécurité (HSE) en vigueur sur le site
- Appuyer l'équipe administrative pour le classement et l'archivage des documents

PROFIL RECHERCHÉ
- Niveau Bac minimum, une formation en logistique, gestion ou comptabilité est un atout
- Expérience de 1 à 2 ans dans un poste similaire, idéalement en milieu industriel ou minier
- Maîtrise indispensable d'Excel : saisie, formules de base, tri, filtres, tableaux de suivi
- Bonne connaissance du pack Office (Word, Excel)
- Anglais professionnel souhaité : une partie du reporting et des échanges avec l'encadrement se fait en anglais
- Français courant, à l'écrit comme à l'oral
- Sensibilisation aux règles de santé et sécurité au travail

QUALITÉS ATTENDUES
- Rigueur et fiabilité absolues dans le suivi des stocks
- Sens de l'organisation et respect des procédures
- Intégrité et discrétion
- Esprit d'équipe et bonne communication
- Capacité à travailler sous pression et à gérer les imprévus
- Ponctualité et assiduité

CONDITIONS
Poste basé sur site en rotation 4 semaines de travail / 2 semaines de repos. Hébergement et restauration assurés sur site. Une formation d'induction sécurité obligatoire sera dispensée à la prise de poste.

Merci d'adresser CV et lettre de motivation en précisant la référence du poste.

(Annonce fictive rédigée à des fins pédagogiques.)`,
  },
  {
    id: 'job-commercial-terrain',
    slug: 'commercial-terrain-distribution',
    title: 'Commercial(e) Terrain',
    label: 'Commerce — Commercial terrain',
    company: 'Société fictive de distribution',
    sectorId: 'commerce',
    location: 'Bamako et environs',
    text: `COMMERCIAL(E) TERRAIN — DISTRIBUTION DE PRODUITS DE GRANDE CONSOMMATION

Dans le cadre du développement de notre réseau, nous recrutons des Commerciaux Terrain pour couvrir plusieurs zones de Bamako et sa périphérie.

VOS MISSIONS
- Prospecter de nouveaux points de vente sur votre secteur et développer le portefeuille clients
- Assurer les visites régulières des clients existants selon un plan de tournée défini
- Présenter la gamme de produits, négocier les commandes et défendre les conditions commerciales
- Suivre le recouvrement des créances en lien avec le service comptable
- Assurer le suivi des règlements et la fidélisation de la clientèle
- Remonter les informations terrain : concurrence, prix pratiqués, ruptures constatées
- Renseigner quotidiennement le fichier de suivi commercial
- Atteindre les objectifs de chiffre d'affaires et de nouveaux clients fixés mensuellement

PROFIL
- Formation commerciale ou expérience équivalente acquise sur le terrain
- Une première expérience en vente ou en prospection est appréciée ; débutants motivés acceptés
- Maîtrise des techniques de vente et de la négociation commerciale
- Capacité à travailler avec des objectifs chiffrés et à rendre compte de ses résultats
- Bonne connaissance du tissu commercial de Bamako appréciée
- Français courant obligatoire ; la pratique du bambara est un réel atout sur le terrain
- Utilisation d'un smartphone et notions de base en informatique (saisie, tableur)
- Permis de conduire A ou B apprécié

QUALITÉS RECHERCHÉES
- Orientation résultats et goût du challenge
- Excellent relationnel et sens de l'écoute
- Autonomie, initiative et sens de l'organisation
- Persévérance face aux refus
- Honnêteté dans la gestion des encaissements
- Présentation professionnelle

NOUS OFFRONS
Salaire fixe complété par une part variable liée aux objectifs. Formation aux produits et aux techniques de vente assurée à l'entrée. Réelles perspectives d'évolution vers un poste de superviseur d'équipe commerciale.

(Annonce fictive rédigée à des fins pédagogiques.)`,
  },
  {
    id: 'job-assistant-administratif',
    slug: 'assistant-administratif-pme',
    title: 'Assistant(e) Administratif(ve) et Comptable',
    label: 'Administration — Assistant administratif',
    company: 'PME fictive de services',
    sectorId: 'administration',
    location: 'Bamako',
    text: `ASSISTANT(E) ADMINISTRATIF(VE) ET COMPTABLE

PME de services recherche un(e) Assistant(e) Administratif(ve) et Comptable pour appuyer la direction dans la gestion quotidienne.

RESPONSABILITÉS
- Accueil physique et téléphonique des visiteurs et des clients
- Gestion du courrier entrant et sortant, classement et archivage des dossiers
- Saisie et suivi des factures clients et fournisseurs
- Tenue de la caisse et rapprochement des pièces justificatives
- Préparation des éléments variables de paie et suivi des présences du personnel
- Rédaction de courriers, comptes rendus de réunion et notes internes
- Préparation des dossiers d'appel d'offres et suivi administratif des contrats
- Gestion des fournitures de bureau et suivi des commandes
- Appui à la direction pour la préparation des rapports d'activité mensuels

PROFIL RECHERCHÉ
- Bac +2 minimum en secrétariat, gestion, comptabilité ou administration des entreprises
- Expérience de 2 ans minimum sur un poste administratif ; les profils juniors sérieux seront étudiés
- Excellente maîtrise du français écrit : orthographe et rédaction irréprochables exigées
- Maîtrise de Word et Excel indispensable ; connaissance d'un logiciel de comptabilité appréciée
- Bonne pratique de la messagerie électronique et des outils bureautiques
- Notions d'anglais appréciées

SAVOIR-ÊTRE
- Rigueur, méthode et sens du détail
- Discrétion absolue : le poste donne accès à des informations confidentielles
- Sens de l'organisation et capacité à gérer plusieurs priorités
- Bon relationnel et sens du service
- Autonomie et prise d'initiative
- Ponctualité

(Annonce fictive rédigée à des fins pédagogiques.)`,
  },
  {
    id: 'job-teletravail-donnees',
    slug: 'assistant-donnees-distance',
    title: 'Assistant(e) Administratif(ve) à Distance — Traitement de Données',
    label: 'Travail à distance — Assistant données',
    company: 'Société fictive de services numériques',
    sectorId: 'numerique',
    location: 'Télétravail — collaboration avec une équipe internationale',
    text: `ASSISTANT(E) ADMINISTRATIF(VE) À DISTANCE — TRAITEMENT DE DONNÉES

Nous recherchons des collaborateurs à distance pour des missions de traitement et de vérification de données, en appui d'équipes basées sur plusieurs fuseaux horaires.

MISSIONS
- Saisie, vérification et nettoyage de données dans des tableurs partagés
- Contrôle de cohérence et signalement des anomalies détectées
- Mise à jour de fiches clients dans un CRM
- Préparation de rapports hebdomadaires de synthèse
- Recherche et vérification d'informations en ligne
- Participation à des réunions d'équipe hebdomadaires en visioconférence
- Communication écrite quotidienne avec l'équipe

COMPÉTENCES REQUISES
- Excellente maîtrise d'Excel ou Google Sheets : formules, filtres, tableaux croisés dynamiques
- Anglais professionnel écrit indispensable : l'ensemble des échanges internes se fait en anglais
- Bonne capacité de compréhension orale en anglais pour les réunions
- Maîtrise des outils collaboratifs en ligne (documents partagés, visioconférence)
- Grande rigueur et souci du détail : le travail est vérifié par échantillonnage
- Autonomie et capacité à s'organiser sans supervision directe
- Respect strict de la confidentialité des données traitées

CONDITIONS TECHNIQUES
- Connexion internet stable indispensable, avec une solution de secours
- Ordinateur personnel en état de fonctionnement
- Disponibilité d'au moins 4 heures par jour sur une plage horaire commune avec l'équipe

PROFIL
- Niveau Bac +2 minimum, toutes filières
- Une première expérience en saisie, en administration ou en support client est appréciée
- Fiabilité et respect des délais : les livrables sont attendus à des échéances fixes

(Annonce fictive rédigée à des fins pédagogiques.)`,
  },
  {
    id: 'job-relation-client-microfinance',
    slug: 'charge-relation-client-microfinance',
    title: 'Chargé(e) de Relation Client',
    label: 'Finance — Chargé de relation client',
    company: 'Institution fictive de microfinance',
    sectorId: 'finance',
    location: 'Ségou et zones rurales environnantes',
    text: `CHARGÉ(E) DE RELATION CLIENT — INSTITUTION DE MICROFINANCE

Institution de microfinance intervenant en zone urbaine et rurale, nous recrutons des Chargé(e)s de Relation Client pour accompagner nos membres.

MISSIONS
- Accueillir, informer et orienter les clients sur les produits d'épargne et de crédit
- Constituer et instruire les dossiers de demande de crédit
- Effectuer les visites de terrain auprès des clients et des groupements
- Assurer le suivi des remboursements et relancer les échéances en retard
- Sensibiliser les clients à la gestion de leur activité et à la tenue de leurs comptes
- Saisir et mettre à jour les dossiers dans le système d'information
- Établir les rapports d'activité hebdomadaires et mensuels
- Contribuer à l'atteinte des objectifs de collecte et de portefeuille de la agence

PROFIL
- Bac +2 minimum en finance, comptabilité, gestion, économie ou sciences sociales
- Une expérience en microfinance, en banque ou en développement rural est un atout majeur
- Maîtrise des outils bureautiques, en particulier Excel
- Bonne capacité rédactionnelle en français
- La maîtrise d'une langue nationale est indispensable pour le travail de terrain
- Permis de conduire moto apprécié pour les déplacements en zone rurale

QUALITÉS INDISPENSABLES
- Intégrité et honnêteté irréprochables : le poste implique la manipulation de fonds
- Excellent sens de l'écoute et de la pédagogie
- Capacité à travailler avec des personnes peu alphabétisées
- Rigueur dans le suivi des dossiers et des échéances
- Résistance à la pression liée aux objectifs de recouvrement
- Disponibilité pour des déplacements fréquents en zone rurale
- Esprit d'équipe

(Annonce fictive rédigée à des fins pédagogiques.)`,
  },
];

export const jobExampleById = new Map(jobExamples.map((example) => [example.id, example]));
