import { BLOG_PATH } from "@/constants/seo";
import { listArticleTags, listArticles } from "@/lib/api/seo";
import type { ArticlePage, ArticleTagCount } from "@/types/seo";

const pageFromUrl = (request: Request) => Math.max(1, Number(new URL(request.url).searchParams.get("page")) || 1);

/** One page of live articles plus the tag cloud; tags may fail softly. */
export async function loadArticleListing(request: Request, tag?: string): Promise<{ articles: ArticlePage; tags: ArticleTagCount[] }> {
  const [articles, tags] = await Promise.all([
    listArticles(pageFromUrl(request), tag).then((res) => res.data),
    listArticleTags()
      .then((res) => res.data)
      .catch(() => []),
  ]);
  return { articles, tags };
}

/** /blog/tag/<tag>, encoded for tags with spaces or symbols. */
export const tagPath = (tag: string) => `${BLOG_PATH}/tag/${encodeURIComponent(tag)}`;

/** "?page=2" for page 2+, so paginated URLs canonicalise to themselves. */
export const pageSuffix = (page: number) => (page > 1 ? `?page=${page}` : "");
