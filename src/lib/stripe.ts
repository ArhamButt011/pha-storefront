import type { Stripe } from "@stripe/stripe-js";

// BYOK — this store's own Stripe publishable key comes back from the
// create-intent response (see stripe.payment.service.js on the backend)
// rather than a build-time env var, so it can never drift out of sync with
// whatever key was actually saved in the dashboard's Settings → Payment
// Account. Cached per key so re-renders don't re-init the Stripe.js script.
//
// Dynamic-imports @stripe/stripe-js itself (not just the loadStripe() call)
// rather than a static top-level import — loadStripe() injects a <script>
// into `document`, so nothing Stripe-related may ever execute during SSR.
// This is only ever called client-side, once the publishable key comes back
// from createPaymentIntent (see Payment.tsx), so that's already guaranteed
// in practice, but the dynamic import means even importing this module is
// harmless if it's ever pulled into a server-rendered code path.
const stripeInstances = new Map<string, Promise<Stripe | null>>();

export function getStripe(publishableKey: string) {
  if (!stripeInstances.has(publishableKey)) {
    stripeInstances.set(
      publishableKey,
      import("@stripe/stripe-js").then(({ loadStripe }) => loadStripe(publishableKey)),
    );
  }
  return stripeInstances.get(publishableKey)!;
}
