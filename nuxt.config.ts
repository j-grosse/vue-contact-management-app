// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@vite-pwa/nuxt'],
  // workbox, manifest devOptions **must** be set. registerType might be able to also be autoUpdate, but haven't tried it
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'FriendCare PWA',
      short_name: 'FriendCare',
      description: 'A Nuxt 3 Contact Management PWA',
      theme_color: '#4A90E2',
      icons: [
        {
          src: '/pwa-icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/pwa-icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
      screenshots: [
        {
          src: 'pwa-screenshot.jpg',
          sizes: '640x480',
          type: 'image/jpg',
          form_factor: 'wide',
          label: 'Wonder Widgets',
        },
        {
          src: 'pwa-screenshot.jpg',
          sizes: '640x480',
          type: 'image/jpg',
          label: 'Wonder Widgets',
        },
      ],
    },
    workbox: {
      // runtimeCaching: [
      //   {
      //     urlPattern: 'https://friendcare.netlify.app/.*',
      //     handler: 'NetworkFirst',
      //     options: {
      //       cacheName: 'api-cache',
      //       expiration: {
      //         maxEntries: 50,
      //         maxAgeSeconds: 86400,
      //       },
      //     },
      //   },
      // ],
    },
  },
});
