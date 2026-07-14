import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { VehicleChip } from "@/components/products/VehicleChip";
import { FilterSidebar, type FacetOption } from "@/components/products/FilterSidebar";
import { ResultsHeader } from "@/components/products/ResultsHeader";
import { ProductCard } from "@/components/products/ProductCard";
import { Pagination } from "@/components/ui/pagination";
import type { Product } from "@/data/products";
import { useVehicle } from "@/context/VehicleContext";
import { getCategory } from "@/lib/api/categories";
import { getProducts } from "@/lib/api/product";
import { mapApiProductToProduct } from "@/utils/mapApiProduct";
import type { ApiCategory } from "@/types/category";
import type { ApiProduct } from "@/types/apiProduct";

const PAGE_SIZE = 9;

// Debounce delay (ms) before price min/max typing triggers a real API call.
const PRICE_DEBOUNCE_MS = 400;

// Maps the UI's sort options to the backend's `sort` query values. "newest"
// and "rating" have no corresponding backend sort yet (rating isn't part of
// the product API's response), so they're left as the default (unsorted /
// server default) order rather than sent as a param.
function mapSortToApiParam(sort: string): string | undefined {
  switch (sort) {
    case "price-asc":
      return "price_low_high";
    case "price-desc":
      return "price_high_low";
    default:
      return undefined;
  }
}

// Builds the "Part Type" facet from each product's real categories array
// (not just its primary category), so counts reflect every category a
// product belongs to and the ids are real backend category ids.
function buildCategoryFacets(products: ApiProduct[]): FacetOption[] {
  const counts = new Map<string, { name: string; count: number }>();
  for (const p of products) {
    for (const c of p.categories ?? []) {
      const entry = counts.get(c._id);
      if (entry) entry.count += 1;
      else counts.set(c._id, { name: c.name, count: 1 });
    }
  }
  return Array.from(counts.entries()).map(([id, v]) => ({ id, name: v.name, count: v.count }));
}

