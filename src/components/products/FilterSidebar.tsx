import { CarFront } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export interface FacetOption {
  name: string;
  count: number;
}

export interface FilterSidebarProps {
  brands: FacetOption[];
  selectedBrands: string[];
  onToggleBrand: (name: string) => void;
  partTypes: FacetOption[];
  selectedPartTypes: string[];
  onTogglePartType: (name: string) => void;
  priceMin: string;
  priceMax: string;
  onPriceMinChange: (value: string) => void;
  onPriceMaxChange: (value: string) => void;
  onClearAll: () => void;
  vehicleFitmentLabel?: string;
}

export function FilterSidebar({
  brands,
  selectedBrands,
  onToggleBrand,
  partTypes,
  selectedPartTypes,
  onTogglePartType,
  priceMin,
  priceMax,
  onPriceMinChange,
  onPriceMaxChange,
  onClearAll,
  vehicleFitmentLabel,
}: FilterSidebarProps) {
  return (
    <aside className="w-full shrink-0 lg:w-64">
      <div className="rounded-2xl border border-border bg-bg-2 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-fg">Filters</h3>
          <button type="button" onClick={onClearAll} className="text-xs font-semibold text-accent hover:underline">
            Clear All
          </button>
        </div>

        {brands.length > 0 && (
          <div className="border-t border-border pt-4">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-fg-muted">Brand</h4>
            <div className="space-y-2.5">
              {brands.map((b) => (
                <label key={b.name} className="flex cursor-pointer items-center justify-between gap-2 text-sm text-fg-muted transition-colors hover:text-fg">
                  <span className="flex items-center gap-2">
                    <Checkbox checked={selectedBrands.includes(b.name)} onChange={() => onToggleBrand(b.name)} />
                    {b.name}
                  </span>
                  <span className="text-xs text-fg-muted">({b.count})</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {partTypes.length > 0 && (
          <div className="mt-5 border-t border-border pt-4">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-fg-muted">Part Type</h4>
            <div className="space-y-2.5">
              {partTypes.map((t) => (
                <label key={t.name} className="flex cursor-pointer items-center justify-between gap-2 text-sm text-fg-muted transition-colors hover:text-fg">
                  <span className="flex items-center gap-2">
                    <Checkbox checked={selectedPartTypes.includes(t.name)} onChange={() => onTogglePartType(t.name)} />
                    {t.name}
                  </span>
                  <span className="text-xs text-fg-muted">({t.count})</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="mt-5 border-t border-border pt-4">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-fg-muted">Price Range</h4>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              inputMode="numeric"
              placeholder="$ Min"
              value={priceMin}
              onChange={(e) => onPriceMinChange(e.target.value)}
              className="px-3 py-2 text-sm"
            />
            <span className="shrink-0 text-xs text-fg-muted">to</span>
            <Input
              type="number"
              inputMode="numeric"
              placeholder="$ Max"
              value={priceMax}
              onChange={(e) => onPriceMaxChange(e.target.value)}
              className="px-3 py-2 text-sm"
            />
          </div>
        </div>

        {vehicleFitmentLabel && (
          <div className="mt-5 border-t border-border pt-4">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-fg-muted">Vehicle Fitment</h4>
            <div className="flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 text-xs font-semibold text-accent">
              <CarFront className="h-3.5 w-3.5 shrink-0" />
              Filtered for {vehicleFitmentLabel}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
