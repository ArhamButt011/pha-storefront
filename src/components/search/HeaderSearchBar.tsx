import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { LiveSearchResults } from "./LiveSearchResults";
import { SHOP_FILTER_PARAMS } from "@/constants/shopFilters";
import { cn } from "@/utils/cn";
import type { Product } from "@/data/products";

export interface HeaderSearchBarProps {
  className?: string;
  // Lets a caller (e.g. the mobile nav's slide-out menu) close itself once a
  // search here actually navigates somewhere.
  onNavigate?: () => void;
}

// Replaces the old search-icon-opens-a-modal pattern: typing here shows
// live, debounced results right below the bar (see LiveSearchResults),
// Google-style. Enter/"View all" falls back to the full /shop results page.
export function HeaderSearchBar({ className, onNavigate }: HeaderSearchBarProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  // Blurring the input (e.g. a mousedown on a result) would otherwise close
  // the dropdown before that click's own handler gets to run — delaying the
  // close lets the click land first.
  const blurTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const goToShop = useCallback(
    (term: string) => {
      const params = new URLSearchParams();
      if (term.trim()) params.set(SHOP_FILTER_PARAMS.search, term.trim());
      const qs = params.toString();
      navigate(`/shop${qs ? `?${qs}` : ""}`);
    },
    [navigate],
  );

  const closeNow = useCallback(() => {
    clearTimeout(blurTimeout.current);
    setIsOpen(false);
  }, []);

  const handleSelectProduct = useCallback(
    (product: Product) => {
      closeNow();
      setQuery("");
      onNavigate?.();
      navigate(`/product/${product.slug}`);
    },
    [closeNow, navigate, onNavigate],
  );

  const handleViewAll = useCallback(() => {
    closeNow();
    onNavigate?.();
    goToShop(query);
  }, [closeNow, goToShop, query, onNavigate]);

  const handleClear = useCallback(() => {
    setQuery("");
    setIsOpen(false);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      closeNow();
      onNavigate?.();
      goToShop(query);
    } else if (e.key === "Escape") {
      closeNow();
      e.currentTarget.blur();
    }
  }

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "group relative flex items-center rounded-full border border-border bg-bg-2/90 shadow-md shadow-black/10 backdrop-blur-sm transition-all duration-200",
          "hover:border-accent/40 hover:shadow-lg hover:shadow-black/20",
          "focus-within:border-accent/70 focus-within:shadow-glow",
        )}
      >
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted transition-colors group-focus-within:text-accent" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            // Also reopen here, not just on focus: after Enter/selecting a
            // result the input can stay DOM-focused (closeNow only flips
            // React state), so a later keystroke wouldn't otherwise fire a
            // fresh focus event to reopen the dropdown.
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => {
            blurTimeout.current = setTimeout(() => setIsOpen(false), 150);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search parts…"
          aria-label="Search"
          className={cn(
            "truncate rounded-full border-0 bg-transparent py-2.5 pl-11 text-sm shadow-none",
            "focus:ring-0",
            query ? "pr-9" : "pr-4",
          )}
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            onMouseDown={(e) => e.preventDefault()}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-bg-3 hover:text-fg"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute inset-x-0 top-full z-50">
          <LiveSearchResults query={query} onSelectProduct={handleSelectProduct} onViewAll={handleViewAll} />
        </div>
      )}
    </div>
  );
}
