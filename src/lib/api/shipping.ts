import { apiClient } from "./client";
import type { BeResponse } from "./base";
import type { OrderItemPayload } from "./orders";
import type { AddressType, ApiShippingQuote } from "@/types/checkout";

export interface ShippingQuotePayload {
  items: OrderItemPayload[];
  receiver: { postcode: string; suburb: string; state?: string; address_type?: AddressType };
}

// Same rates the order is charged at; the server caches quotes for 15 minutes.
export const getShippingQuote = async (payload: ShippingQuotePayload) => {
  const { data } = await apiClient.post<BeResponse<ApiShippingQuote>>("/shipping/quote", payload);
  return data;
};
