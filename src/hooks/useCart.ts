import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import type { RootState, AppDispatch } from "@/store/store";
import { addItem, removeItem, updateQuantity, clearCart, type CartItem } from "@/store/cartSlice";

export function useCart() {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.cart.items);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  function addToCart(item: Omit<CartItem, "quantity"> & { quantity?: number }) {
    try {
      if (!item.id || !item.title) {
        throw new Error("Invalid item: missing id or title");
      }
      dispatch(addItem(item));
      toast.success(`${item.title} added to cart successfully`);
    } catch (err) {
      console.error(err);
      toast.error("Couldn't add this item to your cart. Please try again.");
    }
  }

  return {
    items,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart: (id: string) => dispatch(removeItem(id)),
    setQuantity: (id: string, quantity: number) => dispatch(updateQuantity({ id, quantity })),
    clearCart: () => dispatch(clearCart()),
  };
}