import { getCategoryBySlug } from "@/data/categories";
import type { Product } from "@/data/products";

export function productToCartItem(product: Product, quantity?: number) {
  const category = getCategoryBySlug(product.categorySlug);
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
    category: category?.title,
    meta,
    shippingNote: product.stock.label,
  };
}
