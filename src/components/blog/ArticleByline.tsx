import { Clock } from "lucide-react";
import { formatDate } from "@/utils/format";
import type { ArticleCard } from "@/types/seo";

/** Author · date · reading time. */
export function ArticleByline({ article }: { article: Pick<ArticleCard, "author_name" | "published_at" | "reading_minutes"> }) {
  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-fg-muted">
      {article.author_name ? <span className="font-medium text-fg">{article.author_name}</span> : null}
      {article.author_name ? <span aria-hidden>·</span> : null}
      <time dateTime={article.published_at}>{formatDate(article.published_at)}</time>
      <span aria-hidden>·</span>
      <span className="flex items-center gap-1">
        <Clock className="h-3.5 w-3.5" />
        {article.reading_minutes} min read
      </span>
    </p>
  );
}
