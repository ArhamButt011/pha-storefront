import { SHIPPING_METHOD } from "@/constants/shipping";
import type { CartItem } from "@/store/cartSlice";

export const isCalculatedShipping = (item: CartItem) => item.shippingMethod === SHIPPING_METHOD.CALCULATED;

export const hasCalculatedShipping = (items: CartItem[]) => items.some(isCalculatedShipping);

/** Flat-rate shipping in dollars; calculated lines are quoted at checkout. */
export const flatShippingTotal = (items: CartItem[]) =>
  items.reduce((sum, item) => (isCalculatedShipping(item) ? sum : sum + (item.shippingCost ?? 0) * item.quantity), 0);
