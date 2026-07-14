import { Check } from "lucide-react";
import type { Product } from "@/data/products";
import { TechnicalSpecifications } from "@/components/product/TechnicalSpecifications";
import { VehicleFitmentTable } from "@/components/product/VehicleFitmentTable";

export function ProductTabs({ product }: { product: Product }) {
  const note = product.engineeringNote;
  const features = product.features;

  return (
    <div>
      <TechnicalSpecifications product={product} />

      {(note || (features && features.length > 0)) && (
        <div className="mt-12">
          {note && <p className="text-sm leading-relaxed text-fg-muted">{note}</p>}
          {features && features.length > 0 && (
            <ul className="mt-5 space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-fg-muted">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {f}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <VehicleFitmentTable fitments={product.vehicleFitments ?? []} />
    </div>
  );
}