// Query param keys used by the shop page filters — kept as constants so the
// hook, FilterSidebar, and ProductsListing all reference the same names.
export const SHOP_FILTER_PARAMS = {
  categories: "categories",
  priceMin: "price_min",
  priceMax: "price_max",
  sort: "sort",
  page: "page",
  stock: "stock",
  search: "search",
} as const;

export const DEFAULT_SORT = "newest";

export type StockFilterValue = "in_stock" | "out_of_stock";
