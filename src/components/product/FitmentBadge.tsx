import { ShieldCheck } from "lucide-react";

export function FitmentBadge({ vehicleLabel }: { vehicleLabel: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-accent/25 bg-accent/10 px-4 py-3">
      <ShieldCheck className="h-5 w-5 shrink-0 text-accent" />
      <p className="text-sm">
        <span className="font-bold text-accent">Guaranteed Fitment</span>{" "}
        <span className="text-fg-muted">Confirmed for your: {vehicleLabel}</span>
      </p>
    </div>
  );
}
