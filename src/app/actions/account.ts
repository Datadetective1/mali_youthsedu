'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { LOCALE_COOKIE, isLocale } from '@/lib/i18n/config';
import { getSession, signIn, signOut, signUp, requestMagicLink } from '@/lib/auth';
import {
  createFeedback,
  deleteAccount,
  getPreferences,
  listProgress,
  listUserProjects,
  saveOnboarding,
  savePreferences,
  saveWeeklyPlan,
  startRoadmap,
  updateProfile,
} from '@/lib/db/repository';
import { generateWeeklyPlan } from '@/lib/engine/weekly-plan';
import { checkRateLimit } from '@/lib/rate-limit';
import { startOfIsoWeek } from '@/lib/utils';
import { brand } from '@/config';
import type { OnboardingAnswers } from '@/lib/types';

export type FormState = { status: 'idle' } | { status: 'error'; message: string } | { status: 'ok'; message?: string };

// ---------------------------------------------------------------------------
// Authentication
// ---------------------------------------------------------------------------

const credentialsSchema = z.object({
  email: z.string().trim().email('Adresse e-mail invalide.').max(254),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères.').max(200),
});

const AUTH_ERRORS: Record<string, string> = {
  'invalid-credentials': 'Adresse e-mail ou mot de passe incorrect.',
  'email-taken': 'Un compte existe déjà avec cette adresse.',
  'weak-password': 'Le mot de passe doit contenir au moins 8 caractères.',
  'invalid-email': 'Adresse e-mail invalide.',
  unavailable: 'Cette méthode de connexion n’est pas disponible sur cette installation.',
  unknown: 'La connexion a échoué. Réessayez.',
};

export async function signInAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = credentialsSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0]?.message ?? 'Formulaire invalide.' };
  }

  // Rate limit on the address, not the IP: on a shared connection an IP limit
  // would lock out a whole cybercafé.
  const limit = await checkRateLimit(`signin:${parsed.data.email.toLowerCase()}`, {
    limit: 10,
    windowMs: 10 * 60 * 1000,
  });
  if (!limit.allowed) {
    return {
      status: 'error',
      message: 'Trop de tentatives. Patientez quelques minutes avant de réessayer.',
    };
  }

  const result = await signIn(parsed.data.email, parsed.data.password);
  if (!result.ok) {
    return { status: 'error', message: AUTH_ERRORS[result.code] ?? AUTH_ERRORS.unknown! };
  }

  const next = String(formData.get('suivant') ?? '/tableau-de-bord');
  redirect(safeRedirect(next));
}

export async function signUpAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = credentialsSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0]?.message ?? 'Formulaire invalide.' };
  }

  const displayName = String(formData.get('displayName') ?? '').trim().slice(0, 80);

  const result = await signUp(parsed.data.email, parsed.data.password, displayName);
  if (!result.ok) {
    return { status: 'error', message: AUTH_ERRORS[result.code] ?? AUTH_ERRORS.unknown! };
  }

  const next = String(formData.get('suivant') ?? '/bienvenue');
  redirect(safeRedirect(next));
}

export async function magicLinkAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get('email') ?? '').trim();
  const result = await requestMagicLink(email, `${brand.siteUrl}/tableau-de-bord`);

  // Always the same message, whether or not the address exists — otherwise this
  // form becomes a way to test which addresses have accounts.
  if (!result.ok && result.code === 'unavailable') {
    return {
      status: 'ok',
      message:
        'Si cette adresse correspond à un compte, un lien de connexion vient d’être envoyé.',
    };
  }
  return {
    status: 'ok',
    message: 'Si cette adresse correspond à un compte, un lien de connexion vient d’être envoyé.',
  };
}

export async function signOutAction(): Promise<void> {
  await signOut();
  redirect('/');
}

/** Only same-origin relative paths are accepted as a post-login destination. */
function safeRedirect(target: string): string {
  if (!target.startsWith('/') || target.startsWith('//')) return '/tableau-de-bord';
  return target;
}

// ---------------------------------------------------------------------------
// Onboarding
// ---------------------------------------------------------------------------

/*
 * Onboarding asks six questions; the rest carry defaults.
 *
 * The defaults are the least-assuming option available, not the most common
 * one — `urbain` and `smartphone` do not downgrade anyone's recommendation,
 * whereas guessing `rural` or `telephone-simple` would silently steer someone
 * away from pathways they could do. Everything here is editable from the
 * profile, and the recommendation explains which factors it used.
 */
const onboardingSchema = z.object({
  ageRange: z.enum(['15-17', '18-24', '25-30', '31-35', 'prefer-not']).optional(),
  educationLevel: z
    .enum(['none', 'primaire', 'college', 'lycee', 'technique', 'licence', 'master'])
    .default('lycee'),
  status: z
    .enum([
      'eleve',
      'etudiant',
      'diplome',
      'sans-emploi',
      'emploi-partiel',
      'salarie',
      'independant',
    ])
    .default('diplome'),
  locationType: z.enum(['urbain', 'periurbain', 'rural']).default('urbain'),
  frenchLevel: z.enum(['base', 'courant', 'avance']).default('courant'),
  englishLevel: z.enum(['aucun', 'debutant', 'intermediaire', 'avance']),
  digitalLevel: z.enum(['debutant', 'intermediaire', 'avance']),
  goal: z.enum([
    'trouver-emploi',
    'premier-emploi',
    'changer-metier',
    'travail-distance',
    'freelance',
    'creer-activite',
    'competences',
    'secteur',
  ]),
  interests: z
    .array(
      z.enum([
        'commerce',
        'mines',
        'administration',
        'numerique',
        'langues',
        'entrepreneuriat',
        'finance',
        'logistique',
        'agriculture',
        'communication',
      ]),
    )
    .min(1, 'Choisissez au moins un domaine.')
    .max(3),
  hoursPerWeek: z.coerce.number().int().min(1).max(60),
  connectivity: z.enum(['rare', 'limitee', 'correcte', 'bonne']).default('correcte'),
  device: z
    .enum(['telephone-simple', 'smartphone', 'ordinateur-partage', 'ordinateur'])
    .default('smartphone'),
  experience: z.enum(['aucune', 'scolaire-benevole', 'stage', 'moins-2ans', 'plus-2ans']),
  learningStyle: z.enum(['lecture', 'video', 'pratique', 'groupe']).default('pratique'),
});

