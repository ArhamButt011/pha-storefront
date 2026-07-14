import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { getCategories } from "@/lib/api/categories";
import { getCategoryImage } from "@/lib/categoryImages";
import type { CategoryWithImage } from "@/types/category";

const FEATURED_COUNT = 5;

function CategoryCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-bg-2">
      <div className="h-36 animate-pulse bg-bg-3" />
      <div className="p-4 text-center">
        <div className="mx-auto h-4 w-2/3 animate-pulse rounded bg-bg-3" />
      </div>
    </div>
  );
}

export function Categories() {
  const headRef = useScrollReveal<HTMLDivElement>(0.2);
  const gridRef = useScrollReveal<HTMLDivElement>(0.1);

  const [categories, setCategories] = useState<CategoryWithImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        // The category API now honors limit/page server-side, so the top
        // categories are requested directly instead of slicing a larger
        // client-side batch.
        const res = await getCategories({ limit: FEATURED_COUNT, page: 1 });
        if (cancelled) return;

        const withImages: CategoryWithImage[] = res.data.items.map((cat, index) => ({
          ...cat,
          img: getCategoryImage(cat.slug, index),
        }));
        setCategories(withImages);
      } catch (err) {
        if (!cancelled) setError("Failed to load categories.");
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

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

        {error ? (
          <div className="rounded-2xl border border-border bg-bg-2 px-6 py-16 text-center text-fg-muted">
            {error}
          </div>
        ) : (
          <div
            ref={gridRef}
            className="stagger grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
          >
            {loading
              ? Array.from({ length: FEATURED_COUNT }).map((_, i) => <CategoryCardSkeleton key={i} />)
              : categories.map((c) => <CategoryCard key={c._id} category={c} />)}
          </div>
        )}
      </div>
    </section>
  );
}