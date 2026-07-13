import { apiClient } from "./client";
import type { BeResponse } from "./base";
import type { ApiCategory } from "@/types/category";

export const getCategories = async () => {
  const { data } = await apiClient.get<BeResponse<ApiCategory[]>>("/category");
  return data;
};

export const getCategory = async (id: string) => {
  const { data } = await apiClient.get<BeResponse<ApiCategory>>(`/category/${id}`);
  return data;
};