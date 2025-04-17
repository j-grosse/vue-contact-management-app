<template>
  <NuxtPwaManifest />
  <div
    class="min-h-screen min-w-[320px] overflow-hidden max-w-xl mx-auto bg-white dark:bg-gray-900 transition-colors duration-300"
  >
    <NuxtPage />
  </div>
</template>

<script setup>
// Apply Tailwind and other global styles
useHead({
  script: [
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/js/all.min.js',
      defer: true,
    },
  ],
  link: [
    {
      rel: 'stylesheet',
      href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
    },
  ],
});
</script>

<style>
/* Apply global styles */
body {
  @apply bg-white dark:bg-gray-900;
}
</style>
