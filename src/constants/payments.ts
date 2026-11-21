export type PaymentBrand = "visa" | "mastercard" | "amex" | "afterpay" | "zip";

export const ACCEPTED_CARD_BRANDS: PaymentBrand[] = ["visa", "mastercard", "amex"];

export interface BnplOption {
  brand: PaymentBrand;
  tagline: string;
  learnMoreUrl: string;
}

// Shown on product pages; Stripe only offers them on eligible order totals.
export const BNPL_OPTIONS: BnplOption[] = [
  {
    brand: "afterpay",
    tagline: "Pay in 4 interest-free instalments with Afterpay.",
    learnMoreUrl: "https://www.afterpay.com/en-AU/how-it-works",
  },
  {
    brand: "zip",
    tagline: "Buy now, pay later with Zip Pay.",
    learnMoreUrl: "https://zip.co/au/zip-pay",
  },
];
