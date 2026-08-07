import type { Metadata, Viewport } from 'next';
import './globals.css';
import { brand } from '@/config';
import { getDictionary, getLocale, localeMeta } from '@/lib/i18n';
import { ServiceWorkerRegistrar } from '@/components/offline/service-worker-registrar';
import { OfflineBanner } from '@/components/offline/offline-banner';
import { Analytics } from '@/components/analytics';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return {
    metadataBase: new URL(brand.siteUrl),
    title: {
      default: `${brand.name} — ${t.landing.metaTitle}`,
      template: `%s — ${brand.name}`,
    },
    description: t.landing.metaDescription,
    applicationName: brand.name,
    manifest: '/manifest.webmanifest',
    appleWebApp: {
      capable: true,
      title: brand.shortName,
      statusBarStyle: 'default',
    },
    formatDetection: { telephone: false },
    openGraph: {
      type: 'website',
      locale: 'fr_ML',
      siteName: brand.name,
      title: `${brand.name} — ${t.landing.metaTitle}`,
      description: t.landing.metaDescription,
    },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Zoom is never disabled: pinch-to-zoom is an accessibility feature, and
  // people read this on small screens in bright sunlight.
  maximumScale: 5,
  themeColor: '#124d3e',
  colorScheme: 'light',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const t = await getDictionary();

  return (
    <html lang={localeMeta[locale].htmlLang}>
      <body className="min-h-dvh antialiased">
        <a href="#contenu" className="skip-link">
          {t.a11y.skipToContent}
        </a>

        <OfflineBanner
          offlineLabel={t.offline.banner}
          onlineLabel={t.offline.bannerBack}
          syncingLabel={t.offline.syncing}
        />

        {children}

        <ServiceWorkerRegistrar />
        <Analytics />
      </body>
    </html>
  );
}
