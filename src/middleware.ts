import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { dataConfig, isProduction, supabaseConfig } from '@/config';

/**
 * Middleware: Content Security Policy and Supabase session refresh.
 *
 * The CSP is nonce-based in production. In development it is deliberately
 * relaxed, because Turbopack's HMR client uses eval and inline scripts, and a
 * policy that only holds in development is worth nothing.
 */

function buildCsp(nonce: string): string {
  const supabaseOrigin = supabaseConfig.url ? new URL(supabaseConfig.url).origin : '';
  const supabaseWs = supabaseOrigin ? supabaseOrigin.replace(/^http/, 'ws') : '';

  const directives: Record<string, string[]> = {
    'default-src': ["'self'"],
    // `strict-dynamic` lets Next's own bootstrap load its chunks without
    // enumerating every hashed filename.
    'script-src': [
      "'self'",
      `'nonce-${nonce}'`,
      "'strict-dynamic'",
      ...(isProduction ? [] : ["'unsafe-eval'", "'unsafe-inline'"]),
    ],
    // Tailwind injects a stylesheet; React inlines style attributes.
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'blob:'],
    'font-src': ["'self'", 'data:'],
    'connect-src': ["'self'", supabaseOrigin, supabaseWs].filter(Boolean),
    'frame-ancestors': ["'none'"],
    'form-action': ["'self'"],
    'base-uri': ["'self'"],
    'object-src': ["'none'"],
    'worker-src': ["'self'"],
    'manifest-src': ["'self'"],
  };

  if (isProduction) directives['upgrade-insecure-requests'] = [];

  return Object.entries(directives)
    .map(([directive, values]) => (values.length ? `${directive} ${values.join(' ')}` : directive))
    .join('; ');
}

export async function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

  let response = NextResponse.next({ request: { headers: requestHeaders } });

  // Supabase refreshes its session by rewriting cookies; that has to happen in
  // middleware, because Server Components cannot set cookies.
  if (dataConfig.driver === 'supabase' && supabaseConfig.url && supabaseConfig.anonKey) {
    const client = createServerClient(supabaseConfig.url, supabaseConfig.anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request: { headers: requestHeaders } });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    });
    await client.auth.getUser();
  }

  response.headers.set('Content-Security-Policy', buildCsp(nonce));
  response.headers.set('x-nonce', nonce);
  return response;
}

export const config = {
  matcher: [
    /*
     * Everything except static assets and the service worker, which must not
     * receive a CSP that could block it from controlling the page.
     */
    {
      source: '/((?!_next/static|_next/image|favicon.ico|sw.js|icons/).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
