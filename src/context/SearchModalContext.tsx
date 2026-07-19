import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

interface SearchModalContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  openModal: () => void;
}

const SearchModalContext = createContext<SearchModalContextValue | null>(null);

// Single shared modal instance/state for the whole app (mounted once in
// Layout) instead of Navbar and HeroSearchBar each owning their own — two
// separate instances meant selecting filters in one and navigating away
// (which unmounts it) lost that state entirely before the other could ever
// see it.
export function SearchModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const value = useMemo(() => ({ open, setOpen, openModal: () => setOpen(true) }), [open]);
  return <SearchModalContext.Provider value={value}>{children}</SearchModalContext.Provider>;
}

export function useSearchModal() {
  const ctx = useContext(SearchModalContext);
  if (!ctx) throw new Error("useSearchModal must be used within a SearchModalProvider");
  return ctx;
}
