const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['.expo/**', 'coverage/**'],
  },
  {
    files: ['src/features/*/domain/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            '@nozbe/*',
            '@tanstack/*',
            '@/platform/*',
            'axios',
            'expo*',
            'react',
            'react-native',
            'zustand',
          ],
        },
      ],
    },
  },
]);
