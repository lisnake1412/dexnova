import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react-swc'
import react from '@vitejs/plugin-react' //removed swc

import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths()
  ],
  base: "/#/swap",
  define: {
    'process.env': {},
    'global': "globalThis",
  },
  resolve: {
    alias: {
      "@apollo/client": "@apollo/client/apollo-client.min.cjs",
      buffer: "rollup-plugin-node-polyfills/polyfills/buffer-es6"
    },
  },
  build: {
    target: "es2020"
  }
})
