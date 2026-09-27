import { Truck, RotateCcw, CreditCard } from "lucide-react";
import { formatCurrency } from "@/utils/currency";
import { CALCULATED_SHIPPING_LABEL, SHIPPING_METHOD } from "@/constants/shipping";
import type { ShippingMethod } from "@/types/apiProduct";

export interface ShippingReturnsPaymentsProps {
  shippingCost?: number | null;
  shippingMethod?: ShippingMethod;
}

const RETURNS_TEXT = "30-day returns accepted on unused parts in original packaging.";
const PAYMENTS_TEXT = "Secure checkout via Stripe — all major credit and debit cards accepted.";

// Marketplace-style postage block, limited to facts this store can verify.
export function ShippingReturnsPayments({ shippingCost, shippingMethod }: ShippingReturnsPaymentsProps) {
  const calculated = shippingMethod === SHIPPING_METHOD.CALCULATED;
  const rows = [
    {
      icon: Truck,
      label: "Postage",
      value: calculated ? CALCULATED_SHIPPING_LABEL : shippingCost ? formatCurrency(shippingCost) : "Free Shipping",
      detail: calculated
        ? "Courier rate for your postcode, shown before you pay."
        : "Fast dispatch from our Melbourne HQ",
    },
    {
      icon: RotateCcw,
      label: "Returns",
      value: "30-day returns",
      detail: RETURNS_TEXT,
    },
    {
      icon: CreditCard,
      label: "Payments",
      value: "Cards accepted",
      detail: PAYMENTS_TEXT,
    },
  ];

  return (
    <div className="mt-6 space-y-4 rounded-2xl bg-bg-2 p-5 text-sm">
      <h2 className="font-display text-xs font-black uppercase tracking-wider text-fg-muted">
        Postage, Returns &amp; Payments
      </h2>
      <div className="space-y-4">
        {rows.map((row) => (
          <div key={row.label} className="flex gap-3">
            <row.icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="font-semibold text-fg">{row.label}:</span>
                <span className="text-fg">{row.value}</span>
              </div>
              <p className="mt-0.5 text-fg-muted">{row.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
