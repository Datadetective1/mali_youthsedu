import type { PracticalProject } from '@/lib/types';

/**
 * Practical projects — the answer to "employers want experience I don't have".
 *
 * Every path has at least two. Projects marked `simulated: true` are teaching
 * exercises: the UI always labels them as such and the suggested portfolio
 * description says so explicitly, because presenting an exercise as paid client
 * work is the kind of lie that collapses in one reference call.
 */
export const practicalProjects: PracticalProject[] = [
  // ===========================================================================
  // Compétences numériques
  // ===========================================================================
  {
    id: 'proj-num-suivi-depenses',
    slug: 'tableau-suivi-depenses',
    title: 'Tableau de suivi budgétaire',
    pathId: 'litteratie-numerique',
    difficulty: 'facile',
    simulated: false,
    estimatedMinutes: 180,
    scenario:
      'Un commerce, une association ou un foyer suit ses dépenses de tête ou sur un cahier. Personne ne sait précisément où part l’argent chaque mois.',
    objective:
      'Construire un tableau de suivi qui montre, en un coup d’œil, la répartition des dépenses et l’évolution du solde.',
    instructions: [
      'Choisissez une structure réelle : votre foyer, un petit commerce, une association.',
      'Créez un tableur avec les colonnes : date, catégorie, description, entrée, sortie, solde.',
      'Saisissez au moins trente mouvements réels sur un mois.',
      'Calculez le solde automatiquement par formule, pas à la main.',
      'Ajoutez un tableau de synthèse par catégorie avec la fonction SOMME.SI.',
      'Créez un graphique montrant la répartition des dépenses.',
      'Rédigez une note de cinq lignes sur ce que révèle ce tableau.',
    ],
    deliverable:
      'Un fichier tableur avec 30 mouvements réels, calculs automatiques, synthèse par catégorie, graphique et note d’analyse.',
    skillIds: ['tableur', 'budget', 'suivi-resultats', 'fichiers-dossiers'],
    evaluationChecklist: [
      'Le solde se calcule par formule et non manuellement',
      'Le tableau contient au moins trente mouvements réels',
      'La synthèse par catégorie fonctionne',
      'Le graphique est lisible et légendé',
      'Je peux expliquer chaque formule utilisée',
      'Ma note d’analyse dit quelque chose que le tableau brut ne montrait pas',
    ],
    portfolioDescription:
      'Conception d’un outil de suivi budgétaire sous tableur pour [structure]. Saisie et catégorisation de 30 mouvements sur un mois, calcul automatisé du solde, synthèse par poste de dépense et représentation graphique. A permis d’identifier [le constat principal].',
    offlineFriendly: true,
  },
  {
    id: 'proj-num-dossier-candidature',
    slug: 'dossier-candidature-numerique',
    title: 'Dossier de candidature numérique complet',
    pathId: 'litteratie-numerique',
    difficulty: 'facile',
    simulated: false,
    estimatedMinutes: 150,
    scenario:
      'Vous devez répondre à une offre par e-mail. Le recruteur recevra votre message parmi cent autres, et jugera votre rigueur avant même de lire votre CV.',
    objective:
      'Produire un dossier de candidature irréprochable sur la forme : fichiers nommés correctement, PDF propres, e-mail professionnel.',
    instructions: [
      'Créez une arborescence « Candidatures » avec un sous-dossier par entreprise.',
      'Rédigez un CV d’une page et une lettre d’une page dans un traitement de texte.',
      'Exportez les deux en PDF et vérifiez leur rendu à l’ouverture.',
      'Nommez les fichiers selon la convention : CV_Prenom-Nom.pdf, LM_Prenom-Nom_Entreprise.pdf.',
      'Rédigez l’e-mail d’accompagnement : objet explicite, six lignes maximum, pièces jointes.',
      'Envoyez-le à votre propre adresse et vérifiez ce que reçoit le destinataire.',
    ],
    deliverable:
      'Un dossier structuré contenant CV et lettre en PDF correctement nommés, plus le texte de l’e-mail d’accompagnement.',
    skillIds: ['fichiers-dossiers', 'traitement-texte', 'email-pro', 'communication-ecrite'],
    evaluationChecklist: [
      'Les fichiers suivent une convention de nommage explicite',
      'Les PDF s’ouvrent correctement et tiennent sur une page chacun',
      'L’objet de l’e-mail identifie le poste et mon nom',
      'L’e-mail ne dépasse pas six lignes',
      'J’ai vérifié le rendu en me l’envoyant à moi-même',
      'Aucune faute d’orthographe ne subsiste',
    ],
    portfolioDescription:
      'Mise en place d’un système personnel de gestion des candidatures : arborescence documentaire, convention de nommage, modèles de CV et de lettre exportés en PDF, modèle d’e-mail d’accompagnement.',
    offlineFriendly: true,
  },

  // ===========================================================================
  // Anglais pour l'emploi
  // ===========================================================================
  {
    id: 'proj-ang-presentation',
    slug: 'presentation-anglais',
    title: 'Présentation professionnelle en anglais',
    pathId: 'anglais-emploi',
    difficulty: 'moyen',
    simulated: false,
    estimatedMinutes: 240,
    scenario:
      'Un recruteur d’une société minière commence l’entretien en anglais : « Tell me about yourself. » Les deux minutes qui suivent décident souvent de la suite.',
    objective:
      'Produire et maîtriser une présentation personnelle de deux minutes en anglais, entièrement vraie et dite sans notes.',
    instructions: [
      'Rédigez votre présentation en français d’abord : qui vous êtes, votre parcours, ce que vous savez faire, ce que vous cherchez.',
      'Traduisez-la en anglais avec des phrases simples et courtes.',
      'Faites corriger le texte par une personne dont l’anglais est meilleur que le vôtre, ou comparez-le à des modèles fiables.',
      'Vérifiez la prononciation des mots difficiles.',
      'Répétez debout, à voix haute, au moins dix fois sur plusieurs jours.',
      'Présentez-la à trois personnes différentes sans lire vos notes.',
      'Notez après chaque essai les mots sur lesquels vous butez.',
    ],
    deliverable:
      'Un texte de présentation en anglais corrigé, plus la capacité démontrée de le dire sans notes en deux minutes.',
    skillIds: ['anglais-pro', 'anglais-entretien', 'confiance', 'communication-orale'],
    evaluationChecklist: [
      'La présentation dure entre 90 secondes et 2 minutes',
      'Toutes les informations sont exactes',
      'Le texte a été corrigé par une source fiable',
      'Je peux la dire sans lire',
      'Je l’ai dite à trois personnes réelles',
      'Je connais la prononciation de tous les mots employés',
    ],
    portfolioDescription:
      'Préparation d’une présentation professionnelle de deux minutes en anglais, corrigée et maîtrisée sans support, dans la perspective d’entretiens en environnement anglophone.',
    offlineFriendly: true,
  },
  {
    id: 'proj-ang-email-pro',
    slug: 'emails-anglais',
    title: 'Jeu de modèles d’e-mails professionnels en anglais',
    pathId: 'anglais-emploi',
    difficulty: 'moyen',
    simulated: false,
    estimatedMinutes: 180,
    scenario:
      'Vous travaillez pour un sous-traitant d’une société internationale. Une partie des échanges écrits se fait en anglais, et chaque message mal rédigé coûte du temps à tout le monde.',
    objective:
      'Construire six modèles d’e-mails en anglais couvrant les situations professionnelles les plus fréquentes.',
    instructions: [
      'Rédigez six e-mails en anglais : candidature, demande d’information, confirmation de rendez-vous, relance, signalement d’un retard, remerciement après entretien.',
      'Chaque e-mail doit avoir un objet explicite et ne pas dépasser huit lignes.',
      'Utilisez des formules d’ouverture et de clôture adaptées au degré de formalité.',
      'Faites relire l’ensemble et corrigez.',
      'Constituez un document unique regroupant les six modèles.',
    ],
    deliverable: 'Un document contenant six modèles d’e-mails professionnels en anglais, corrigés.',
    skillIds: ['anglais-pro', 'communication-ecrite', 'email-pro'],
    evaluationChecklist: [
      'Les six situations sont couvertes',
      'Chaque objet d’e-mail est explicite',
      'Aucun message ne dépasse huit lignes',
      'Les formules de politesse sont adaptées au contexte',
      'Le texte a été relu et corrigé',
      'Je comprends chaque phrase que j’ai écrite',
    ],
    portfolioDescription:
      'Constitution d’un jeu de six modèles d’e-mails professionnels en anglais couvrant les situations courantes de la relation employeur et client.',
    offlineFriendly: true,
  },

  // ===========================================================================
  // Commercial et vente
  // ===========================================================================
  {
    id: 'proj-com-fichier-prospection',
    slug: 'fichier-prospection',
    title: 'Fichier de prospection et suivi client',
    pathId: 'commercial-vente',
    difficulty: 'moyen',
    simulated: false,
    estimatedMinutes: 300,
    scenario:
      'Un commerce ou un artisan de votre entourage vend uniquement à ceux qui passent devant. Personne ne rappelle les anciens clients, personne ne sait qui relancer.',
    objective:
      'Construire un fichier de prospection réel et l’utiliser pendant deux semaines pour générer des contacts.',
    instructions: [
      'Choisissez un produit ou service réellement vendu autour de vous, avec l’accord du vendeur.',
      'Constituez une liste de trente prospects qualifiés avec, pour chacun, une raison précise de le contacter.',
      'Construisez un tableur avec : nom, contact, besoin identifié, date du dernier échange, résultat, prochaine action, date de relance.',
      'Contactez réellement au moins dix prospects.',
      'Mettez le fichier à jour après chaque contact, sans exception.',
      'Après deux semaines, calculez : nombre de contacts, taux de réponse, nombre de rendez-vous ou de ventes.',
      'Rédigez une synthèse d’une page avec vos chiffres et ce que vous en tirez.',
    ],
    deliverable:
      'Un fichier de prospection de trente lignes, tenu pendant deux semaines, avec dix contacts réels et une synthèse chiffrée.',
    skillIds: ['prospection', 'crm', 'relation-client', 'suivi-resultats', 'fiabilite'],
    evaluationChecklist: [
      'Les trente prospects sont réels et qualifiés',
      'Chaque prospect a une raison de contact précise',
      'J’ai réalisé au moins dix contacts',
      'Le fichier a été mis à jour après chaque échange',
      'Je connais mon taux de réponse',
      'Ma synthèse explique les résultats, pas seulement les chiffres',
    ],
    portfolioDescription:
      'Constitution et exploitation d’un fichier de prospection de 30 contacts qualifiés pour [activité]. 10 contacts réalisés en deux semaines, suivi systématique des échanges et des relances, analyse chiffrée du taux de réponse.',
    offlineFriendly: true,
  },
  {
    id: 'proj-com-simulation-vente',
    slug: 'simulation-entretien-vente',
    title: 'Simulation d’entretien de vente',
    pathId: 'commercial-vente',
    difficulty: 'moyen',
    simulated: true,
    estimatedMinutes: 240,
    scenario:
      'Mission simulée. Une société de distribution recrute un commercial terrain. Le recruteur annonce : « Vendez-moi ce produit, je joue le client. » Cette mise en situation est l’épreuve la plus fréquente des entretiens commerciaux.',
    objective:
      'Préparer et réaliser un entretien de vente complet en simulation, du premier contact à la conclusion.',
    instructions: [
      'Choisissez un produit ou service réel que vous connaissez bien.',
      'Rédigez un argumentaire complet : accroche, cinq questions de découverte, trois bénéfices client, présentation du prix, phrase de conclusion.',
      'Préparez une réponse aux cinq objections les plus probables.',
      'Demandez à trois personnes de jouer le client, avec des profils différents : pressé, méfiant, intéressé mais sans budget.',
      'Réalisez les trois entretiens sans lire vos notes.',
      'Demandez à chacun ce qui l’a convaincu et ce qui l’a gêné.',
      'Rédigez une analyse d’une page : ce qui a fonctionné, ce qui a échoué, ce que vous changez.',
    ],
    deliverable:
      'Un argumentaire écrit, un catalogue de cinq objections traitées, et une analyse de trois simulations réalisées.',
    skillIds: ['vente-techniques', 'negociation', 'ecoute-active', 'confiance', 'communication-orale'],
    evaluationChecklist: [
      'Mon argumentaire couvre les six étapes de l’entretien',
      'Chaque argument est formulé en bénéfice pour le client',
      'J’ai préparé cinq objections avec leur réponse',
      'J’ai réalisé trois simulations avec des profils différents',
      'J’ai recueilli un retour après chaque simulation',
      'Mon analyse identifie une amélioration concrète',
    ],
    portfolioDescription:
      'Exercice de simulation commerciale : construction d’un argumentaire de vente complet pour [produit], préparation du traitement de cinq objections, et réalisation de trois entretiens simulés avec analyse des retours. Projet pédagogique personnel, non réalisé pour un employeur.',
    offlineFriendly: true,
  },

  // ===========================================================================
  // Métiers support du secteur minier
  // ===========================================================================
  {
    id: 'proj-min-suivi-stock',
    slug: 'suivi-stock-inventaire',
    title: 'Suivi de stock avec inventaire et analyse des écarts',
    pathId: 'mines-support',
    difficulty: 'moyen',
    simulated: false,
    estimatedMinutes: 300,
    scenario:
      'Sur un site industriel comme dans une boutique, un stock mal suivi provoque des ruptures, des immobilisations d’argent et des pertes que personne ne sait expliquer.',
    objective:
      'Tenir un stock réel pendant deux semaines, réaliser un inventaire physique et expliquer chaque écart.',
    instructions: [
      'Choisissez un stock réel : marchandises, fournitures, matériel, récolte, pièces détachées.',
      'Créez une fiche de stock : référence, désignation, stock initial, entrées, sorties, stock calculé, seuil d’alerte.',
      'Le stock calculé doit être une formule, jamais une saisie manuelle.',
      'Enregistrez chaque mouvement pendant quatorze jours, le jour même.',
      'Réalisez un inventaire physique à la fin de la période.',
      'Comparez stock calculé et stock physique, et expliquez chaque écart.',
      'Rédigez un rapport d’une page : méthode, résultats, écarts, causes, recommandations.',
    ],
    deliverable:
      'Une fiche de stock tenue quatorze jours, un inventaire physique et un rapport d’écarts d’une page.',
    skillIds: ['gestion-stock', 'tableur', 'reporting-pro', 'fiabilite', 'pensee-critique'],
    evaluationChecklist: [
      'Le stock calculé est obtenu par formule',
      'Les mouvements ont été enregistrés le jour même pendant quatorze jours',
      'Un inventaire physique a été réalisé',
      'Chaque écart est expliqué par une cause identifiée',
      'Le rapport contient des recommandations concrètes',
      'Un seuil d’alerte est défini par référence',
    ],
    portfolioDescription:
      'Mise en place et tenue d’un suivi de stock sur 14 jours pour [structure] : fiche de stock automatisée, enregistrement quotidien des mouvements, inventaire physique de contrôle et rapport d’analyse des écarts avec recommandations.',
    offlineFriendly: true,
  },
  {
    id: 'proj-min-rapport-hebdo',
    slug: 'rapport-activite-hebdomadaire',
    title: 'Rapport d’activité hebdomadaire',
    pathId: 'mines-support',
    difficulty: 'moyen',
    simulated: true,
    estimatedMinutes: 240,
    scenario:
      'Mission simulée. Vous occupez un poste d’assistant logistique chez un sous-traitant minier. Chaque vendredi, votre responsable attend un rapport d’une page : ce qui a été fait, les chiffres, les écarts, les points d’attention.',
    objective:
      'Produire quatre rapports hebdomadaires successifs, factuels et chiffrés, au format attendu en entreprise.',
    instructions: [
      'Choisissez une activité réelle que vous pouvez suivre pendant quatre semaines : un commerce, une association, un travail, vos propres démarches de recherche d’emploi.',
      'Définissez trois à cinq indicateurs chiffrés à suivre chaque semaine.',
      'Chaque vendredi, rédigez un rapport d’une page structuré : période, réalisations, chiffres, écarts par rapport au prévu, points d’attention, actions de la semaine suivante.',
      'N’écrivez que des faits : aucune appréciation générale du type « la semaine s’est bien passée ».',
      'À la quatrième semaine, ajoutez un tableau et un graphique d’évolution.',
      'Faites lire le dernier rapport à une personne extérieure et vérifiez qu’elle comprend la situation sans explication.',
    ],
    deliverable:
      'Quatre rapports hebdomadaires d’une page avec indicateurs chiffrés, plus un tableau d’évolution sur quatre semaines.',
    skillIds: ['reporting-pro', 'communication-ecrite', 'tableur', 'suivi-resultats', 'gestion-temps'],
    evaluationChecklist: [
      'Quatre rapports ont été produits, un par semaine',
      'Chaque rapport tient sur une page',
      'Les mêmes indicateurs sont suivis d’une semaine à l’autre',
      'Les écarts sont expliqués par une cause, pas seulement constatés',
      'Le tableau d’évolution est lisible',
      'Une personne extérieure comprend la situation sans explication orale',
    ],
    portfolioDescription:
      'Exercice de reporting professionnel : production de quatre rapports d’activité hebdomadaires sur [activité], avec suivi de 3 à 5 indicateurs chiffrés, analyse des écarts et synthèse graphique sur un mois. Projet pédagogique personnel.',
    offlineFriendly: true,
  },

  // ===========================================================================
  // Préparation à l'emploi
  // ===========================================================================
  {
    id: 'proj-emp-analyse-trois-offres',
    slug: 'analyse-trois-offres',
    title: 'Analyse comparée de trois offres d’emploi',
    pathId: 'preparation-emploi',
    difficulty: 'facile',
    simulated: false,
    estimatedMinutes: 180,
    scenario:
      'Vous postulez à plusieurs offres du même métier sans savoir précisément ce qui vous manque. Vous répétez donc les mêmes échecs.',
    objective:
      'Identifier vos écarts récurrents en analysant méthodiquement trois offres réelles du même type de poste.',
    instructions: [
      'Choisissez trois offres réelles correspondant au poste que vous visez.',
      'Analysez chacune avec l’outil « Analyser une offre ».',
      'Pour chaque offre, listez : les exigences que vous remplissez, celles que vous remplissez partiellement, celles qui vous manquent.',
      'Repérez ce qui revient dans les trois offres.',
      'Construisez un plan de comblement : pour chaque écart récurrent, une action précise et une échéance.',
      'Pour les écarts que vous ne pouvez pas combler à court terme, rédigez la phrase que vous direz en entretien.',
    ],
    deliverable:
      'Trois analyses d’offres, une liste priorisée des écarts récurrents et un plan de comblement daté.',
    skillIds: ['analyse-offre', 'analyse-ecarts', 'pensee-critique', 'conscience-de-soi'],
    evaluationChecklist: [
      'Les trois offres sont réelles et comparables',
      'J’ai distingué exigences remplies, partielles et manquantes',
      'J’ai identifié ce qui revient dans les trois offres',
      'Chaque écart a une action et une échéance',
      'J’ai préparé une phrase honnête pour les écarts non comblés',
    ],
    portfolioDescription:
      'Analyse comparée de trois offres d’emploi de [métier] : extraction des exigences, positionnement de mon profil et construction d’un plan de montée en compétence priorisé.',
    offlineFriendly: false,
  },
  {
    id: 'proj-emp-dossier-candidature',
    slug: 'dossier-candidature-complet',
    title: 'Dossier de candidature complet pour un poste ciblé',
    pathId: 'preparation-emploi',
    difficulty: 'exigeant',
    simulated: false,
    estimatedMinutes: 360,
    scenario:
      'Une offre correspond vraiment à votre objectif. Vous avez une seule occasion de vous présenter, et la préparation fera la différence avec un candidat de niveau équivalent.',
    objective:
      'Constituer un dossier complet qui traite les six questions clés d’une candidature.',
    instructions: [
      'Choisissez une offre réelle correspondant à votre objectif.',
      'Analysez-la avec l’outil « Analyser une offre » et notez votre indice de préparation.',
      'Étudiez l’employeur et remplissez la check-list correspondante.',
      'Adaptez votre CV en reprenant le vocabulaire de l’offre, sans jamais rien inventer.',
      'Rédigez une lettre d’une demi-page traitant les trois exigences principales.',
      'Préparez par écrit vos réponses aux six questions : pourquoi ce poste, pourquoi cette entreprise, pourquoi mon profil, quels écarts, comment les compenser, quelle valeur.',
      'Construisez trois exemples STAR mobilisables.',
      'Préparez trois questions à poser à l’employeur.',
      'Faites réaliser un entretien blanc de vingt minutes par une autre personne.',
    ],
    deliverable:
      'Un dossier complet : analyse d’offre, fiche employeur, CV adapté, lettre, six réponses, trois exemples STAR, trois questions, et le compte rendu de l’entretien blanc.',
    skillIds: [
      'analyse-offre',
      'analyse-ecarts',
      'proposition-valeur',
      'communication-ecrite',
      'communication-orale',
      'confiance',
      'recherche-web',
    ],
    evaluationChecklist: [
      'L’offre a été analysée exigence par exigence',
      'Ma fiche employeur contient une actualité récente et vérifiée',
      'Mon CV reprend le vocabulaire de l’offre sans aucune information fausse',
      'Les six questions ont une réponse écrite',
      'J’ai trois exemples STAR complets',
      'Mes trois questions ne trouvent pas leur réponse sur le site de l’entreprise',
      'J’ai réalisé un entretien blanc et noté les points à retravailler',
    ],
    portfolioDescription:
      'Constitution d’un dossier de candidature complet pour un poste de [intitulé] : analyse des exigences du poste, recherche employeur, adaptation du CV, préparation structurée des six questions de candidature et simulation d’entretien.',
    offlineFriendly: false,
  },

  // ===========================================================================
  // Créer une activité
  // ===========================================================================
  {
    id: 'proj-ent-validation-idee',
    slug: 'validation-idee-activite',
    title: 'Validation d’une idée d’activité',
    pathId: 'entrepreneuriat',
    difficulty: 'moyen',
    simulated: false,
    estimatedMinutes: 360,
    scenario:
      'Vous avez une idée d’activité. La plupart des projets échouent parce que personne n’a vérifié, avant de dépenser, que le problème visé existait vraiment.',
    objective:
      'Valider ou invalider une idée auprès de personnes réelles, avant tout investissement.',
    instructions: [
      'Décrivez le problème que vous pensez résoudre, en trois phrases.',
      'Interrogez quinze personnes du profil visé, sans jamais présenter votre solution.',
      'Demandez uniquement : à quelle fréquence rencontrez-vous ce problème, comment faites-vous aujourd’hui, combien cela vous coûte.',
      'Notez les réponses telles quelles, y compris celles qui contredisent votre idée.',
      'Comptez combien de personnes rencontrent réellement le problème et à quelle fréquence.',
      'Concluez honnêtement : problème confirmé, problème différent de celui imaginé, ou problème inexistant.',
      'Si le problème est confirmé, décrivez votre offre en une page et faites-la reformuler par cinq personnes.',
    ],
    deliverable:
      'Quinze comptes rendus d’entretien, une synthèse chiffrée et une conclusion argumentée sur la validité de l’idée.',
    skillIds: ['etude-besoin', 'proposition-valeur', 'pensee-critique', 'ecoute-active'],
    evaluationChecklist: [
      'J’ai interrogé quinze personnes du profil visé',
      'Je n’ai présenté aucune solution pendant les entretiens',
      'J’ai noté les réponses qui contredisaient mon idée',
      'Je connais la fréquence et le coût du problème',
      'Ma conclusion est argumentée, même si elle invalide l’idée',
    ],
    portfolioDescription:
      'Étude de validation d’une idée d’activité : conduite de 15 entretiens clients sur [problème], analyse des besoins réels et conclusion argumentée sur la viabilité du projet.',
    offlineFriendly: true,
  },
  {
    id: 'proj-ent-plan-action',
    slug: 'plan-action-activite',
    title: 'Plan d’action et comptes d’une petite activité',
    pathId: 'entrepreneuriat',
    difficulty: 'exigeant',
    simulated: false,
    estimatedMinutes: 420,
    scenario:
      'Une activité qui ne tient pas de comptes ne sait pas si elle gagne de l’argent. Beaucoup de petites activités travaillent à perte pendant des mois sans s’en apercevoir.',
    objective:
      'Calculer la rentabilité réelle d’une activité et construire un plan d’action chiffré à trois mois.',
    instructions: [
      'Choisissez une activité réelle : la vôtre, ou celle de quelqu’un qui accepte de vous ouvrir ses chiffres.',
      'Listez tous les coûts fixes mensuels et tous les coûts variables par unité vendue.',
      'Intégrez le temps de travail à un taux horaire, même modeste.',
      'Calculez le coût de revient unitaire et le seuil de rentabilité mensuel.',
      'Tenez un registre de recettes et dépenses pendant un mois complet, sans exception.',
      'Calculez le résultat réel du mois.',
      'Rédigez un plan d’action à trois mois avec trois objectifs chiffrés et les moyens de les atteindre.',
    ],
    deliverable:
      'Un calcul de coûts, un seuil de rentabilité, un registre d’un mois et un plan d’action chiffré à trois mois.',
    skillIds: ['budget', 'pricing', 'tenue-registres', 'comptabilite-base', 'suivi-resultats'],
    evaluationChecklist: [
      'Tous les coûts fixes et variables sont listés',
      'Le temps de travail est valorisé',
      'Le seuil de rentabilité est chiffré et atteignable',
      'Le registre couvre un mois complet sans trou',
      'Le résultat du mois est calculé',
      'Le plan contient trois objectifs chiffrés avec des moyens précis',
    ],
    portfolioDescription:
      'Analyse économique d’une petite activité : calcul du coût de revient et du seuil de rentabilité, tenue d’un registre comptable sur un mois, et construction d’un plan d’action chiffré à trois mois.',
    offlineFriendly: true,
  },

  // ===========================================================================
  // Freelance et travail à distance
  // ===========================================================================
  {
    id: 'proj-fre-portfolio',
    slug: 'portfolio-freelance',
    title: 'Portfolio de trois réalisations',
    pathId: 'freelance-distance',
    difficulty: 'moyen',
    simulated: false,
    estimatedMinutes: 420,
    scenario:
      'Aucun client ne confie une mission sans preuve. Aucune preuve n’existe sans mission. La seule sortie est de produire les preuves vous-même.',
    objective:
      'Constituer un portfolio de trois réalisations complètes, présentées honnêtement.',
    instructions: [
      'Choisissez votre compétence principale.',
      'Réalisez trois travaux complets dans cette compétence.',
      'Au moins un doit être fait pour une personne ou une structure réelle, même bénévolement.',
      'Pour chaque réalisation, décrivez : le contexte, la demande, ce que vous avez fait, le résultat obtenu.',
      'Indiquez explicitement, pour chaque pièce, s’il s’agit d’une commande réelle ou d’un exercice personnel.',
      'Rassemblez le tout dans un document unique ou une page en ligne accessible.',
      'Faites-le relire par deux personnes et demandez ce qui manque pour leur inspirer confiance.',
    ],
    deliverable:
      'Un portfolio de trois réalisations décrites honnêtement, relu par deux personnes.',
    skillIds: ['portfolio', 'communication-ecrite', 'ethique-pro', 'initiative'],
    evaluationChecklist: [
      'Trois réalisations complètes sont présentées',
      'Au moins une a été réalisée pour quelqu’un de réel',
      'Le statut de chaque pièce est indiqué sans ambiguïté',
      'Chaque description suit la structure contexte, demande, action, résultat',
      'Deux personnes l’ont relu et ont donné leur avis',
      'Aucune réalisation n’est présentée de façon trompeuse',
    ],
    portfolioDescription:
      'Constitution d’un portfolio professionnel de trois réalisations en [compétence], incluant un travail réalisé pour une structure réelle, avec description structurée du contexte, de la demande et des résultats.',
    offlineFriendly: false,
  },
  {
    id: 'proj-fre-proposition',
    slug: 'proposition-commerciale-freelance',
    title: 'Modèle de proposition et cinq envois',
    pathId: 'freelance-distance',
    difficulty: 'exigeant',
    simulated: false,
    estimatedMinutes: 300,
    scenario:
      'Vous envoyez des messages génériques à des clients potentiels et n’obtenez aucune réponse. Le problème n’est presque jamais le prix : c’est que votre message ne montre pas que vous avez lu la demande.',
    objective:
      'Construire un modèle de proposition solide et l’utiliser pour cinq candidatures réelles.',
    instructions: [
      'Créez un modèle de proposition comprenant : reformulation du besoin, ce que vous ferez, ce qui n’est pas inclus, délai, prix, modalités de paiement.',
      'Calculez votre tarif à partir de vos coûts et du temps estimé, pas au hasard.',
      'Identifiez cinq demandes réelles, locales ou en ligne.',
      'Personnalisez chaque proposition : la première phrase doit prouver que vous avez lu la demande.',
      'Envoyez les cinq propositions.',
      'Suivez les réponses pendant deux semaines et relancez une fois.',
      'Analysez : combien de réponses, quelles différences entre celles qui ont abouti et les autres.',
    ],
    deliverable:
      'Un modèle de proposition réutilisable, cinq propositions envoyées et une analyse des retours.',
    skillIds: ['freelance-proposition', 'pricing', 'communication-ecrite', 'fiabilite'],
    evaluationChecklist: [
      'Le modèle précise le périmètre, ce qui est exclu, le délai et le prix',
      'Mon tarif est calculé, pas improvisé',
      'Les cinq propositions sont personnalisées',
      'J’ai réellement envoyé les cinq propositions',
      'J’ai relancé une fois après une semaine',
      'Mon analyse identifie une différence concrète entre les propositions abouties et les autres',
    ],
    portfolioDescription:
      'Conception d’un modèle de proposition commerciale freelance et campagne de cinq candidatures personnalisées, avec suivi des relances et analyse comparative des retours obtenus.',
    offlineFriendly: false,
  },

  // ===========================================================================
  // Savoir-être et confiance
  // ===========================================================================
  {
    id: 'proj-sav-star-portfolio',
    slug: 'portfolio-exemples-star',
    title: 'Trois exemples STAR prêts pour l’entretien',
    pathId: 'savoir-etre',
    difficulty: 'facile',
    simulated: false,
    estimatedMinutes: 180,
    scenario:
      'Un recruteur demande : « Racontez-moi une situation où vous avez dû gérer un imprévu. » Sans exemple préparé, la réponse reste vague — et une réponse vague ne convainc jamais.',
    objective:
      'Préparer trois exemples STAR complets, vrais et réutilisables dans la plupart des entretiens.',
    instructions: [
      'Identifiez trois situations réelles que vous avez vécues : une réussite, une difficulté surmontée, un travail en équipe.',
      'Pour chacune, rédigez la structure complète : Situation, Tâche, Action, Résultat.',
      'Dans la partie Action, utilisez systématiquement « j’ai » et non « nous avons ».',
      'Ajoutez un résultat chiffré ou mesurable, même approximatif et honnête.',
      'Chronométrez : chaque exemple doit se raconter en moins de deux minutes.',
      'Racontez-les à deux personnes et demandez ce qu’elles ont retenu de votre rôle exact.',
    ],
    deliverable: 'Trois exemples STAR rédigés, chronométrés et testés à l’oral.',
    skillIds: ['conscience-de-soi', 'communication-orale', 'confiance', 'resolution-problemes'],
    evaluationChecklist: [
      'Les trois situations sont réelles',
      'Les quatre parties S, T, A, R sont complètes',
      'La partie Action décrit ce que j’ai fait personnellement',
      'Chaque exemple a un résultat mesurable',
      'Chaque exemple se raconte en moins de deux minutes',
      'Deux personnes ont pu identifier mon rôle exact',
    ],
    portfolioDescription:
      'Préparation structurée de trois exemples professionnels selon la méthode STAR, couvrant réussite, gestion de difficulté et travail en équipe, testés à l’oral.',
    offlineFriendly: true,
  },
  {
    id: 'proj-sav-resolution-probleme',
    slug: 'resolution-probleme-reel',
    title: 'Résolution méthodique d’un problème réel',
    pathId: 'savoir-etre',
    difficulty: 'moyen',
    simulated: false,
    estimatedMinutes: 300,
    scenario:
      'Les recruteurs testent la capacité de réflexion en posant un problème inhabituel. Ce qu’ils observent n’est pas la réponse, mais la méthode.',
    objective:
      'Résoudre un problème réel avec une méthode explicite et documenter la démarche.',
    instructions: [
      'Choisissez un problème d’organisation concret dans votre entourage : famille, école, association, commerce, travail.',
      'Reformulez le problème par écrit : de quoi s’agit-il exactement ?',
      'Listez les faits établis et, séparément, ce que vous supposez sans en être sûr.',
      'Vérifiez au moins deux de vos suppositions auprès des personnes concernées.',
      'Proposez trois options différentes, avec leurs avantages et leurs inconvénients.',
      'Choisissez-en une et argumentez ce choix.',
      'Mettez-la en œuvre avec les personnes concernées.',
      'Mesurez le résultat et écrivez ce qui a fonctionné et ce qui a échoué.',
    ],
    deliverable:
      'Un compte rendu documentant reformulation, faits, hypothèses vérifiées, trois options, choix argumenté, mise en œuvre et résultat.',
    skillIds: [
      'resolution-problemes',
      'pensee-critique',
      'creativite',
      'initiative',
      'travail-equipe',
      'gestion-conflit',
    ],
    evaluationChecklist: [
      'Le problème est reformulé par écrit avant toute recherche de solution',
      'Faits et suppositions sont clairement séparés',
      'Au moins deux suppositions ont été vérifiées',
      'Trois options réellement différentes sont présentées',
      'Le choix est argumenté',
      'La solution a été mise en œuvre et le résultat mesuré',
      'Les échecs sont décrits honnêtement',
    ],
    portfolioDescription:
      'Résolution documentée d’un problème d’organisation réel : reformulation, distinction faits/hypothèses, vérification des suppositions, comparaison de trois options, mise en œuvre en équipe et mesure des résultats.',
    offlineFriendly: true,
  },
];

export const projectById = new Map(practicalProjects.map((project) => [project.id, project]));

export function projectsForPath(pathId: string): PracticalProject[] {
  return practicalProjects.filter((project) => project.pathId === pathId);
}

export function projectBySlug(slug: string): PracticalProject | undefined {
  return practicalProjects.find((project) => project.slug === slug);
}
