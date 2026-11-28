import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import type { Route } from "./+types/CategoriesGrid";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { CategoryCardSkeleton } from "@/components/categories/CategoryCardSkeleton";
import { Input } from "@/components/ui/input";
import { getCategories } from "@/lib/api/categories";
import { getCategoryImage } from "@/lib/categoryImages";
import { buildMeta, getOrigin } from "@/lib/seo";
import type { CategoryWithImage } from "@/types/category";

const SEARCH_DEBOUNCE_MS = 400;

export async function loader({ request }: Route.LoaderArgs) {
  const res = await getCategories({ limit: 100, page: 1 });
  const categories: CategoryWithImage[] = res.data.items.map((cat, index) => ({
    ...cat,
    img: getCategoryImage(cat.slug, index),
  }));
  return { categories, origin: getOrigin(request) };
}

export function meta({ matches }: Route.MetaArgs) {
  return buildMeta(matches, {
    title: "Shop by Category",
    description: "Browse automotive parts by category: engine, suspension, brakes, exhaust and more, all fitted to your vehicle.",
    path: "/categories",
    pageKey: "categories",
  });
}

export default function CategoriesGrid({ loaderData }: Route.ComponentProps) {
  const [query, setQuery] = useState("");
  // Debounced, so the API is only called once they pause typing.
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [categories, setCategories] = useState<CategoryWithImage[]>(loaderData.categories);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // The loader already fetched the unfiltered list; skip refetching it.
  const skipNextFetch = useRef(true);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (skipNextFetch.current) {
      skipNextFetch.current = false;
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        // The API pages results, so ask for all; search matches server-side.
        const res = await getCategories({
          limit: 100,
          page: 1,
          search: debouncedQuery || undefined,
        });
        if (cancelled) return;

        const withImages: CategoryWithImage[] = res.data.items.map((cat, index) => ({
          ...cat,
          img: getCategoryImage(cat.slug, index),
        }));
        setCategories(withImages);
      } catch (err) {
        if (!cancelled) setError("Failed to load categories. Please try again.");
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Shop by Category" }]} />
      </div>

      <section className="rounded-2xl border border-border bg-bg-2 p-6 sm:p-8">
        <h1 className="font-display text-3xl font-black tracking-wide text-fg sm:text-4xl">Shop by Category</h1>
        <p className="mt-3 max-w-2xl text-fg-muted">
          Precision engineering across every system on your vehicle. Select a category to find
          compatible high-performance parts.
        </p>

        <div className="relative mt-6 max-w-md">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" />
          <Input
            placeholder="Search categories…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-11"
          />
        </div>
      </section>

      <div className="mt-10">
        {loading ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-border bg-bg-2 px-6 py-16 text-center text-fg-muted">
            {error}
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((c) => (
              <CategoryCard key={c._id} category={c} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-bg-2 px-6 py-16 text-center text-fg-muted">
            No categories match "{debouncedQuery}".
          </div>
        )}
      </div>
    </main>
  );
}
