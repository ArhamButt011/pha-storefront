import type { DeliveryMethod } from "@/types/checkout";

export const CHECKOUT_STEPS = ["Shipping", "Payment", "Review"] as const;

export const AU_STATES = ["VIC", "NSW", "QLD", "WA", "SA", "TAS", "ACT", "NT"];

export interface DeliveryMethodOption {
  value: DeliveryMethod;
  label: string;
  description: string;
}

export const DELIVERY_METHOD_OPTIONS: DeliveryMethodOption[] = [
  { value: "delivery", label: "Delivery", description: "Ship to your address" },
  { value: "pickup", label: "Pick Up", description: "Collect in-store" },
];

export const PICKUP_LOCATION = {
  name: "Parts Hub Australia",
  address: "34 Killara Road, Campbellfield VIC 3061, Australia",
  note: "We'll email you once your order is ready for collection — usually within 1 business day.",
};

export interface TrustBadge {
  title: string;
  description: string;
}

/** "{make}" is replaced with the customer's selected vehicle make at render time. */
export const TRUST_BADGES: TrustBadge[] = [
  { title: "Secure SSL Encryption", description: "Your data is protected and encrypted" },
  { title: "24-Month Parts Warranty", description: "Genuine quality guarantee" },
  { title: "Specialist Support", description: "Expert help for your {make} project" },
];

export interface WhatsNextItem {
  title: string;
  description: string;
  actionLabel: string;
}

export const WHATS_NEXT_ITEMS: WhatsNextItem[] = [
  {
    title: "Real-time Tracking",
    description: "Receive SMS & email updates as your parts move through our logistics network. Delivery ETA: 2-3 business days.",
    actionLabel: "Track Shipment",
  },
  {
    title: "Technical Support",
    description: "Access installation guides, fitment FAQs, or chat with our specialist mechanics for part-specific advice.",
    actionLabel: "Get Assistance",
  },
];

export const LOYALTY_PROGRAM = {
  title: "PH Loyalty Program",
  description: "Join 50k+ enthusiasts. Earn {points} points from this order. Unlock exclusive early access to performance drops.",
  actionLabel: "Join Now",
};

export const COMPANY_INFO = {
  name: "Parts Hub Australia",
  abn: "45 678 910 112",
  email: "support@partshub.com.au",
};

export const INVOICE_NOTE = "Please ensure installation is performed by a certified technician to maintain fitment guarantee.";
