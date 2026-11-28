import type { Route } from "./+types/Robots";
import { EMPTY_SEO_SETTINGS, ROBOTS_DEFAULT_DISALLOW, SEO_RESOURCE_CACHE } from "@/constants/seo";
import { getPublicSeo } from "@/lib/api/seo";
import { getOrigin } from "@/lib/seo";

export async function loader({ request }: Route.LoaderArgs) {
  const seo = await getPublicSeo()
    .then((res) => res.data)
    .catch(() => EMPTY_SEO_SETTINGS);
  const disallow = [...new Set([...ROBOTS_DEFAULT_DISALLOW, ...seo.robots_disallow])];
  const body = [
    "User-agent: *",
    "Allow: /",
    ...disallow.map((path) => `Disallow: ${path}`),
    "",
    `Sitemap: ${getOrigin(request)}/sitemap.xml`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": SEO_RESOURCE_CACHE } });
}
