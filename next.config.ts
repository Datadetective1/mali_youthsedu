import type { NextConfig } from 'next';

/**
 * Security headers applied to every response.
 * The Content-Security-Policy itself is generated per-request in `src/middleware.ts`
 * so it can carry a nonce; everything static lives here.
 */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Keep the client bundle small: these packages are tree-shaken per-import.
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // Fail the production build on type errors rather than shipping them.
  // Linting is a separate gate (`npm run lint`) — Next 16 no longer runs it
  // during `next build`.
  typescript: { ignoreBuildErrors: false },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        // The service worker must never be cached by intermediaries, or users
        // get stuck on a stale offline shell.
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
      {
        source: '/manifest.webmanifest',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=3600' }],
      },
    ];
  },
};

export default nextConfig;
