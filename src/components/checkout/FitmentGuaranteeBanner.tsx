import { Link } from "react-router-dom";
import { Check } from "lucide-react";

export function FitmentGuaranteeBanner({ vehicleLabel }: { vehicleLabel: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-accent/25 bg-accent/10 px-5 py-4">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-fg">
          <Check className="h-4 w-4" />
        </span>
        <div>
          <p className="font-bold text-accent">Fitment Guarantee</p>
          <p className="text-xs text-fg-muted">Confirmed parts for: {vehicleLabel}</p>
        </div>
      </div>
      <Link to="/#vehicle-selector" className="shrink-0 text-sm font-semibold text-accent hover:underline">
        Change Vehicle
      </Link>
    </div>
  );
}
