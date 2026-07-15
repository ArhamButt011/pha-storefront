import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Deliberately excluded from redux-persist (see store.ts whitelist) — and
// deliberately never holds a Stripe client_secret. This slice only carries
// enough to get from Shipping -> Payment within the same SPA session; the
// confirmation page (which may be reached via a full-page 3DS redirect,
// wiping this entirely) treats it as a cache, never a source of truth —
// order_id/token are re-read from the return_url's query params instead.
export interface CheckoutState {
  orderId: string | null;
  guestToken: string | null;
  orderNumber: string | null;
  step: "shipping" | "payment" | "confirmation";
}

const initialState: CheckoutState = {
  orderId: null,
  guestToken: null,
  orderNumber: null,
  step: "shipping",
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setOrder(
      state,
      action: PayloadAction<{ orderId: string; guestToken: string; orderNumber: string }>,
    ) {
      state.orderId = action.payload.orderId;
      state.guestToken = action.payload.guestToken;
      state.orderNumber = action.payload.orderNumber;
      state.step = "payment";
    },
    resetCheckout() {
      return initialState;
    },
  },
});

export const { setOrder, resetCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;
