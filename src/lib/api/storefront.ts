import { apiClient } from "./client";
import type { BeResponse } from "./base";
import type { StorefrontContent } from "@/types/storefront";

export const getStorefrontContent = async () => {
  const { data } = await apiClient.get<BeResponse<StorefrontContent>>("/storefront/public");
  return data;
};
