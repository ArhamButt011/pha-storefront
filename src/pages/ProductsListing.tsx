import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { VehicleChip } from "@/components/products/VehicleChip";
import { FilterSidebar, type FacetOption } from "@/components/products/FilterSidebar";
import { ResultsHeader } from "@/components/products/ResultsHeader";
import { ProductCard } from "@/components/products/ProductCard";
import { Pagination } from "@/components/ui/pagination";
import type { Product } from "@/data/products";
import { useVehicle } from "@/context/VehicleContext";
import { useShopFilters } from "@/hooks/useShopFilters";
import { getCategory, getCategories } from "@/lib/api/categories";
import { getProducts } from "@/lib/api/product";
import { mapApiProductToProduct } from "@/utils/mapApiProduct";
import type { ApiCategory } from "@/types/category";

const PAGE_SIZE = 9;

// Debounce delay (ms) before price min/max typing triggers a real API call
// (and gets written into the price_min/price_max query params).
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

export function ProductsListing() {
  const { categoryId } = useParams();
  const filters = useShopFilters(categoryId);
  const { vehicle } = useVehicle();

  const [category, setCategory] = useState<ApiCategory | null>(null);
  const [partTypes, setPartTypes] = useState<FacetOption[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Price inputs update instantly for typing, but only get written into the
  // price_min/price_max query params (and trigger a real API call) after the
  // person pauses, instead of on every keystroke.
  const [priceMinInput, setPriceMinInput] = useState(filters.priceMin);
  const [priceMaxInput, setPriceMaxInput] = useState(filters.priceMax);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Skip no-op writes (e.g. on mount, before the user has typed anything) —
      // every filter setter also resets `page`, so writing back an unchanged
      // value would wipe out a page number restored from the URL on load.
      if (priceMinInput !== filters.priceMin) filters.setPriceMin(priceMinInput);
    }, PRICE_DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceMinInput]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (priceMaxInput !== filters.priceMax) filters.setPriceMax(priceMaxInput);
    }, PRICE_DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceMaxInput]);

  // Real, catalog-wide "Part Type" facet counts — fetched once on mount from
  // the categories API, independent of whatever other filters are active.
  useEffect(() => {
    let cancelled = false;
    getCategories({ limit: 100 })
      .then((res) => {
        if (cancelled) return;
        setPartTypes(
          res.data.items.map((c) => ({ id: c._id, name: c.name, count: c.product_count ?? 0 })),
        );
      })
      .catch(console.error);
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetches the category (title/breadcrumb) + products whenever any filter
  // (categories, search, price range, sort, stock, page) or the applied
  // vehicle fitment changes — everything is a real GET /product query param.
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [categoryRes, productsRes] = await Promise.all([
          categoryId ? getCategory(categoryId) : Promise.resolve(null),
          getProducts({
            page: filters.page,
            limit: PAGE_SIZE,
            categories: filters.categoryIds.length ? filters.categoryIds.join(",") : undefined,
            search: filters.search || undefined,
            price_min: filters.priceMin ? Number(filters.priceMin) : undefined,
            price_max: filters.priceMax ? Number(filters.priceMax) : undefined,
            sort: mapSortToApiParam(filters.sort),
            stock: filters.stock ?? undefined,
            make: vehicle?.make || undefined,
            model: vehicle?.model || undefined,
            model_code: vehicle?.model_code || undefined,
            year: vehicle?.year_from || undefined,
          }),
        ]);

        if (cancelled) return;
        setCategory(categoryRes?.data ?? null);
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
  }, [
    categoryId,
    filters.categoryIds.join(","),
    filters.search,
    filters.priceMin,
    filters.priceMax,
    filters.sort,
    filters.stock,
    filters.page,
    vehicle?.make,
    vehicle?.model,
    vehicle?.model_code,
    vehicle?.year_from,
  ]);

  function clearAll() {
    setPriceMinInput("");
    setPriceMaxInput("");
    filters.clearAll();
  }

  const title = filters.search
    ? `Search results for "${filters.search}"`
    : category?.name ?? "All Parts";
  const description = filters.search
    ? `Showing parts matching "${filters.search}"${category ? ` in ${category.name}` : ""}.`
    : category
    ? `Browse our full range of ${category.name.toLowerCase()} parts for your vehicle.`
    : "Browse our full range of performance parts for your vehicle.";
  const breadcrumbItems = category
    ? [{ label: "Home", href: "/" }, { label: "Categories", href: "/categories" }, { label: category.name }]
    : [{ label: "Home", href: "/" }, { label: filters.search ? "Search Results" : "All Parts" }];

  const vehicleLabel = vehicle?.make
    ? [vehicle.make, vehicle.model, vehicle.model_code].filter(Boolean).join(" ")
    : undefined;

  return (
    <main className="mx-auto max-w-7xl px-4 pb-8 lg:pt-28 pt-20 sm:px-6 lg:px-8">
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
          partTypes={partTypes}
          selectedPartTypeIds={filters.categoryIds}
          onTogglePartType={filters.toggleCategory}
          priceMin={priceMinInput}
          priceMax={priceMaxInput}
          onPriceMinChange={setPriceMinInput}
          onPriceMaxChange={setPriceMaxInput}
          stock={filters.stock}
          onStockChange={filters.setStock}
          onClearAll={clearAll}
          vehicleFitmentLabel={vehicleLabel}
        />

        <div className="min-w-0 flex-1">
          <ResultsHeader count={total} sort={filters.sort} onSortChange={filters.setSort} />

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

          <Pagination page={filters.page} totalPages={totalPages} onPageChange={filters.setPage} className="mt-10" />
        </div>
      </div>
    </main>
  );
}
