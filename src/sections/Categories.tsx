import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { CategoryCard } from "@/components/categories/CategoryCard";
import type { CategoryWithImage } from "@/types/category";

// NOTE: fetching moved to Home's route loader (SSR) — this section is only
// ever rendered from Home, and has no interactivity that would need its own
// re-fetch, so it just renders what it's given.
export function Categories({ categories }: { categories: CategoryWithImage[] }) {
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

        <div
          ref={gridRef}
          className="stagger grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
        >
          {categories.map((c) => (
            <CategoryCard key={c._id} category={c} />
          ))}
        </div>
      </div>
    </section>
  );
}