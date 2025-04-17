// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: false, // Disable ssr since we're using localStorage
  modules: ['@nuxtjs/tailwindcss', '@vite-pwa/nuxt', '@pinia/nuxt'],
  app: {
    head: {
      title: 'FriendCare',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },
  tailwindcss: {
    config: {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            primary: 'slateblue',
          },
        },
      },
    },
  },

  // vite-pwa: workbox, manifest devOptions **must** be set.
  // registerType might be able to also be autoUpdate, but haven't tried it
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'FriendCare PWA',
      short_name: 'FriendCare',
      description: 'A Nuxt 3 Contact Management PWA',
      theme_color: 'slateblue',
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
