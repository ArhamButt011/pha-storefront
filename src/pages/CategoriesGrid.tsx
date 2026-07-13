import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { Input } from "@/components/ui/input";
import { getCategories } from "@/lib/api/categories";
import { getCategoryImage } from "@/lib/categoryImages";
import type { CategoryWithImage } from "@/types/category";

export function CategoriesGrid() {
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<CategoryWithImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await getCategories();
        if (cancelled) return;

        const withImages: CategoryWithImage[] = res.data.map((cat, index) => ({
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
  }, []);

  const filtered = useMemo(
    () => categories.filter((c) => c.name.toLowerCase().includes(query.trim().toLowerCase())),
    [categories, query],
  );

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
          <div className="rounded-2xl border border-border bg-bg-2 px-6 py-16 text-center text-fg-muted">
            Loading categories…
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-border bg-bg-2 px-6 py-16 text-center text-fg-muted">
            {error}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((c) => (
              <CategoryCard key={c._id} category={c} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-bg-2 px-6 py-16 text-center text-fg-muted">
            No categories match "{query}".
          </div>
        )}
      </div>
    </main>
  );
}