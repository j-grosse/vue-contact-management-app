<template>
  <NuxtPwaManifest />
  <div
    class="min-h-screen min-w-[320px] overflow-hidden max-w-3xl mx-auto bg-white dark:bg-gray-900 transition-colors duration-300"
  >
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { usePushNotifications } from '~/composables/usePushNotifications';

const {
  registerServiceWorker,
  subscribeToPush,
  requestNotificationPermission,
} = usePushNotifications();

onMounted(async () => {
  const registration = await registerServiceWorker();
  if (registration) {
    const permissionGranted = await requestNotificationPermission();
    if (permissionGranted) {
      await subscribeToPush(registration);
    }
  }
});
</script>

<style>
/* Apply global styles */
/* body {
  @apply bg-white dark:bg-gray-900;
} */
</style>
