// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: false, // Disable ssr since we're using localStorage
  modules: ['@nuxtjs/tailwindcss', '@vite-pwa/nuxt', '@pinia/nuxt'],
  runtimeConfig: {
    public: {
      VAPID_PUBLIC_KEY: process.env.PUBLIC_VAPID_KEY,
    },
  },
  app: {
    head: {
      title: 'FriendCare',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },
  css: ['@fortawesome/fontawesome-svg-core/styles.css'],
  plugins: ['./plugins/fontawesome.js'],
  build: {
    transpile: [
      '@fortawesome/fontawesome-svg-core',
      '@fortawesome/free-solid-svg-icons',
      '@fortawesome/vue-fontawesome',
    ],
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => ['font-awesome-icon'].includes(tag),
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

  pwa: {
    registerType: 'prompt',

    manifest: {
      name: 'FriendCare PWA',
      short_name: 'FriendCare',
      description: 'A Nuxt 3 Contact Management PWA',
      theme_color: '#111827',
      id: '/?homescreen=1',
      start_url: '/?homescreen=1',
      display: 'standalone',
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
      globPatterns: ['**/*.{html,js,css,ico,png,jpg,jpeg,svg}'], // Include all necessary files
      cleanupOutdatedCaches: true,
      clientsClaim: true,
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
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallback: '/',
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module',
    },
  },
  // you *must* have this Nitro option set to pre-render the homepage, even if you have SSR turned off:
  nitro: {
    prerender: {
      routes: ['/'],
    },
  },
});
