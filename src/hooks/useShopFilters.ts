import { useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
  DEFAULT_SORT,
  SHOP_FILTER_PARAMS,
  type AuthenticityFilterValue,
  type ConditionFilterValue,
  type StockFilterValue,
} from "@/constants/shopFilters";
import { VEHICLE_PARAM_KEYS } from "@/context/VehicleContext";

export interface ShopFiltersState {
  categoryIds: string[];
  priceMin: string;
  priceMax: string;
  sort: string;
  page: number;
  stock: StockFilterValue | null;
  search: string;
  // Normally set via SearchFiltersModal rather than the sidebar (that modal
  // is temporarily disabled, see Layout.tsx) — read-only pass-through here,
  // same as `search`, but still applied to the API call and cleared by
  // "Clear All".
  condition: ConditionFilterValue | null;
  authenticity: AuthenticityFilterValue | null;
  mpn: string;
  sku: string;
}

export interface ShopFiltersApi extends ShopFiltersState {
  toggleCategory: (id: string) => void;
  setPriceMin: (value: string) => void;
  setPriceMax: (value: string) => void;
  setPriceRange: (min: string, max: string) => void;
  setSort: (value: string) => void;
  setPage: (page: number) => void;
  setStock: (value: StockFilterValue | null) => void;
  setSearch: (value: string) => void;
  setCondition: (value: ConditionFilterValue | null) => void;
  setAuthenticity: (value: AuthenticityFilterValue | null) => void;
  setMpn: (value: string) => void;
  setSku: (value: string) => void;
  clearAll: () => void;
}

const P = SHOP_FILTER_PARAMS;

// URL-backed shop filter state (Part Type, price range, sort, stock, page,
// plus condition/authenticity/mpn/sku from the search modal), following the
// same useSearchParams + {replace:true} pattern as useVehicle().
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
  const condition = (searchParams.get(P.condition) as ConditionFilterValue | null) ?? null;
  const authenticity = (searchParams.get(P.authenticity) as AuthenticityFilterValue | null) ?? null;
  const mpn = searchParams.get(P.mpn)?.trim() ?? "";
  const sku = searchParams.get(P.sku)?.trim() ?? "";

  // Applies a filter change and resets pagination back to page 1 in the
  // same update (replacing the old filterKey/prevFilterKey diffing hack).
  // Wrapped in useCallback (stable across renders as long as setSearchParams
  // is, which React Router guarantees) so consumers passed down to
  // React.memo'd components (e.g. <Select>) don't re-render needlessly.
  const updateFilters = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          mutate(params);
          params.delete(P.page);
          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const toggleCategory = useCallback(
    (id: string) => {
      updateFilters((params) => {
        const current = params.getAll(P.categories);
        params.delete(P.categories);
        const next = current.includes(id) ? current.filter((c) => c !== id) : [...current, id];
        next.forEach((c) => params.append(P.categories, c));
      });
    },
    [updateFilters],
  );

  const setPriceMin = useCallback(
    (value: string) => {
      updateFilters((params) => (value ? params.set(P.priceMin, value) : params.delete(P.priceMin)));
    },
    [updateFilters],
  );

  const setPriceMax = useCallback(
    (value: string) => {
      updateFilters((params) => (value ? params.set(P.priceMax, value) : params.delete(P.priceMax)));
    },
    [updateFilters],
  );

  // Sets both bounds in one atomic update. React Router's setSearchParams
  // builds its next value from the *current render's* searchParams closure,
  // not a live ref — so calling setPriceMin then setPriceMax back-to-back
  // runs both against the same stale snapshot, and the second call's
  // navigate() silently wins, undoing the first (e.g. clearing a price pill
  // removed price_max but brought price_min right back). Whenever two bounds
  // must change together, they have to go through a single updateFilters call.
  const setPriceRange = useCallback(
    (min: string, max: string) => {
      updateFilters((params) => {
        if (min) params.set(P.priceMin, min);
        else params.delete(P.priceMin);
        if (max) params.set(P.priceMax, max);
        else params.delete(P.priceMax);
      });
    },
    [updateFilters],
  );

  const setSort = useCallback(
    (value: string) => {
      updateFilters((params) =>
        value === DEFAULT_SORT ? params.delete(P.sort) : params.set(P.sort, value),
      );
    },
    [updateFilters],
  );

  const setStock = useCallback(
    (value: StockFilterValue | null) => {
      updateFilters((params) => (value ? params.set(P.stock, value) : params.delete(P.stock)));
    },
    [updateFilters],
  );

  // Setters for the search-modal-owned fields — needed so a filter pill's
  // remove button (or any other future consumer) can clear one of these
  // individually, without having to reopen the modal to do it.
  const setSearch = useCallback(
    (value: string) => {
      updateFilters((params) => (value ? params.set(P.search, value) : params.delete(P.search)));
    },
    [updateFilters],
  );

  const setCondition = useCallback(
    (value: ConditionFilterValue | null) => {
      updateFilters((params) => (value ? params.set(P.condition, value) : params.delete(P.condition)));
    },
    [updateFilters],
  );

  const setAuthenticity = useCallback(
    (value: AuthenticityFilterValue | null) => {
      updateFilters((params) =>
        value ? params.set(P.authenticity, value) : params.delete(P.authenticity),
      );
    },
    [updateFilters],
  );

  const setMpn = useCallback(
    (value: string) => {
      updateFilters((params) => (value ? params.set(P.mpn, value) : params.delete(P.mpn)));
    },
    [updateFilters],
  );

  const setSku = useCallback(
    (value: string) => {
      updateFilters((params) => (value ? params.set(P.sku, value) : params.delete(P.sku)));
    },
    [updateFilters],
  );

  const setPage = useCallback(
    (nextPage: number) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          if (nextPage <= 1) params.delete(P.page);
          else params.set(P.page, String(nextPage));
          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  // Full reset — every filter this hook and the search modal write into,
  // including search/sort/page and vehicle fitment, so "Clear All" from
  // either the sidebar or the modal actually returns to an unfiltered /shop
  // instead of leaving some params (e.g. vehicle, search) still applied.
  const clearAll = useCallback(() => {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        Object.values(P).forEach((key) => params.delete(key));
        VEHICLE_PARAM_KEYS.forEach((key) => params.delete(key));
        return params;
      },
      { replace: true },
    );
  }, [setSearchParams]);

  return {
    categoryIds,
    priceMin,
    priceMax,
    sort,
    page,
    stock,
    search,
    condition,
    authenticity,
    mpn,
    sku,
    toggleCategory,
    setPriceMin,
    setPriceMax,
    setPriceRange,
    setSort,
    setPage,
    setStock,
    setSearch,
    setCondition,
    setAuthenticity,
    setMpn,
    setSku,
    clearAll,
  };
}
