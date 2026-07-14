import { getCategoryBySlug } from "@/data/categories";
import type { Product } from "@/data/products";

export function productToCartItem(product: Product, quantity?: number) {
  const categoryLabel = product.categoryName ?? getCategoryBySlug(product.categorySlug)?.title;
  const meta = product.fitmentConfirmedFor
    ? `Vehicle: ${product.fitmentConfirmedFor} | ${product.partType}`
    : product.partType;

  return {
    id: product.id,
    title: product.title,
    brand: product.brand,
    img: product.img,
    price: product.price,
    quantity,
    category: categoryLabel,
    meta,
    shippingNote: product.stock.label,
  };
}