import { ShieldCheck } from "lucide-react";

export function InvoiceFitmentBadge({ vehicleLabel }: { vehicleLabel: string }) {
  return (
    <div className="rounded-2xl border border-accent/25 bg-accent/10 p-5 text-center">
      <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-fg">
        <ShieldCheck className="h-5 w-5" />
      </span>
      <p className="mt-2 text-xs font-bold uppercase tracking-wider text-accent">Fitment Guaranteed</p>
      <p className="mt-1.5 text-xs text-fg-muted">
        This order has been verified by our engineering team for compatibility with your {vehicleLabel}.
      </p>
    </div>
  );
}
