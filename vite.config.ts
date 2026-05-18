import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true
      },
      manifest: {
        name: "Mobile Web View",
        short_name: "Web View",
        description: "Phone-friendly viewer for AI-generated Markdown and HTML artifacts.",
        display: "standalone",
        theme_color: "#f3efe5",
        background_color: "#f6f1e7",
        start_url: "/",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png}"],
        navigateFallbackDenylist: [/^\/api\//, /^\/content\//]
      }
    })
  ],
  build: {
    outDir: "dist/client"
  },
  server: {
    host: "0.0.0.0"
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    globals: true
  }
});
