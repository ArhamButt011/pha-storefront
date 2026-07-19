import type { StockStatus } from "@/data/products";

// Single source of truth for stock status -> dot color, shared between
// ProductCard and ProductDetails instead of each keeping its own copy.
export const STOCK_DOT: Record<StockStatus, string> = {
  "in-stock": "bg-ok",
  limited: "bg-accent",
  "out-of-stock": "bg-danger",
};

export type ApiStockStatus = "in_stock" | "low_stock" | "out_of_stock";

export function mapApiStockStatus(status: ApiStockStatus | undefined): StockStatus {
  if (status === "low_stock") return "limited";
  if (status === "out_of_stock") return "out-of-stock";
  return "in-stock";
}

export function stockLabel(status: StockStatus, count: number | null): string {
  if (status === "out-of-stock") return "Out of Stock";
  if (status === "limited") return count ? `Low Stock (${count} left)` : "Low Stock";
  return "In Stock";
}
