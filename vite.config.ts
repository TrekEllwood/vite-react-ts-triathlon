/// <reference types="node" />
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        lang: "en-us",
        name: "Triathlon Event App",
        short_name: "Triathlon Event",
        description: "A triathlon event application that allows race and participant entries",
        start_url: "/",
        background_color: "#1e2939",
        theme_color: "#1e2939",
        orientation: "any",
        display: "standalone",
        icons: [
          {
            src: "icons/icon192.png",
            type: "image/png",
            sizes: "192x192"
          },
          {
            src: "icons/icon512.png",
            type: "image/png",
            sizes: "512x512"
          }
        ]
      }
    }),
    tailwindcss(),
    react()
  ],
    resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
