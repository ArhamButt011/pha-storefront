import { apiClient } from "./client";
import type { BeResponse } from "./base";

export interface SubscribeNewsletterPayload {
  email: string;
}

export const subscribeNewsletter = async (payload: SubscribeNewsletterPayload) => {
  const { data } = await apiClient.post<BeResponse<null>>(
    "/newsletter",
    payload,
  );
  return data;
};