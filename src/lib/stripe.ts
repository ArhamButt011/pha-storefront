import { loadStripe } from "@stripe/stripe-js";

// BYOK — this store's own Stripe publishable key comes back from the
// create-intent response (see stripe.payment.service.js on the backend)
// rather than a build-time env var, so it can never drift out of sync with
// whatever key was actually saved in the dashboard's Settings → Payment
// Account. Cached per key so re-renders don't re-init the Stripe.js script.
const stripeInstances = new Map<string, ReturnType<typeof loadStripe>>();

export function getStripe(publishableKey: string) {
  if (!stripeInstances.has(publishableKey)) {
    stripeInstances.set(publishableKey, loadStripe(publishableKey));
  }
  return stripeInstances.get(publishableKey)!;
}
