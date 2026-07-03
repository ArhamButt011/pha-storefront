import { Lock, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SHIPPING_COST, GST_RATE, MEMBER_SHIPPING_SAVINGS } from "@/constants/cart";

function formatCurrency(value: number) {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

interface OrderSummaryProps {
  subtotal: number;
  onCheckout?: () => void;
}

export function OrderSummary({ subtotal, onCheckout }: OrderSummaryProps) {
  const shipping = SHIPPING_COST;
  const gst = (subtotal + shipping) * GST_RATE;
  const total = subtotal + shipping + gst;

  return (
    <div className="rounded-2xl border border-border bg-bg-2 p-6">
      <h2 className="text-lg font-bold text-fg">Order Summary</h2>

      <div className="mt-5 space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-fg-muted">Subtotal</span>
          <span className="font-semibold text-fg">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-fg-muted">Express Shipping</span>
          <span className="font-semibold text-accent">{formatCurrency(shipping)}</span>
        </div>
        <div className="flex items-center justify-between border-b border-border pb-3">
          <span className="text-fg-muted">GST (10%)</span>
          <span className="font-semibold text-fg">{formatCurrency(gst)}</span>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-baseline justify-between">
          <span className="font-bold text-fg">Total</span>
          <span className="font-display text-2xl font-black text-accent">{formatCurrency(total)}</span>
        </div>
        <p className="text-right text-xs text-fg-muted">AUD Dollars</p>
      </div>

      <Button size="lg" className="mt-6 w-full gap-2 uppercase tracking-wide" onClick={onCheckout}>
        <Lock className="h-4 w-4" />
        Proceed to Secure Checkout
      </Button>

      <div className="mt-5 flex items-start gap-3 rounded-xl border border-accent/25 bg-accent/10 px-4 py-3">
        <Crown className="h-5 w-5 shrink-0 text-accent" />
        <p className="text-xs">
          <span className="font-bold text-accent">Elite Member Shipping Applied</span>{" "}
          <span className="text-fg-muted">
            You're saving {formatCurrency(MEMBER_SHIPPING_SAVINGS)} on priority freight with your Pro status.
          </span>
        </p>
      </div>

      <p className="mt-5 text-center text-xs leading-relaxed text-fg-muted">
        Secure 256-bit SSL encrypted checkout.
        <br />
        All components include 12-month workshop warranty.
      </p>
    </div>
  );
}
