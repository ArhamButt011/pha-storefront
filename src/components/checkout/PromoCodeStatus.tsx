import { CheckCircle2, HeartHandshake, Loader2, Sparkles, XCircle } from "lucide-react";
import { formatCurrency } from "@/utils/currency";
import type { DiscountQuoteState } from "@/types/checkout";

interface PromoCodeStatusProps {
  // What the shopper typed, blank means automatic discounts only.
  value: string;
  quote: DiscountQuoteState;
}

/** One line under the promo field: checking, applied, welcome back or why not. */
export function PromoCodeStatus({ value, quote }: PromoCodeStatusProps) {
  if (quote.status === "loading") {
    return (
      <span className="flex items-center gap-1.5 text-fg-muted">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Checking…
      </span>
    );
  }
  if (quote.status === "error") {
    return (
      <span className="flex items-center gap-1.5 text-danger">
        <XCircle className="h-3.5 w-3.5" />
        {quote.message}
      </span>
    );
  }
  if (quote.status !== "ready" || !quote.quote.discount) return null;
  const { discount, amount } = quote.quote;
  const saving = formatCurrency(amount / 100);
  if ((discount.min_order_number ?? 1) >= 2) {
    return (
      <span className="flex items-center gap-1.5 text-ok">
        <HeartHandshake className="h-3.5 w-3.5" />
        Welcome back! {discount.name}: −{saving}
      </span>
    );
  }
  if (discount.is_automatic || !value.trim()) {
    return (
      <span className="flex items-center gap-1.5 text-ok">
        <Sparkles className="h-3.5 w-3.5" />
        {discount.name} applied automatically: −{saving}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 text-ok">
      <CheckCircle2 className="h-3.5 w-3.5" />
      {discount.code} applied: −{saving}
    </span>
  );
}
