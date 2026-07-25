import { QuantityStepper } from "@/components/ui/quantity-stepper";
import type { StockStatus } from "@/data/products";

export interface ProductConditionQuantityRowProps {
  condition?: string;
  qty: number;
  onQtyChange: (value: number) => void;
  stockCount?: number | null;
  stockStatus: StockStatus;
}

// Mirrors a marketplace listing's "Condition / Quantity available" block —
// the exact count is only ever surfaced for low stock (status === "limited"),
// same threshold as everywhere else stock is shown (see stockLabel()); plenty
// in stock just reads "In Stock" rather than a fabricated "40 available".
export function ProductConditionQuantityRow({
  condition,
  qty,
  onQtyChange,
  stockCount,
  stockStatus,
}: ProductConditionQuantityRowProps) {
  const outOfStock = stockStatus === "out-of-stock";
  if (!condition && outOfStock) return null;

  return (
    <div className="mt-5 space-y-3 border-t border-border pt-5 text-sm">
      {condition && (
        <div className="flex items-center gap-2">
          <span className="w-24 shrink-0 text-fg-muted">Condition:</span>
          <span className="font-semibold text-fg">{condition}</span>
        </div>
      )}
      {!outOfStock && (
        <div className="flex items-center gap-3">
          <span className="w-24 shrink-0 text-fg-muted">Quantity:</span>
          <QuantityStepper value={qty} onChange={onQtyChange} max={stockCount ?? undefined} />
          <span className="text-xs text-fg-muted">
            {stockStatus === "limited" && stockCount ? `${stockCount} available` : "In Stock"}
          </span>
        </div>
      )}
    </div>
  );
}
