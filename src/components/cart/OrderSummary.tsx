import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/currency";

interface OrderSummaryProps {
  subtotal: number;
  /** Real per-item shipping cost total from the backend, 0 = free */
  shipping: number;
  onCheckout?: () => void;
}

export function OrderSummary({ subtotal, shipping, onCheckout }: OrderSummaryProps) {
  const total = subtotal + shipping;

  return (
    <div className="rounded-2xl border border-border bg-bg-2 p-6">
      <h2 className="text-lg font-bold text-fg">Order Summary</h2>

      <div className="mt-5 space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-fg-muted">Subtotal</span>
          <span className="font-semibold text-fg">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between border-b border-border pb-3">
          <span className="text-fg-muted">Express Shipping</span>
          <span className={shipping > 0 ? "font-semibold text-fg" : "font-semibold text-ok"}>
            {shipping > 0 ? formatCurrency(shipping) : "Free"}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-baseline justify-between">
          <span className="font-bold text-fg">Total</span>
          <span className="font-display text-2xl font-black text-accent">{formatCurrency(total)}</span>
        </div>
        <p className="text-right text-xs text-fg-muted">AUD Dollars</p>
      </div>

      <Button size="sm" className="mt-6 w-full text-xs gap-2 uppercase tracking-wide" onClick={onCheckout}>
        <Lock className="h-4 w-4" />
        Proceed to Secure Checkout
      </Button>
{/* 
      <div className="mt-5 flex items-start gap-3 rounded-xl border border-accent/25 bg-accent/10 px-4 py-3">
        <Crown className="h-5 w-5 shrink-0 text-accent" />
        <p className="text-xs">
          <span className="font-bold text-accent">Elite Member Shipping Applied</span>{" "}
          <span className="text-fg-muted">
            You're saving {formatCurrency(MEMBER_SHIPPING_SAVINGS)} on priority freight with your Pro status.
          </span>
        </p>
      </div> */}

      <p className="mt-5 text-center text-xs leading-relaxed text-fg-muted">
        Secure 256-bit SSL encrypted checkout.
        <br />
        All components include 12-month workshop warranty.
      </p>
    </div>
  );
}
