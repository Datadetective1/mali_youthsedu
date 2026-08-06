import type { Skill } from '@/lib/types';

/**
 * The skill vocabulary.
 *
 * `keywords` are the accent-free, lowercase terms the deterministic job
 * analyzer looks for in a French advert. They are matched on word boundaries,
 * so short keywords must be unambiguous ("crm" is fine, "vente" is fine,
 * "sap" would be too noisy without context). Adding a keyword here immediately
 * improves extraction quality — no model retraining, no deployment risk.
 *
 * Dimensions follow the four recruitment dimensions in docs/PRODUCT_VISION.md.
 */
export const skills: Skill[] = [
  // ---------------------------------------------------------------------------
  // Savoir-faire — commercial
  // ---------------------------------------------------------------------------
  {
    id: 'vente-techniques',
    name: 'Techniques de vente',
    dimension: 'savoir-faire',
    description:
      'Conduire un entretien de vente : découverte du besoin, argumentation, traitement des objections, conclusion.',
    sectorIds: ['commerce'],
    keywords: [
      'technique de vente',
      'techniques de vente',
      'vente',
      'vendre',
      'argumentaire',
      'closing',
      'conclure une vente',
      'cycle de vente',
      'force de vente',
    ],
  },
  {
    id: 'prospection',
    name: 'Prospection commerciale',
    dimension: 'savoir-faire',
    description:
      'Identifier des clients potentiels, préparer une approche, prendre contact et organiser un suivi discipliné.',
    sectorIds: ['commerce'],
    keywords: [
      'prospection',
      'prospecter',
      'prospect',
      'prospects',
      'nouveaux clients',
      'demarchage',
      'phoning',
      'porte a porte',
      'developpement commercial',
      'business development',
    ],
  },
  {
    id: 'relation-client',
    name: 'Relation client',
    dimension: 'savoir-faire',
    description:
      'Construire et entretenir une relation de confiance durable : suivi, réclamations, fidélisation.',
    sectorIds: ['commerce', 'communication'],
    keywords: [
      'relation client',
      'relation clientele',
      'fidelisation',
      'fideliser',
      'service client',
      'satisfaction client',
      'portefeuille client',
      'suivi client',
      'reclamation',
      'customer care',
    ],
  },
  {
    id: 'negociation',
    name: 'Négociation',
    dimension: 'savoir-faire',
    description:
      'Préparer une négociation, défendre une position, chercher un accord équilibré et savoir quand refuser.',
    sectorIds: ['commerce', 'logistique'],
    keywords: ['negociation', 'negocier', 'negociateur', 'accord commercial', 'marge', 'remise'],
  },
  {
    id: 'strategie-commerciale',
    name: 'Stratégie commerciale',
    dimension: 'savoir-faire',
    description:
      'Choisir des cibles, définir des priorités, planifier son activité et arbitrer entre les opportunités.',
    sectorIds: ['commerce'],
    keywords: [
      'strategie commerciale',
      'plan d action commercial',
      'objectifs commerciaux',
      'segmentation',
      'ciblage',
      'part de marche',
      'plan de vente',
    ],
  },
  {
    id: 'crm',
    name: 'Utilisation d’un CRM',
    dimension: 'savoir-faire',
    description:
      'Enregistrer et exploiter les informations client dans un outil de suivi, même simple.',
    sectorIds: ['commerce', 'numerique'],
    keywords: ['crm', 'salesforce', 'hubspot', 'odoo', 'logiciel de gestion client', 'pipeline commercial'],
  },
  {
    id: 'suivi-resultats',
    name: 'Suivi des résultats',
    dimension: 'savoir-faire',
    description:
      'Mesurer son activité, comprendre ses chiffres et rendre compte de façon claire.',
    sectorIds: ['commerce', 'finance'],
    keywords: [
      'reporting',
      'tableau de bord',
      'kpi',
      'indicateurs',
      'suivi des ventes',
      'chiffre d affaires',
      'objectifs chiffres',
      'compte rendu',
    ],
  },

  // ---------------------------------------------------------------------------
  // Savoir-faire — numérique et bureautique
  // ---------------------------------------------------------------------------
  {
    id: 'informatique-base',
    name: 'Bases de l’informatique',
    dimension: 'savoir-faire',
    description:
      'Utiliser un ordinateur : démarrage, clavier, souris, fenêtres, connexion, impression.',
    sectorIds: ['numerique'],
    keywords: ['informatique de base', 'utilisation d un ordinateur', 'pc', 'windows', 'ordinateur'],
  },
  {
    id: 'fichiers-dossiers',
    name: 'Fichiers et organisation numérique',
    dimension: 'savoir-faire',
    description:
      'Nommer, classer, retrouver et sauvegarder des documents sans perdre son travail.',
    sectorIds: ['numerique', 'administration'],
    keywords: ['classement numerique', 'gestion documentaire', 'archivage', 'sauvegarde', 'fichiers'],
  },
  {
    id: 'traitement-texte',
    name: 'Traitement de texte',
    dimension: 'savoir-faire',
    description: 'Rédiger, mettre en forme et exporter un document professionnel propre.',
    sectorIds: ['administration', 'numerique'],
    keywords: ['word', 'traitement de texte', 'microsoft word', 'libreoffice', 'google docs', 'pack office', 'suite bureautique'],
  },
  {
    id: 'tableur',
    name: 'Tableur (Excel)',
    dimension: 'savoir-faire',
    description:
      'Saisir des données, faire des calculs, trier, filtrer et produire un tableau lisible. Compétence citée dans presque toutes les offres de support.',
    sectorIds: ['administration', 'finance', 'logistique', 'mines', 'numerique'],
    keywords: [
      'excel',
      'tableur',
      'microsoft excel',
      'google sheets',
      'feuille de calcul',
      'tableaux croises',
      'recherchev',
      'formules excel',
      'spreadsheet',
    ],
  },
  {
    id: 'presentation-outil',
    name: 'Présentations (PowerPoint)',
    dimension: 'savoir-faire',
    description: 'Construire un support de présentation clair et le présenter sans le lire.',
    sectorIds: ['administration', 'communication'],
    keywords: ['powerpoint', 'presentation', 'diaporama', 'slides', 'google slides'],
  },
  {
    id: 'email-pro',
    name: 'Messagerie professionnelle',
    dimension: 'savoir-faire',
    description:
      'Écrire un e-mail professionnel : objet explicite, message court, pièce jointe correcte, relance polie.',
    sectorIds: ['administration', 'communication'],
    keywords: ['email', 'e mail', 'messagerie', 'outlook', 'gmail', 'courriel', 'correspondance'],
  },
  {
    id: 'recherche-web',
    name: 'Recherche d’information',
    dimension: 'savoir-faire',
    description:
      'Trouver une information fiable en ligne, vérifier sa source et l’utiliser correctement.',
    sectorIds: ['numerique'],
    keywords: ['recherche internet', 'veille', 'recherche documentaire', 'sourcing information'],
  },
  {
    id: 'securite-numerique',
    name: 'Sécurité numérique',
    dimension: 'savoir-faire',
    description:
      'Protéger ses comptes, reconnaître une arnaque, gérer ses mots de passe, préserver les données de l’employeur.',
    sectorIds: ['numerique'],
    keywords: ['securite informatique', 'cybersecurite', 'mot de passe', 'phishing', 'arnaque en ligne', 'confidentialite'],
  },
  {
    id: 'visio',
    name: 'Réunions en ligne',
    dimension: 'savoir-faire',
    description: 'Participer et animer une réunion à distance dans de bonnes conditions.',
    sectorIds: ['numerique', 'communication'],
    keywords: ['visioconference', 'zoom', 'teams', 'google meet', 'reunion a distance', 'visio'],
  },
  {
    id: 'cloud-docs',
    name: 'Documents partagés',
    dimension: 'savoir-faire',
    description: 'Travailler à plusieurs sur un même document en ligne sans perdre de version.',
    sectorIds: ['numerique', 'administration'],
    keywords: ['google drive', 'onedrive', 'sharepoint', 'document partage', 'collaboration en ligne', 'cloud'],
  },
  {
    id: 'ia-responsable',
    name: 'Usage responsable de l’IA',
    dimension: 'savoir-faire',
    description:
      'Utiliser un assistant IA comme aide, en vérifiant ses réponses et sans lui confier de données confidentielles.',
    sectorIds: ['numerique'],
    keywords: ['intelligence artificielle', 'ia', 'chatgpt', 'assistant ia'],
  },

  // ---------------------------------------------------------------------------
  // Savoir-faire — administration, finance, logistique
  // ---------------------------------------------------------------------------
  {
    id: 'gestion-administrative',
    name: 'Gestion administrative',
    dimension: 'savoir-faire',
    description:
      'Traiter le courrier, tenir un agenda, préparer des dossiers, respecter des procédures.',
    sectorIds: ['administration'],
    keywords: [
      'gestion administrative',
      'taches administratives',
      'suivi administratif',
      'dossier',
      'agenda',
      'courrier',
      'procedures internes',
    ],
  },
  {
    id: 'comptabilite-base',
    name: 'Bases de la comptabilité',
    dimension: 'savoir-faire',
    description: 'Distinguer recettes et dépenses, tenir une caisse, comprendre une facture.',
    sectorIds: ['finance'],
    keywords: ['comptabilite', 'comptable', 'saisie comptable', 'facturation', 'caisse', 'ecritures', 'grand livre'],
  },
  {
    id: 'budget',
    name: 'Suivi budgétaire',
    dimension: 'savoir-faire',
    description: 'Prévoir des dépenses, suivre un budget et expliquer un écart.',
    sectorIds: ['finance', 'entrepreneuriat'],
    keywords: ['budget', 'budgetaire', 'previsionnel', 'controle de gestion', 'suivi des depenses'],
  },
  {
    id: 'gestion-stock',
    name: 'Gestion de stock',
    dimension: 'savoir-faire',
    description: 'Compter, enregistrer, réapprovisionner et éviter les ruptures comme les surstocks.',
    sectorIds: ['logistique', 'mines', 'commerce'],
    keywords: ['gestion de stock', 'inventaire', 'magasinier', 'entrepot', 'reception marchandise', 'expedition', 'stock'],
  },
  {
    id: 'achats-support',
    name: 'Appui aux achats',
    dimension: 'savoir-faire',
    description:
      'Préparer une demande d’achat, comparer des devis, suivre une commande jusqu’à la livraison.',
    sectorIds: ['logistique', 'mines'],
    keywords: ['achats', 'approvisionnement', 'procurement', 'appel d offres', 'devis', 'bon de commande', 'fournisseur', 'fournisseurs'],
  },
  {
    id: 'rh-support',
    name: 'Appui aux ressources humaines',
    dimension: 'savoir-faire',
    description:
      'Tenir des dossiers du personnel, suivre les présences, organiser un recrutement en appui.',
    sectorIds: ['administration', 'mines'],
    keywords: ['ressources humaines', 'rh', 'dossier du personnel', 'paie', 'recrutement', 'pointage', 'presences'],
  },
  {
    id: 'reporting-pro',
    name: 'Rédaction de rapports',
    dimension: 'savoir-faire',
    description: 'Produire un rapport d’activité factuel, structuré et lisible par un responsable.',
    sectorIds: ['administration', 'mines'],
    keywords: ['rapport', 'rapports', 'reporting', 'compte rendu', 'note de synthese', 'rapport d activite'],
  },

  // ---------------------------------------------------------------------------
  // Savoir-faire — mines et sécurité
  // ---------------------------------------------------------------------------
  {
    id: 'mines-connaissance',
    name: 'Connaissance du secteur minier',
    dimension: 'savoir-faire',
    description:
      'Comprendre l’organisation d’un site minier, ses familles de métiers, ses sous-traitants et ses contraintes.',
    sectorIds: ['mines'],
    keywords: ['secteur minier', 'industrie miniere', 'site minier', 'exploitation miniere', 'sous traitance miniere'],
  },
  {
    id: 'hse',
    name: 'Sensibilisation à la sécurité au travail',
    dimension: 'savoir-faire',
    description:
      'Connaître les règles de base de sécurité, les équipements de protection et la conduite à tenir en cas d’incident.',
    sectorIds: ['mines', 'logistique', 'agriculture'],
    keywords: [
      'hse',
      'securite au travail',
      'sante securite',
      'qhse',
      'hsse',
      'epi',
      'equipement de protection',
      'prevention des risques',
      'accident du travail',
      'safety',
    ],
  },
  {
    id: 'environnement-social',
    name: 'Enjeux environnementaux et sociaux',
    dimension: 'savoir-faire',
    description:
      'Comprendre l’impact d’un site industriel sur son environnement et sur les communautés voisines.',
    sectorIds: ['mines', 'agriculture'],
    keywords: ['environnement', 'impact environnemental', 'rse', 'responsabilite sociale', 'communautes locales', 'developpement durable'],
  },

  // ---------------------------------------------------------------------------
  // Savoir-faire — entrepreneuriat et freelance
  // ---------------------------------------------------------------------------
  {
    id: 'etude-besoin',
    name: 'Étude du besoin client',
    dimension: 'savoir-faire',
    description:
      'Interroger de vrais clients potentiels avant de construire une offre, et écouter ce qu’ils disent vraiment.',
    sectorIds: ['entrepreneuriat', 'commerce'],
    keywords: ['etude de marche', 'besoin client', 'enquete client', 'analyse du besoin', 'clientele cible'],
  },
  {
    id: 'proposition-valeur',
    name: 'Proposition de valeur',
    dimension: 'savoir-faire',
    description: 'Formuler clairement ce que l’on apporte, à qui, et pourquoi cela compte.',
    sectorIds: ['entrepreneuriat', 'commerce'],
    keywords: ['proposition de valeur', 'offre de service', 'positionnement', 'valeur ajoutee'],
  },
  {
    id: 'pricing',
    name: 'Fixation des prix',
    dimension: 'savoir-faire',
    description: 'Calculer un coût, définir un prix tenable et l’expliquer sans s’excuser.',
    sectorIds: ['entrepreneuriat'],
    keywords: ['prix', 'tarification', 'tarif', 'grille tarifaire', 'cout de revient', 'marge'],
  },
  {
    id: 'tenue-registres',
    name: 'Tenue de registres',
    dimension: 'savoir-faire',
    description: 'Noter chaque entrée et sortie d’argent pour savoir si l’activité gagne réellement.',
    sectorIds: ['entrepreneuriat', 'finance'],
    keywords: ['registre', 'livre de caisse', 'suivi des recettes', 'cahier de comptes'],
  },
  {
    id: 'test-idee',
    name: 'Test d’une idée à faible coût',
    dimension: 'savoir-faire',
    description: 'Vérifier qu’une idée intéresse avant d’y engager de l’argent.',
    sectorIds: ['entrepreneuriat'],
    keywords: ['test de marche', 'prototype', 'pilote', 'experimentation', 'mvp'],
  },
  {
    id: 'freelance-proposition',
    name: 'Proposition et devis freelance',
    dimension: 'savoir-faire',
    description: 'Rédiger une proposition claire : périmètre, délai, prix, conditions.',
    sectorIds: ['entrepreneuriat', 'numerique'],
    keywords: ['freelance', 'devis', 'proposition commerciale', 'cahier des charges', 'prestation', 'mission freelance'],
  },
  {
    id: 'portfolio',
    name: 'Construction d’un portfolio',
    dimension: 'savoir-faire',
    description: 'Rassembler des preuves de son travail et les présenter de façon convaincante.',
    sectorIds: ['numerique', 'entrepreneuriat'],
    keywords: ['portfolio', 'book', 'realisations', 'references', 'echantillons de travail'],
  },
  {
    id: 'marketing-digital',
    name: 'Promotion numérique',
    dimension: 'savoir-faire',
    description:
      'Faire connaître une activité en ligne de manière simple, honnête et adaptée au budget.',
    sectorIds: ['communication', 'entrepreneuriat'],
    keywords: ['marketing digital', 'reseaux sociaux', 'facebook', 'whatsapp business', 'publicite en ligne', 'community management'],
  },
  {
    id: 'gestion-temps',
    name: 'Organisation et gestion du temps',
    dimension: 'savoir-faire',
    description: 'Planifier, prioriser, tenir des délais et rendre compte de l’avancement.',
    sectorIds: ['administration', 'entrepreneuriat'],
    keywords: ['gestion du temps', 'organisation', 'planification', 'priorisation', 'respect des delais', 'rigueur'],
  },

  // ---------------------------------------------------------------------------
  // Communication (savoir communiquer)
  // ---------------------------------------------------------------------------
  {
    id: 'francais-pro',
    name: 'Français professionnel',
    dimension: 'communication',
    description: 'Écrire et parler un français clair et correct en contexte professionnel.',
    sectorIds: ['langues', 'administration'],
    keywords: ['francais', 'francais courant', 'bonne expression ecrite', 'redaction', 'orthographe', 'expression francaise'],
  },
  {
    id: 'anglais-pro',
    name: 'Anglais professionnel',
    dimension: 'communication',
    description:
      'Comprendre et se faire comprendre en anglais au travail : e-mails, réunions, consignes. Exigence fréquente dans le secteur minier.',
    sectorIds: ['langues', 'mines'],
    keywords: [
      'anglais',
      'english',
      'anglais professionnel',
      'anglais courant',
      'bilingue',
      'english speaking',
      'fluent english',
      'good command of english',
      'niveau d anglais',
    ],
  },
  {
    id: 'anglais-entretien',
    name: 'Anglais en entretien',
    dimension: 'communication',
    description: 'Se présenter, décrire son parcours et répondre à des questions simples en anglais.',
    sectorIds: ['langues'],
    keywords: ['entretien en anglais', 'interview in english', 'self introduction'],
  },
  {
    id: 'communication-ecrite',
    name: 'Communication écrite',
    dimension: 'communication',
    description: 'Écrire de façon structurée, brève et adaptée au destinataire.',
    sectorIds: ['administration', 'communication'],
    keywords: ['communication ecrite', 'redaction professionnelle', 'note', 'synthese', 'expression ecrite'],
  },
  {
    id: 'communication-orale',
    name: 'Communication orale',
    dimension: 'communication',
    description: 'S’exprimer clairement, poser des questions et transmettre une information sans ambiguïté.',
    sectorIds: ['communication'],
    keywords: ['communication orale', 'aisance relationnelle', 'expression orale', 'prise de parole', 'sens du contact'],
  },
  {
    id: 'presentation-orale',
    name: 'Présentation devant un groupe',
    dimension: 'communication',
    description: 'Préparer et tenir une présentation courte devant plusieurs personnes.',
    sectorIds: ['communication'],
    keywords: ['presentation orale', 'animer une reunion', 'prise de parole en public', 'exposer'],
  },
  {
    id: 'ecoute-active',
    name: 'Écoute active',
    dimension: 'communication',
    description: 'Écouter réellement, reformuler et vérifier que l’on a bien compris.',
    sectorIds: ['communication', 'commerce'],
    keywords: ['ecoute', 'ecoute active', 'sens de l ecoute', 'reformulation', 'empathie'],
  },

  // ---------------------------------------------------------------------------
  // Savoir-être
  // ---------------------------------------------------------------------------
  {
    id: 'fiabilite',
    name: 'Fiabilité',
    dimension: 'savoir-etre',
    description: 'Faire ce que l’on a dit, dans le délai annoncé, et prévenir quand ce n’est pas possible.',
    keywords: ['fiabilite', 'fiable', 'serieux', 'serieuse', 'engagement', 'respect des engagements', 'conscience professionnelle'],
  },
  {
    id: 'ponctualite',
    name: 'Ponctualité et assiduité',
    dimension: 'savoir-etre',
    description: 'Arriver à l’heure, être présent, respecter les horaires convenus.',
    keywords: ['ponctualite', 'ponctuel', 'assiduite', 'presence', 'horaires', 'disponibilite'],
  },
  {
    id: 'travail-equipe',
    name: 'Travail en équipe',
    dimension: 'savoir-etre',
    description: 'Coopérer, partager l’information et accepter la contribution des autres.',
    keywords: ['travail en equipe', 'esprit d equipe', 'collaboration', 'cooperation', 'teamwork', 'travailler en equipe'],
  },
  {
    id: 'adaptabilite',
    name: 'Adaptabilité',
    dimension: 'savoir-etre',
    description: 'Rester efficace quand le contexte, les priorités ou les outils changent.',
    keywords: ['adaptabilite', 'adaptable', 'flexibilite', 'polyvalence', 'polyvalent', 'capacite d adaptation'],
  },
  {
    id: 'leadership',
    name: 'Leadership',
    dimension: 'savoir-etre',
    description: 'Entraîner un groupe vers un objectif, prendre des décisions et en assumer les suites.',
    keywords: ['leadership', 'leader', 'potentiel d encadrement', 'capacite a diriger', 'meneur'],
  },
  {
    id: 'gestion-equipe',
    name: 'Encadrement d’équipe',
    dimension: 'savoir-etre',
    description: 'Organiser le travail de plusieurs personnes, suivre leur avancement et les soutenir.',
    keywords: ['management', 'manager', 'encadrement', 'gestion d equipe', 'superviser', 'chef d equipe', 'animation d equipe'],
  },
  {
    id: 'orientation-resultats',
    name: 'Orientation résultats',
    dimension: 'savoir-etre',
    description: 'Travailler en visant un résultat mesurable, pas seulement en occupant son poste.',
    keywords: ['orientation resultats', 'axe resultats', 'atteinte des objectifs', 'sens du resultat', 'performance', 'objectifs'],
  },
  {
    id: 'confiance',
    name: 'Confiance en soi',
    dimension: 'savoir-etre',
    description:
      'Savoir dire ce que l’on sait faire, reconnaître ce que l’on ne sait pas encore, sans s’effacer ni exagérer.',
    keywords: ['confiance en soi', 'assurance', 'aisance', 'estime de soi'],
  },
  {
    id: 'conscience-de-soi',
    name: 'Connaissance de soi',
    dimension: 'savoir-etre',
    description: 'Identifier ses forces, ses limites et ce qui doit progresser.',
    keywords: ['connaissance de soi', 'auto evaluation', 'recul', 'lucidite'],
  },
  {
    id: 'gestion-conflit',
    name: 'Gestion des conflits',
    dimension: 'savoir-etre',
    description: 'Traiter un désaccord sans l’aggraver et chercher une issue acceptable.',
    keywords: ['gestion des conflits', 'mediation', 'desaccord', 'diplomatie', 'gestion du stress'],
  },
  {
    id: 'feedback',
    name: 'Recevoir et donner un retour',
    dimension: 'savoir-etre',
    description: 'Accepter une critique sans se braquer et formuler un retour utile aux autres.',
    keywords: ['feedback', 'retour d experience', 'critique constructive', 'remise en question'],
  },
  {
    id: 'ethique-pro',
    name: 'Éthique professionnelle',
    dimension: 'savoir-etre',
    description: 'Honnêteté, discrétion, respect des règles et des personnes.',
    keywords: ['ethique', 'integrite', 'honnetete', 'discretion', 'confidentialite', 'deontologie', 'probite'],
  },

  // ---------------------------------------------------------------------------
  // Capacité de réflexion
  // ---------------------------------------------------------------------------
  {
    id: 'resolution-problemes',
    name: 'Résolution de problèmes',
    dimension: 'reflexion',
    description: 'Décomposer une difficulté, envisager des options et choisir une solution réaliste.',
    keywords: ['resolution de problemes', 'resoudre', 'problem solving', 'sens pratique', 'trouver des solutions'],
  },
  {
    id: 'pensee-critique',
    name: 'Pensée critique',
    dimension: 'reflexion',
    description: 'Vérifier une information, distinguer un fait d’une opinion, remettre en cause une évidence.',
    keywords: ['esprit critique', 'analyse', 'capacite d analyse', 'analytique', 'rigueur intellectuelle', 'synthese'],
  },
  {
    id: 'initiative',
    name: 'Initiative',
    dimension: 'reflexion',
    description: 'Proposer et agir sans attendre une instruction pour chaque geste.',
    keywords: ['initiative', 'proactif', 'proactivite', 'autonomie', 'autonome', 'force de proposition'],
  },
  {
    id: 'creativite',
    name: 'Créativité',
    dimension: 'reflexion',
    description: 'Envisager une solution que personne n’a proposée, surtout quand les moyens manquent.',
    keywords: ['creativite', 'creatif', 'innovation', 'innovant', 'imagination', 'idees nouvelles'],
  },
  {
    id: 'analyse-offre',
    name: 'Analyse d’une offre d’emploi',
    dimension: 'reflexion',
    description: 'Lire une annonce en profondeur pour comprendre le besoin réel derrière l’intitulé.',
    keywords: ['analyse de poste', 'fiche de poste', 'comprendre une offre'],
  },
  {
    id: 'analyse-ecarts',
    name: 'Analyse de ses écarts',
    dimension: 'reflexion',
    description: 'Comparer honnêtement son profil aux exigences et bâtir un plan pour combler la différence.',
    keywords: ['analyse des ecarts', 'gap analysis', 'plan de progression', 'auto diagnostic'],
  },
];

export const skillById = new Map(skills.map((skill) => [skill.id, skill]));

export function skillName(id: string): string {
  return skillById.get(id)?.name ?? id;
}

export function skillsByDimension(dimension: Skill['dimension']): Skill[] {
  return skills.filter((skill) => skill.dimension === dimension);
}
