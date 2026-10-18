import { Gift, Sparkles, Tag, Truck, Zap, type LucideIcon } from "lucide-react";
import type {
  AnnouncementIcon,
  AnnouncementTheme,
  HeroHeight,
  HeroImageFocus,
  HeroSettings,
  StorefrontContent,
  TickerSpeed,
  TickerTheme,
} from "@/types/storefront";

export const DEFAULT_HERO_SETTINGS: HeroSettings = {
  autoplay: true,
  interval_seconds: 6,
  show_arrows: true,
  show_dots: true,
  height: "standard",
};

export const EMPTY_STOREFRONT_CONTENT: StorefrontContent = {
  hero_slides: [],
  hero_settings: DEFAULT_HERO_SETTINGS,
  announcement: null,
  flash_sale: null,
};

// Background + text pair per dashboard-chosen theme, "custom" is inline.
export const ANNOUNCEMENT_THEME_CLASS: Record<AnnouncementTheme, string> = {
  indigo: "bg-promo-indigo text-promo-fg",
  crimson: "bg-danger text-danger-fg",
  amber: "bg-promo-amber text-promo-amber-fg",
  emerald: "bg-ok text-ok-fg",
  carbon: "bg-promo-carbon text-promo-fg",
  custom: "",
};

export const ANNOUNCEMENT_ICONS: Record<Exclude<AnnouncementIcon, "none">, LucideIcon> = {
  sparkles: Sparkles,
  truck: Truck,
  tag: Tag,
  zap: Zap,
  gift: Gift,
};

// sessionStorage key: a closed banner stays closed for the visit.
export const BANNER_DISMISSED_KEY = "pha-banner-dismissed";

export const HERO_HEIGHT_CLASS: Record<HeroHeight, string> = {
  compact: "min-h-[50vh] lg:min-h-[60vh]",
  standard: "min-h-[70vh] lg:min-h-[88vh]",
  tall: "min-h-[85vh] lg:min-h-screen",
};

export const HERO_FOCUS_CLASS: Record<HeroImageFocus, string> = {
  center: "object-center",
  top: "object-top",
  bottom: "object-bottom",
  left: "object-left",
  right: "object-right",
};

// Below this width the phone photo (if any) is used.
export const HERO_MOBILE_MEDIA = "(max-width: 767px)";

export const TICKER_THEME_CLASS: Record<TickerTheme, string> = {
  brand: "bg-gradient-to-r from-danger via-accent to-danger text-danger-fg",
  crimson: "bg-danger text-danger-fg",
  carbon: "bg-promo-carbon text-promo-fg",
  custom: "",
};

// Seconds per marquee loop, longer is slower.
export const TICKER_DURATION_SECONDS: Record<TickerSpeed, number> = { slow: 60, normal: 35, fast: 18 };

export const DISCOUNT_QUOTE_DEBOUNCE_MS = 450;
