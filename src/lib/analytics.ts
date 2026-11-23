import type { ApiOrder } from "@/lib/api/orders";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

const TRACKED_KEY_PREFIX = "pha-purchase-tracked:";

const centsToAmount = (cents: number) => Number((cents / 100).toFixed(2));

/** Order total in dollars as a URL-safe string, e.g. "105.40". */
export function formatTransactionValue(totalCents: number) {
  return (totalCents / 100).toFixed(2);
}

function alreadyTracked(orderId: string) {
  try {
    return localStorage.getItem(TRACKED_KEY_PREFIX + orderId) !== null;
  } catch {
    return false;
  }
}

function markTracked(orderId: string) {
  try {
    localStorage.setItem(TRACKED_KEY_PREFIX + orderId, "1");
  } catch {
    // Storage blocked: GA4 still dedupes on transaction_id.
  }
}

/** GA4 purchase event for GTM, once per paid order even across refreshes. */
export function trackPurchase(order: ApiOrder) {
  if (typeof window === "undefined" || alreadyTracked(order._id)) return;

  window.dataLayer = window.dataLayer || [];
  // GTM ecommerce convention: clear the previous ecommerce object first.
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({
    event: "purchase",
    ecommerce: {
      transaction_id: order.order_number,
      value: centsToAmount(order.total),
      tax: centsToAmount(order.tax_amount),
      shipping: centsToAmount(order.shipping_cost),
      currency: order.currency.toUpperCase(),
      items: order.items.map((item) => ({
        item_id: item.sku || item.product,
        item_name: item.name,
        price: centsToAmount(item.unit_price),
        quantity: item.quantity,
      })),
    },
  });
  markTracked(order._id);
}
