import type { Checklist } from '@/lib/types';

/**
 * Checklists used across the Job Readiness Center. Ids are persisted in
 * `checklist_states`, so renaming an id orphans a user's ticks — add, don't rename.
 */
export const checklists: Checklist[] = [
  {
    id: 'chk-interview-preparation',
    title: 'Préparation générale de l’entretien',
    intro:
      'À parcourir la veille. Ce qui est coché ici ne se prépare pas dans la salle d’attente.',
    items: [
      { id: 'ip-1', label: 'J’ai relu l’offre en entier et souligné les exigences principales' },
      { id: 'ip-2', label: 'Je sais expliquer en une phrase ce que fait l’entreprise' },
      {
        id: 'ip-3',
        label: 'J’ai préparé mes réponses aux six questions de candidature',
        help: 'Pourquoi ce poste, pourquoi cette entreprise, pourquoi mon profil, mes écarts, comment les compenser, ma valeur.',
      },
      { id: 'ip-4', label: 'J’ai trois exemples STAR complets et chronométrés' },
      { id: 'ip-5', label: 'J’ai préparé trois questions à poser au recruteur' },
      { id: 'ip-6', label: 'J’ai une réponse préparée sur mes prétentions salariales' },
      { id: 'ip-7', label: 'J’ai préparé la réponse à la question que je redoute le plus' },
      { id: 'ip-8', label: 'J’ai répété ma présentation à voix haute au moins cinq fois' },
      { id: 'ip-9', label: 'J’ai fait un entretien blanc avec une autre personne' },
    ],
  },
  {
    id: 'chk-cv-mastery',
    title: 'Maîtrise de mon CV',
    intro:
      'Un recruteur peut interroger n’importe quelle ligne. Ne pas savoir défendre ce qu’on a écrit soi-même est éliminatoire.',
    items: [
      { id: 'cm-1', label: 'Je peux expliquer chaque ligne de mon CV sans hésiter' },
      { id: 'cm-2', label: 'Chaque expérience contient au moins un élément concret ou chiffré' },
      { id: 'cm-3', label: 'Toutes les dates sont exactes et je peux les justifier' },
      {
        id: 'cm-4',
        label: 'Chaque niveau de langue annoncé correspond à la réalité',
        help: 'Un recruteur peut basculer en anglais sans prévenir. « Anglais courant » doit être vrai.',
      },
      {
        id: 'cm-5',
        label: 'Chaque logiciel mentionné peut être démontré',
        help: 'Si vous écrivez Excel, vous devez pouvoir citer les formules que vous utilisez.',
      },
      { id: 'cm-6', label: 'Je sais expliquer chaque interruption dans mon parcours' },
      { id: 'cm-7', label: 'Mon CV tient sur une page et a été relu par deux personnes' },
      { id: 'cm-8', label: 'Aucune information n’est exagérée ou inventée' },
    ],
  },
  {
    id: 'chk-employer-research',
    title: 'Recherche sur l’employeur',
    intro:
      'Ne pas s’être renseigné est l’une des erreurs les plus fréquentes — et l’une des plus simples à éviter.',
    items: [
      { id: 'er-1', label: 'Je sais ce que l’entreprise vend ou produit exactement' },
      { id: 'er-2', label: 'Je connais sa taille approximative et ses implantations' },
      { id: 'er-3', label: 'Je connais son secteur et ses principaux concurrents' },
      { id: 'er-4', label: 'J’ai trouvé une actualité récente la concernant' },
      { id: 'er-5', label: 'Je sais qui sont ses clients ou ses bénéficiaires' },
      {
        id: 'er-6',
        label: 'J’ai identifié le problème que ce poste doit résoudre pour elle',
        help: 'Un poste est ouvert parce que quelque chose manque. Lequel ?',
      },
      { id: 'er-7', label: 'J’ai parlé à quelqu’un qui la connaît, si c’était possible' },
      { id: 'er-8', label: 'Je peux dire pourquoi elle m’intéresse en particulier' },
      { id: 'er-9', label: 'Mes questions ne trouvent pas leur réponse sur sa page d’accueil' },
    ],
  },
  {
    id: 'chk-interview-logistics',
    title: 'Aspects pratiques',
    intro: 'Les détails matériels qui font arriver serein plutôt qu’essoufflé.',
    items: [
      { id: 'il-1', label: 'Je connais l’adresse exacte et le temps de trajet réel' },
      { id: 'il-2', label: 'J’ai prévu d’arriver dix à quinze minutes en avance' },
      { id: 'il-3', label: 'J’ai le nom et le numéro de la personne qui me reçoit' },
      { id: 'il-4', label: 'Ma tenue est prête, propre et adaptée au secteur' },
      { id: 'il-5', label: 'J’ai imprimé deux copies de mon CV' },
      { id: 'il-6', label: 'J’ai de quoi écrire et un carnet' },
      { id: 'il-7', label: 'Mon téléphone sera chargé et en silencieux' },
      {
        id: 'il-8',
        label: 'Pour un entretien en ligne : connexion, micro et lieu calme testés',
        help: 'Testez la veille, pas cinq minutes avant.',
      },
    ],
  },
  {
    id: 'chk-application',
    title: 'Check-list de candidature',
    intro: 'À parcourir avant chaque envoi. Dix minutes qui changent le résultat.',
    items: [
      { id: 'ap-1', label: 'J’ai analysé l’offre exigence par exigence' },
      { id: 'ap-2', label: 'Je remplis les exigences éliminatoires, ou je sais comment les traiter' },
      { id: 'ap-3', label: 'Mon CV est adapté à cette offre précise' },
      {
        id: 'ap-4',
        label: 'J’ai repris le vocabulaire de l’offre, sans rien inventer',
        help: 'Si l’offre dit « suivi des stocks » et que vous l’avez fait, écrivez « suivi des stocks », pas « gestion de marchandises ».',
      },
      { id: 'ap-5', label: 'Ma lettre traite les trois exigences principales de l’offre' },
      { id: 'ap-6', label: 'Mes fichiers sont en PDF et nommés correctement' },
      { id: 'ap-7', label: 'L’objet de mon e-mail identifie le poste et mon nom' },
      { id: 'ap-8', label: 'J’ai relu l’ensemble et corrigé les fautes' },
      { id: 'ap-9', label: 'J’ai vérifié que toutes les pièces demandées sont jointes' },
      { id: 'ap-10', label: 'J’ai noté la date d’envoi et prévu une relance à sept jours' },
    ],
  },
  {
    id: 'chk-questions-to-ask',
    title: 'Questions à poser au recruteur',
    intro:
      'Préparez-en trois, posez-en deux. Cochez celles que vous retenez pour cet entretien.',
    items: [
      { id: 'qa-1', label: 'Quelles seraient mes priorités pendant les trois premiers mois ?' },
      { id: 'qa-2', label: 'Comment est organisée l’équipe dans laquelle je travaillerais ?' },
      { id: 'qa-3', label: 'Qu’est-ce qui distingue quelqu’un qui réussit à ce poste ?' },
      { id: 'qa-4', label: 'Quelle est la principale difficulté de ce poste aujourd’hui ?' },
      { id: 'qa-5', label: 'Comment mon travail serait-il évalué ?' },
      { id: 'qa-6', label: 'Une formation est-elle prévue à la prise de poste ?' },
      { id: 'qa-7', label: 'Quelles sont les prochaines étapes du recrutement et sous quel délai ?' },
      {
        id: 'qa-8',
        label: 'Pourquoi ce poste est-il ouvert ?',
        help: 'Création ou remplacement : la réponse en dit long sur l’équipe.',
      },
    ],
  },
];

export const checklistById = new Map(checklists.map((checklist) => [checklist.id, checklist]));
