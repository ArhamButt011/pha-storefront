import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BANNER_DISMISSED_KEY } from "@/constants/storefront";
import type { Announcement } from "@/types/storefront";

// Storage can throw (private mode, blocked site data), treat that as unset.
function readDismissed(message: string) {
  try {
    return window.sessionStorage.getItem(BANNER_DISMISSED_KEY) === message;
  } catch {
    return false;
  }
}

/** Whether the banner shows here, honouring placement and a shopper's close. */
export function useAnnouncementVisibility(announcement: Announcement | null) {
  const { pathname } = useLocation();
  // Starts visible to match SSR, a stored dismissal applies after mount.
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (announcement?.dismissible) setDismissed(readDismissed(announcement.message));
  }, [announcement?.dismissible, announcement?.message]);

  const dismiss = useCallback(() => {
    if (!announcement) return;
    setDismissed(true);
    try {
      window.sessionStorage.setItem(BANNER_DISMISSED_KEY, announcement.message);
    } catch {
      // Closed for this page view only.
    }
  }, [announcement]);

  const placed = announcement?.placement !== "home_only" || pathname === "/";
  return { visible: !!announcement && placed && !dismissed, dismiss };
}
