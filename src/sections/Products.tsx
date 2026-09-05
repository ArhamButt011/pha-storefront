import { Link } from "react-router-dom";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useCart } from "@/hooks/useCart";
import { productToCartItem } from "@/utils/productToCartItem";
import type { Product } from "@/data/products";
import { useVehicle } from "@/context/VehicleContext";

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addToCart(productToCartItem(product));
  }
  return (
    <Link
      to={`/product/${product.slug}`}
      className="product-card group flex flex-col overflow-hidden rounded-2xl bg-bg-2"
    >
      <div className="relative h-44 overflow-hidden shine">
        <img
          src={product.img}
          alt={product.title}
          className="card-img h-full w-full object-cover"
          loading="lazy"
        />

        {/* Slides in from the left on hover */}
        <button
          onClick={handleAdd}
          className="absolute bottom-3 left-3 flex -translate-x-[calc(100%+0.75rem)] items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-bold text-accent-fg opacity-0 shadow-lg transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-fg-muted">
          { product.make}
        </p>
        <h3 className="mt-1 line-clamp-2 text-sm font-bold text-fg">{product.title}</h3>

        <div className="mt-auto flex items-center gap-2 pt-3">
          <span className="text-base font-black text-accent">A${product.price.toLocaleString()}</span>
          {product.oldPrice && (
            <span className="text-xs text-fg-muted/60 line-through">
              A${product.oldPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// NOTE: fetching moved to Home's route loader (SSR) — this section is only
// ever rendered from Home, and has no interactivity that would need its own
// re-fetch, so it just renders what it's given.
export function Products({ products }: { products: Product[] }) {
  const headRef = useScrollReveal<HTMLDivElement>(0.2);
  const gridRef = useScrollReveal<HTMLDivElement>(0.1);
  const { setVehicle } = useVehicle();

  return (
    <section id="products" className="bg-bg-2/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={headRef} className="reveal mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Precision Engineered</p>
            <h2 className="mt-2 font-display text-2xl font-black tracking-wide text-fg sm:text-3xl">
              Featured Parts
            </h2>
          </div>
          <Link to="/shop"  onClick={() => setVehicle(null)} className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-accent transition-all hover:gap-2.5">
            Explore Shop <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div
          ref={gridRef}
          className="stagger grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}