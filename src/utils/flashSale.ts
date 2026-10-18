import type { FlashSale } from "@/types/storefront";

export function isProductOnSale(categoryIds: string[] | undefined, sale: FlashSale | null): sale is FlashSale {
  if (!sale) return false;
  if (sale.scope === "storewide") return true;
  return (categoryIds ?? []).some((id) => sale.eligible_category_ids.includes(id));
}

type OrderRange = Pick<FlashSale, "min_order_number" | "max_order_number">;

const ordinal = (n: number) => {
  const tens = n % 100;
  if (tens >= 11 && tens <= 13) return `${n}th`;
  return `${n}${({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[n % 10] ?? "th"}`;
};

export const isOpenToEveryone = (s: OrderRange) => s.min_order_number == null && s.max_order_number == null;

/** Which orders a restricted sale is for, null when it's for any order. */
export function saleAudienceLabel({ min_order_number: min, max_order_number: max }: OrderRange) {
  if (min == null && max == null) return null;
  if (min === 1 && max === 1) return "On your first order";
  if (min && min === max) return `On your ${ordinal(min)} order`;
  if (min && max == null) return `From your ${ordinal(min)} order`;
  return max && !min ? `On your first ${max} orders` : `On orders ${min} to ${max}`;
}

/** Reduced unit price, only for automatic %-off sales open to everyone. */
export function salePrice(price: number, sale: FlashSale) {
  if (sale.discount_type !== "percent" || !sale.is_automatic || !isOpenToEveryone(sale)) return null;
  return Math.round(price * (100 - sale.discount_value)) / 100;
}

export function saleHeadline(sale: Pick<FlashSale, "discount_type" | "discount_value">) {
  if (sale.discount_type === "percent") return `${sale.discount_value}% OFF`;
  if (sale.discount_type === "fixed") return `A$${sale.discount_value} OFF`;
  return "FREE EXPRESS SHIPPING";
}

/** How the shopper gets it: "with code X" or "applied at checkout". */
export function saleHowTo(sale: Pick<FlashSale, "code">) {
  return sale.code ? `with code ${sale.code}` : "applied automatically at checkout";
}

/** Card/PDP line when no reduced price is shown, e.g. "Use code SAVE10". */
export function saleNote(sale: FlashSale) {
  const audience = saleAudienceLabel(sale);
  const how = sale.code ? `Use code ${sale.code}` : "Applied at checkout";
  return audience ? `${audience} · ${how}` : how;
}

export function saleTickerText(sale: FlashSale) {
  return sale.ticker_text || `${saleHeadline(sale)} ${saleHowTo(sale)}`;
}
