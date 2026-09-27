import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import type { RootState, AppDispatch } from "@/store/store";
import { addItem, removeItem, updateQuantity, clearCart, type CartItem } from "@/store/cartSlice";
import { flatShippingTotal, hasCalculatedShipping as cartHasCalculated } from "@/utils/shipping";

export function useCart() {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.cart.items);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const hasCalculatedShipping = cartHasCalculated(items);
  const totalShipping = flatShippingTotal(items);

  function addToCart(item: Omit<CartItem, "quantity"> & { quantity?: number }) {
    try {
      if (!item.id || !item.title) {
        throw new Error("Invalid item: missing id or title");
      }

      // The reducer enforces the cap; this only predicts whether to toast.
      const max = item.maxQuantity;
      const currentQty = items.find((i) => i.id === item.id)?.quantity ?? 0;

      dispatch(addItem(item));

      // Toast only when nothing was added; otherwise the badge count moves.
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
    hasCalculatedShipping,
    addToCart,
    removeFromCart: (id: string) => dispatch(removeItem(id)),
    setQuantity: (id: string, quantity: number) => dispatch(updateQuantity({ id, quantity })),
    clearCart: () => dispatch(clearCart()),
  };
}