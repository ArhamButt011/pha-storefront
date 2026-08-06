import { apiClient } from "./client";
import type { BeResponse } from "./base";
import type { ApiProduct, ApiProductSuggestion } from "@/types/apiProduct";
import type {
  AuthenticityFilterValue,
  ConditionFilterValue,
  StockFilterValue,
} from "@/constants/shopFilters";

export interface ProductListParams {
  page?: number;
  search?: string;
  categories?: string;
  type?: string;
  limit?: number;
  price_min?: number;
  price_max?: number;
  sort?: string;
  make?: string;
  model?: string;
  model_code?: string;
  year?: string | number;
  stock?: StockFilterValue;
  condition?: ConditionFilterValue;
  authenticity?: AuthenticityFilterValue;
  mpn?: string;
  sku?: string;
}

export interface ProductListData {
  items: ApiProduct[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const getProducts = async (params: ProductListParams = {}) => {
  const { data } = await apiClient.get<BeResponse<ProductListData>>(
    "/product",
    { params },
  );
  return data;
};

export const getProductBySlug = async (slug: string) => {
  const { data } = await apiClient.get<BeResponse<ApiProduct>>(
    `/product/${slug}`,
  );
  return data;
};

export interface SuggestProductsData {
  items: ApiProductSuggestion[];
  total: number;
}

// Typesense-backed autocomplete (fuzzy/prefix match, ranked SKU/MPN/title
// first) — used by the header search bar's live dropdown instead of a full
// `getProducts({search, limit})` call. See product.controller.js#suggestProducts.
export const getSearchSuggestions = async (q: string, limit = 6) => {
  const { data } = await apiClient.get<BeResponse<SuggestProductsData>>(
    "/product/search/suggest",
    { params: { q, limit } },
  );
  return data;
};