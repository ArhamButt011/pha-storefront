// Shared by every SSR route's meta/loader: URLs, JSON-LD and meta tags.

import type { MetaDescriptor } from "react-router";
import { EMPTY_SEO_SETTINGS, LAYOUT_ROUTE_ID, META_DESCRIPTION_LENGTH } from "@/constants/seo";
import type { LayoutSeoData, PageMetaKey, PublicSeoSettings, SeoMeta } from "@/types/seo";

// NOTE: nginx terminates TLS, so trust X-Forwarded-*, not request.url's proto.
export function getOrigin(request: Request): string {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "";
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  return `${proto}://${host}`;
}

// Escaping "<" stops a merchant string like "</script>" closing the tag.
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}

// schema.org availability straight from stock_status, matching the feed.
export function mapAvailability(stockStatus: string): "InStock" | "OutOfStock" {
  return stockStatus === "out_of_stock" ? "OutOfStock" : "InStock";
}

// Free-text condition to schema.org ItemCondition; New, like the API default.
export function mapItemCondition(condition: string | null | undefined): string {
  const normalized = (condition ?? "").toLowerCase();
  if (normalized.includes("refurb")) return "RefurbishedCondition";
  if (normalized.includes("used")) return "UsedCondition";
  if (normalized.includes("damage")) return "DamagedCondition";
  return "NewCondition";
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

type RouteMatch = { id: string; data?: unknown } | undefined;

/** The layout loader's SEO settings and origin, from any route's matches. */
export function getLayoutSeo(matches: readonly RouteMatch[]): LayoutSeoData {
  const data = matches.find((m) => m?.id === LAYOUT_ROUTE_ID)?.data as Partial<LayoutSeoData> | undefined;
  return { seo: data?.seo ?? EMPTY_SEO_SETTINGS, origin: data?.origin ?? "" };
}

export interface PageMetaInput {
  // The page's own title; the site's title template wraps it.
  title: string;
  description?: string;
  image?: string | null;
  // Path for og:url and the default canonical, e.g. "/blog/my-post".
  path: string;
  type?: "website" | "article" | "product";
  // Staff overrides: used exactly as typed, never templated.
  seo?: Partial<SeoMeta> | null;
  // Built-in pages whose meta is set under SEO settings.
  pageKey?: PageMetaKey;
  // Home's title is the site name, so it skips the template.
  rawTitle?: boolean;
  extra?: MetaDescriptor[];
}

function applyTemplate(template: string, title: string) {
  return template.includes("%s") ? template.replace("%s", title) : `${title} | ${template}`;
}

function clip(text: string) {
  const plain = stripHtml(text).replace(/\s+/g, " ").trim();
  return plain.length > META_DESCRIPTION_LENGTH ? `${plain.slice(0, META_DESCRIPTION_LENGTH - 1).trimEnd()}…` : plain;
}

/** Title, description, Open Graph, Twitter, canonical and robots tags. */
export function buildMeta(matches: readonly RouteMatch[], input: PageMetaInput): MetaDescriptor[] {
  const { seo: site, origin } = getLayoutSeo(matches);
  const override = input.pageKey ? site.page_meta?.[input.pageKey] : undefined;
  const ownTitle = input.seo?.meta_title || override?.meta_title;
  const title = ownTitle || (input.rawTitle ? input.title : applyTemplate(site.title_template, input.title));
  const description = clip(
    input.seo?.meta_description || override?.meta_description || input.description || site.default_description,
  );
  const image = input.seo?.og_image || input.image || site.default_og_image || "";
  const url = `${origin}${input.path}`;
  const canonical = input.seo?.canonical_url || url;

  return [
    { title },
    { name: "description", content: description },
    ...(input.seo?.noindex ? [{ name: "robots", content: "noindex,follow" }] : []),
    { tagName: "link", rel: "canonical", href: canonical },
    { property: "og:site_name", content: site.site_name },
    { property: "og:type", content: input.type ?? "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    ...(image ? [{ property: "og:image", content: image }] : []),
    { name: "twitter:card", content: image ? "summary_large_image" : "summary" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    ...(image ? [{ name: "twitter:image", content: image }] : []),
    ...(input.extra ?? []),
  ];
}

/** schema.org Organization for the whole site, from SEO settings. */
export function buildOrganizationJsonLd(seo: PublicSeoSettings, origin: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: seo.site_name,
    url: origin,
    logo: `${origin}/branding/logo.svg`,
    ...(seo.social_profiles.length ? { sameAs: seo.social_profiles } : {}),
  };
}
