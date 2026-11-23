import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { loadGuestToken, saveGuestToken } from "@/lib/guestOrderAccess";

/** order_id from the URL plus its token, from the URL or localStorage. */
export function useGuestOrderRef() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const urlToken = searchParams.get("token");
  // Storage is read in an effect so SSR and hydration render the same markup.
  const [storedToken, setStoredToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (orderId && urlToken) saveGuestToken(orderId, urlToken);
    setStoredToken(orderId && !urlToken ? loadGuestToken(orderId) : null);
    setReady(true);
  }, [orderId, urlToken]);

  return { orderId, token: urlToken ?? storedToken, ready };
}
