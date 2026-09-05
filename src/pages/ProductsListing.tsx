import { useEffect, useState } from "react";
import { useParams, useNavigation } from "react-router-dom";
import type { Route } from "./+types/ProductsListing";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { VehicleChip } from "@/components/products/VehicleChip";
import { FilterSidebar, type FacetOption } from "@/components/products/FilterSidebar";
import { ResultsHeader } from "@/components/products/ResultsHeader";
import { ProductCard } from "@/components/products/ProductCard";
import { Pagination } from "@/components/ui/pagination";
import { useVehicle } from "@/context/VehicleContext";
import { useShopFilters } from "@/hooks/useShopFilters";
import { getCategory, getCategories } from "@/lib/api/categories";
import { getProducts } from "@/lib/api/product";
import { mapApiProductToProduct } from "@/utils/mapApiProduct";
import { getOrigin } from "@/lib/seo";
import { SHOP_FILTER_PARAMS, DEFAULT_SORT, type StockFilterValue } from "@/constants/shopFilters";

const PAGE_SIZE = 9;

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

// Mirrors useShopFilters.ts's URL-param reading exactly (including the
// route :categoryId -> `categories` param fallback that hook seeds via a
// client effect) so the loader's first fetch already reflects what the
// client would otherwise only reach a render later.
export async function loader({ request, params }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const sp = url.searchParams;
  const P = SHOP_FILTER_PARAMS;

  const categoryIds = sp.getAll(P.categories);
  if (categoryIds.length === 0 && params.categoryId) categoryIds.push(params.categoryId);

  const priceMin = sp.get(P.priceMin) ?? "";
  const priceMax = sp.get(P.priceMax) ?? "";
  const sort = sp.get(P.sort) ?? DEFAULT_SORT;
  const page = Math.max(1, Number(sp.get(P.page) ?? "1") || 1);
  const stock = (sp.get(P.stock) as StockFilterValue | null) ?? undefined;
  const search = sp.get(P.search)?.trim() || undefined;

  const make = sp.get("make") || undefined;
  const model = sp.get("model") || undefined;
  const model_code = sp.get("model_code") || undefined;
  const year_from = sp.get("year_from") || undefined;

  const origin = getOrigin(request);

  try {
    const [categoryRes, productsRes, partTypesRes] = await Promise.all([
      params.categoryId ? getCategory(params.categoryId) : Promise.resolve(null),
      getProducts({
        page,
        limit: PAGE_SIZE,
        categories: categoryIds.length ? categoryIds.join(",") : undefined,
        search,
        price_min: priceMin ? Number(priceMin) : undefined,
        price_max: priceMax ? Number(priceMax) : undefined,
        sort: mapSortToApiParam(sort),
        stock,
        make,
        model,
        model_code,
        year: year_from,
      }),
      getCategories({ limit: 100 }),
    ]);

    return {
      category: categoryRes?.data ?? null,
      products: productsRes.data.items,
      total: productsRes.data.total,
      totalPages: Math.max(1, productsRes.data.totalPages),
      partTypes: partTypesRes.data.items.map((c) => ({
        id: c._id,
        name: c.name,
        count: c.product_count ?? 0,
      })),
      origin,
      error: null as string | null,
    };
  } catch (err) {
    console.error(err);
    return {
      category: null,
      products: [],
      total: 0,
      totalPages: 1,
      partTypes: [],
      origin,
      error: "Failed to load products. Please try again.",
    };
  }
}

export function meta({ data }: Route.MetaArgs) {
  if (!data) return [];
  const title = data.category ? `${data.category.name} | Parts Hub Australia` : "Shop All Parts | Parts Hub Australia";
  const description = data.category
    ? `Browse our full range of ${data.category.name.toLowerCase()} parts for your vehicle.`
    : "Browse our full range of performance parts for your vehicle.";

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: `${data.origin}/shop` },
  ];
}

export default function ProductsListing({ loaderData }: Route.ComponentProps) {
  const { categoryId } = useParams();
  const filters = useShopFilters(categoryId);
  const { vehicle } = useVehicle();
  const navigation = useNavigation();
  // Any in-flight navigation on this route is a filter/page change — the
  // loader re-runs automatically on every search-param change, replacing
  // the old useEffect+getProducts fetch-on-filter-change entirely.
  const loading = navigation.state !== "idle";

  const category = loaderData.category;
  const partTypes: FacetOption[] = loaderData.partTypes;
  const categoryProducts = loaderData.products.map(mapApiProductToProduct);
  const total = loaderData.total;
  const totalPages = loaderData.totalPages;

  // Price inputs update instantly for typing, but only get written into the
  // price_min/price_max query params (and trigger a loader re-run) after
  // the person pauses, instead of on every keystroke.
  const [priceMinInput, setPriceMinInput] = useState(filters.priceMin);
  const [priceMaxInput, setPriceMaxInput] = useState(filters.priceMax);

  const PRICE_DEBOUNCE_MS = 400;

  useEffect(() => {
    const timer = setTimeout(() => {
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
          ) : loaderData.error ? (
            <div className="rounded-2xl border border-border bg-bg-2 px-6 py-16 text-center text-fg-muted">
              {loaderData.error}
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
