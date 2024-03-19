import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import {resolve} from "path";

const root = resolve(__dirname, 'src');
const outDir = resolve(__dirname, 'dist')
// https://vitejs.dev/config/
export default defineConfig({
  root,
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        register: resolve(root,'register', 'index.html'),
        login: resolve(root,'login', 'index.html'),
        dashboard: resolve(root,'dashboard', 'index.html'),
        snaps: resolve(root,'snaps', 'index.html'),
        users: resolve(root,'users', 'index.html'),
        services: resolve(root,'services', 'index.html')
      }
    },

    // Output directory for the production build
    outDir,
 
    // Adjust this value if you see warnings about large chunks
    chunkSizeWarningLimit: 2000,
  },
});
