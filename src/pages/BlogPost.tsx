import type { Route } from "./+types/BlogPost";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { RichContent } from "@/components/common/RichContent";
import { ArticleByline } from "@/components/blog/ArticleByline";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { ArticleTagLinks } from "@/components/blog/ArticleTagLinks";
import { useSeo } from "@/context/SeoContext";
import { BLOG_PATH } from "@/constants/seo";
import { ApiError } from "@/lib/api/client";
import { getArticle } from "@/lib/api/seo";
import { redirectOrNotFound } from "@/lib/redirects";
import { buildMeta, getOrigin, safeJsonLd } from "@/lib/seo";
import type { Article } from "@/types/seo";

export async function loader({ params, request }: Route.LoaderArgs) {
  try {
    const res = await getArticle(params.slug);
    return { article: res.data, origin: getOrigin(request) };
  } catch (err) {
    // Only a real 404 is a 404; Google de-indexes it, so outages must 500.
    if (err instanceof ApiError && err.status === 404) return redirectOrNotFound(request);
    throw err;
  }
}

export function meta({ data, matches }: Route.MetaArgs) {
  if (!data) return [];
  const { article } = data;
  return buildMeta(matches, {
    title: article.title,
    description: article.excerpt,
    image: article.cover_image,
    path: `${BLOG_PATH}/${article.slug}`,
    type: "article",
    seo: article.seo,
    extra: [
      { property: "article:published_time", content: article.published_at },
      { property: "article:modified_time", content: article.updated_at },
      ...article.tags.map((tag) => ({ property: "article:tag", content: tag })),
    ],
  });
}

function buildArticleJsonLd(article: Article, origin: string, siteName: string) {
  const url = `${origin}${BLOG_PATH}/${article.slug}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.seo.meta_description || article.excerpt,
      ...(article.cover_image ? { image: [article.cover_image] } : {}),
      datePublished: article.published_at,
      dateModified: article.updated_at,
      author: article.author_name ? { "@type": "Person", name: article.author_name } : { "@type": "Organization", name: siteName },
      publisher: { "@type": "Organization", name: siteName, logo: { "@type": "ImageObject", url: `${origin}/branding/logo.svg` } },
      mainEntityOfPage: url,
      ...(article.tags.length ? { keywords: article.tags.join(", ") } : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${origin}/` },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${origin}${BLOG_PATH}` },
        { "@type": "ListItem", position: 3, name: article.title, item: url },
      ],
    },
  ];
}

export default function BlogPost({ loaderData }: Route.ComponentProps) {
  const { article, origin } = loaderData;
  const { site_name: siteName } = useSeo();

  return (
    <main className="pb-16 pt-28">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: safeJsonLd(buildArticleJsonLd(article, origin, siteName)) }}
      />
      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Blog", href: BLOG_PATH }, { label: article.title }]} />
        <header className="mb-8 mt-6 space-y-4">
          <ArticleTagLinks tags={article.tags} />
          <h1 className="font-display text-3xl font-black leading-tight text-fg sm:text-4xl">{article.title}</h1>
          <ArticleByline article={article} />
        </header>
        {article.cover_image ? (
          <img
            src={article.cover_image}
            alt={article.cover_alt || article.title}
            className="mb-10 aspect-video w-full rounded-2xl border border-border object-cover"
          />
        ) : null}
        <RichContent html={article.body_html} />
      </article>

      {article.related.length ? (
        <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 font-display text-2xl font-bold text-fg">Keep reading</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {article.related.map((related) => (
              <ArticleCard key={related._id} article={related} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
