import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import type { Route } from "./+types/Layout";
import { InquiryModal } from "@/components/InquiryModal";
import { CartSync } from "@/components/cart/CartSync";
import { LayoutChrome } from "@/components/layout/LayoutChrome";
import { EMPTY_SEO_SETTINGS } from "@/constants/seo";
import { EMPTY_STOREFRONT_CONTENT } from "@/constants/storefront";
import { SearchModalProvider } from "@/context/SearchModalContext";
import { SeoProvider } from "@/context/SeoContext";
import { StorefrontContentProvider } from "@/context/StorefrontContentContext";
import { getOrigin } from "@/lib/seo";
import { getPublicSeo } from "@/lib/api/seo";
import { getStorefrontContent } from "@/lib/api/storefront";
import type { StorefrontContent } from "@/types/storefront";
import type { PublicSeoSettings } from "@/types/seo";

// Dashboard-managed content and SEO; a failure must never take the shop down.
export async function loader({ request }: Route.LoaderArgs) {
  const [content, seo] = await Promise.all([
    getStorefrontContent()
      .then((res): StorefrontContent => ({ ...EMPTY_STOREFRONT_CONTENT, ...res.data }))
      .catch(() => EMPTY_STOREFRONT_CONTENT),
    getPublicSeo()
      .then((res): PublicSeoSettings => ({ ...EMPTY_SEO_SETTINGS, ...res.data }))
      .catch(() => EMPTY_SEO_SETTINGS),
  ]);
  return { content, seo, origin: getOrigin(request) };
}

// Cart and checkout have no meta of their own; any page's meta replaces this.
export function meta({ data }: Route.MetaArgs) {
  const seo = data?.seo ?? EMPTY_SEO_SETTINGS;
  return [{ title: `${seo.site_name} | Premium Automotive Parts` }, { name: "description", content: seo.default_description }];
}

export function Layout() {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const { content, seo } = useLoaderData<typeof loader>();

  return (
    <StorefrontContentProvider value={content}>
      <SeoProvider value={seo}>
        <SearchModalProvider>
          <LayoutChrome onInquiry={() => setInquiryOpen(true)} />
          <InquiryModal open={inquiryOpen} onOpenChange={setInquiryOpen} />
          <CartSync />
        </SearchModalProvider>
      </SeoProvider>
    </StorefrontContentProvider>
  );
}

// routes.ts's layout() needs the route component as the default export.
export default Layout;
