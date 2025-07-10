<template>
  <NuxtPwaManifest />
  <div
    class="app-min-width overflow-x-hidden overscroll-x-none overscroll-y-none w-full bg-white dark:bg-gray-900 transition-colors duration-300"
  >
    <NuxtLayout>
      <NuxtPage />
      <SplashScreen v-if="showSplashScreen" @close="closeModal" />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { usePushNotifications } from '~/composables/usePushNotifications';
import SplashScreen from './components/Modals/SplashScreen.vue';

const {
  registerServiceWorker,
  subscribeToPush,
  requestNotificationPermission,
} = usePushNotifications();

const showSplashScreen = ref(false);

const closeModal = () => {
  showSplashScreen.value = false;
};

onMounted(async () => {
  // show splash screen if not shown before
  const splashScreenShown = localStorage.getItem('splashScreenShown');
  if (!splashScreenShown) {
    showSplashScreen.value = true;
  }

  // Check if the service worker is already registered
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
body.modal-open {
  overflow: hidden;
}
/* body {
  @apply bg-white dark:bg-gray-900;
} */
</style>
