import type { Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null> | null = null;

// NOTE: loadStripe() injects a <script> into `document` — calling it (or
// even importing @stripe/stripe-js) at module scope would crash the server
// render. This dynamic-imports the package itself, not just the call, so
// nothing Stripe-related ever executes unless something in the browser
// actually invokes getStripe() (see Payment.tsx, from a useEffect).
export function getStripe() {
  if (!stripePromise) {
    stripePromise = import("@stripe/stripe-js").then(({ loadStripe }) =>
      loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY),
    );
  }
  return stripePromise;
}
