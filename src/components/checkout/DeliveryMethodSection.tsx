import { Truck, Store, type LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";
import { DELIVERY_METHOD_OPTIONS } from "@/constants/checkout";
import type { DeliveryMethod } from "@/types/checkout";

interface DeliveryMethodSectionProps {
  value: DeliveryMethod;
  onChange: (method: DeliveryMethod) => void;
}

const ICONS: Record<DeliveryMethod, LucideIcon> = {
  delivery: Truck,
  pickup: Store,
};

export function DeliveryMethodSection({ value, onChange }: DeliveryMethodSectionProps) {
  return (
    <div className="rounded-2xl border border-border bg-bg-2 p-6">
      <div className="mb-6 flex items-center gap-2">
        <Truck className="h-5 w-5 text-accent" />
        <h2 className="text-lg font-bold text-fg">Shipping & Collection</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {DELIVERY_METHOD_OPTIONS.map((opt) => {
          const isSelected = value === opt.value;
          const Icon = ICONS[opt.value];
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              aria-pressed={isSelected}
              className={cn(
                "flex items-start gap-3 rounded-xl border p-4 text-left transition-colors",
                isSelected ? "border-accent bg-accent/10" : "border-border bg-bg-3 hover:border-fg-muted",
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors",
                  isSelected ? "bg-accent text-accent-fg" : "bg-bg-2 text-fg-muted",
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span>
                <span className="block font-semibold text-fg">{opt.label}</span>
                <span className="block text-sm text-fg-muted">{opt.description}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
