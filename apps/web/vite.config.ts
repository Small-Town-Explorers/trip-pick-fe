import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: [
      {
        find: '@assets',
        replacement: fileURLToPath(new URL('../../packages/app/assets', import.meta.url)),
      },
      {
        find: '@icons',
        replacement: fileURLToPath(new URL('../../packages/app/assets/icons', import.meta.url)),
      },
      {
        find: '@styles',
        replacement: fileURLToPath(new URL('../../packages/app/src/styles', import.meta.url)),
      },
      {
        find: '@components',
        replacement: fileURLToPath(new URL('../../packages/app/src/components', import.meta.url)),
      },
      { find: /^react-native$/, replacement: 'react-native-web' },
    ],
  },
});
