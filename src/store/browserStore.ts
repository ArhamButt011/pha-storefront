import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { rootReducer, type AppStore } from "./store";

const persistConfig = {
  key: "pha-storefront",
  storage,
  // "checkout" is intentionally NOT persisted — it's a same-session cache
  // for the Shipping -> Payment handoff only (see checkoutSlice.ts), never
  // the source of truth for order/payment state.
  whitelist: ["cart"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

function buildBrowserStore() {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  }) as unknown as AppStore;
  return { store, persistor: null as ReturnType<typeof persistStore> | null };
}

let browserStore: ReturnType<typeof buildBrowserStore> | undefined;

// NOTE: no <PersistGate> here on purpose. PersistGate hides its children
// until redux-persist finishes reading localStorage, but the SSR'd tree it
// would wrap has *already* rendered (with the default, empty cart state) —
// gating the client's first render behind "not yet rehydrated" would mean
// hydrating against `null` where the server rendered real markup, which is
// exactly the hydration-mismatch crash this migration needs to avoid.
// Skipping the gate means react-redux's normal subscribe/re-render just
// picks up the REHYDRATE action after mount instead.
export function getBrowserStore() {
  if (!browserStore) browserStore = buildBrowserStore();
  return browserStore;
}

// VERIFICATION FINDING (confirmed via a real headless-Chrome run, not
// theoretical): calling persistStore() eagerly — as soon as the store is
// created — raced React's hydration commit for a visitor who already had a
// persisted cart. redux-persist's localStorage read resolves on a
// microtask, which could land *before* hydration finished reconciling,
// so the REHYDRATE action mutated state.cart mid-hydration and threw React
// error #418 ("text content does not match server-rendered HTML"). React
// recovers by discarding and client-rendering the affected subtree — the
// user still ends up with the right cart, but via a visible re-render and a
// console error, and since the cart badge lives in Navbar (shared by every
// SSR'd route via Layout), this could hit ANY page for a returning visitor,
// not just /cart.
//
// Fix: the store object handed to <Provider> is created eagerly (so it's
// stable across the hydration pass — no store-swapping), but persistStore()
// itself — the thing that actually reads localStorage and can dispatch
// REHYDRATE — is only started here, from root.tsx's useEffect, which by
// definition cannot run until after the commit. There is no longer any
// timing window for a rehydration action to land during hydration.
export function startPersisting() {
  const { store } = getBrowserStore();
  if (!browserStore!.persistor) {
    browserStore!.persistor = persistStore(store);
  }
  return browserStore!.persistor;
}
