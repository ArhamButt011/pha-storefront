import { Link } from "react-router-dom";
import { ShoppingCart, ShieldCheck, Truck, FileText, ChevronRight } from "lucide-react";

export function ConfirmationSummaryLinks() {
  return (
    <div className="rounded-2xl border border-border bg-bg-2 p-5">
      <p className="text-sm font-bold text-fg">Checkout Summary</p>
      <p className="text-xs text-fg-muted">Secure Purchase Complete</p>

      <div className="mt-4 space-y-1">
        <div className="flex items-center gap-3 rounded-lg bg-accent/10 px-3 py-2.5 text-sm font-semibold text-accent">
          <ShoppingCart className="h-4 w-4 shrink-0" />
          Order Summary
        </div>
        <div className="flex items-center gap-3 px-3 py-2.5 text-sm text-fg-muted">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          Fitment Guarantee
        </div>
        <div className="flex items-center gap-3 px-3 py-2.5 text-sm text-fg-muted">
          <Truck className="h-4 w-4 shrink-0" />
          Express Shipping
        </div>
        <Link
          to="/checkout/invoice"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-fg-muted transition-colors hover:bg-bg-3 hover:text-fg"
        >
          <FileText className="h-4 w-4 shrink-0" />
          <span className="flex-1">Tax Invoice</span>
          <ChevronRight className="h-4 w-4 shrink-0" />
        </Link>
      </div>
    </div>
  );
}
