import { useNavigate, useSearchParams } from "react-router-dom";
import { Breadcrumb, type BreadcrumbItem } from "@/components/common/Breadcrumb";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { ArticleTagLinks } from "@/components/blog/ArticleTagLinks";
import { Pagination } from "@/components/ui/pagination";
import { BLOG_PATH } from "@/constants/seo";
import type { ArticlePage, ArticleTagCount } from "@/types/seo";

interface BlogListingViewProps {
  heading: string;
  intro: string;
  articles: ArticlePage;
  tags: ArticleTagCount[];
  activeTag?: string;
}

/** Article grid with tag filters and pagination, for /blog and tag pages. */
export function BlogListingView({ heading, intro, articles, tags, activeTag }: BlogListingViewProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const crumbs: BreadcrumbItem[] = activeTag
    ? [{ label: "Home", href: "/" }, { label: "Blog", href: BLOG_PATH }, { label: activeTag }]
    : [{ label: "Home", href: "/" }, { label: "Blog" }];

  function goToPage(page: number) {
    const next = new URLSearchParams(searchParams);
    if (page > 1) next.set("page", String(page));
    else next.delete("page");
    const query = next.toString();
    navigate(query ? `?${query}` : ".");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <Breadcrumb items={crumbs} />
      <header className="mb-8 mt-6 max-w-3xl">
        <h1 className="font-display text-3xl font-black text-fg sm:text-4xl">{heading}</h1>
        <p className="mt-3 text-fg-muted">{intro}</p>
      </header>

      <ArticleTagLinks tags={tags.map((t) => t.tag)} active={activeTag} showAll className="mb-8" />

      {articles.items.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.items.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-border p-10 text-center text-fg-muted">
          No articles yet. Check back soon.
        </p>
      )}

      <Pagination page={articles.page} totalPages={articles.totalPages} onPageChange={goToPage} className="mt-10" />
    </main>
  );
}
