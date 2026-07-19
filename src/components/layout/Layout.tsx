import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "@/sections/Navbar";
import { Footer } from "@/sections/Footer";
import { InquiryModal } from "@/components/InquiryModal";
import { SearchFiltersModal } from "@/components/search/SearchFiltersModal";
import { SearchModalProvider, useSearchModal } from "@/context/SearchModalContext";

function LayoutInner({ onInquiry }: { onInquiry: () => void }) {
  const { open, setOpen } = useSearchModal();

  return (
    <>
      <Navbar onInquiry={onInquiry} />
      <Outlet />
      <Footer />
      <SearchFiltersModal open={open} onOpenChange={setOpen} />
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
