import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/utils/cn";
import { PRODUCT_TABS, type ProductTab, GENERIC_INSTALLATION_GUIDE, GENERIC_SHIPPING_RETURNS } from "@/constants/product";
import type { Product } from "@/data/products";

function SpecificationsPanel({ product }: { product: Product }) {
  const note =
    product.engineeringNote ??
    `Engineered by ${product.brand} to deliver dependable performance in the ${product.partType.toLowerCase()} category. Every unit is built to strict quality standards for a precise, reliable fit.`;

  const features = product.features ?? [
    `Genuine ${product.brand} construction`,
    `Purpose-built for ${product.partType}`,
    "Backed by our workmanship guarantee",
  ];

  const specs = product.specs ?? [
    { label: "Brand", value: product.brand },
    { label: "Category", value: product.partType },
    { label: "Warranty", value: product.warranty ?? "12 Month" },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
      <div>
        <h3 className="text-lg font-bold text-fg">Engineering Excellence</h3>
        <p className="mt-3 text-sm leading-relaxed text-fg-muted">{note}</p>
        <ul className="mt-5 space-y-3">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-fg-muted">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-border bg-bg-2 p-5">
        <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-fg-muted">Technical Data</h4>
        <dl className="space-y-3">
          {specs.map((s) => (
            <div key={s.label} className="flex items-center justify-between border-b border-border pb-3 text-sm last:border-0 last:pb-0">
              <dt className="text-fg-muted">{s.label}</dt>
              <dd className="font-semibold text-fg">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

function CompatibilityPanel({ product }: { product: Product }) {
  const list =
    product.compatibility ??
    (product.fits === "all"
      ? ["Universal fitment — compatible with most vehicles"]
      : product.fits.map((make) => `${make} — most models`));

  return (
    <ul className="space-y-2.5">
      {list.map((v) => (
        <li key={v} className="flex items-center gap-2 text-sm text-fg-muted">
          <Check className="h-4 w-4 shrink-0 text-accent" /> {v}
        </li>
      ))}
    </ul>
  );
}

export function ProductTabs({ product }: { product: Product }) {
  const [active, setActive] = useState<ProductTab>(PRODUCT_TABS[0]);

  return (
    <div>
      <div className="flex gap-6 overflow-x-auto border-b border-border">
        {PRODUCT_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(tab)}
            className={cn(
              "shrink-0 whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-semibold transition-colors",
              active === tab ? "border-accent text-fg" : "border-transparent text-fg-muted hover:text-fg",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="pt-6">
        {active === "Specifications" && <SpecificationsPanel product={product} />}
        {active === "Compatibility" && <CompatibilityPanel product={product} />}
        {active === "Installation Guide" && (
          <p className="text-sm leading-relaxed text-fg-muted">{GENERIC_INSTALLATION_GUIDE}</p>
        )}
        {active === "Shipping & Returns" && (
          <p className="text-sm leading-relaxed text-fg-muted">{GENERIC_SHIPPING_RETURNS}</p>
        )}
      </div>
    </div>
  );
}
