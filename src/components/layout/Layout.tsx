import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "@/sections/Navbar";
import { Footer } from "@/sections/Footer";
import { InquiryModal } from "@/components/InquiryModal";
// Commented out for now — the header search bar (Navbar) handles live search
// directly, so the old advanced-filter modal is disabled rather than deleted
// in case it's needed again.
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
    </SearchModalProvider>
  );
}
