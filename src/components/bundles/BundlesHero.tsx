import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MAKES, MODELS_BY_MAKE } from "@/data/vehicles";

const VEHICLE_OPTIONS = MAKES.flatMap((make) => MODELS_BY_MAKE[make].map((model) => `${make} ${model}`));

interface BundlesHeroProps {
  vehicleValue: string;
  onVehicleChange: (value: string) => void;
  onFilter: () => void;
}

export function BundlesHero({ vehicleValue, onVehicleChange, onFilter }: BundlesHeroProps) {
  return (
    <section className="rounded-2xl border border-border bg-bg-2 p-6 sm:p-8">
      <span className="inline-block rounded-full bg-bg-3 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-fg-muted">
        Pre-Configured Kits
      </span>
      <h1 className="mt-4 font-display text-3xl font-black tracking-wide text-fg sm:text-4xl">
        Engineered Efficiency
      </h1>
      <p className="mt-3 max-w-2xl text-fg-muted">
        Unlock maximum performance and value with our curated Popular Bundles. Expertly selected
        parts designed to work in perfect harmony, saving you time and money.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="space-y-1.5 sm:max-w-xs sm:flex-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Year/Make/Model</label>
          <Select
            value={vehicleValue}
            onValueChange={onVehicleChange}
            placeholder="Select Vehicle"
            options={VEHICLE_OPTIONS.map((v) => ({ value: v, label: v }))}
          />
        </div>
        <Button onClick={onFilter} className="shrink-0 uppercase tracking-wide">
          Filter Bundles
        </Button>
      </div>
    </section>
  );
}
