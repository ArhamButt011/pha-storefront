import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import cartReducer from "./cartSlice";
import checkoutReducer from "./checkoutSlice";

const persistConfig = {
  key: "pha-storefront",
  storage,
  // "checkout" is intentionally NOT persisted — it's a same-session cache
  // for the Shipping -> Payment handoff only (see checkoutSlice.ts), never
  // the source of truth for order/payment state.
  whitelist: ["cart"],
};

const rootReducer = combineReducers({
  cart: cartReducer,
  checkout: checkoutReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
