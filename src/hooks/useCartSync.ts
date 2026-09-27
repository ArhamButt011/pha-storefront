import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useHasRehydrated } from "@/hooks/useHasRehydrated";
import { getProductsByIds } from "@/lib/api/product";
import { CART_SYNC_INTERVAL_MS } from "@/constants/cart";
import { syncItems } from "@/store/cartSlice";
import { mapApiProductToProduct } from "@/utils/mapApiProduct";
import { productToCartItemUpdate } from "@/utils/productToCartItem";
import type { AppDispatch, RootState } from "@/store/store";

/** Refreshes saved cart lines from the server on load and on tab return. */
export function useCartSync() {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.cart.items);
  const hasRehydrated = useHasRehydrated();
  // Latest cart without re-subscribing listeners on every change.
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const lastSync = useRef(0);

  const sync = useCallback(async () => {
    const current = itemsRef.current;
    if (!current.length) return;
    lastSync.current = Date.now();
    try {
      const res = await getProductsByIds(current.map((i) => i.id));
      const updates = res.data.items.map((p) => productToCartItemUpdate(mapApiProductToProduct(p)));
      const available = new Map(updates.map((u) => [u.id, u]));
      const removed = current.filter((i) => !available.get(i.id) || available.get(i.id)?.maxQuantity === 0);
      const repriced = current.some((i) => {
        const u = available.get(i.id);
        return u && u.price !== i.price;
      });
      dispatch(syncItems(updates));
      if (removed.length) toast.warn(`Removed from your cart, no longer available: ${removed.map((i) => i.title).join(", ")}`);
      else if (repriced) toast.info("Prices in your cart have been updated.");
    } catch {
      // Offline or API down: keep the saved cart; checkout re-prices anyway.
    }
  }, [dispatch]);

  useEffect(() => {
    if (hasRehydrated) void sync();
  }, [hasRehydrated, sync]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible" && Date.now() - lastSync.current > CART_SYNC_INTERVAL_MS) void sync();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [sync]);
}
