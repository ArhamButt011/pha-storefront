import { Trash2 } from "lucide-react";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { useCart } from "@/hooks/useCart";
import type { CartItem } from "@/store/cartSlice";

function formatCurrency(value: number) {
  return `A$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function CartItemCard({ item }: { item: CartItem }) {
  const { setQuantity, removeFromCart } = useCart();
  const lineTotal = item.price * item.quantity;

  return (
    <div className="flex gap-4 rounded-2xl border border-border bg-bg-2 p-4">
      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl">
        <img src={item.img} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {item.category && (
              <p className="text-xs font-bold uppercase tracking-wider text-accent">{item.category}</p>
            )}
            <h3 className="mt-0.5 truncate font-bold text-fg">{item.title}</h3>
            {item.meta && <p className="mt-1 text-xs text-fg-muted">{item.meta}</p>}
          </div>
          <button
            onClick={() => removeFromCart(item.id)}
            className="shrink-0 rounded-lg p-1.5 text-fg-muted transition-colors hover:bg-danger/10 hover:text-danger"
            aria-label={`Remove ${item.title}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-3">
          <QuantityStepper value={item.quantity} onChange={(q) => setQuantity(item.id, q)} />
          <div className="text-right">
            <div className="text-lg font-black text-fg">{formatCurrency(lineTotal)}</div>
            {item.shippingNote && <div className="text-xs text-fg-muted">{item.shippingNote}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
