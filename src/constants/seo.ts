import type { PageMetaOverride, PublicSeoSettings } from "@/types/seo";

const BLANK_PAGE_META: PageMetaOverride = { meta_title: "", meta_description: "" };

// Used when the SEO API is down, so pages still render sane tags.
export const EMPTY_SEO_SETTINGS: PublicSeoSettings = {
  site_name: "Parts Hub Australia",
  title_template: "%s | Parts Hub Australia",
  default_description:
    "Australia's #1 destination for premium automotive parts. Genuine parts, fast delivery, expert support.",
  default_og_image: "",
  google_verification: "",
  bing_verification: "",
  social_profiles: [],
  robots_disallow: [],
  page_meta: {
    home: BLANK_PAGE_META,
    shop: BLANK_PAGE_META,
    categories: BLANK_PAGE_META,
    bundles: BLANK_PAGE_META,
    blog: BLANK_PAGE_META,
  },
  footer_pages: [],
};

// RR7 derives a route's id from its file path under appDirectory.
export const LAYOUT_ROUTE_ID = "components/layout/Layout";

// Shopping flow pages search engines should never index.
export const NOINDEX_PATH_PREFIXES = ["/cart", "/checkout"];

export const META_DESCRIPTION_LENGTH = 160;

// Static storefront pages listed in the sitemap ahead of catalogue URLs.
export const SITEMAP_STATIC_PATHS = ["/", "/shop", "/categories", "/bundles", "/blog", "/returns-policy", "/shipping-policy"];

export const ROBOTS_DEFAULT_DISALLOW = ["/cart", "/checkout"];

export const SEO_RESOURCE_CACHE = "public, max-age=3600";

export const BLOG_PATH = "/blog";
export const CONTENT_PAGE_PATH = "/pages";
