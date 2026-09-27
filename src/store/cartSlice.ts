import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ShippingMethod } from "@/types/apiProduct";

export interface CartItem {
  id: string;
  title: string;
  brand: string;
  img: string;
  price: number;
  quantity: number;
  /** Category label shown on the cart line, e.g. "Brakes" */
  category?: string;
  /** Fitment / spec line, e.g. "Vehicle: BMW M3 (G80) | 6-Piston Front" */
  meta?: string;
  /** Delivery note, e.g. "Ships from AU Depot" */
  shippingNote?: string;
  /** Per-item shipping surcharge from the backend, null/0 = free */
  shippingCost?: number | null;
  /** "calculated" is priced by courier quote at checkout, not shippingCost */
  shippingMethod?: ShippingMethod;
  /** Stock when added to the cart; null = untracked/unlimited */
  maxQuantity?: number | null;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = { items: [] };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // The one place the stock cap is enforced; null maxQuantity = no cap.
    addItem(state, action: PayloadAction<Omit<CartItem, "quantity"> & { quantity?: number }>) {
      const requested = action.payload.quantity ?? 1;
      const max = action.payload.maxQuantity;
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        const combined = existing.quantity + requested;
        existing.quantity = max != null ? Math.min(combined, max) : combined;
      } else {
        const quantity = max != null ? Math.min(requested, max) : requested;
        state.items.push({ ...action.payload, quantity });
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    updateQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
      if (action.payload.quantity <= 0) {
        state.items = state.items.filter((i) => i.id !== action.payload.id);
        return;
      }
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.quantity = item.maxQuantity != null
          ? Math.min(action.payload.quantity, item.maxQuantity)
          : action.payload.quantity;
      }
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
