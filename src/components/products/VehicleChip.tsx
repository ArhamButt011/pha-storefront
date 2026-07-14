import { Link } from "react-router-dom";
import { CarFront, Pencil, X } from "lucide-react";
import { useVehicle, type SelectedVehicle } from "@/context/VehicleContext";

export function VehicleChip({ vehicle }: { vehicle: SelectedVehicle }) {
  const { setVehicle } = useVehicle();
  const label = [vehicle.make, vehicle.model, vehicle.model_code].filter(Boolean).join(" ");

  return (
    <div className="flex shrink-0 items-center gap-3 rounded-full border border-border bg-bg-2 py-1.5 pl-3 pr-1.5">
      <CarFront className="h-4 w-4 text-accent" />
      <div className="leading-tight">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-fg-muted">Your Vehicle</div>
        <div className="text-sm font-bold text-fg">{label}</div>
      </div>
      <Link
        to="/#vehicle-selector"
        className="flex h-7 w-7 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-bg-3 hover:text-accent"
        aria-label="Change vehicle"
      >
        <Pencil className="h-3.5 w-3.5" />
      </Link>
      <button
        type="button"
        onClick={() => setVehicle(null)}
        className="flex h-7 w-7 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-bg-3 hover:text-red-400"
        aria-label="Clear vehicle filter"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}