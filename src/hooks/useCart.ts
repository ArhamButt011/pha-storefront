import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { addItem, removeItem, updateQuantity, clearCart, type CartItem } from "@/store/cartSlice";

export function useCart() {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.cart.items);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return {
    items,
    totalItems,
    totalPrice,
    addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => dispatch(addItem(item)),
    removeFromCart: (id: string) => dispatch(removeItem(id)),
    setQuantity: (id: string, quantity: number) => dispatch(updateQuantity({ id, quantity })),
    clearCart: () => dispatch(clearCart()),
  };
}
