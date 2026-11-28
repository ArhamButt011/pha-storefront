import type { Route } from "./+types/CustomPage";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { RichContent } from "@/components/common/RichContent";
import { CONTENT_PAGE_PATH } from "@/constants/seo";
import { ApiError } from "@/lib/api/client";
import { getPage } from "@/lib/api/seo";
import { redirectOrNotFound } from "@/lib/redirects";
import { buildMeta } from "@/lib/seo";

export async function loader({ params, request }: Route.LoaderArgs) {
  try {
    return { page: (await getPage(params.slug)).data };
  } catch (err) {
    // Only a real 404 is a 404; Google de-indexes it, so outages must 500.
    if (err instanceof ApiError && err.status === 404) return redirectOrNotFound(request);
    throw err;
  }
}

export function meta({ data, matches }: Route.MetaArgs) {
  if (!data) return [];
  const { page } = data;
  return buildMeta(matches, {
    title: page.title,
    description: page.excerpt,
    path: `${CONTENT_PAGE_PATH}/${page.slug}`,
    seo: page.seo,
  });
}

export default function CustomPage({ loaderData }: Route.ComponentProps) {
  const { page } = loaderData;
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: page.title }]} />
      <h1 className="mb-8 mt-6 font-display text-3xl font-black text-fg sm:text-4xl">{page.title}</h1>
      <RichContent html={page.body_html} />
    </main>
  );
}
