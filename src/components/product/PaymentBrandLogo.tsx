import type { PaymentBrand } from "@/constants/payments";
import { cn } from "@/utils/cn";

interface PaymentBrandLogoProps {
  brand: PaymentBrand;
  className?: string;
}

const BRAND_NAMES: Record<PaymentBrand, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "American Express",
  afterpay: "Afterpay",
  zip: "Zip Pay",
};

/** Official full-colour badge (activemerchant/payment_icons, MIT) from public/. */
export function PaymentBrandLogo({ brand, className }: PaymentBrandLogoProps) {
  return (
    <img
      src={`/payment-icons/${brand}.svg`}
      alt={BRAND_NAMES[brand]}
      title={BRAND_NAMES[brand]}
      width={38}
      height={24}
      loading="lazy"
      className={cn("h-7 w-auto shrink-0 rounded", className)}
    />
  );
}
