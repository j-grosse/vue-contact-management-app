import webPush from 'web-push';
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { title, message } = body;

  // Get all subscriptions (replace with DB query in production)
  const subscriptions = [
    // Replace this with your actual subscription retrieval logic
    {
      endpoint: 'YOUR_SUBSCRIPTION_ENDPOINT',
      keys: {
        p256dh: 'YOUR_SUBSCRIPTION_P256DH',
        auth: 'YOUR_SUBSCRIPTION_AUTH',
      },
    },
  ]; // Get from your storage

  // Send notifications to all subscribers
  const results = await Promise.allSettled(
    subscriptions.map((subscription) =>
      webPush
        .sendNotification(
          subscription,
          JSON.stringify({
            title,
            body: message,
            icon: '/pwa-icon-512x512.png',
          })
        )
        .catch((error) => {
          console.error('Error sending notification', error);
          return error;
        })
    )
  );

  return {
    sent: results.filter((r) => r.status === 'fulfilled').length,
    failed: results.filter((r) => r.status === 'rejected').length,
  };
});
