export type DeliveryMethod = "delivery" | "pickup";

// Couriers price residential and business drop-offs differently.
export type AddressType = "residential" | "business";

export interface AddressFields {
  address: string;
  suburb: string;
  state: string;
  postcode: string;
}

/** POST /shipping/quote response; amounts in cents. */
export interface ApiShippingQuote {
  shipping_cost: number;
  standard_cost: number;
  calculated_cost: number;
  calculated: { cost: number; courier: string; service: string; transit_time: string | null } | null;
  currency: string;
}

// Checkout's shipping line; `amount` is in dollars like the rest of the cart.
export type ShippingQuoteState =
  | { status: "idle" }
  | { status: "needs_address" }
  | { status: "loading" }
  | { status: "ready"; amount: number; courier?: string }
  | { status: "error"; message: string };

export interface ShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  deliveryMethod: DeliveryMethod;
  shippingAddress: AddressFields;
  addressType: AddressType;
  billingSameAsShipping: boolean;
  billingAddress: AddressFields;
}
