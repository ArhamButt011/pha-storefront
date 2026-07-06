import { useState } from "react";
import { Search } from "lucide-react";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { Input } from "@/components/ui/input";
import { CATEGORIES } from "@/data/categories";

export function CategoriesGrid() {
  const [query, setQuery] = useState("");

  const categories = CATEGORIES.filter((c) =>
    c.title.toLowerCase().includes(query.trim().toLowerCase()),
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
        {categories.length > 0 ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((c) => (
              <CategoryCard key={c.slug} category={c} />
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
