// Mirrors pha-dashboard's /seo/public/* responses.

export interface SeoMeta {
  meta_title: string;
  meta_description: string;
  og_image: string;
  canonical_url: string;
  noindex: boolean;
}

export type PageMetaKey = "home" | "shop" | "categories" | "bundles" | "blog";

export interface PageMetaOverride {
  meta_title: string;
  meta_description: string;
}

export interface FooterPageLink {
  _id: string;
  title: string;
  slug: string;
}

export interface PublicSeoSettings {
  site_name: string;
  // "%s" is replaced by the page's own title.
  title_template: string;
  default_description: string;
  default_og_image: string;
  google_verification: string;
  bing_verification: string;
  social_profiles: string[];
  robots_disallow: string[];
  page_meta: Record<PageMetaKey, PageMetaOverride>;
  footer_pages: FooterPageLink[];
}

export interface ArticleCard {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  cover_alt: string;
  tags: string[];
  author_name: string;
  published_at: string;
  reading_minutes: number;
}

export interface Article extends ArticleCard {
  body_html: string;
  updated_at: string;
  seo: SeoMeta;
  related: ArticleCard[];
}

export interface ArticlePage {
  items: ArticleCard[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ArticleTagCount {
  tag: string;
  count: number;
}

export interface ContentPage {
  _id: string;
  title: string;
  slug: string;
  body_html: string;
  excerpt: string;
  updated_at: string;
  seo: SeoMeta;
}

export interface RedirectTarget {
  to: string;
  status: 301 | 302;
}

export interface SitemapEntry {
  id: string;
  slug: string;
  updated_at: string | null;
}

export interface SitemapEntries {
  categories: SitemapEntry[];
  pages: SitemapEntry[];
  articles: SitemapEntry[];
  products: SitemapEntry[];
  truncated: boolean;
}

// What the layout loader hands every route's meta.
export interface LayoutSeoData {
  seo: PublicSeoSettings;
  origin: string;
}
