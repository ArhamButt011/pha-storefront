export const SHIPPING_COST = 145;
export const GST_RATE = 0.1;
export const MEMBER_SHIPPING_SAVINGS = 85;

// Product prices are GST-inclusive (AU retail) — GST component = price / 11,
// never added on top. Used by CheckoutOrderSummary; GST_RATE above is still
// used by the cart page's OrderSummary (pre-existing, out of scope here).
export const GST_DIVISOR = 11;
