// Keeps the guest order token out of URLs so GTM/analytics never collect it.
const KEY_PREFIX = "pha-guest-token:";

// Shared computers: a stored token stops granting order access after this.
const TOKEN_TTL_MS = 3 * 24 * 60 * 60 * 1000;

// Query params that must never reach analytics page_location.
const SECRET_PARAMS = ["token", "payment_intent_client_secret"];

// Stored as "<expiresAtMs>:<token>"; the inline script below writes the same.
function encode(token: string) {
  return `${Date.now() + TOKEN_TTL_MS}:${token}`;
}

/** Runs inline before GTM: drop expired tokens, stash this one, strip secrets. */
export const STRIP_URL_SECRETS_SCRIPT = `(function(){try{var P=${JSON.stringify(KEY_PREFIX)},n=Date.now(),ls=localStorage;for(var i=ls.length-1;i>=0;i--){var k=ls.key(i);if(k&&k.indexOf(P)===0){var v=ls.getItem(k)||"",x=v.indexOf(":");if(x>0&&Number(v.slice(0,x))<n)ls.removeItem(k)}}var u=new URL(location.href),p=u.searchParams,t=p.get("token"),o=p.get("order_id");if(t&&o){var val=(n+${TOKEN_TTL_MS})+":"+t;ls.setItem(P+o,val);if(ls.getItem(P+o)!==val)return}else if(t){return}var c=false;${JSON.stringify(SECRET_PARAMS)}.forEach(function(k){if(p.has(k)){p.delete(k);c=true}});if(c)history.replaceState(history.state,"",u.pathname+u.search+u.hash)}catch(e){}})();`;

/** True only if the token is now readable back from storage. */
export function saveGuestToken(orderId: string, token: string) {
  try {
    const value = encode(token);
    localStorage.setItem(KEY_PREFIX + orderId, value);
    return localStorage.getItem(KEY_PREFIX + orderId) === value;
  } catch {
    return false;
  }
}

/** The stored token, or null once expired (the expired entry is removed). */
export function loadGuestToken(orderId: string) {
  try {
    const raw = localStorage.getItem(KEY_PREFIX + orderId);
    if (!raw) return null;
    const sep = raw.indexOf(":");
    // Pre-expiry entries hold a bare token; re-save them with an expiry.
    if (sep === -1) {
      saveGuestToken(orderId, raw);
      return raw;
    }
    if (Number(raw.slice(0, sep)) < Date.now()) {
      localStorage.removeItem(KEY_PREFIX + orderId);
      return null;
    }
    return raw.slice(sep + 1);
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
