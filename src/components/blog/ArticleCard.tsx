import { Link } from "react-router-dom";
import { Newspaper } from "lucide-react";
import { ArticleByline } from "@/components/blog/ArticleByline";
import { BLOG_PATH } from "@/constants/seo";
import type { ArticleCard as ArticleCardData } from "@/types/seo";

/** Cover, title, excerpt and byline for one article in a grid. */
export function ArticleCard({ article }: { article: ArticleCardData }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-bg-2 transition-all hover:-translate-y-1 hover:border-accent/40">
      <Link to={`${BLOG_PATH}/${article.slug}`} className="block aspect-video overflow-hidden bg-bg-3">
        {article.cover_image ? (
          <img
            src={article.cover_image}
            alt={article.cover_alt || article.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-fg-muted">
            <Newspaper className="h-10 w-10" />
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        {article.tags[0] ? <span className="text-xs font-bold uppercase tracking-wider text-accent">{article.tags[0]}</span> : null}
        <h2 className="font-display text-lg font-bold leading-snug text-fg">
          <Link to={`${BLOG_PATH}/${article.slug}`} className="transition-colors hover:text-accent">
            {article.title}
          </Link>
        </h2>
        {article.excerpt ? <p className="line-clamp-3 text-sm text-fg-muted">{article.excerpt}</p> : null}
        <div className="mt-auto pt-2">
          <ArticleByline article={article} />
        </div>
      </div>
    </article>
  );
}
