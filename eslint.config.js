const { defineConfig, globalIgnores } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier/flat');

module.exports = defineConfig([
  globalIgnores([
    '**/node_modules/**',
    '**/dist/**',
    '**/.expo/**',
    '**/coverage/**',
    '**/expo-env.d.ts',
  ]),
  expoConfig,
  prettierConfig,
  {
    settings: {
      'import/resolver': {
        typescript: {
          project: [
            './packages/app/tsconfig.json',
            './apps/web/tsconfig.app.json',
            './apps/mobile/tsconfig.json',
          ],
        },
      },
    },
    rules: {
      'import/no-unresolved': [
        'error',
        {
          // Vite가 처리하는 웹 SVG 컴포넌트 import
          ignore: ['\\.svg\\?react$', '\\.png'],
        },
      ],
    },
  },
]);
