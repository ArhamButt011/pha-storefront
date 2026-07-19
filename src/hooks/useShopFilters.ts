import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { DEFAULT_SORT, SHOP_FILTER_PARAMS, type StockFilterValue } from "@/constants/shopFilters";

export interface ShopFiltersState {
  categoryIds: string[];
  priceMin: string;
  priceMax: string;
  sort: string;
  page: number;
  stock: StockFilterValue | null;
  search: string;
}

export interface ShopFiltersApi extends ShopFiltersState {
  toggleCategory: (id: string) => void;
  setPriceMin: (value: string) => void;
  setPriceMax: (value: string) => void;
  setSort: (value: string) => void;
  setPage: (page: number) => void;
  setStock: (value: StockFilterValue | null) => void;
  clearAll: () => void;
}

const P = SHOP_FILTER_PARAMS;

// URL-backed shop filter state (Part Type, price range, sort, stock, page),
// following the same useSearchParams + {replace:true} pattern as useVehicle().
export function useShopFilters(routeCategoryId?: string): ShopFiltersApi {
  const [searchParams, setSearchParams] = useSearchParams();

  // Seeds `categories` from the route's :categoryId exactly once, only if no
  // `categories` param is present yet — after that, checkboxes and the route
  // both just read/write the same query param instead of one overriding the other.
  const seeded = useRef(false);
  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    if (routeCategoryId && !searchParams.has(P.categories)) {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          params.set(P.categories, routeCategoryId);
          return params;
        },
        { replace: true },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeCategoryId]);

  const categoryIds = searchParams.getAll(P.categories);
  const priceMin = searchParams.get(P.priceMin) ?? "";
  const priceMax = searchParams.get(P.priceMax) ?? "";
  const sort = searchParams.get(P.sort) ?? DEFAULT_SORT;
  const page = Math.max(1, Number(searchParams.get(P.page) ?? "1") || 1);
  const stock = (searchParams.get(P.stock) as StockFilterValue | null) ?? null;
  const search = searchParams.get(P.search)?.trim() ?? "";

  // Applies a filter change and resets pagination back to page 1 in the
  // same update (replacing the old filterKey/prevFilterKey diffing hack).
  function updateFilters(mutate: (params: URLSearchParams) => void) {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        mutate(params);
        params.delete(P.page);
        return params;
      },
      { replace: true },
    );
  }

  function toggleCategory(id: string) {
    updateFilters((params) => {
      const current = params.getAll(P.categories);
      params.delete(P.categories);
      const next = current.includes(id) ? current.filter((c) => c !== id) : [...current, id];
      next.forEach((c) => params.append(P.categories, c));
    });
  }

  function setPriceMin(value: string) {
    updateFilters((params) => (value ? params.set(P.priceMin, value) : params.delete(P.priceMin)));
  }

  function setPriceMax(value: string) {
    updateFilters((params) => (value ? params.set(P.priceMax, value) : params.delete(P.priceMax)));
  }

  function setSort(value: string) {
    updateFilters((params) =>
      value === DEFAULT_SORT ? params.delete(P.sort) : params.set(P.sort, value),
    );
  }

  function setStock(value: StockFilterValue | null) {
    updateFilters((params) => (value ? params.set(P.stock, value) : params.delete(P.stock)));
  }

  function setPage(nextPage: number) {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        if (nextPage <= 1) params.delete(P.page);
        else params.set(P.page, String(nextPage));
        return params;
      },
      { replace: true },
    );
  }

  function clearAll() {
    updateFilters((params) => {
      params.delete(P.categories);
      params.delete(P.priceMin);
      params.delete(P.priceMax);
      params.delete(P.stock);
    });
  }

  return {
    categoryIds,
    priceMin,
    priceMax,
    sort,
    page,
    stock,
    search,
    toggleCategory,
    setPriceMin,
    setPriceMax,
    setSort,
    setPage,
    setStock,
    clearAll,
  };
}
