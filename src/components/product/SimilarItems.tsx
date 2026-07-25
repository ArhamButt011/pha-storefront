import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductGridSkeleton } from "@/components/products/ProductGridSkeleton";
import { getProducts } from "@/lib/api/product";
import { mapApiProductToProduct } from "@/utils/mapApiProduct";
import type { Product } from "@/data/products";

const SIMILAR_ITEMS_LIMIT = 4;

export interface SimilarItemsProps {
  categoryId?: string;
  categorySlug: string;
  categoryTitle?: string;
  excludeProductId: string;
}

// Same-category products, excluding the one currently being viewed — the
// closest fit to a listing page's "Similar Items" without a real
// recommendation/similarity engine behind it.
//
// The `categories` filter on the product list API only matches Mongo
// ObjectIds (see server/src/utils/productFilter.js) — a slug is silently
// ignored, which would fall back to an unfiltered "most recent products"
// list. So this must be filtered by categoryId, not categorySlug.
export function SimilarItems({ categoryId, categorySlug, categoryTitle, excludeProductId }: SimilarItemsProps) {
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    setProducts(null);

    if (!categoryId) {
      setProducts([]);
      return;
    }

    getProducts({ categories: categoryId, limit: SIMILAR_ITEMS_LIMIT })
      .then((res) => {
        if (cancelled) return;
        const mapped = res.data.items
          .map(mapApiProductToProduct)
          .filter((p) => p.id !== excludeProductId);
        setProducts(mapped);
      })
      .catch((err) => {
        if (!cancelled) setProducts([]);
        console.error(err);
      });

    return () => {
      cancelled = true;
    };
  }, [categoryId, excludeProductId]);

  if (products !== null && products.length === 0) return null;

  return (
    <div className="mt-16 border-t border-border pt-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
        <h2 className="font-display text-xl font-black text-fg sm:text-2xl">Similar Items</h2>
        {categorySlug && (
          <Link
            to={`/shop/${categorySlug}`}
            className="text-sm font-semibold text-accent hover:underline"
          >
            See all{categoryTitle ? ` in ${categoryTitle}` : ""}
          </Link>
        )}
      </div>

      {products === null ? (
        <ProductGridSkeleton count={SIMILAR_ITEMS_LIMIT} className="sm:grid-cols-2 xl:grid-cols-4" />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
