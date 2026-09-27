import { getCategoryBySlug } from "@/data/categories";
import type { Product } from "@/data/products";
import type { CartItemUpdate } from "@/store/cartSlice";

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
    shippingCost: product.shippingCost ?? null,
    shippingMethod: product.shippingMethod,
    maxQuantity: product.stockCount ?? null,
  };
}
/** The fields a cart line refreshes from the latest product data. */
export function productToCartItemUpdate(product: Product): CartItemUpdate {
  const { id, title, brand, img, price, shippingNote, shippingCost, shippingMethod, maxQuantity } =
    productToCartItem(product);
  return { id, title, brand, img, price, shippingNote, shippingCost, shippingMethod, maxQuantity };
}
