import { apiClient } from "./client";
import type { BeResponse } from "./base";

export interface SubscribeNewsletterPayload {
  email: string;
  first_name?: string;
  // "popup" tags the signup and returns the popup's code, if any.
  source?: "footer" | "popup";
}

// The code is this email's own: one use, at a checkout with the same email.
export interface SubscribeNewsletterResult {
  discount_code: string | null;
  expires_at: string | null;
  already_used: boolean;
  expired: boolean;
}

export const subscribeNewsletter = async (payload: SubscribeNewsletterPayload) => {
  const { data } = await apiClient.post<BeResponse<SubscribeNewsletterResult | null>>(
    "/newsletter",
    payload,
  );
  return data;
};
