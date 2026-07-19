import { apiClient } from "./client";
import type { BeResponse } from "./base";
import type { ApiProduct } from "@/types/apiProduct";
import type { StockFilterValue } from "@/constants/shopFilters";

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