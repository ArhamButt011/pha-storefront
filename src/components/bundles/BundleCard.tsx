import { Check, ShoppingCart } from "lucide-react";
import type { Bundle } from "@/data/bundles";

function formatPrice(value: number) {
  return `A$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function BundleCard({ bundle }: { bundle: Bundle }) {
  const saveAmount = bundle.oldPrice - bundle.price;

  return (
    <div className="product-card flex flex-col overflow-hidden rounded-2xl bg-bg-2">
      <div className="relative h-48 overflow-hidden shine">
        <img src={bundle.img} alt={bundle.title} className="card-img h-full w-full object-cover" loading="lazy" />
        <span className="absolute right-3 top-3 rounded-full bg-accent px-3 py-1 text-[10px] font-bold text-accent-fg">
          Save {formatPrice(saveAmount)}
        </span>
        <span className="absolute bottom-3 left-3 rounded bg-black/60 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
          Fitment: {bundle.fitmentLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-bold text-fg">{bundle.title}</h3>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {bundle.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-bg-3 px-2.5 py-1 text-[11px] font-medium text-fg-muted">
              {tag}
            </span>
          ))}
        </div>

        <ul className="mt-4 space-y-1.5">
          {bundle.includes.map((item) => (
            <li key={item} className="flex items-start gap-2 text-xs text-fg-muted">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center justify-between pt-5">
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-fg-muted/60 line-through">{formatPrice(bundle.oldPrice)}</span>
            <span className="text-xl font-black text-accent">{formatPrice(bundle.price)}</span>
          </div>
          <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-fg transition-all hover:brightness-110">
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
