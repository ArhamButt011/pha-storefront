import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { SIGNUP_POPUP_HIDDEN_PATHS, SIGNUP_POPUP_PREVIEW_PARAM, SIGNUP_POPUP_SEEN_KEY } from "@/constants/storefront";
import type { SignupPopup } from "@/types/storefront";

const DAY_MS = 24 * 60 * 60 * 1000;

interface SeenRecord {
  at: number;
  version: string;
  subscribed: boolean;
}

/** Changes whenever the offer or wording does, so a new offer shows again. */
function popupVersion(popup: SignupPopup) {
  const o = popup.offer;
  const text = [popup.headline, popup.body, o?.discount_type, o?.discount_value, o?.minimum_order].join("|");
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) hash = (hash * 31 + text.charCodeAt(i)) | 0;
  return String(hash);
}

// Storage can throw (private mode, blocked site data); treat that as unseen.
function readSeen(): SeenRecord | null {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(SIGNUP_POPUP_SEEN_KEY) ?? "null");
    return parsed && typeof parsed.at === "number" ? parsed : null;
  } catch {
    return null;
  }
}

/** Subscribers are never asked again; a closed popup waits out its days. */
function shouldSuppress(popup: SignupPopup, version: string) {
  const seen = readSeen();
  if (!seen) return false;
  if (seen.subscribed) return true;
  return seen.version === version && Date.now() - seen.at < popup.frequency_days * DAY_MS;
}

function isHiddenPath(pathname: string) {
  return SIGNUP_POPUP_HIDDEN_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/** Opens the popup after its delay, client-only, at most once per window. */
export function useSignupPopup(popup: SignupPopup | null) {
  const { pathname, search } = useLocation();
  const [open, setOpen] = useState(false);
  // Once per page view: closing must never re-arm the timer, preview or not.
  const shown = useRef(false);
  const version = useMemo(() => (popup ? popupVersion(popup) : ""), [popup]);
  const preview = new URLSearchParams(search).get(SIGNUP_POPUP_PREVIEW_PARAM) === "preview";
  const placed = !!popup && (preview || ((popup.placement !== "home_only" || pathname === "/") && !isHiddenPath(pathname)));

  useEffect(() => {
    if (!popup || !placed || open || shown.current) return;
    if (!preview && shouldSuppress(popup, version)) return;
    const timer = window.setTimeout(() => {
      shown.current = true;
      setOpen(true);
    }, preview ? 0 : popup.delay_seconds * 1000);
    return () => window.clearTimeout(timer);
  }, [popup, placed, open, preview, version]);

  const markSeen = useCallback(
    (subscribed = false) => {
      try {
        const record: SeenRecord = { at: Date.now(), version, subscribed: subscribed || Boolean(readSeen()?.subscribed) };
        window.localStorage.setItem(SIGNUP_POPUP_SEEN_KEY, JSON.stringify(record));
      } catch {
        // Shows again next visit; nothing else to do.
      }
    },
    [version],
  );

  return { open, setOpen, markSeen };
}
