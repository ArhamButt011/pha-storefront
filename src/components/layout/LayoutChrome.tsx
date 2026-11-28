import { Outlet } from "react-router-dom";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { SignupPopup } from "@/components/layout/SignupPopup";
import { useStorefrontContent } from "@/context/StorefrontContentContext";
import { useAnnouncementVisibility } from "@/hooks/useAnnouncementVisibility";
import { Footer } from "@/sections/Footer";
import { Navbar } from "@/sections/Navbar";
// Disabled, not deleted: the Navbar search replaces the advanced-filter modal.
// import { SearchFiltersModal } from "@/components/search/SearchFiltersModal";

/** Banner, navbar, page and footer, rendered inside Layout's providers. */
export function LayoutChrome({ onInquiry }: { onInquiry: () => void }) {
  // const { open, setOpen } = useSearchModal();
  const { announcement, signup_popup } = useStorefrontContent();
  const banner = useAnnouncementVisibility(announcement);

  return (
    <>
      {banner.visible && announcement && <AnnouncementBar announcement={announcement} onDismiss={banner.dismiss} />}
      <Navbar onInquiry={onInquiry} offsetForAnnouncement={banner.visible} />
      <div className={banner.visible ? "pt-9" : undefined}>
        <Outlet />
        <Footer />
      </div>
      {signup_popup && <SignupPopup popup={signup_popup} />}
      {/* <SearchFiltersModal open={open} onOpenChange={setOpen} /> */}
    </>
  );
}
