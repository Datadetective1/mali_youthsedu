import coreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

/**
 * Flat config.
 *
 * `eslint-config-next` v16 exports flat-config arrays directly, so they are
 * spread in as-is. Routing them through `FlatCompat` instead throws
 * "Converting circular structure to JSON" — the compat layer cannot serialise
 * the already-flat plugin objects.
 */
const config = [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      '.data/**',
      'public/sw.js',
      'next-env.d.ts',
    ],
  },

  ...coreWebVitals,
  ...nextTypescript,

  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      // French copy is full of apostrophes and quotation marks; escaping them
      // as entities would make the dictionaries unreadable for a translator.
      'react/no-unescaped-entities': 'off',
    },
  },

  {
    // Tests and scripts run in Node and legitimately use console output.
    files: ['**/*.test.ts', '**/*.test.tsx', 'scripts/**/*.ts', 'e2e/**/*.ts'],
    rules: {
      'no-console': 'off',
    },
  },
];

export default config;
