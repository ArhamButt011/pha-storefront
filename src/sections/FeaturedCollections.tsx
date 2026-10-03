import { useScrollReveal } from "@/hooks/useScrollReveal";
import { CollectionCard } from "@/components/categories/CollectionCard";
import type { FeaturedCollectionLink } from "@/types/category";

export function FeaturedCollections({ collections }: { collections: FeaturedCollectionLink[] }) {
  const headRef = useScrollReveal<HTMLDivElement>(0.2);
  const gridRef = useScrollReveal<HTMLDivElement>(0.1);

  if (!collections.length) return null;

  return (
    <section id="collections" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={headRef} className="reveal mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Featured Collections</p>
          <h2 className="mt-2 font-display text-2xl font-black tracking-wide text-fg sm:text-3xl">Bundles &amp; Body Kits</h2>
        </div>

        <div ref={gridRef} className="stagger grid grid-cols-1 gap-6 md:grid-cols-2">
          {collections.map((c) => (
            <CollectionCard key={c.slug} collection={c} />
          ))}
        </div>
      </div>
    </section>
  );
}
