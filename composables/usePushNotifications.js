import { useRuntimeConfig } from 'nuxt/app';
import { onMounted } from 'vue';

export function usePushNotifications() {
  async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log(
          'Service Worker registered with scope:',
          registration.scope
        );
        return registration;
      } catch (error) {
        console.error('Service Worker registration failed:', error);
        return null;
      }
    }
    return null;
  }

  async function subscribeToPush(registration, retries = 3) {
    try {
      const runtimeConfig = useRuntimeConfig();
      const publicKey = runtimeConfig.public.VAPID_PUBLIC_KEY;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicKey,
      });

      console.log('Push subscription:', subscription);

      // Send subscription to server
      const response = await $fetch('/api/subscribe', {
        method: 'POST',
        body: subscription,
      });

      console.log('Subscription sent to server.');
    } catch (error) {
      console.error('Push subscription failed:', error);
      if (retries > 0) {
        console.log(
          `Retrying push subscription (retries left: ${retries - 1})`
        );
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
        await subscribeToPush(registration, retries - 1);
      } else {
        console.error('Push subscription failed after multiple retries.');
      }
    }
  }

  async function requestNotificationPermission() {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      return true;
    } else {
      console.warn('Notification permission denied.');
      return false;
    }
  }

  return {
    registerServiceWorker,
    subscribeToPush,
    requestNotificationPermission,
  };
}
