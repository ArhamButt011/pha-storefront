import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "@/sections/Navbar";
import { Footer } from "@/sections/Footer";
import { InquiryModal } from "@/components/InquiryModal";
import { CartSync } from "@/components/cart/CartSync";
// Disabled, not deleted: the Navbar search replaces the advanced-filter modal.
// import { SearchFiltersModal } from "@/components/search/SearchFiltersModal";
import { SearchModalProvider } from "@/context/SearchModalContext";

function LayoutInner({ onInquiry }: { onInquiry: () => void }) {
  // const { open, setOpen } = useSearchModal();

  return (
    <>
      <Navbar onInquiry={onInquiry} />
      <Outlet />
      <Footer />
      {/* <SearchFiltersModal open={open} onOpenChange={setOpen} /> */}
    </>
  );
}

export function Layout() {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <SearchModalProvider>
      <LayoutInner onInquiry={() => setInquiryOpen(true)} />
      <InquiryModal open={inquiryOpen} onOpenChange={setInquiryOpen} />
      <CartSync />
    </SearchModalProvider>
  );
}

// routes.ts's layout() needs the route component as the default export.
export default Layout;
