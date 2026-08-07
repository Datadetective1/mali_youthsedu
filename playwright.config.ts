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
      testIgnore: /auth\.setup\.ts/,
    },
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
      dependencies: ['setup'],
      testIgnore: /auth\.setup\.ts/,
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
