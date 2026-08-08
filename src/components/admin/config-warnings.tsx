import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { productionConfigIssues, dataConfig, aiConfig, isProduction } from '@/config';
import { Notice } from '@/components/ui';

/**
 * Surfaces configuration problems to whoever operates the deployment.
 *
 * `productionConfigIssues()` knows what a misconfigured production install
 * looks like — a development data driver, a mock AI provider, a missing admin
 * allowlist — but knowing is useless unless someone is told. This is where
 * they are told: the first screen an administrator sees.
 *
 * Deliberately not a hard failure. Refusing to boot would take the whole site
 * down over something like an empty ADMIN_EMAILS, which is worse than serving
 * the site with a loud warning to the one person who can fix it.
 */
export function ConfigWarnings() {
  const issues = productionConfigIssues();

  if (issues.length === 0) {
    return (
      <Notice tone="success" className="mb-6">
        <p className="flex items-center gap-2 font-semibold">
          <ShieldCheck aria-hidden className="size-4" />
          Configuration conforme
        </p>
        <p className="mt-1">
          Driver de données : <strong>{dataConfig.driver}</strong> · Fournisseur IA :{' '}
          <strong>{aiConfig.provider}</strong>
          {isProduction ? ' · Mode production' : ' · Mode développement'}
        </p>
      </Notice>
    );
  }

  return (
    <Notice tone="danger" className="mb-6" title="Problèmes de configuration détectés">
      <p className="mb-2">
        Cette installation n’est pas prête pour un usage réel. Corrigez les points suivants dans
        vos variables d’environnement :
      </p>
      <ul className="list-disc space-y-1 pl-5">
        {issues.map((issue) => (
          <li key={issue} className="flex items-start gap-2">
            <AlertTriangle aria-hidden className="mt-0.5 size-4 shrink-0" />
            <span>{issue}</span>
          </li>
        ))}
      </ul>
    </Notice>
  );
}
