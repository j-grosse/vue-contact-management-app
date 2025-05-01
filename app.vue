<template>
  <NuxtPwaManifest />
  <div
    class="min-h-screen min-w-[320px] overflow-hidden max-w-3xl mx-auto bg-white dark:bg-gray-900 transition-colors duration-300"
  >
    <NuxtPage />
  </div>
</template>

<script setup>
import { useRuntimeConfig } from 'nuxt/app';
import { onMounted } from 'vue';

onMounted(async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered with scope:', registration.scope);

      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        await subscribeToPush(registration, 3); // Retry up to 3 times
      } else {
        console.warn('Notification permission denied.');
      }
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
});

async function subscribeToPush(registration, retries) {
  try {
    const runtimeConfig = useRuntimeConfig();
    const publicKey = runtimeConfig.public.VAPID_PUBLIC_KEY;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: publicKey,
    });

    console.log('Push subscription:', subscription);

    // Send subscription to server
    await $fetch('/api/subscribe', {
      method: 'POST',
      body: subscription,
    });

    console.log('Subscription sent to server.');
  } catch (error) {
    console.error('Push subscription failed:', error);
    if (retries > 0) {
      console.log(`Retrying push subscription (retries left: ${retries - 1})`);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
      await subscribeToPush(registration, retries - 1);
    } else {
      console.error('Push subscription failed after multiple retries.');
    }
  }
}
</script>

<style>
/* Apply global styles */
/* body {
  @apply bg-white dark:bg-gray-900;
} */
</style>
