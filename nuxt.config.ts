// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@vite-pwa/nuxt'],
  // workbox, manifest devOptions **must** be set. registerType might be able to also be autoUpdate, but haven't tried it
  pwa: {
    registerType: 'prompt',

    manifest: {
      name: 'pwa-test',
      short_name: 'pwa-test',
      description: 'just a test',
      theme_color: '#ffffff',
    },

    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
    },

    devOptions: {
      enabled: false,
      suppressWarnings: true,
      navigateFallback: '/',
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module',
    },
  },

  // In addition, you *must* have this Nitro option set to pre-render the homepage, even if you have SSR turned off:

  nitro: {
    prerender: {
      routes: ['/'],
    },
  },
});
