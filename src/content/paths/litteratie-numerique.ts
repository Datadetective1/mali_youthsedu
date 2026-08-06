import { buildPath } from './builder';

export const litteratieNumerique = buildPath({
  slug: 'litteratie-numerique',
  name: 'Compétences numériques',
  summary:
    'Du premier contact avec un ordinateur jusqu’au tableur et aux outils de travail en ligne.',
  description:
    'Presque toutes les offres d’emploi de bureau, de commerce ou de support mentionnent la bureautique. Ce parcours part du niveau zéro et vous conduit jusqu’à un usage professionnel crédible : documents, tableur, messagerie, recherche d’information, sécurité et outils collaboratifs.',
  audience: [
    'Vous n’avez jamais utilisé d’ordinateur ou seulement de façon occasionnelle',
    'Vous savez utiliser un téléphone mais pas un tableur',
    'Une offre vous a déjà été refusée à cause de « la maîtrise de l’outil informatique »',
  ],
  outcomes: [
    'Créer, organiser et retrouver vos documents sans les perdre',
    'Produire un tableau de suivi propre dans un tableur',
    'Écrire un e-mail professionnel correct',
    'Reconnaître une arnaque en ligne et protéger vos comptes',
    'Participer à une réunion en ligne dans de bonnes conditions',
  ],
  prerequisites: [],
  sectorIds: ['numerique', 'administration'],
  skillIds: [
    'informatique-base',
    'fichiers-dossiers',
    'traitement-texte',
    'tableur',
    'email-pro',
    'recherche-web',
    'securite-numerique',
    'visio',
    'cloud-docs',
    'ia-responsable',
  ],
  level: 'debutant',
  featured: true,
  order: 1,
  icon: 'Laptop',
  projectIds: ['proj-num-suivi-depenses', 'proj-num-dossier-candidature'],
  stages: [
    {
      name: 'Prendre l’outil en main',
      objective:
        'Être capable d’allumer un ordinateur, de s’y repérer et de comprendre le vocabulaire de base sans se sentir perdu.',
      skillIds: ['informatique-base'],
      estimatedMinutes: 180,
      resourceIds: ['res-gcf-informatique', 'res-pix'],
      items: [
        {
          title: 'Comprendre les parties d’un ordinateur',
          description:
            'Écran, unité centrale, clavier, souris, ports. Savoir nommer les choses évite de bloquer devant un problème simple.',
          minutes: 30,
          kind: 'lecture',
          resourceIds: ['res-gcf-informatique'],
        },
        {
          title: 'Démarrer, se connecter, éteindre correctement',
          minutes: 20,
          kind: 'pratique',
        },
        {
          title: 'Se repérer sur le bureau et dans les fenêtres',
          description: 'Ouvrir, fermer, réduire, passer d’une application à l’autre.',
          minutes: 40,
          kind: 'pratique',
          resourceIds: ['res-gcf-informatique'],
        },
        {
          title: 'S’entraîner au clavier et à la souris',
          description:
            'Vingt minutes par jour pendant une semaine changent radicalement votre vitesse.',
          minutes: 60,
          kind: 'pratique',
        },
        {
          title: 'Évaluer votre point de départ',
          minutes: 30,
          kind: 'evaluation',
          resourceIds: ['res-pix'],
        },
      ],
      practicalExercise: {
        title: 'Votre première session complète',
        instructions: [
          'Trouvez un accès à un ordinateur : école, cybercafé, centre communautaire, voisin, employeur.',
          'Allumez-le, connectez-vous, ouvrez une application, écrivez trois phrases, enregistrez, éteignez proprement.',
          'Notez sur papier chaque moment où vous avez hésité.',
        ],
        deliverable:
          'Une liste écrite de trois difficultés rencontrées et de la façon dont vous les avez résolues.',
      },
      checklist: [
        'Je sais allumer et éteindre un ordinateur correctement',
        'Je sais ouvrir et fermer une application',
        'Je sais passer d’une fenêtre à l’autre',
        'Je connais le nom des principaux éléments',
      ],
      reflection:
        'Qu’est-ce qui vous a le plus surpris lors de votre première session ? Qu’est-ce qui vous paraissait difficile et ne l’est plus ?',
      evidence:
        'Une note écrite décrivant votre première session complète et les difficultés surmontées.',
      knowledgeCheck: [
        {
          question: 'Que faut-il faire avant de débrancher un ordinateur de bureau ?',
          options: [
            'Rien de particulier, on peut couper directement',
            'L’éteindre par le menu de démarrage puis attendre l’arrêt complet',
            'Fermer seulement l’écran',
          ],
          answerIndex: 1,
          explanation:
            'Couper l’alimentation sans éteindre peut endommager les fichiers en cours d’écriture. Cela paraît anodin et c’est l’une des premières causes de travail perdu.',
        },
      ],
    },
    {
      name: 'Fichiers, dossiers et sauvegarde',
      objective:
        'Ne plus jamais perdre un document et savoir le retrouver en moins de trente secondes.',
      skillIds: ['fichiers-dossiers'],
      estimatedMinutes: 150,
      resourceIds: ['res-gcf-informatique'],
      items: [
        {
          title: 'Comprendre l’arborescence : dossiers et sous-dossiers',
          minutes: 30,
          kind: 'lecture',
          resourceIds: ['res-gcf-informatique'],
        },
        {
          title: 'Créer, renommer, déplacer, supprimer',
          minutes: 40,
          kind: 'pratique',
        },
        {
          title: 'Adopter une convention de nommage',
          description:
            'Par exemple : 2026-03-12_CV_Awa-Traore.pdf. La date au début permet un classement automatique.',
          minutes: 20,
          kind: 'lecture',
        },
        {
          title: 'Sauvegarder sur clé USB et en ligne',
          minutes: 40,
          kind: 'pratique',
        },
        {
          title: 'Retrouver un fichier avec la recherche',
          minutes: 20,
          kind: 'pratique',
        },
      ],
      practicalExercise: {
        title: 'Construire votre dossier professionnel',
        instructions: [
          'Créez un dossier « Professionnel » contenant : CV, Candidatures, Formations, Projets.',
          'Placez-y au moins un document dans chaque sous-dossier.',
          'Appliquez la convention de nommage à chaque fichier.',
          'Faites une copie complète sur une clé USB ou un espace en ligne.',
        ],
        deliverable:
          'Une capture d’écran ou une description écrite de votre arborescence de dossiers.',
      },
      checklist: [
        'J’ai créé une structure de dossiers claire',
        'Tous mes fichiers suivent la même convention de nommage',
        'J’ai fait une sauvegarde en dehors de l’ordinateur',
        'Je retrouve n’importe quel fichier en moins de trente secondes',
      ],
      reflection:
        'Avez-vous déjà perdu un travail important ? Qu’est-ce que votre nouvelle organisation aurait changé ?',
      evidence: 'Une arborescence de dossiers professionnelle, sauvegardée en double.',
    },
    {
      name: 'Écrire un document professionnel',
      objective:
        'Produire un document propre, lisible et exportable en PDF, prêt à être envoyé à un employeur.',
      skillIds: ['traitement-texte', 'communication-ecrite'],
      estimatedMinutes: 210,
      resourceIds: ['res-gcf-word', 'res-libreoffice-doc'],
      items: [
        {
          title: 'Saisir et corriger un texte',
          minutes: 40,
          kind: 'pratique',
          resourceIds: ['res-gcf-word'],
        },
        {
          title: 'Mettre en forme : titres, gras, listes, alignement',
          minutes: 50,
          kind: 'pratique',
          resourceIds: ['res-gcf-word'],
        },
        {
          title: 'Contrôler la mise en page et l’impression',
          minutes: 30,
          kind: 'pratique',
        },
        {
          title: 'Exporter en PDF',
          description:
            'Un employeur reçoit un PDF, jamais un fichier qui s’ouvre mal. C’est un détail qui se remarque.',
          minutes: 20,
          kind: 'pratique',
        },
        {
          title: 'Installer et utiliser une alternative gratuite',
          description: 'LibreOffice permet de travailler sans licence payante.',
          minutes: 70,
          kind: 'pratique',
          resourceIds: ['res-libreoffice-doc'],
        },
      ],
      practicalExercise: {
        title: 'Une lettre de motivation mise en forme',
        instructions: [
          'Rédigez une lettre de motivation d’une page pour un poste qui vous intéresse réellement.',
          'Structurez-la : coordonnées, objet, corps en trois paragraphes, formule de politesse.',
          'Relisez-la deux fois, à voix haute la seconde fois.',
          'Exportez-la en PDF et vérifiez le rendu.',
        ],
        deliverable: 'Un fichier PDF d’une page, sans faute de frappe, lisible à l’impression.',
      },
      checklist: [
        'Mon document tient sur une page',
        'La mise en forme est cohérente du début à la fin',
        'J’ai relu et corrigé les fautes',
        'Le PDF s’ouvre correctement',
      ],
      reflection:
        'Relisez votre lettre en vous mettant à la place du recruteur. Qu’est-ce qui retient l’attention dans les cinq premières secondes ?',
      evidence: 'Une lettre de motivation d’une page en PDF.',
      knowledgeCheck: [
        {
          question: 'Pourquoi envoyer un CV en PDF plutôt qu’en fichier de traitement de texte ?',
          options: [
            'Le PDF pèse toujours moins lourd',
            'La mise en page reste identique quel que soit l’ordinateur du destinataire',
            'Le PDF est obligatoire par la loi',
          ],
          answerIndex: 1,
          explanation:
            'Un document de traitement de texte peut se décaler complètement selon les polices installées chez le destinataire. Le PDF fige la mise en page.',
        },
      ],
    },
    {
      name: 'Le tableur, compétence la plus demandée',
      objective:
        'Construire un tableau de suivi avec des calculs, un tri et un filtre — le niveau attendu dans une offre de support.',
      skillIds: ['tableur', 'suivi-resultats'],
      estimatedMinutes: 300,
      resourceIds: ['res-gcf-excel', 'res-exceleasy', 'res-microsoft-learn-excel'],
      items: [
        {
          title: 'Cellules, lignes, colonnes, feuilles',
          minutes: 40,
          kind: 'lecture',
          resourceIds: ['res-gcf-excel'],
        },
        {
          title: 'Saisir des données proprement',
          description:
            'Une colonne = une information. C’est la règle qui évite 90 % des problèmes ensuite.',
          minutes: 40,
          kind: 'pratique',
        },
        {
          title: 'Les formules essentielles : SOMME, MOYENNE, NB, SI',
          minutes: 70,
          kind: 'pratique',
          resourceIds: ['res-exceleasy'],
        },
        {
          title: 'Trier et filtrer',
          minutes: 40,
          kind: 'pratique',
        },
        {
          title: 'Mettre en forme un tableau lisible',
          minutes: 40,
          kind: 'pratique',
        },
        {
          title: 'Créer un graphique simple',
          minutes: 40,
          kind: 'pratique',
          resourceIds: ['res-microsoft-learn-excel'],
        },
        {
          title: 'Exporter et imprimer un tableau',
          minutes: 30,
          kind: 'pratique',
        },
      ],
      practicalExercise: {
        title: 'Un tableau de suivi réel',
        instructions: [
          'Choisissez quelque chose que vous suivez vraiment : dépenses, ventes d’un commerce familial, stock, présences.',
          'Créez un tableau avec au moins quatre colonnes et vingt lignes de données réelles.',
          'Ajoutez un total, une moyenne et un compteur.',
          'Triez par une colonne, puis filtrez pour n’afficher qu’une catégorie.',
          'Ajoutez un graphique et exportez le tout en PDF.',
        ],
        deliverable: 'Un fichier tableur fonctionnel avec formules, tri, filtre et graphique.',
      },
      checklist: [
        'Mon tableau contient au moins vingt lignes de données réelles',
        'J’utilise au moins trois formules différentes',
        'Le tri et le filtre fonctionnent',
        'Le graphique est lisible et correctement légendé',
        'Je peux expliquer chaque formule que j’ai écrite',
      ],
      reflection:
        'Quelle information votre tableau vous a-t-il révélée que vous ne voyiez pas avant de la mettre en tableau ?',
      evidence:
        'Un fichier tableur avec données réelles, formules et graphique — le meilleur élément de portfolio pour un poste administratif.',
      knowledgeCheck: [
        {
          question: 'Dans un tableur, à quoi sert la fonction SI ?',
          options: [
            'À additionner une plage de cellules',
            'À afficher un résultat différent selon qu’une condition est vraie ou fausse',
            'À trier automatiquement les lignes',
          ],
          answerIndex: 1,
          explanation:
            'SI teste une condition et renvoie une valeur si elle est vraie, une autre sinon. C’est la fonction qui transforme un tableau de saisie en outil de décision.',
        },
        {
          question: 'Vous avez une colonne « Nom et Prénom ». Pourquoi est-ce un problème ?',
          options: [
            'Cela prend trop de place',
            'On ne peut plus trier ou filtrer sur le nom seul',
            'Ce n’est pas un problème',
          ],
          answerIndex: 1,
          explanation:
            'Une colonne doit contenir une seule information. Sinon, tri, filtre et publipostage deviennent impossibles sans retravailler toutes les données.',
        },
      ],
    },
    {
      name: 'Messagerie, recherche et sécurité',
      objective:
        'Communiquer par e-mail de façon professionnelle, trouver une information fiable et protéger ses comptes.',
      skillIds: ['email-pro', 'recherche-web', 'securite-numerique'],
      estimatedMinutes: 210,
      resourceIds: ['res-gcf-internet', 'res-cybermalveillance', 'res-lesbonsclics'],
      items: [
        {
          title: 'Créer une adresse e-mail professionnelle',
          description:
            'prenom.nom@… et non un pseudonyme. C’est la première chose que voit un recruteur.',
          minutes: 30,
          kind: 'pratique',
        },
        {
          title: 'Écrire, répondre, transférer, joindre un fichier',
          minutes: 40,
          kind: 'pratique',
          resourceIds: ['res-lesbonsclics'],
        },
        {
          title: 'Les codes de l’e-mail professionnel',
          description: 'Objet explicite, formule d’appel, message court, signature.',
          minutes: 30,
          kind: 'lecture',
        },
        {
          title: 'Chercher une information et vérifier sa source',
          minutes: 40,
          kind: 'pratique',
          resourceIds: ['res-gcf-internet'],
        },
        {
          title: 'Mots de passe, hameçonnage et arnaques',
          minutes: 40,
          kind: 'lecture',
          resourceIds: ['res-cybermalveillance'],
        },
        {
          title: 'Sécuriser vos comptes existants',
          minutes: 30,
          kind: 'pratique',
        },
      ],
      practicalExercise: {
        title: 'Trois e-mails professionnels',
        instructions: [
          'Rédigez un e-mail de candidature spontanée avec CV en pièce jointe.',
          'Rédigez une relance polie sept jours après une candidature sans réponse.',
          'Rédigez une demande d’information à une entreprise qui vous intéresse.',
          'Faites relire les trois par quelqu’un dont le français écrit est solide.',
        ],
        deliverable: 'Trois e-mails rédigés, relus et corrigés.',
      },
      checklist: [
        'Mon adresse e-mail est sérieuse',
        'Chaque e-mail a un objet explicite',
        'Aucun message ne dépasse dix lignes',
        'J’ai activé un mot de passe solide sur mes comptes importants',
        'Je sais reconnaître un message d’hameçonnage',
      ],
      reflection:
        'Quelle arnaque en ligne avez-vous déjà croisée ? Qu’est-ce qui aurait dû vous alerter ?',
      evidence: 'Trois modèles d’e-mails professionnels réutilisables.',
      knowledgeCheck: [
        {
          question:
            'Un message vous annonce un emploi bien payé et demande 25 000 FCFA de « frais de dossier ». Que faire ?',
          options: [
            'Payer rapidement pour ne pas perdre l’opportunité',
            'Ne pas payer : un employeur sérieux ne demande jamais d’argent pour recruter',
            'Négocier le montant',
          ],
          answerIndex: 1,
          explanation:
            'La demande d’argent en amont d’une embauche est le signe le plus fiable d’une arnaque. Aucune exception ne mérite d’être testée.',
        },
      ],
    },
    {
      name: 'Travailler avec les autres en ligne',
      objective:
        'Utiliser les documents partagés, participer à une réunion en ligne et utiliser l’IA de façon responsable.',
      skillIds: ['cloud-docs', 'visio', 'ia-responsable', 'ethique-pro'],
      estimatedMinutes: 180,
      resourceIds: ['res-google-ateliers', 'res-remote-work-guide'],
      items: [
        {
          title: 'Créer et partager un document en ligne',
          minutes: 40,
          kind: 'pratique',
          resourceIds: ['res-google-ateliers'],
        },
        {
          title: 'Travailler à plusieurs sans écraser le travail des autres',
          minutes: 30,
          kind: 'pratique',
        },
        {
          title: 'Participer correctement à une réunion en ligne',
          description:
            'Micro coupé par défaut, prise de parole claire, connexion testée à l’avance.',
          minutes: 40,
          kind: 'lecture',
          resourceIds: ['res-remote-work-guide'],
        },
        {
          title: 'Utiliser un assistant IA comme aide, pas comme remplaçant',
          description:
            'Vérifier chaque réponse, ne jamais y coller de données confidentielles, ne jamais présenter un texte généré comme le sien sans le retravailler.',
          minutes: 40,
          kind: 'lecture',
        },
        {
          title: 'Comportement professionnel en ligne',
          description:
            'Ce que vous publiez publiquement peut être consulté par un recruteur.',
          minutes: 30,
          kind: 'reflexion',
        },
      ],
      practicalExercise: {
        title: 'Une réunion en ligne de bout en bout',
        instructions: [
          'Organisez une réunion en ligne de quinze minutes avec un ami ou un camarade.',
          'Envoyez l’invitation par e-mail avec un ordre du jour de trois points.',
          'Partagez un document préparé à l’avance pendant l’appel.',
          'Rédigez ensuite un compte rendu de cinq lignes et envoyez-le au participant.',
        ],
        deliverable: 'Une invitation, un ordre du jour et un compte rendu de réunion.',
      },
      checklist: [
        'J’ai envoyé une invitation avec ordre du jour',
        'J’ai testé ma connexion et mon micro avant',
        'J’ai partagé un document pendant l’appel',
        'J’ai envoyé un compte rendu après',
      ],
      reflection:
        'Si un recruteur cherchait votre nom en ligne aujourd’hui, que trouverait-il ? Est-ce l’image que vous voulez donner ?',
      evidence: 'Un compte rendu de réunion rédigé et envoyé.',
    },
  ],
});
