import { Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PromoCodeStatus } from "@/components/checkout/PromoCodeStatus";
import type { DiscountQuoteState } from "@/types/checkout";

interface PromoCodeFieldProps {
  value: string;
  onChange: (value: string) => void;
  // The server's verdict for the current cart and code.
  quote: DiscountQuoteState;
  // Promoted sale code, offered as a one-tap "Apply" tip.
  suggestedCode?: string | null;
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
        <PromoCodeStatus value={value} quote={quote} />
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
