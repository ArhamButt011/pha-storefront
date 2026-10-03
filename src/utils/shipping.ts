import { SHIPPING_METHOD } from "@/constants/shipping";
import type { CartItem } from "@/store/cartSlice";

export const isCalculatedShipping = (item: CartItem) => item.shippingMethod === SHIPPING_METHOD.CALCULATED;

export const hasCalculatedShipping = (items: CartItem[]) => items.some(isCalculatedShipping);

export const isPickupOnly = (item: CartItem) => item.shippingMethod === SHIPPING_METHOD.PICKUP;

export const hasPickupOnly = (items: CartItem[]) => items.some(isPickupOnly);

/** Flat-rate shipping in dollars; calculated is quoted, pickup is free. */
export const flatShippingTotal = (items: CartItem[]) =>
  items.reduce(
    (sum, item) => (isCalculatedShipping(item) || isPickupOnly(item) ? sum : sum + (item.shippingCost ?? 0) * item.quantity),
    0,
  );
