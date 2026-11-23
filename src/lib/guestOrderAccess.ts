// Keeps the guest order token out of URLs so GTM/analytics never collect it.
const KEY_PREFIX = "pha-guest-token:";

// Query params that must never reach analytics page_location.
const SECRET_PARAMS = ["token", "payment_intent_client_secret"];

/** Runs inline before GTM: stash the token, then strip secrets from the URL. */
export const STRIP_URL_SECRETS_SCRIPT = `(function(){try{var u=new URL(location.href),p=u.searchParams,t=p.get("token"),o=p.get("order_id");if(t&&o){localStorage.setItem(${JSON.stringify(KEY_PREFIX)}+o,t);if(localStorage.getItem(${JSON.stringify(KEY_PREFIX)}+o)!==t)return}else if(t){return}var s=${JSON.stringify(SECRET_PARAMS)},c=false;s.forEach(function(k){if(p.has(k)){p.delete(k);c=true}});if(c)history.replaceState(history.state,"",u.pathname+u.search+u.hash)}catch(e){}})();`;

/** True only if the token is now readable back from storage. */
export function saveGuestToken(orderId: string, token: string) {
  try {
    localStorage.setItem(KEY_PREFIX + orderId, token);
    return localStorage.getItem(KEY_PREFIX + orderId) === token;
  } catch {
    return false;
  }
}

export function loadGuestToken(orderId: string) {
  try {
    return localStorage.getItem(KEY_PREFIX + orderId);
  } catch {
    return null;
  }
}

/** order_id query string; the token is included only if storage can't hold it. */
export function guestOrderQuery(orderId: string, token: string, extra: Record<string, string> = {}) {
  const params = new URLSearchParams({ order_id: orderId, ...extra });
  if (loadGuestToken(orderId) !== token) params.set("token", token);
  return params.toString();
}
