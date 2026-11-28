import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigation } from "react-router-dom";
import type { Route } from "./+types/ProductsListing";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { ActiveFilters } from "@/components/products/ActiveFilters";
import { FilterSidebar, type FacetOption } from "@/components/products/FilterSidebar";
import { ResultsHeader } from "@/components/products/ResultsHeader";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductGridSkeleton } from "@/components/products/ProductGridSkeleton";
import { Pagination } from "@/components/ui/pagination";
import { useVehicle } from "@/context/VehicleContext";
import { useShopFilters } from "@/hooks/useShopFilters";
import { getCategory, getCategories } from "@/lib/api/categories";
import { getProducts } from "@/lib/api/product";
import { mapApiProductToProduct } from "@/utils/mapApiProduct";
import { buildMeta, getOrigin } from "@/lib/seo";
import {
  SHOP_FILTER_PARAMS,
  DEFAULT_SORT,
  type StockFilterValue,
  type ConditionFilterValue,
  type AuthenticityFilterValue,
} from "@/constants/shopFilters";

const PAGE_SIZE = 9;

// UI sort to API sort; "newest" and "rating" have no API sort, so default.
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

// Reads params exactly as useShopFilters does, so SSR matches the client.
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
  const condition = (sp.get(P.condition) as ConditionFilterValue | null) ?? undefined;
  const authenticity = (sp.get(P.authenticity) as AuthenticityFilterValue | null) ?? undefined;
  const mpn = sp.get(P.mpn)?.trim() || undefined;
  const sku = sp.get(P.sku)?.trim() || undefined;

  const make = sp.get("make") || undefined;
  const model = sp.get("model") || undefined;
  const model_code = sp.get("model_code") || undefined;
  const year_from = sp.get("year_from") || undefined;

  const origin = getOrigin(request);

  // Facet counts follow the other filters but never `categories` itself.
  const sharedFilterParams = {
    search,
    price_min: priceMin ? Number(priceMin) : undefined,
    price_max: priceMax ? Number(priceMax) : undefined,
    condition,
    authenticity,
    mpn,
    sku,
    make,
    model,
    model_code,
    year: year_from,
  };

  try {
    const [categoryRes, productsRes, partTypesRes] = await Promise.all([
      params.categoryId ? getCategory(params.categoryId) : Promise.resolve(null),
      getProducts({
        ...sharedFilterParams,
        page,
        limit: PAGE_SIZE,
        categories: categoryIds.length ? categoryIds.join(",") : undefined,
        sort: mapSortToApiParam(sort),
        stock,
      }),
      getCategories({ ...sharedFilterParams, limit: 100 }),
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

export function meta({ data, matches, params }: Route.MetaArgs) {
  if (!data) return [];
  const { category } = data;
  return buildMeta(matches, {
    title: category ? category.name : "Shop All Parts",
    description: category
      ? category.description || `Browse our full range of ${category.name.toLowerCase()} parts for your vehicle.`
      : "Browse our full range of performance parts for your vehicle.",
    path: params.categoryId ? `/shop/${params.categoryId}` : "/shop",
    seo: category?.seo,
    pageKey: category ? undefined : "shop",
  });
}

export default function ProductsListing({ loaderData }: Route.ComponentProps) {
  const { categoryId } = useParams();
  const filters = useShopFilters(categoryId);
  const { vehicle } = useVehicle();
  const navigation = useNavigation();
  // A navigation here is a filter or page change re-running the loader.
  const loading = navigation.state !== "idle";

  const category = loaderData.category;
  const partTypes: FacetOption[] = loaderData.partTypes;
  const categoryProducts = loaderData.products.map(mapApiProductToProduct);
  const total = loaderData.total;
  const totalPages = loaderData.totalPages;

  // Inputs update as typed; the URL (and loader) only after a pause.
  const [priceMinInput, setPriceMinInput] = useState(filters.priceMin);
  const [priceMaxInput, setPriceMaxInput] = useState(filters.priceMax);

  const PRICE_DEBOUNCE_MS = 400;

  // One debounce for both bounds: two separate setters race and drop one.
  useEffect(() => {
    const timer = setTimeout(() => {
      // Skip no-op writes: every setter resets `page`, losing the URL's page.
      if (priceMinInput !== filters.priceMin || priceMaxInput !== filters.priceMax) {
        filters.setPriceRange(priceMinInput, priceMaxInput);
      }
    }, PRICE_DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceMinInput, priceMaxInput]);

  // Stable reference, or the memoised FilterSidebar re-renders every time.
  const clearAll = useCallback(() => {
    setPriceMinInput("");
    setPriceMaxInput("");
    filters.clearAll();
  }, [filters.clearAll]);

  // Clears the local inputs too, in one setPriceRange call (see above).
  const clearPrice = useCallback(() => {
    setPriceMinInput("");
    setPriceMaxInput("");
    filters.setPriceRange("", "");
  }, [filters.setPriceRange]);

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
        <ActiveFilters filters={filters} categories={partTypes} vehicle={vehicle} onClearPrice={clearPrice} />
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
            <ProductGridSkeleton count={PAGE_SIZE} />
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
