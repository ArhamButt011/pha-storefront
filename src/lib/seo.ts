// Small helpers shared by every SSR route's `meta`/loader for building
// absolute URLs and safely embedding JSON-LD.

// NOTE: nginx sits in front of the Node server and terminates TLS, so the
// Node process only ever sees plain HTTP requests — `request.url`'s own
// protocol can't be trusted for building canonical/OG URLs. nginx.conf sets
// X-Forwarded-Proto/X-Forwarded-Host; this falls back to "https" (this
// storefront has no legitimate http-only deployment) if they're ever absent.
export function getOrigin(request: Request): string {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "";
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  return `${proto}://${host}`;
}

// JSON.stringify already escapes quotes/control characters correctly; the
// one thing it won't do is stop a merchant-supplied string containing a
// literal "</script>" from closing the <script> tag it's embedded in early.
// Escaping every `<` neutralizes that (and any other tag) without touching
// the JSON's validity.
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}

// schema.org/Offer.availability only ever needs to be one of these two
// values per this migration's spec — mapped straight from the backend's own
// stock_status so it can never drift from what the Merchant Center feed
// already reports for the same product.
export function mapAvailability(stockStatus: string): "InStock" | "OutOfStock" {
  return stockStatus === "out_of_stock" ? "OutOfStock" : "InStock";
}

// Best-effort mapping of the backend's free-text `condition` to a
// schema.org/ItemCondition value. Defaults to NewCondition, matching the
// product API's own default ("New") for items with no explicit condition.
export function mapItemCondition(condition: string | null | undefined): string {
  const normalized = (condition ?? "").toLowerCase();
  if (normalized.includes("refurb")) return "RefurbishedCondition";
  if (normalized.includes("used")) return "UsedCondition";
  if (normalized.includes("damage")) return "DamagedCondition";
  return "NewCondition";
}
