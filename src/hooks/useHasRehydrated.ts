import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

// persistReducer (browserStore.ts) stamps `_persist: { rehydrated: boolean }`
// onto the top-level state as soon as the browser store is created — true
// even before persistStore() has been called (see root.tsx/browserStore.ts's
// own comments on why that's deliberately deferred to a useEffect). This is
// the only reliable way to tell "cart is genuinely empty" apart from "cart
// hasn't been read from localStorage yet".
//
// VERIFICATION FINDING: without this, Shipping.tsx's "redirect to /cart if
// empty" effect ran before root.tsx's persistence-start effect (child
// effects fire before parent effects), so it always saw the pre-rehydration
// empty cart on a fresh full-page load of /checkout and incorrectly bounced
// a visitor with a real cart back to /cart. Confirmed via a real headless
// Chrome run, not theoretical.
//
// SECOND VERIFICATION FINDING, on top of the one above: `_persist` isn't
// stamped onto state at store-creation time the way the comment above
// first assumed — redux-persist's persistReducer only adds it once it
// processes its own internal PERSIST action, i.e. once persistStore() has
// actually been called (see node_modules/redux-persist/lib/persistReducer.js).
// Since persistStore() is now deliberately deferred to root.tsx's useEffect
// (fixing the #418 hydration race), `_persist` is *also* absent, briefly,
// on the client — structurally identical to the server's state shape,
// which never has `_persist` at all. Defaulting to `true` on "absent"
// (this hook's first version) made hasRehydrated read as `true` during
// exactly the gap it exists to catch, silently re-introducing the bounce-
// to-/cart bug through a different path — confirmed via a real headless
// Chrome run, not theoretical. Defaulting to `false` instead is safe on
// the server too: nothing there ever checks this outside of an effect
// (which never runs during SSR), and any render guard combining this with
// an already-empty server-side cart (e.g. `!hasRehydrated || items.length
// === 0`) produces the same "render nothing" result either way.
export function useHasRehydrated(): boolean {
  return useSelector((state: RootState) => {
    const persist = (state as RootState & { _persist?: { rehydrated: boolean } })._persist;
    return persist?.rehydrated ?? false;
  });
}
