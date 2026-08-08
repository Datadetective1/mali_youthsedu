import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env.E2E_PORT ?? 3100);
const BASE_URL = process.env.E2E_BASE_URL ?? `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  timeout: 60_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    locale: 'fr-FR',
    timezoneId: 'Africa/Bamako',
  },

  projects: [
    {
      // Creates the accounts once and stores their signed-in state, so tests
      // never have to sign in repeatedly and trip the app's own rate limit.
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },
    {
      // Primary target: a modest Android phone. Desktop is the secondary case.
      name: 'mobile',
      use: { ...devices['Pixel 5'] },
      dependencies: ['setup'],
      // `desktop.spec.ts` asserts wide-viewport layout; it is meaningless here.
      testIgnore: [/auth\.setup\.ts/, /desktop\.spec\.ts/],
    },
    {
      /*
       * Desktop verifies that layouts hold at a wide viewport. It deliberately
       * does NOT re-run the stateful journey: both projects share one set of
       * accounts and one database, so running the mutating flows twice means
       * the second run operates on state the first already changed — which
       * produces failures that say nothing about the product.
       *
       * Mobile is the primary target and runs everything.
       */
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
      dependencies: ['setup'],
      testMatch: [/guest\.spec\.ts/, /desktop\.spec\.ts/],
    },
  ],

  webServer: {
    command: `npm run build && npm run start -- --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
    env: {
      NODE_ENV: 'production',
      DATA_DRIVER: 'local',
      LOCAL_DATA_DIR: '.data/e2e',
      AI_PROVIDER: 'mock',
      AUTH_SECRET: 'e2e-only-secret-not-for-production-use-0123456789',
      ADMIN_EMAILS: 'admin@example.org',
      NEXT_PUBLIC_ANALYTICS_PROVIDER: 'none',
    },
  },
});
