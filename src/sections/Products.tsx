import { Link } from "react-router-dom";
import { Heart, ShoppingCart, ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const FEATURED = {
  brand: "Brembo Performance",
  title: "GT Series Braking System",
  desc: "Ultimate stopping power for track and road use.",
  tag: "PERFORMANCE PLUS",
  price: "4,299.00",
  img: "https://images.unsplash.com/photo-1573939843624-b22996c1a31c?w=900&h=900&fit=crop",
};

const PRODUCTS = [
  {
    brand: "Garrett Performance",
    title: "G-Series G25-660 Turbocharger",
    price: "2,850.00",
    img: "https://images.unsplash.com/photo-1673153597250-ae20d69e7fde?w=500&h=500&fit=crop",
  },
  {
    brand: "KW Suspension",
    title: "V3 Coilover Kit - BMW M3/M4",
    price: "3,999.00",
    img: "https://images.unsplash.com/photo-1760836395865-0c20fff2aefd?w=500&h=500&fit=crop",
  },
  {
    brand: "Bosch Genuine",
    title: "Ultimate Major Service Kit",
    price: "245.00",
    img: "https://images.unsplash.com/photo-1590227763209-821c686b932f?w=500&h=500&fit=crop",
  },
  {
    brand: "M-Performance",
    title: "Carbon Fiber Front Splitter",
    price: "1,250.00",
    img: "https://images.unsplash.com/photo-1770172505231-2644765d984c?w=500&h=500&fit=crop",
  },
];

function AddToCartButton() {
  return (
    <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-fg transition-all hover:brightness-110">
      <ShoppingCart className="h-4 w-4" />
    </button>
  );
}

function FeaturedCard() {
  return (
    <div className="product-card group relative flex flex-col overflow-hidden rounded-2xl bg-bg-2 lg:col-span-2 lg:row-span-2">
      <div className="relative h-64 overflow-hidden shine lg:h-full lg:min-h-70 lg:flex-1">
        <img
          src={FEATURED.img}
          alt={FEATURED.title}
          className="card-img h-full w-full object-cover"
          loading="lazy"
        />
        <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-[10px] font-bold tracking-wide text-accent-fg">
          {FEATURED.tag}
        </span>
        <button className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-accent hover:text-accent-fg">
          <Heart className="h-4 w-4" />
        </button>
      </div>
      <div className="p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-fg-muted">{FEATURED.brand}</p>
        <h3 className="mt-1 text-xl font-bold text-fg">{FEATURED.title}</h3>
        <p className="mt-1 text-sm text-fg-muted">{FEATURED.desc}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-2xl font-black text-accent">${FEATURED.price} <span className="text-sm font-semibold text-fg-muted">AUD</span></span>
          <AddToCartButton />
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: (typeof PRODUCTS)[0] }) {
  return (
    <div className="product-card flex items-center gap-4 rounded-2xl bg-bg-2 p-4">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl">
        <img src={product.img} alt={product.title} className="h-full w-full object-cover" loading="lazy" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-fg-muted">{product.brand}</p>
        <h3 className="mt-0.5 truncate text-sm font-bold text-fg">{product.title}</h3>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-base font-black text-accent">${product.price}</span>
          <AddToCartButton />
        </div>
      </div>
    </div>
  );
}

export function Products() {
  const headRef = useScrollReveal<HTMLDivElement>(0.2);
  const gridRef = useScrollReveal<HTMLDivElement>(0.1);

  return (
    <section id="products" className="bg-bg-2/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={headRef} className="reveal mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Precision Engineered</p>
            <h2 className="mt-2 font-display text-2xl font-black tracking-wide text-fg sm:text-3xl">
              Featured High-Performance Parts
            </h2>
          </div>
          <Link to="/products" className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-accent transition-all hover:gap-2.5">
            Explore Shop <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div ref={gridRef} className="stagger grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          <FeaturedCard />
          {PRODUCTS.map((p) => (
            <ProductCard key={p.title} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
