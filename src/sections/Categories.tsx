import { Link } from "react-router-dom";
import { ArrowRight, SlidersVertical, Wrench, Gauge, Fan, Disc, Plug } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const CATEGORIES = [
  { slug: "engine", title: "Engine", icon: SlidersVertical },
  { slug: "suspension", title: "Suspension", icon: Wrench },
  { slug: "turbo-systems", title: "Turbo Systems", icon: Gauge },
  { slug: "cooling", title: "Cooling", icon: Fan },
  { slug: "brakes", title: "Brakes", icon: Disc },
  { slug: "electrical", title: "Electrical", icon: Plug },
];

export function Categories() {
  const headRef = useScrollReveal<HTMLDivElement>(0.2);
  const gridRef = useScrollReveal<HTMLDivElement>(0.1);

  return (
    <section id="categories" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={headRef} className="reveal mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Browse Departments</p>
            <h2 className="mt-2 font-display text-2xl font-black tracking-wide text-fg sm:text-3xl">
              Shop by Category
            </h2>
          </div>
          <Link to="/categories" className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-accent transition-all hover:gap-2.5">
            View All Categories <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div ref={gridRef} className="stagger grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                to={`/products/${cat.slug}`}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-bg-2 p-6 text-center transition-colors hover:border-accent/40"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-bg-3 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-fg">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="text-sm font-semibold text-fg">{cat.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
