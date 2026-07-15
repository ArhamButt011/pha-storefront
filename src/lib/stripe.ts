import { loadStripe } from "@stripe/stripe-js";

// Loaded once, outside the component tree — re-calling loadStripe on every
// render would re-fetch/re-init the Stripe.js script each time.
export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
