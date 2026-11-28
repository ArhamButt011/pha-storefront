import { Link } from "react-router-dom";
import { BLOG_PATH } from "@/constants/seo";
import { cn } from "@/utils/cn";

interface ArticleTagLinksProps {
  tags: string[];
  active?: string;
  className?: string;
}

export const tagPath = (tag: string) => `${BLOG_PATH}/tag/${encodeURIComponent(tag)}`;

/** Tag chips that link to each tag's article list. */
export function ArticleTagLinks({ tags, active, className }: ArticleTagLinksProps) {
  if (!tags.length) return null;
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {tags.map((tag) => (
        <Link
          key={tag}
          to={tagPath(tag)}
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
            tag === active
              ? "border-accent bg-accent/15 text-accent"
              : "border-border text-fg-muted hover:border-accent/50 hover:text-accent",
          )}
        >
          {tag}
        </Link>
      ))}
    </div>
  );
}