export async function saveOnboardingAction(
  answers: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await getSession();
  if (!session) {
    return { ok: false, error: 'Créez un compte pour enregistrer vos réponses.' };
  }

  const parsed = onboardingSchema.safeParse(answers);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Certaines réponses sont manquantes.',
    };
  }

  await saveOnboarding(session.userId, parsed.data as OnboardingAnswers);
  revalidatePath('/recommandation');
  revalidatePath('/tableau-de-bord');
  return { ok: true };
}

/** Accepts the recommendation: starts the path and builds the first week. */
export async function acceptRecommendationAction(
  pathId: string,
  supportingPathId?: string | null,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await getSession();
  if (!session) return { ok: false, error: 'Connectez-vous pour commencer un parcours.' };

  await startRoadmap(session.userId, pathId, true);
  if (supportingPathId && supportingPathId !== pathId) {
    await startRoadmap(session.userId, supportingPathId, false);
  }

  const preferences = await getPreferences(session.userId);
  const [progress, projects] = await Promise.all([
    listProgress(session.userId),
    listUserProjects(session.userId),
  ]);

  await saveWeeklyPlan(
    generateWeeklyPlan({
      userId: session.userId,
      pathId,
      weekStart: startOfIsoWeek(new Date()),
      hoursPerWeek: preferences.hoursPerWeek,
      connectivity: preferences.connectivity,
      learningStyle: preferences.learningStyle,
      completedItemIds: progress.map((entry) => entry.itemId),
      completedProjectIds: projects.filter((p) => p.completedAt).map((p) => p.projectId),
    }),
  );

  revalidatePath('/tableau-de-bord');
  revalidatePath('/mon-parcours');
  revalidatePath('/plan-semaine');
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

const preferencesSchema = z.object({
  displayName: z.string().trim().max(80).optional(),
  hoursPerWeek: z.coerce.number().int().min(1).max(60).optional(),
  connectivity: z.enum(['rare', 'limitee', 'correcte', 'bonne']).optional(),
  locale: z.string().max(5).optional(),
});

export async function savePreferencesAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await getSession();
  if (!session) return { status: 'error', message: 'Connectez-vous pour modifier votre profil.' };

  const parsed = preferencesSchema.safeParse({
    displayName: formData.get('displayName') ?? undefined,
    hoursPerWeek: formData.get('hoursPerWeek') ?? undefined,
    connectivity: formData.get('connectivity') ?? undefined,
    locale: formData.get('locale') ?? undefined,
  });
  if (!parsed.success) {
    return { status: 'error', message: 'Vérifiez les champs indiqués.' };
  }

  if (parsed.data.displayName !== undefined) {
    await updateProfile(session.userId, { displayName: parsed.data.displayName });
  }
  await savePreferences(session.userId, {
    hoursPerWeek: parsed.data.hoursPerWeek,
    connectivity: parsed.data.connectivity,
  });

  if (parsed.data.locale && isLocale(parsed.data.locale)) {
    const store = await cookies();
    store.set(LOCALE_COOKIE, parsed.data.locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });
  }

  revalidatePath('/profil');
  return { status: 'ok', message: 'Vos préférences ont été enregistrées.' };
}

export async function deleteAccountAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await getSession();
  if (!session) return { status: 'error', message: 'Connectez-vous d’abord.' };

  // Typed confirmation: account deletion is irreversible by design, so it must
  // not be reachable by a mis-tap.
  if (String(formData.get('confirmation') ?? '').trim() !== 'SUPPRIMER') {
    return { status: 'error', message: 'Le texte saisi ne correspond pas.' };
  }

  await deleteAccount(session.userId);
  await signOut();
  redirect('/?compte=supprime');
}

// ---------------------------------------------------------------------------
// Feedback
// ---------------------------------------------------------------------------

const feedbackSchema = z.object({
  type: z.enum(['idee', 'probleme', 'contenu', 'accessibilite', 'partenariat', 'autre']),
  message: z.string().trim().min(10, 'Décrivez votre retour en quelques mots.').max(5000),
  email: z.string().trim().max(254).optional(),
});

export async function sendFeedbackAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = feedbackSchema.safeParse({
    type: formData.get('type'),
    message: formData.get('message'),
    email: formData.get('email') || undefined,
  });
  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0]?.message ?? 'Formulaire invalide.' };
  }

  const session = await getSession();
  const limit = await checkRateLimit(`feedback:${session?.userId ?? 'anon'}`, {
    limit: 5,
    windowMs: 60 * 60 * 1000,
  });
  if (!limit.allowed) {
    return { status: 'error', message: 'Trop de messages envoyés. Réessayez plus tard.' };
  }

  const email = parsed.data.email && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(parsed.data.email)
    ? parsed.data.email
    : null;

  await createFeedback(parsed.data.type, parsed.data.message, email);
  return { status: 'ok', message: 'Merci. Votre message a bien été enregistré.' };
}
