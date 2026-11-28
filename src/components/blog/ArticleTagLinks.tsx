import { Link } from "react-router-dom";
import { BLOG_PATH } from "@/constants/seo";
import { tagPath } from "@/lib/blog";
import { cn } from "@/utils/cn";

interface ArticleTagLinksProps {
  tags: string[];
  active?: string;
  // Leads with an "All" chip back to /blog, for the listing filters.
  showAll?: boolean;
  className?: string;
}

const chipClass = (on: boolean) =>
  cn(
    "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
    on ? "border-accent bg-accent/15 text-accent" : "border-border text-fg-muted hover:border-accent/50 hover:text-accent",
  );

/** Tag chips that link to each tag's article list. */
export function ArticleTagLinks({ tags, active, showAll, className }: ArticleTagLinksProps) {
  if (!tags.length) return null;
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {showAll ? (
        <Link to={BLOG_PATH} className={chipClass(!active)}>
          All
        </Link>
      ) : null}
      {tags.map((tag) => (
        <Link key={tag} to={tagPath(tag)} className={chipClass(tag === active)}>
          {tag}
        </Link>
      ))}
    </div>
  );
}
