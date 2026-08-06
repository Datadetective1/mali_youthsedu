import type { PartialDictionary } from '../types';

/**
 * English — partial on purpose.
 *
 * The MVP ships in French. This dictionary exists so the fallback machinery is
 * exercised by real data (and by tests) rather than being retrofitted later.
 * Anything absent here resolves to the French string.
 */
export const en: PartialDictionary = {
  actions: {
    start: 'Start',
    continue: 'Continue',
    back: 'Back',
    next: 'Next',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    retry: 'Retry',
    search: 'Search',
    loading: 'Loading…',
  },
  nav: {
    home: 'Home',
    myPath: 'My path',
    weeklyPlan: 'Weekly plan',
    skills: 'Skills',
    jobPrep: 'Job readiness',
    projects: 'Practical projects',
    resources: 'Resources',
    profile: 'My profile',
    dashboard: 'Dashboard',
    signIn: 'Sign in',
    signUp: 'Create account',
    signOut: 'Sign out',
    explore: 'Explore pathways',
    about: 'Our mission',
  },
  offline: {
    badgeOnline: 'Online',
    badgeOffline: 'Offline',
    banner: 'You are offline. Saved content is still available.',
    saveForOffline: 'Save for offline',
    savedForOffline: 'Saved for offline',
  },
  landing: {
    heroTitle: 'Talent is universal. Opportunity is not.',
    heroPrimaryCta: 'Find my path',
    heroSecondaryCta: 'Explore pathways',
  },
};
