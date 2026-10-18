import type { DiscountQuoteState } from "@/types/checkout";

/** Summary line for a ready quote with a saving, null otherwise. */
export function quotedDiscountLine(state: DiscountQuoteState) {
  if (state.status !== "ready" || !state.quote.discount || state.quote.amount <= 0) return null;
  const { discount, amount } = state.quote;
  return { label: discount.code ? `Promo (${discount.code})` : discount.name, amount: amount / 100 };
}
