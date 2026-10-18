import { CheckCircle2, HeartHandshake, Loader2, Sparkles, Tag, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/utils/currency";
import type { DiscountQuoteState } from "@/types/checkout";

interface PromoCodeFieldProps {
  value: string;
  onChange: (value: string) => void;
  // The server's verdict for the current cart and code.
  quote: DiscountQuoteState;
  // Promoted sale code, offered as a one-tap "Apply" tip.
  suggestedCode?: string | null;
}

function QuoteStatus({ value, quote }: Pick<PromoCodeFieldProps, "value" | "quote">) {
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

export function PromoCodeField({ value, onChange, quote, suggestedCode }: PromoCodeFieldProps) {
  return (
    <div className="rounded-2xl border border-border bg-bg-2 p-6">
      <label htmlFor="promo-code" className="flex items-center gap-2 text-sm font-bold text-fg">
        <Tag className="h-4 w-4 text-accent" />
        Promo code
      </label>
      <Input
        id="promo-code"
        value={value}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        placeholder="Enter a code"
        className="mt-3 font-mono uppercase"
        autoComplete="off"
      />
      <div className="mt-2 min-h-5 text-xs">
        <QuoteStatus value={value} quote={quote} />
      </div>
      {suggestedCode && value.trim().toUpperCase() !== suggestedCode ? (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-dashed border-accent/40 bg-accent/5 px-3 py-2 text-xs">
          <span className="text-fg-muted">
            Have this code? <span className="font-mono font-bold text-fg">{suggestedCode}</span>
          </span>
          <Button type="button" size="sm" variant="outline" className="h-8 px-4" onClick={() => onChange(suggestedCode)}>
            Apply
          </Button>
        </div>
      ) : null}
    </div>
  );
}
