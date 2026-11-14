import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
  react(),
  VitePWA({
    registerType: 'prompt',
    includeAssets: ['favicon.svg'],
    manifest: {
      name: 'Easy-Count',
      short_name: 'E-Count',
      description: 'Count anything on the go with single, multi and limit counters. Works offline and syncs your reports when you are back online.',     // одно предложение от тебя
      start_url: '/',
      scope: '/',
      display: 'standalone',
      orientation: 'portrait',
      theme_color: '#0A0F2C',
      background_color: '#0A0F2C',
      lang: 'en',
      categories: ['productivity', 'utilities'],
      icons: [],
    },
  }),
],
})