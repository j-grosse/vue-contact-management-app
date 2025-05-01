// subscription endpoint for push notifications
import webPush from 'web-push';
import { defineEventHandler, readBody } from 'h3';

// Configure web-push with your VAPID keys
const vapidKeys = {
  publicKey: process.env.PUBLIC_VAPID_KEY,
  privateKey: process.env.PRIVATE_VAPID_KEY,
};

if (!vapidKeys.publicKey || !vapidKeys.privateKey) {
  throw new Error(
    'VAPID public and private keys must be defined in environment variables.'
  );
}

webPush.setVapidDetails(
  'mailto:your-email@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// In-memory storage for subscriptions (use a database in production)
const subscriptions: any[] = [];

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // Validate subscription
  if (!body || !body.endpoint) {
    throw createError({ statusCode: 400, message: 'Invalid subscription' });
  }

  // Check if subscription exists
  const exists = subscriptions.some((s) => s.endpoint === body.endpoint);
  if (!exists) {
    subscriptions.push(body);
  }

  return { status: 'ok' };
});
