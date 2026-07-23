import { useEffect, useState } from "react";
import { Loader2, PackageSearch } from "lucide-react";
import { getProducts } from "@/lib/api/product";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { mapApiProductToProduct } from "@/utils/mapApiProduct";
import { formatCurrency } from "@/utils/currency";
import type { Product } from "@/data/products";

const MIN_QUERY_LENGTH = 1;
const SEARCH_DEBOUNCE_MS = 300;
const MAX_RESULTS = 6;

export interface LiveSearchResultsProps {
  query: string;
  onSelectProduct: (product: Product) => void;
  onViewAll: () => void;
}

// Google-style live results: matches against part number/title/SKU/keywords
// (tags)/description server-side (see product.controller.js's `search`
// filter), debounced so every keystroke doesn't fire a request.
export function LiveSearchResults({ query, onSelectProduct, onViewAll }: LiveSearchResultsProps) {
  const debouncedQuery = useDebouncedValue(query.trim(), SEARCH_DEBOUNCE_MS);
  const [results, setResults] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (debouncedQuery.length < MIN_QUERY_LENGTH) {
      setResults([]);
      setTotal(0);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getProducts({ search: debouncedQuery, limit: MAX_RESULTS })
      .then((res) => {
        if (cancelled) return;
        setResults(res.data.items.map(mapApiProductToProduct));
        setTotal(res.data.total);
      })
      .catch(() => {
        if (cancelled) return;
        setResults([]);
        setTotal(0);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  if (debouncedQuery.length < MIN_QUERY_LENGTH) return null;

  return (
    <div className="mt-2 overflow-hidden rounded-lg border border-border bg-bg-2 shadow-lg">
      {loading ? (
        <div className="flex items-center gap-2 px-4 py-4 text-sm text-fg-muted">
          <Loader2 className="h-4 w-4 animate-spin" />
          Searching…
        </div>
      ) : results.length === 0 ? (
        <div className="flex items-center gap-2 px-4 py-4 text-sm text-fg-muted">
          <PackageSearch className="h-4 w-4 shrink-0" />
          No parts match &quot;{debouncedQuery}&quot;
        </div>
      ) : (
        <>
          <ul className="max-h-72 divide-y divide-border overflow-y-auto">
            {results.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => onSelectProduct(p)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-bg-3"
                >
                  <img
                    src={p.img}
                    alt=""
                    className="h-10 w-10 shrink-0 rounded-md border border-border object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-fg">{p.title}</p>
                    <p className="truncate text-xs text-fg-muted">
                      {p.sku ? `SKU: ${p.sku}` : p.mpn ? `MPN: ${p.mpn}` : ""}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-accent">{formatCurrency(p.price)}</span>
                </button>
              </li>
            ))}
          </ul>
          {total > results.length && (
            <button
              type="button"
              onClick={onViewAll}
              className="w-full border-t border-border px-4 py-2.5 text-center text-xs font-semibold text-accent hover:bg-bg-3"
            >
              View all {total} results
            </button>
          )}
        </>
      )}
    </div>
  );
}
