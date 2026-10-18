// Mirrors pha-dashboard's GET /storefront/public response.
export type HeroAlign = "left" | "center" | "right";
export type HeroVertical = "top" | "center" | "bottom";
export type HeroTextTone = "light" | "dark";
export type HeroImageFocus = "center" | "top" | "bottom" | "left" | "right";
export type HeroHeight = "compact" | "standard" | "tall";
export type AnnouncementTheme = "indigo" | "crimson" | "amber" | "emerald" | "carbon" | "custom";
export type AnnouncementIcon = "none" | "sparkles" | "truck" | "tag" | "zap" | "gift";
export type TickerSpeed = "slow" | "normal" | "fast";
export type TickerTheme = "brand" | "crimson" | "carbon" | "custom";
export type DiscountType = "percent" | "fixed" | "free_shipping";

export interface HeroSlide {
  _id: string;
  title: string;
  subtitle: string;
  badge: string;
  cta_label: string;
  cta_url: string;
  secondary_cta_label: string;
  secondary_cta_url: string;
  image_url: string;
  // Optional phone crop, falls back to image_url.
  mobile_image_url: string;
  image_focus: HeroImageFocus;
  align: HeroAlign;
  vertical: HeroVertical;
  text_tone: HeroTextTone;
  overlay: number;
}

export interface HeroSettings {
  autoplay: boolean;
  interval_seconds: number;
  show_arrows: boolean;
  show_dots: boolean;
  height: HeroHeight;
}

export interface Announcement {
  message: string;
  link_url: string;
  link_label: string;
  theme: AnnouncementTheme;
  // Used when theme is "custom".
  bg_color: string;
  text_color: string;
  icon: AnnouncementIcon;
  dismissible: boolean;
  placement: "all_pages" | "home_only";
}

export interface FlashSale {
  name: string;
  // Null for automatic discounts, which need no code at checkout.
  code: string | null;
  is_automatic: boolean;
  discount_type: DiscountType;
  discount_value: number;
  // Dollars, the cart subtotal must reach it.
  minimum_order: number;
  scope: "storewide" | "categories";
  // Targeted categories plus their descendants, empty when storewide.
  eligible_category_ids: string[];
  ends_at: string | null;
  // Which of the shopper's orders qualify (1 = first), null bounds are open.
  min_order_number: number | null;
  max_order_number: number | null;
  ticker_text: string;
  ticker_speed: TickerSpeed;
  ticker_theme: TickerTheme;
  // Used when ticker_theme is "custom".
  ticker_bg_color: string;
  ticker_text_color: string;
  show_countdown: boolean;
  show_hero_card: boolean;
  show_product_badges: boolean;
}

export interface StorefrontContent {
  hero_slides: HeroSlide[];
  hero_settings: HeroSettings;
  announcement: Announcement | null;
  flash_sale: FlashSale | null;
}
