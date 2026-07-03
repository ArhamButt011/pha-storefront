import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { CartItemCard } from "@/components/cart/CartItemCard";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { useCart } from "@/hooks/useCart";

export function Cart() {
  const { items, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-black tracking-wide text-fg sm:text-3xl">
          Your Performance Build{" "}
          <span className="text-fg-muted">
            ({totalItems} {totalItems === 1 ? "Item" : "Items"})
          </span>
        </h1>
        <Link
          to="/products"
          className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-accent transition-all hover:gap-2.5"
        >
          <ArrowLeft className="h-4 w-4" /> Keep Shopping
        </Link>
      </div>

      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="grid min-w-0 gap-8 lg:grid-cols-[1fr_360px]">
          <div className="min-w-0 space-y-4">
            {items.map((item) => (
              <CartItemCard key={item.id} item={item} />
            ))}
          </div>
          <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <OrderSummary subtotal={totalPrice} onCheckout={() => navigate("/checkout")} />
          </div>
        </div>
      )}
    </main>
  );
}
