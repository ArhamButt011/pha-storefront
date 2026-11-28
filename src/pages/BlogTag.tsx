import type { Route } from "./+types/BlogTag";
import { BlogListingView } from "@/components/blog/BlogListingView";
import { tagPath } from "@/components/blog/ArticleTagLinks";
import { loadArticleListing, pageSuffix } from "@/lib/blog";
import { redirectOrNotFound } from "@/lib/redirects";
import { buildMeta } from "@/lib/seo";

export async function loader({ request, params }: Route.LoaderArgs) {
  const tag = params.tag;
  const listing = await loadArticleListing(request, tag);
  // An unknown tag is a dead URL, not an empty page Google should index.
  if (!listing.articles.total) await redirectOrNotFound(request);
  return { ...listing, tag };
}

export function meta({ data, matches }: Route.MetaArgs) {
  if (!data) return [];
  const page = data.articles.page;
  return buildMeta(matches, {
    title: `${data.tag} articles${page > 1 ? `, page ${page}` : ""}`,
    description: `Articles about ${data.tag.toLowerCase()} from our team.`,
    path: `${tagPath(data.tag)}${pageSuffix(page)}`,
  });
}

export default function BlogTag({ loaderData }: Route.ComponentProps) {
  const { tag, articles, tags } = loaderData;
  return (
    <BlogListingView
      heading={tag}
      intro={`${articles.total} ${articles.total === 1 ? "article" : "articles"} tagged ${tag}.`}
      articles={articles}
      tags={tags}
      activeTag={tag}
    />
  );
}
