import type { Route } from "./+types/BlogIndex";
import { BlogListingView } from "@/components/blog/BlogListingView";
import { BLOG_PATH } from "@/constants/seo";
import { loadArticleListing, pageSuffix } from "@/lib/blog";
import { buildMeta } from "@/lib/seo";

const INTRO = "Workshop tips, fitting guides and news from our team.";

export async function loader({ request }: Route.LoaderArgs) {
  return loadArticleListing(request);
}

export function meta({ data, matches }: Route.MetaArgs) {
  const page = data?.articles.page ?? 1;
  return buildMeta(matches, {
    title: page > 1 ? `Blog, page ${page}` : "Blog",
    description: INTRO,
    path: `${BLOG_PATH}${pageSuffix(page)}`,
    pageKey: page > 1 ? undefined : "blog",
  });
}

export default function BlogIndex({ loaderData }: Route.ComponentProps) {
  return <BlogListingView heading="Blog" intro={INTRO} articles={loaderData.articles} tags={loaderData.tags} />;
}
