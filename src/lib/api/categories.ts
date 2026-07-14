import { apiClient } from "./client";
import type { BeResponse, PaginatedData } from "./base";
import type { ApiCategory } from "@/types/category";

export interface CategoryListParams {
  limit?: number;
  page?: number;
  search?: string;
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