import { apiClient } from "./client";
import type { BeResponse } from "./base";
import type { ApiProduct } from "@/types/apiProduct";

export interface ProductListParams {
  page?: number;
  search?: string;
  categories?: string;
  type?: string;
  limit?: number;
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