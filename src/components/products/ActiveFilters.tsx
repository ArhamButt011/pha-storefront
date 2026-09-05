import { VehicleChip } from "./VehicleChip";
import { FilterPill } from "./FilterPill";
import type { ShopFiltersApi } from "@/hooks/useShopFilters";
import type { SelectedVehicle } from "@/context/VehicleContext";
import { CONDITION_LABELS, AUTHENTICITY_LABELS } from "@/constants/shopFilters";

export interface CategoryLookup {
  id: string;
  name: string;
}

interface ActiveFiltersProps {
  filters: ShopFiltersApi;
  categories: CategoryLookup[];
  vehicle: SelectedVehicle | null;
  onClearPrice: () => void;
}

// Every filter applied via the search modal or sidebar, each as its own
// removable pill — not just the vehicle — so the person can see and undo
// exactly what's narrowing their results without reopening the modal.
export function ActiveFilters({ filters, categories, vehicle, onClearPrice }: ActiveFiltersProps) {
  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? id;

  const hasAny =
    Boolean(vehicle?.make) ||
    filters.categoryIds.length > 0 ||
    Boolean(filters.condition) ||
    Boolean(filters.authenticity) ||
    Boolean(filters.priceMin) ||
    Boolean(filters.priceMax) ||
    Boolean(filters.mpn) ||
    Boolean(filters.sku) ||
    Boolean(filters.search);

  if (!hasAny) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {vehicle?.make && <VehicleChip vehicle={vehicle} />}
      {filters.search && (
        <FilterPill label={`Search: "${filters.search}"`} onRemove={() => filters.setSearch("")} />
      )}
      {filters.categoryIds.map((id) => (
        <FilterPill key={id} label={categoryName(id)} onRemove={() => filters.toggleCategory(id)} />
      ))}
      {filters.condition && (
        <FilterPill label={CONDITION_LABELS[filters.condition]} onRemove={() => filters.setCondition(null)} />
      )}
      {filters.authenticity && (
        <FilterPill
          label={AUTHENTICITY_LABELS[filters.authenticity]}
          onRemove={() => filters.setAuthenticity(null)}
        />
      )}
      {(filters.priceMin || filters.priceMax) && (
        <FilterPill label={`A$${filters.priceMin || "0"} – ${filters.priceMax || "Any"}`} onRemove={onClearPrice} />
      )}
      {filters.mpn && <FilterPill label={`MPN: ${filters.mpn}`} onRemove={() => filters.setMpn("")} />}
      {filters.sku && <FilterPill label={`SKU: ${filters.sku}`} onRemove={() => filters.setSku("")} />}
    </div>
  );
}
