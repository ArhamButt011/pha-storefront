import { combineReducers, configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import checkoutReducer from "./checkoutSlice";

export const rootReducer = combineReducers({
  cart: cartReducer,
  checkout: checkoutReducer,
});

// NOTE: SSR must never see redux-persist's persistStore/PersistGate — each
// server request needs its own throwaway store (a module-level singleton
// would leak one user's session state into another user's response), and
// there's nothing in localStorage for the server to read anyway. This is
// the store used by root.tsx when `typeof document === "undefined"`; the
// browser instead uses the persisted singleton from ./browserStore.
export function createServerStore() {
  return configureStore({ reducer: rootReducer });
}

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof createServerStore>;
export type AppDispatch = AppStore["dispatch"];
