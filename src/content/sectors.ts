import type { Sector } from '@/lib/types';

/**
 * Sector ids intentionally match `InterestId` in `src/lib/types.ts`, so an
 * onboarding interest maps to a sector without a translation table.
 */
export const sectors: Sector[] = [
  {
    id: 'commerce',
    name: 'Commerce et vente',
    description:
      'Vente, prospection, relation client, distribution, animation de point de vente. Le secteur qui recrute le plus régulièrement des profils juniors.',
    keywords: [
      'commercial',
      'commerciale',
      'vente',
      'ventes',
      'vendeur',
      'vendeuse',
      'client',
      'clientele',
      'prospection',
      'distribution',
      'boutique',
      'magasin',
      'chiffre d affaires',
      'business developer',
    ],
  },
  {
    id: 'mines',
    name: 'Mines et industrie',
    description:
      'Sites miniers, sous-traitance industrielle et fonctions support qui les accompagnent : logistique, achats, administration, reporting.',
    caution:
      'De nombreux postes miniers exigent des diplômes, des certifications de sécurité ou des habilitations officielles. Cette plateforme prépare aux fonctions support et à la compréhension du secteur, jamais aux métiers réglementés.',
    keywords: [
      'mine',
      'minier',
      'miniere',
      'mining',
      'orpaillage',
      'extraction',
      'carriere',
      'site industriel',
      'industrie',
      'usine',
      'exploitation',
      'geologie',
      'hse',
    ],
  },
  {
    id: 'administration',
    name: 'Administration et bureau',
    description:
      'Assistanat, secrétariat, accueil, gestion documentaire, coordination administrative, appui aux ressources humaines.',
    keywords: [
      'administratif',
      'administrative',
      'assistant',
      'assistante',
      'secretaire',
      'secretariat',
      'bureau',
      'accueil',
      'classement',
      'archivage',
      'courrier',
      'agenda',
      'office manager',
    ],
  },
  {
    id: 'numerique',
    name: 'Numérique et informatique',
    description:
      'Bureautique, outils en ligne, appui informatique, saisie et traitement de données, communication numérique.',
    keywords: [
      'informatique',
      'numerique',
      'digital',
      'bureautique',
      'saisie',
      'donnees',
      'data',
      'logiciel',
      'systeme',
      'web',
      'internet',
      'it',
    ],
  },
  {
    id: 'langues',
    name: 'Langues',
    description:
      'Anglais professionnel, communication écrite et orale, traduction simple, accueil de visiteurs internationaux.',
    keywords: [
      'anglais',
      'english',
      'bilingue',
      'traduction',
      'interpretation',
      'langue',
      'langues',
      'francais',
    ],
  },
  {
    id: 'entrepreneuriat',
    name: 'Entrepreneuriat',
    description:
      'Création et gestion d’une petite activité : identification d’un besoin, offre, prix, vente, suivi des recettes.',
    keywords: [
      'entrepreneur',
      'entrepreneuriat',
      'creation d entreprise',
      'auto emploi',
      'startup',
      'petite entreprise',
      'activite generatrice',
      'projet personnel',
    ],
  },
  {
    id: 'finance',
    name: 'Finance et comptabilité',
    description:
      'Comptabilité de base, caisse, facturation, suivi budgétaire, appui au contrôle de gestion, microfinance.',
    keywords: [
      'comptable',
      'comptabilite',
      'finance',
      'financier',
      'caisse',
      'facturation',
      'facture',
      'budget',
      'tresorerie',
      'banque',
      'bancaire',
      'microfinance',
      'credit',
      'audit',
    ],
  },
  {
    id: 'logistique',
    name: 'Logistique et transport',
    description:
      'Gestion de stock, réception et expédition, suivi de flotte, coordination des livraisons, appui aux achats.',
    keywords: [
      'logistique',
      'logistics',
      'stock',
      'stocks',
      'magasinier',
      'entrepot',
      'approvisionnement',
      'achat',
      'achats',
      'procurement',
      'transport',
      'livraison',
      'flotte',
      'chaine d approvisionnement',
      'supply chain',
    ],
  },
  {
    id: 'agriculture',
    name: 'Agriculture et agroalimentaire',
    description:
      'Production, transformation, commercialisation de produits agricoles, coopératives et circuits de distribution locaux.',
    keywords: [
      'agriculture',
      'agricole',
      'agro',
      'agroalimentaire',
      'elevage',
      'cooperative',
      'recolte',
      'production agricole',
      'transformation',
      'maraichage',
    ],
  },
  {
    id: 'communication',
    name: 'Communication et relation client',
    description:
      'Accueil, service client, communication interne et externe, réseaux sociaux professionnels, animation de communauté.',
    keywords: [
      'communication',
      'relation client',
      'service client',
      'support client',
      'accueil',
      'call center',
      'centre d appel',
      'reseaux sociaux',
      'community',
      'marketing',
    ],
  },
];

export const sectorById = new Map(sectors.map((sector) => [sector.id, sector]));