export function ProductsListing() {
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search")?.trim() ?? "";
  const { vehicle } = useVehicle();

  const [category, setCategory] = useState<ApiCategory | null>(null);
  const [rawProducts, setRawProducts] = useState<ApiProduct[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedPartTypeIds, setSelectedPartTypeIds] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  // Debounced price inputs — the fields update instantly for typing, but the
  // API call (and the price_min/price_max query params) only fire after the
  // person pauses, instead of on every keystroke.
  const [debouncedPriceMin, setDebouncedPriceMin] = useState("");
  const [debouncedPriceMax, setDebouncedPriceMax] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedPriceMin(priceMin), PRICE_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [priceMin]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedPriceMax(priceMax), PRICE_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [priceMax]);

  const prevFilterKey = useRef<string>("");

  // Everything except `page` that should reset pagination back to page 1
  // when it changes (new category/search, a Part Type toggle, a price
  // range edit, a sort change, or applying/clearing the selected vehicle
  // via "Find Parts").
  const filterKey = [
    categoryId ?? "",
    searchTerm,
    selectedPartTypeIds.join(","),
    debouncedPriceMin,
    debouncedPriceMax,
    sort,
    vehicle?.make ?? "",
    vehicle?.model ?? "",
    vehicle?.model_code ?? "",
    vehicle?.year_from ?? "",
  ].join("|");

  // Fetches the category (title/breadcrumb) + products whenever the route,
  // search term, selected Part Type checkboxes, price range, sort, or
  // applied vehicle fitment change. All of these are sent straight through
  // to GET /product as real query params rather than filtered/sorted
  // client-side.
  useEffect(() => {
    let cancelled = false;

    const filterChanged = prevFilterKey.current !== filterKey;
    prevFilterKey.current = filterKey;
    const effectivePage = filterChanged ? 1 : page;

    if (filterChanged && page !== 1) {
      setPage(1);
    }

    async function load() {
      setLoading(true);
      setError(null);
      try {
        // Checked Part Types take over as the active category filter;
        // with none checked, the route's :categoryId (if any) applies.
        const effectiveCategories =
          selectedPartTypeIds.length > 0 ? selectedPartTypeIds.join(",") : categoryId;

        const [categoryRes, productsRes] = await Promise.all([
          categoryId ? getCategory(categoryId) : Promise.resolve(null),
          getProducts({
            page: effectivePage,
            limit: PAGE_SIZE,
            categories: effectiveCategories,
            search: searchTerm || undefined,
            price_min: debouncedPriceMin ? Number(debouncedPriceMin) : undefined,
            price_max: debouncedPriceMax ? Number(debouncedPriceMax) : undefined,
            sort: mapSortToApiParam(sort),
            make: vehicle?.make || undefined,
            model: vehicle?.model || undefined,
            model_code: vehicle?.model_code || undefined,
            year: vehicle?.year_from || undefined,
          }),
        ]);

        if (cancelled) return;
        setCategory(categoryRes?.data ?? null);
        setRawProducts(productsRes.data.items);
        setCategoryProducts(productsRes.data.items.map(mapApiProductToProduct));
        setTotal(productsRes.data.total);
        setTotalPages(Math.max(1, productsRes.data.totalPages));
      } catch (err) {
        if (!cancelled) setError("Failed to load products. Please try again.");
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey, page]);

  // Part Type checkbox counts are derived from the current server response
  // (already scoped to this category/search/vehicle/price query).
  const partTypeFacets = useMemo(() => buildCategoryFacets(rawProducts), [rawProducts]);

  function togglePartType(id: string) {
    setSelectedPartTypeIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  }

  function clearAll() {
    setSelectedPartTypeIds([]);
    setPriceMin("");
    setPriceMax("");
  }

  const title = searchTerm
    ? `Search results for "${searchTerm}"`
    : category?.name ?? "All Parts";
  const description = searchTerm
    ? `Showing parts matching "${searchTerm}"${category ? ` in ${category.name}` : ""}.`
    : category
    ? `Browse our full range of ${category.name.toLowerCase()} parts for your vehicle.`
    : "Browse our full range of performance parts for your vehicle.";
  const breadcrumbItems = category
    ? [{ label: "Home", href: "/" }, { label: "Categories", href: "/categories" }, { label: category.name }]
    : [{ label: "Home", href: "/" }, { label: searchTerm ? "Search Results" : "All Parts" }];

  const vehicleLabel = vehicle?.make
    ? [vehicle.make, vehicle.model, vehicle.model_code].filter(Boolean).join(" ")
    : undefined;

  return (
    <main className="mx-auto max-w-7xl px-4 pb-8 pt-28 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Breadcrumb items={breadcrumbItems} />
        {vehicle?.make && <VehicleChip vehicle={vehicle} />}
      </div>

      <div className="mb-8">
        <h1 className="font-display text-3xl font-black tracking-wide text-fg sm:text-4xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-fg-muted">{description}</p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <FilterSidebar
          partTypes={partTypeFacets}
          selectedPartTypeIds={selectedPartTypeIds}
          onTogglePartType={togglePartType}
          priceMin={priceMin}
          priceMax={priceMax}
          onPriceMinChange={setPriceMin}
          onPriceMaxChange={setPriceMax}
          onClearAll={clearAll}
          vehicleFitmentLabel={vehicleLabel}
        />

        <div className="min-w-0 flex-1">
          <ResultsHeader count={total} sort={sort} onSortChange={setSort} />

          {loading ? (
            <div className="rounded-2xl border border-border bg-bg-2 px-6 py-16 text-center text-fg-muted">
              Loading parts…
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-border bg-bg-2 px-6 py-16 text-center text-fg-muted">
              {error}
            </div>
          ) : categoryProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {categoryProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-bg-2 px-6 py-16 text-center text-fg-muted">
              No parts match your current filters.
            </div>
          )}

          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} className="mt-10" />
        </div>
      </div>
    </main>
  );
}