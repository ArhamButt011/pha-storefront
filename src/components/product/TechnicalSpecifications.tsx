import { ShieldCheck } from "lucide-react";
import { SpecCell } from "@/components/product/SpecCell";
import type { Product } from "@/data/products";

interface SpecRow {
  label: string;
  value: string;
}

export function TechnicalSpecifications({ product }: { product: Product }) {
  const rows: [SpecRow, SpecRow][] = [
    [
      { label: "Make", value: product.make ?? product.brand },
      { label: "Model", value: product.model ?? "—" },
    ],
    [
      { label: "Series", value: product.model_code ?? "—" },
      {
        label: "Year",
        value:
          product.year_from && product.year_to
            ? product.year_from === product.year_to
              ? `${product.year_from}`
              : `${product.year_from} – ${product.year_to}`
            : product.year_from
              ? `${product.year_from} – Present`
              : "—",
      },
    ],
    [
      { label: "Authenticity", value: product.authenticity ?? "Genuine" },
      { label: "Condition", value: product.condition ?? "New" },
    ],
  ];

  return (
    <div>
      <h3 className="text-lg font-bold text-fg">Technical Specifications</h3>
      <div className="mt-1 h-0.5 w-10 bg-accent" />

      <div className="mt-6">
        <div className="divide-y divide-border rounded-2xl border border-border bg-bg-2 px-5">
          {rows.map(([left, right], i) => (
            <div key={i} className="grid grid-cols-2 gap-6">
              <SpecCell {...left} />
              <SpecCell {...right} />
            </div>
          ))}

          {product.productNote && (
            <div className="py-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-fg-muted">Product Note</p>
              <p className="mt-1 text-sm italic leading-relaxed text-fg-muted">{product.productNote}</p>
            </div>
          )}

          {product.conditionNotes && (
            <div className="py-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-fg-muted">Condition Notes</p>
              <p className="mt-1 text-sm leading-relaxed text-fg-muted">{product.conditionNotes}</p>
            </div>
          )}

          {product.specs && product.specs.length > 0 && (
            <div className="grid grid-cols-2 gap-6 py-4">
              {product.specs.map((spec) => (
                <SpecCell key={spec.label} {...spec} />
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 py-4">
            <ShieldCheck className="h-4 w-4 shrink-0 text-accent" />
            <p className="text-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-fg-muted">Warranty · </span>
              <span className="font-semibold text-fg">{product.warranty ?? "N/A"}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}