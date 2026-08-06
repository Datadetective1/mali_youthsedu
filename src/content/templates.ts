export interface MessageTemplate {
  id: string;
  title: string;
  context: string;
  subject?: string;
  body: string;
  /** What the user must change before sending — a copied template is spotted instantly. */
  adaptations: string[];
}

/**
 * Professional communication templates.
 *
 * Deliberately plain. A candidate who sends an over-written message stands out
 * for the wrong reason; a clear five-line message gets read.
 */
export const emailTemplates: MessageTemplate[] = [
  {
    id: 'tpl-candidature',
    title: 'Candidature à une offre',
    context: 'À envoyer avec votre CV en pièce jointe, en réponse à une annonce.',
    subject: 'Candidature — [Intitulé du poste] — [Votre prénom et nom]',
    body: `Madame, Monsieur,

Je me permets de vous adresser ma candidature au poste de [intitulé du poste], publié le [date] sur [source].

[Une phrase reliant votre profil à l'exigence principale de l'offre. Exemple : « Le suivi de stock et le reporting hebdomadaire constituent l'essentiel de mon expérience chez [X], où je tenais une fiche de stock de [N] références. »]

Vous trouverez ci-joint mon curriculum vitae. Je reste disponible pour un entretien à votre convenance.

Veuillez agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

[Prénom Nom]
[Téléphone] — [Adresse e-mail]`,
    adaptations: [
      'Remplacez l’intitulé exact du poste et la source de l’annonce',
      'La phrase du milieu doit citer une exigence précise de cette offre',
      'Vérifiez que le CV est bien joint avant d’envoyer',
    ],
  },
  {
    id: 'tpl-spontanee',
    title: 'Candidature spontanée',
    context: 'Quand aucune offre n’est publiée mais que l’entreprise vous intéresse.',
    subject: 'Candidature spontanée — [Domaine] — [Votre prénom et nom]',
    body: `Madame, Monsieur,

Votre entreprise [nom] intervient dans [activité précise que vous avez vérifiée], et c’est un domaine dans lequel je souhaite construire mon parcours professionnel.

Je sais [compétence 1] et [compétence 2]. J’ai notamment [une réalisation concrète et vérifiable, en une ligne].

Si un besoin correspondait à ce profil, même à venir, je serais heureux(se) d’échanger avec vous. Mon CV est joint à ce message.

Veuillez agréer, Madame, Monsieur, mes salutations respectueuses.

[Prénom Nom]
[Téléphone] — [Adresse e-mail]`,
    adaptations: [
      'La première phrase doit prouver que vous connaissez l’entreprise',
      'Citez une réalisation réelle, pas une qualité',
      'Adressez-le à une personne nommée si vous parvenez à l’identifier',
    ],
  },
  {
    id: 'tpl-relance',
    title: 'Relance après candidature',
    context: 'Sept à dix jours après l’envoi, sans réponse. Une seule fois.',
    subject: 'Relance — Candidature [Intitulé du poste] — [Votre prénom et nom]',
    body: `Madame, Monsieur,

Je me permets de revenir vers vous concernant ma candidature au poste de [intitulé], adressée le [date].

Ce poste correspond précisément à ce que je recherche, et je reste pleinement disponible pour un entretien.

Je me tiens à votre disposition pour tout complément d’information.

Cordialement,

[Prénom Nom]
[Téléphone]`,
    adaptations: [
      'N’envoyez cette relance qu’une seule fois',
      'Rappelez la date exacte de votre premier envoi',
      'Restez bref : quatre lignes suffisent',
    ],
  },
  {
    id: 'tpl-remerciement',
    title: 'Remerciement après entretien',
    context: 'À envoyer dans les 24 heures suivant l’entretien.',
    subject: 'Merci pour notre entretien — [Intitulé du poste]',
    body: `Madame, Monsieur [Nom],

Je vous remercie pour le temps que vous m’avez accordé [aujourd’hui / hier] au sujet du poste de [intitulé].

Notre échange sur [un point précis discuté pendant l’entretien] a confirmé mon intérêt pour ce poste. [Si une question vous a mis en difficulté, une phrase pour compléter votre réponse — sans revenir longuement dessus.]

Je reste à votre disposition pour toute information complémentaire.

Cordialement,

[Prénom Nom]
[Téléphone]`,
    adaptations: [
      'Citez un point réellement discuté : c’est ce qui distingue ce message d’un modèle',
      'Une seule phrase de complément si vous en avez une, pas un paragraphe',
      'Envoyez dans les 24 heures, au-delà l’effet disparaît',
    ],
  },
  {
    id: 'tpl-demande-retour',
    title: 'Demande de retour après un refus',
    context:
      'Après une réponse négative. Beaucoup de recruteurs répondent, et ce retour vaut cher pour la suite.',
    subject: 'Demande de retour — [Intitulé du poste]',
    body: `Madame, Monsieur,

Je vous remercie de m’avoir informé(e) de votre décision concernant le poste de [intitulé].

Si vous en avez la possibilité, je serais reconnaissant(e) que vous m’indiquiez le principal point qui a manqué à ma candidature. Cette information m’aiderait sincèrement à progresser pour mes prochaines démarches.

Je vous remercie par avance du temps que vous voudrez bien y consacrer.

Cordialement,

[Prénom Nom]`,
    adaptations: [
      'Ne contestez jamais la décision : vous demandez un retour, pas une révision',
      'Une seule question précise obtient plus de réponses qu’une demande générale',
      'Remerciez la réponse, même si elle est brève ou dure à entendre',
    ],
  },
  {
    id: 'tpl-retard',
    title: 'Signaler un retard ou un empêchement',
    context:
      'À envoyer avant l’échéance, jamais après. C’est ce qui distingue un professionnel fiable.',
    subject: '[Objet concerné] — point de situation',
    body: `Bonjour [Prénom],

Je vous informe que [tâche / livrable] ne pourra pas être terminé(e) pour [date prévue].

Raison : [cause factuelle, sans excuse ni justification longue].

Nouvelle échéance proposée : [date réaliste].
Ce qui est déjà terminé : [état d’avancement].

Dites-moi si cette nouvelle échéance vous convient ou si une autre priorité doit passer devant.

Cordialement,

[Prénom Nom]`,
    adaptations: [
      'Envoyez avant l’échéance, pas le jour même',
      'Proposez une nouvelle date réaliste, pas optimiste',
      'Indiquez ce qui est déjà fait : cela rassure plus que des excuses',
    ],
  },
  {
    id: 'tpl-proposition-freelance',
    title: 'Proposition pour une mission freelance',
    context: 'Réponse à une demande de client, locale ou en ligne.',
    subject: 'Proposition — [Nature de la mission]',
    body: `Bonjour [Prénom / Madame, Monsieur],

Si je comprends bien votre demande, vous cherchez [reformulation du besoin en une phrase, avec vos mots].

Ce que je propose :
- [Livrable 1]
- [Livrable 2]
- [Livrable 3]

Ce qui n’est pas inclus : [périmètre exclu, pour éviter tout malentendu].

Délai : [durée] à compter de la validation.
Prix : [montant], [modalité : acompte de X % au démarrage, solde à la livraison].

Je reste disponible pour ajuster ce périmètre si nécessaire.

Cordialement,

[Prénom Nom]
[Contact] — [Lien vers le portfolio]`,
    adaptations: [
      'La première phrase doit prouver que vous avez lu la demande',
      'Indiquez toujours ce qui n’est pas inclus : c’est ce qui évite les conflits',
      'Ne proposez jamais un prix que vous n’avez pas calculé',
    ],
  },
];

export const templateById = new Map(emailTemplates.map((template) => [template.id, template]));
