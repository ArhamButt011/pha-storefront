import { apiClient } from "./client";
import type { BeResponse } from "./base";

export interface CreateIntentPayload {
  order_id: string;
  token: string;
}

export interface CreateIntentData {
  payment_id: string;
  client_secret: string;
  // This store's own Stripe publishable key (BYOK) — see lib/stripe.ts#getStripe.
  stripe_publishable_key: string;
}

export const createPaymentIntent = async (payload: CreateIntentPayload) => {
  const { data } = await apiClient.post<BeResponse<CreateIntentData>>(
    "/payment/create-intent",
    payload,
  );
  return data;
};
