import { common } from './common';
import { marketing } from './marketing';
import { account } from './account';
import { learn } from './learn';
import { jobs } from './jobs';
import { site } from './site';

/**
 * The French dictionary is the reference: it is complete by definition, and
 * every other locale falls back to it key by key.
 */
export const fr = {
  ...common,
  ...marketing,
  ...account,
  ...learn,
  ...jobs,
  ...site,
};

export type Dictionary = typeof fr;
