import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Zap } from "lucide-react";
import { cn } from "@/utils/cn";
import { useCart } from "@/hooks/useCart";
import { productToCartItem } from "@/utils/productToCartItem";
import { STOCK_DOT } from "@/constants/stock";
import type { Product } from "@/data/products";

const BADGE_LABEL: Record<NonNullable<Product["badge"]>, string> = {
  "top-rated": "Top Rated",
  sale: "Sale",
};

const BADGE_CLASS: Record<NonNullable<Product["badge"]>, string> = {
  "top-rated": "bg-accent text-accent-fg",
  sale: "bg-danger text-danger-fg",
};

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const outOfStock = product.stock.status === "out-of-stock";

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    addToCart(productToCartItem(product));
  }

  function handleBuyNow(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    addToCart(productToCartItem(product));
    navigate("/checkout");
  }

  return (
    <Link to={`/product/${product.slug}`} className="product-card flex flex-col overflow-hidden rounded-2xl bg-bg-2">
      <div className="relative h-48 overflow-hidden shine">
        <img src={product.img} alt={product.title} className="card-img h-full w-full object-cover" loading="lazy" />
        {product.badge && (
          <span className={cn("absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide", BADGE_CLASS[product.badge])}>
            {BADGE_LABEL[product.badge]}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <span className="truncate text-xs font-semibold uppercase tracking-wider text-fg-muted">{product.make}</span>
          {/* <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-fg-muted">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
            {product.rating.toFixed(1)}
          </span> */}
        </div>

        <h3 className="mb-4 font-bold text-fg">{product.title}</h3>

        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-accent">A${product.price.toLocaleString()}</span>
            {product.oldPrice && (
              <span className="text-sm text-fg-muted/60 line-through">A${product.oldPrice.toLocaleString()}</span>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={handleAdd}
              disabled={outOfStock}
              title="Add to Cart"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-fg transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
            <button
              onClick={handleBuyNow}
              disabled={outOfStock}
              title="Buy Now"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-fg transition-all hover:border-accent/50 hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Zap className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-fg-muted">
          <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", STOCK_DOT[product.stock.status])} />
          {product.stock.label}
        </div>
      </div>
    </Link>
  );
}