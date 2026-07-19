import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import type { RootState, AppDispatch } from "@/store/store";
import { addItem, removeItem, updateQuantity, clearCart, type CartItem } from "@/store/cartSlice";

export function useCart() {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.cart.items);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  // Per-line-item shipping surcharge from the backend, summed once per line
  // (not multiplied by quantity — it represents a per-product freight cost,
  // not a per-unit one).
  const totalShipping = items.reduce((sum, i) => sum + (i.shippingCost ?? 0), 0);

  function addToCart(item: Omit<CartItem, "quantity"> & { quantity?: number }) {
    try {
      if (!item.id || !item.title) {
        throw new Error("Invalid item: missing id or title");
      }

      // The reducer is what actually enforces the cap (single source of
      // truth); this is purely to decide whether a toast is warranted, so
      // it's fine for this to be a prediction rather than the authority.
      const max = item.maxQuantity;
      const currentQty = items.find((i) => i.id === item.id)?.quantity ?? 0;

      dispatch(addItem(item));

      // The cart icon's badge count is feedback enough for a normal (or
      // partially-capped) add — it visibly changes either way. A toast is
      // only warranted when nothing could be added at all, since that's the
      // one case where the badge doesn't move and a silent no-op would look
      // like a broken button.
      if (max != null && currentQty >= max) {
        toast.error(`Only ${max} in stock — you already have the maximum in your cart.`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Couldn't add this item to your cart. Please try again.");
    }
  }

  return {
    items,
    totalItems,
    totalPrice,
    totalShipping,
    addToCart,
    removeFromCart: (id: string) => dispatch(removeItem(id)),
    setQuantity: (id: string, quantity: number) => dispatch(updateQuantity({ id, quantity })),
    clearCart: () => dispatch(clearCart()),
  };
}