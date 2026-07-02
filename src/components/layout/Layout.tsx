import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "@/sections/Navbar";
import { Footer } from "@/sections/Footer";
import { InquiryModal } from "@/components/InquiryModal";

export function Layout() {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <>
      <Navbar onInquiry={() => setInquiryOpen(true)} />
      <Outlet />
      <Footer />
      <InquiryModal open={inquiryOpen} onOpenChange={setInquiryOpen} />
    </>
  );
}
