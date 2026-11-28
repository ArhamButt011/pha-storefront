import type { Route } from "./+types/Sitemap";
import { BLOG_PATH, CONTENT_PAGE_PATH, SEO_RESOURCE_CACHE, SITEMAP_STATIC_PATHS } from "@/constants/seo";
import { getSitemapEntries } from "@/lib/api/seo";
import { escapeXml, getOrigin } from "@/lib/seo";
import type { SitemapEntry } from "@/types/seo";

interface UrlEntry {
  path: string;
  lastmod?: string | null;
}

const toUrls = (entries: SitemapEntry[], prefix: string): UrlEntry[] =>
  entries.map((e) => ({ path: `${prefix}/${encodeURIComponent(e.slug)}`, lastmod: e.updated_at }));

function renderUrl(origin: string, { path, lastmod }: UrlEntry) {
  const date = lastmod ? `<lastmod>${new Date(lastmod).toISOString().slice(0, 10)}</lastmod>` : "";
  return `<url><loc>${escapeXml(`${origin}${path}`)}</loc>${date}</url>`;
}

export async function loader({ request }: Route.LoaderArgs) {
  const origin = getOrigin(request);
  const { data: entries } = await getSitemapEntries();
  // Shop links are keyed by category id, not slug.
  const categories = entries.categories.map((c) => ({ path: `/shop/${c.id}`, lastmod: c.updated_at }));
  const urls: UrlEntry[] = [
    ...SITEMAP_STATIC_PATHS.map((path) => ({ path })),
    ...categories,
    ...toUrls(entries.pages, CONTENT_PAGE_PATH),
    ...toUrls(entries.articles, BLOG_PATH),
    ...toUrls(entries.products, "/product"),
  ];
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map((u) => renderUrl(origin, u)).join("\n") +
    "\n</urlset>\n";
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": SEO_RESOURCE_CACHE } });
}
