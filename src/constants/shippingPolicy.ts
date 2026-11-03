import { PICKUP_LOCATION } from "@/constants/checkout";

export const SHIPPING_POLICY_POINTS = [
  "We deliver Australia-wide to both residential and business addresses.",
  "Orders ship from our Melbourne and Sydney hubs, with most dispatched within 1 business day.",
  "Shipping costs are calculated at checkout based on your delivery postcode and the items in your order.",
  "Once dispatched, you'll receive SMS and email tracking updates. Most orders arrive within 2–3 business days.",
  `Prefer to collect? Choose Pick Up at checkout and collect from ${PICKUP_LOCATION.address}. We'll email you once your order is ready, usually within 1 business day.`,
  "Some items are marked as in-store pickup only and can't be shipped.",
] as const;
