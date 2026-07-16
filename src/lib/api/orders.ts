import { apiClient } from "./client";
import type { BeResponse } from "./base";

export interface OrderItemPayload {
  product: string;
  variant?: string | null;
  quantity: number;
}

export interface OrderCustomerPayload {
  name: string;
  email: string;
  phone: string;
}

export interface OrderAddressPayload {
  address: string;
  suburb: string;
  state: string;
  postcode: string;
}

export interface CreateOrderPayload {
  items: OrderItemPayload[];
  customer: OrderCustomerPayload;
  shipping_address: OrderAddressPayload;
  billing_address?: OrderAddressPayload | null;
}

export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "fulfilled"
  | "cancelled"
  | "refunded"
  | "partially_refunded";

export interface ApiOrderItem {
  product: string;
  variant: string | null;
  name: string;
  sku: string | null;
  unit_price: number; // cents
  quantity: number;
}

// Populated by the backend from the linked Payment doc — card_brand/last4
// are only set once the payment has actually succeeded.
export interface ApiOrderPayment {
  _id: string;
  status: string;
  card_brand: string | null;
  card_last4: string | null;
  amount: number; // cents
  amount_refunded: number; // cents
  paid_at: string | null;
}

export interface ApiOrder {
  _id: string;
  order_number: string;
  items: ApiOrderItem[];
  customer: OrderCustomerPayload;
  shipping_address: OrderAddressPayload;
  billing_address: OrderAddressPayload | null;
  subtotal: number; // cents, GST-inclusive
  shipping_cost: number; // cents
  tax_amount: number; // cents — GST component of subtotal, display-only
  total: number; // cents
  currency: string;
  status: OrderStatus;
  has_stock_issue: boolean;
  created_at: string;
  payment: ApiOrderPayment | null;
}

// Only present in the create-order response — never returned again by
// GET /order/:id, which strips it server-side.
export interface ApiOrderCreated extends ApiOrder {
  guest_access_token: string;
}

export const createOrder = async (payload: CreateOrderPayload) => {
  const { data } = await apiClient.post<BeResponse<ApiOrderCreated>>(
    "/order",
    payload,
  );
  return data;
};

export const getOrder = async (orderId: string, token: string) => {
  const { data } = await apiClient.get<BeResponse<ApiOrder>>(
    `/order/${orderId}`,
    { params: { token } },
  );
  return data;
};
