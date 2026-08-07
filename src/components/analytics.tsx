import Script from 'next/script';
import { analyticsConfig } from '@/config';

/**
 * Privacy-conscious analytics.
 *
 * Disabled by default. When enabled it loads a single self-hostable,
 * cookie-free script (Plausible-compatible) that records page views without an
 * identifier. No product code calls a tracking function, so there is no path by
 * which a user's answers, CV or analyses could reach an analytics provider.
 *
 * Everything the team actually needs to steer the product is counted
 * server-side in `metric_counters` as aggregates — see docs/PRIVACY.md.
 */
export function Analytics() {
  if (analyticsConfig.provider !== 'plausible') return null;
  if (!analyticsConfig.domain || !analyticsConfig.scriptUrl) return null;

  return (
    <Script
      defer
      data-domain={analyticsConfig.domain}
      src={analyticsConfig.scriptUrl}
      strategy="afterInteractive"
    />
  );
}
