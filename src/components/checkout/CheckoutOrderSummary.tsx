import { ArrowRight, ShieldCheck, BadgeCheck, Headphones, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GST_DIVISOR } from "@/constants/cart";
import { TRUST_BADGES } from "@/constants/checkout";
import type { CartItem } from "@/store/cartSlice";

const BADGE_ICONS = [ShieldCheck, BadgeCheck, Headphones];

function formatCurrency(value: number) {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

interface CheckoutOrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  vehicleMake?: string;
  onContinue?: () => void;
  submitting?: boolean;
  disabled?: boolean;
}

export function CheckoutOrderSummary({
  items,
  subtotal,
  vehicleMake,
  onContinue,
  submitting = false,
  disabled = false,
}: CheckoutOrderSummaryProps) {
  // Product prices are GST-inclusive (AU retail) — GST is extracted for
  // display, never added on top of the subtotal.
  const gst = subtotal / GST_DIVISOR;
  const total = subtotal;

  return (
    <div className="rounded-2xl border border-border bg-bg-2 p-6">
      <h2 className="text-lg font-bold text-fg">Order Summary</h2>

      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg">
              <img src={item.img} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-fg">{item.title}</p>
              {item.meta && <p className="truncate text-xs text-fg-muted">{item.meta}</p>}
              <p className="text-xs text-fg-muted">Qty: {item.quantity}</p>
            </div>
            <p className="shrink-0 text-sm font-bold text-fg">{formatCurrency(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-3 border-t border-border pt-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-fg-muted">Subtotal</span>
          <span className="font-semibold text-fg">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-fg-muted">Shipping (Express)</span>
          <span className="font-semibold text-ok">FREE</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-fg-muted">Includes GST</span>
          <span className="font-semibold text-fg">{formatCurrency(gst)}</span>
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
        <span className="font-bold text-fg">Total</span>
        <span className="font-display text-2xl font-black text-accent">{formatCurrency(total)}</span>
      </div>

      <Button size="lg" className="mt-6 w-full gap-2" onClick={onContinue} disabled={disabled || submitting}>
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Placing Order…
          </>
        ) : (
          <>
            Continue to Payment
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>

      <div className="mt-6 space-y-3">
        {TRUST_BADGES.map((badge, i) => {
          const Icon = BADGE_ICONS[i];
          const description = badge.description.replace("{make}", vehicleMake ?? "your");
          return (
            <div key={badge.title} className="flex items-center gap-3 rounded-xl border border-border bg-bg-3 px-4 py-3">
              <Icon className="h-5 w-5 shrink-0 text-accent" />
              <div>
                <p className="text-sm font-bold text-fg">{badge.title}</p>
                <p className="text-xs text-fg-muted">{description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
