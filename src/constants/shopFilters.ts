// Query param keys used by the shop page filters — kept as constants so the
// hook, FilterSidebar, SearchFiltersModal, and ProductsListing all reference
// the same names.
export const SHOP_FILTER_PARAMS = {
  categories: "categories",
  priceMin: "price_min",
  priceMax: "price_max",
  sort: "sort",
  page: "page",
  stock: "stock",
  search: "search",
  condition: "condition",
  authenticity: "authenticity",
  mpn: "mpn",
  sku: "sku",
} as const;

export const DEFAULT_SORT = "newest";

export type StockFilterValue = "in_stock" | "out_of_stock";

// Mirrors the backend's PRODUCT_CONDITION / PRODUCT_AUTHENTICITY enums
// (server/src/constants/product.constants.js) — keep in sync with those.
export type ConditionFilterValue = "NEW" | "USED";
export type AuthenticityFilterValue = "Genuine" | "Aftermarket";

// Single source of truth for display labels — used by both the search
// modal's <Select> options and the shop page's active-filter pills, so the
// two never drift apart.
export const CONDITION_LABELS: Record<ConditionFilterValue, string> = {
  NEW: "New",
  USED: "Used",
};

export const AUTHENTICITY_LABELS: Record<AuthenticityFilterValue, string> = {
  Genuine: "Genuine",
  Aftermarket: "Aftermarket",
};
