import type { ShippingMethod } from "@/types/apiProduct";

export const SHIPPING_METHOD = {
  STANDARD: "standard",
  CALCULATED: "calculated",
  PICKUP: "pickup",
} as const satisfies Record<string, ShippingMethod>;

// Waits for typing to settle before asking the courier API for a price.
export const SHIPPING_QUOTE_DEBOUNCE_MS = 600;

export const AU_POSTCODE_PATTERN = /^\d{4}$/;

export const CALCULATED_SHIPPING_LABEL = "Calculated at checkout";

export const PICKUP_ONLY_LABEL = "In store pickup only";
