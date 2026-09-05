import { apiClient } from "./client";
import type { BeResponse, PaginatedData } from "./base";
import type { ApiCategory } from "@/types/category";
import type {
  AuthenticityFilterValue,
  ConditionFilterValue,
} from "@/constants/shopFilters";

// Filter fields mirror ProductListParams (lib/api/product.ts) — passing the
// same active shop filters here makes each category's product_count reflect
// the current search/vehicle/price/condition selection instead of a static
// catalog-wide total.
export interface CategoryListParams {
  limit?: number;
  page?: number;
  search?: string;
  price_min?: number;
  price_max?: number;
  make?: string;
  model?: string;
  model_code?: string;
  year?: string | number;
  condition?: ConditionFilterValue;
  authenticity?: AuthenticityFilterValue;
  mpn?: string;
  sku?: string;
}
export const getCategories = async (params: CategoryListParams = {}) => {
  const { data } = await apiClient.get<BeResponse<PaginatedData<ApiCategory>>>("/category", {
    params,
  });
  return data;
};

export const getCategory = async (id: string) => {
  const { data } = await apiClient.get<BeResponse<ApiCategory>>(`/category/${id}`);
  return data;
};