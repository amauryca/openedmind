import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from "fs";
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    middlewareMode: false,
    fs: {
      strict: false
    },
    historyApiFallback: {
      index: '/index.html',
      rewrites: [
        { from: /^\/.*$/, to: '/index.html' }
      ]
    }
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    assetsDir: 'assets',
  },
  preview: {
    port: 8080,
    host: "::",
    historyApiFallback: true
  },
}));
