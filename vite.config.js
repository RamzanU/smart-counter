import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  server: { port: 5180, strictPort: true },
  preview: { port: 4180, strictPort: true },
  plugins: [
  react(),
  VitePWA({
  registerType: 'prompt',
  includeAssets: ['favicon.svg', 'favicon.ico', 'apple-touch-icon-180x180.png'], // NEW: два файла
  manifest: {
    id: '/',                                                                      // NEW
    name: 'Easy-Count',
    short_name: 'E-Count',
    description: 'Count anything on the go with single, multi and limit counters. Works offline and syncs your reports when you are back online.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    theme_color: '#0A0F2C',
    background_color: '#0A0F2C',
    lang: 'en',
    categories: ['productivity', 'utilities'],
    icons: [                                                                      // NEW: весь массив
      { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
      { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
      { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  },
}),
],
})