import { CreditCard } from "lucide-react";
import { INVOICE_NOTE } from "@/constants/checkout";
import { formatCurrency } from "@/utils/currency";

interface InvoicePaymentAndTotalsProps {
  paymentMethod: { brand: string; last4: string };
  subtotal: number;
  shipping: number;
  gst: number;
  total: number;
}

export function InvoicePaymentAndTotals({ paymentMethod, subtotal, shipping, gst, total }: InvoicePaymentAndTotalsProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="rounded-2xl border border-border bg-bg-2 p-5">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-fg-muted">Payment Information</p>
        <div className="flex items-center gap-3 text-sm">
          <CreditCard className="h-5 w-5 shrink-0 text-accent" />
          <div>
            <p className="font-semibold text-fg">{paymentMethod.brand} Ending in {paymentMethod.last4}</p>
            <p className="text-xs text-fg-muted">Processed via Secure Gateway</p>
          </div>
        </div>
        <p className="mt-4 text-xs italic leading-relaxed text-fg-muted">"{INVOICE_NOTE}"</p>
      </div>

      <div className="rounded-2xl border border-border bg-bg-2 p-5">
        <div className="space-y-2.5 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-fg-muted">Subtotal</span>
            <span className="font-semibold text-fg">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-fg-muted">Shipping (Express Premium)</span>
            <span className="font-semibold text-fg">{formatCurrency(shipping)}</span>
          </div>
          <div className="flex items-center justify-between border-b border-border pb-2.5">
            <span className="text-fg-muted">Includes GST</span>
            <span className="font-semibold text-fg">{formatCurrency(gst)}</span>
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="font-bold text-fg">Total Amount</span>
          <span className="font-display text-2xl font-black text-accent">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}
