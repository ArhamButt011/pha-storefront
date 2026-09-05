export type DeliveryMethod = "delivery" | "pickup";

export interface AddressFields {
  address: string;
  suburb: string;
  state: string;
  postcode: string;
}

export interface ShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  deliveryMethod: DeliveryMethod;
  shippingAddress: AddressFields;
  billingSameAsShipping: boolean;
  billingAddress: AddressFields;
}
