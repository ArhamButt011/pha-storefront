import { useState } from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { useAnnouncementVisibility } from "@/hooks/useAnnouncementVisibility";
import { StorefrontContentProvider, useStorefrontContent } from "@/context/StorefrontContentContext";
import { EMPTY_STOREFRONT_CONTENT } from "@/constants/storefront";
import { getStorefrontContent } from "@/lib/api/storefront";
import type { StorefrontContent } from "@/types/storefront";
import { Navbar } from "@/sections/Navbar";
import { Footer } from "@/sections/Footer";
import { InquiryModal } from "@/components/InquiryModal";
import { CartSync } from "@/components/cart/CartSync";
// Disabled, not deleted: the Navbar search replaces the advanced-filter modal.
// import { SearchFiltersModal } from "@/components/search/SearchFiltersModal";
import { SearchModalProvider } from "@/context/SearchModalContext";

// Dashboard-managed content, a failure must never take the shop down.
export async function loader(): Promise<StorefrontContent> {
  try {
    return { ...EMPTY_STOREFRONT_CONTENT, ...(await getStorefrontContent()).data };
  } catch {
    return EMPTY_STOREFRONT_CONTENT;
  }
}

function LayoutInner({ onInquiry }: { onInquiry: () => void }) {
  // const { open, setOpen } = useSearchModal();
  const { announcement } = useStorefrontContent();
  const banner = useAnnouncementVisibility(announcement);

  return (
    <>
      {banner.visible && announcement && <AnnouncementBar announcement={announcement} onDismiss={banner.dismiss} />}
      <Navbar onInquiry={onInquiry} offsetForAnnouncement={banner.visible} />
      <div className={banner.visible ? "pt-9" : undefined}>
        <Outlet />
        <Footer />
      </div>
      {/* <SearchFiltersModal open={open} onOpenChange={setOpen} /> */}
    </>
  );
}

export function Layout() {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const content = useLoaderData<typeof loader>();

  return (
    <StorefrontContentProvider value={content}>
    <SearchModalProvider>
      <LayoutInner onInquiry={() => setInquiryOpen(true)} />
      <InquiryModal open={inquiryOpen} onOpenChange={setInquiryOpen} />
      <CartSync />
    </SearchModalProvider>
    </StorefrontContentProvider>
  );
}

// routes.ts's layout() needs the route component as the default export.
export default Layout;
