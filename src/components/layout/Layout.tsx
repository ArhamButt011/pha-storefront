import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { InquiryModal } from "@/components/InquiryModal";
import { CartSync } from "@/components/cart/CartSync";
import { LayoutChrome } from "@/components/layout/LayoutChrome";
import { EMPTY_STOREFRONT_CONTENT } from "@/constants/storefront";
import { SearchModalProvider } from "@/context/SearchModalContext";
import { StorefrontContentProvider } from "@/context/StorefrontContentContext";
import { getStorefrontContent } from "@/lib/api/storefront";
import type { StorefrontContent } from "@/types/storefront";

// Dashboard-managed content, a failure must never take the shop down.
export async function loader(): Promise<StorefrontContent> {
  try {
    return { ...EMPTY_STOREFRONT_CONTENT, ...(await getStorefrontContent()).data };
  } catch {
    return EMPTY_STOREFRONT_CONTENT;
  }
}

export function Layout() {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const content = useLoaderData<typeof loader>();

  return (
    <StorefrontContentProvider value={content}>
      <SearchModalProvider>
        <LayoutChrome onInquiry={() => setInquiryOpen(true)} />
        <InquiryModal open={inquiryOpen} onOpenChange={setInquiryOpen} />
        <CartSync />
      </SearchModalProvider>
    </StorefrontContentProvider>
  );
}

// routes.ts's layout() needs the route component as the default export.
export default Layout;
