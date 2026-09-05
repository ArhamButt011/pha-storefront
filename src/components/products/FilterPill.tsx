import { X } from "lucide-react";

export interface FilterPillProps {
  label: string;
  onRemove: () => void;
}

// Generic "active filter" pill — one per applied category/condition/
// authenticity/price/mpn/sku/search filter on the shop page, each
// individually removable. Sits alongside the richer <VehicleChip> (which
// also has an edit action, unlike these simple value+remove pills).
export function FilterPill({ label, onRemove }: FilterPillProps) {
  return (
    <div className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-bg-2 py-1.5 pl-3.5 pr-1.5 text-sm font-medium text-fg">
      <span className="max-w-[220px] truncate">{label}</span>
      <button
        type="button"
        onClick={onRemove}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-bg-3 hover:text-red-400"
        aria-label={`Remove ${label} filter`}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
