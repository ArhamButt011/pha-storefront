import { SpecCell } from "@/components/product/SpecCell";
import type { Product } from "@/data/products";

// Cross-reference/lookup identifiers — kept separate from Technical
// Specifications since these are about *finding* the exact part (stock
// number, MPN, superseded numbers), not describing what it is.
export function PartIdentifiers({ product }: { product: Product }) {
  const superseded = product.supersededPartNumbers ?? [];
  const hasAnyIdentifier = Boolean(product.sku || product.mpn || superseded.length > 0);
  if (!hasAnyIdentifier) return null;

  return (
    <div className="mt-12">
      <h3 className="text-lg font-bold text-fg">Part Identifiers</h3>
      <div className="mt-1 h-0.5 w-10 bg-accent" />

      <div className="mt-6 rounded-2xl border border-border bg-bg-2 px-5">
        <div className="grid grid-cols-2 gap-6 py-4">
          {product.sku && <SpecCell label="Stock Number (SKU)" value={product.sku} />}
          {product.mpn && <SpecCell label="Manufacturer Part Number (MPN)" value={product.mpn} />}
          {superseded.length > 0 && (
            <SpecCell label="Superseded Part Number(s)" value={superseded.join(", ")} />
          )}
        </div>
      </div>
    </div>
  );
}
