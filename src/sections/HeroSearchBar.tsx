import { Search } from "lucide-react";
import { useSearchModal } from "@/context/SearchModalContext";

// Sits in the same overlapping-card slot the old "Select Your Vehicle"
// section used (-mt-16 over the Hero), now as a single prominent search
// entry point instead of inline vehicle dropdowns.
export function HeroSearchBar() {
  const { openModal } = useSearchModal();

  return (
    <section className="relative z-20 -mt-16 mx-4 sm:mx-8 lg:mx-16">
      <button
        type="button"
        onClick={openModal}
        className="mx-auto flex w-full max-w-3xl items-center gap-3 rounded-xl border border-border bg-bg-2/95 px-5 py-4 text-left shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-md transition hover:border-accent/40 sm:px-6"
      >
        <Search className="h-5 w-5 shrink-0 text-accent" />
        <span className="min-w-0 flex-1 truncate font-display text-base font-bold tracking-wide text-fg">
          Search parts, categories, make, model, year…
        </span>
        <span className="hidden shrink-0 items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-bold text-accent-fg sm:flex">
          Find Parts
        </span>
      </button>
    </section>
  );
}
