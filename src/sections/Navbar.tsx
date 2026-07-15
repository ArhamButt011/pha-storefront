import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Menu, X, ShoppingCart, User, Search as SearchIcon, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLinkItem } from "@/components/layout/NavLinkItem";
import { useCart } from "@/hooks/useCart";
import { useVehicle } from "@/context/VehicleContext";
import { getCategories } from "@/lib/api/categories";
import type { ApiCategory } from "@/types/category";

interface Props {
  onInquiry: () => void;
}

const NAV_LINKS = [
  { label: "Shop by Category", href: "/categories" },
  { label: "Shop", href: "/shop" },
  // { label: "Popular Bundles", href: "/bundles" },
  { label: "About Us", href: "/#about" },
];

export function Navbar({ onInquiry }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems: cartCount } = useCart();
  const { setVehicle } = useVehicle();
  const navigate = useNavigate();
  const [urlSearchParams] = useSearchParams();

  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [searchCategory, setSearchCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Keeps the navbar's search input in sync with the URL — landing on (or
  // navigating to) a URL like /shop?search=bonu should show "bonu" in
  // the field, not just apply it silently on the results page.
  useEffect(() => {
    setSearchQuery(urlSearchParams.get("search") ?? "");
  }, [urlSearchParams]);

  const selectedCategoryLabel =
    categories.find((c) => c._id === searchCategory)?.name ?? "All Categories";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        // The category API now enforces limit/page server-side (it used to
        // ignore them), so a generous limit is passed explicitly here to
        // keep the nav dropdown showing the full category list.
        const res = await getCategories({ limit: 100, page: 1 });
        if (!cancelled) setCategories(res.data.items);
      } catch (err) {
        console.error(err);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Selecting a category filters via the /shop/:categoryId route (the
  // same one CategoryCard uses) — that's what ProductsListing reads to call
  // GET /category/:id and GET /product?categories=:id. Passing the category
  // as a query string instead (the old behavior) was silently ignored,
  // since the page never looked at a `categories` search param.
  function handleSearch() {
    setMenuOpen(false);

    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    const query = params.toString();

    const path = searchCategory ? `/shop/${searchCategory}` : "/shop";
    navigate(`${path}${query ? `?${query}` : ""}`);
  }

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  }

  function handleNavClick(href: string) {
    if (href === "/shop") setVehicle(null);
  }

  return (
    <>
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-bg/95 shadow-lg backdrop-blur-md border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex shrink-0 items-center gap-2 group">
            <img
              src="/branding/logo.svg"
              alt="Parts Hub Australia"
              className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-110"
            />
            <span className="hidden font-display text-sm font-bold tracking-wider text-fg sm:block">
              PARTS HUB <span className="text-accent">AUSTRALIA</span>
            </span>
          </Link>

          <div className="hidden items-center gap-6 lg:flex">
            {NAV_LINKS.map((l) => (
              <NavLinkItem
                key={l.href}
                href={l.href}
                label={l.label}
                onClick={() => handleNavClick(l.href)}
                className="nav-link whitespace-nowrap text-sm font-medium text-fg-muted transition-colors hover:text-fg"
              />
            ))}
          </div>

          <div className="hidden flex-1 items-center rounded-full border border-border bg-bg-2 py-1 pl-1 pr-1.5 lg:flex">
            <div
              className="category-autosize relative shrink-0"
              data-label={selectedCategoryLabel}
            >
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                aria-label="Search category"
                className="min-w-[5.5rem] max-w-[12rem] rounded-full bg-bg-3 py-2 pl-3 pr-7 text-xs font-semibold text-fg-muted outline-none transition hover:text-fg focus:text-fg appearance-none"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-fg-muted" />
            </div>
            <span className="mx-2 h-5 w-px shrink-0 bg-border" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search part number…"
              className="w-full bg-transparent text-sm text-fg outline-none placeholder:text-fg-muted"
            />
            <button
              type="button"
              onClick={handleSearch}
              aria-label="Search"
              className="ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-fg transition hover:brightness-110"
            >
              <SearchIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="ml-auto hidden items-center gap-1 lg:flex">
            {/* <button className="p-2 text-fg-muted transition-colors hover:text-fg" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
            </button> */}
            <Link to="/cart" className="relative p-2 text-fg-muted transition-colors hover:text-fg" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-fg">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              className="p-2 text-fg-muted transition-colors hover:text-fg cursor-pointer"
              aria-label="Account"
              onClick={() => window.open("https://admin.partshubaustralia.com.au/login", "_blank")}
            >
              <User className="h-5 w-5" />
            </button>
          </div>

          <button
            className="ml-auto p-2 text-fg lg:hidden"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div
        className={`mobile-menu fixed right-0 top-0 z-50 flex h-full w-72 flex-col bg-bg-2 p-8 lg:hidden ${menuOpen ? "open" : ""}`}
      >
        <div className="flex items-center justify-between mb-8">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <img
              src="/branding/logo.svg"
              alt="Parts Hub Australia"
              className="h-10 w-10 object-contain"
            />
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            className="rounded-lg p-1.5 text-fg-muted hover:bg-bg-3 hover:text-fg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6 flex flex-col gap-2 rounded-xl border border-border bg-bg-3 p-2">
          <select
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            aria-label="Search category"
            className="w-full rounded-lg bg-bg-2 px-3 py-2 text-xs font-semibold text-fg-muted outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search part number…"
              className="w-full rounded-lg bg-bg-2 px-3 py-2 text-sm text-fg outline-none placeholder:text-fg-muted"
            />
            <button
              type="button"
              onClick={handleSearch}
              aria-label="Search"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-fg transition hover:brightness-110"
            >
              <SearchIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV_LINKS.map((l) => (
            <NavLinkItem
              key={l.href}
              href={l.href}
              label={l.label}
              onClick={() => {
                handleNavClick(l.href);
                setMenuOpen(false);
              }}
              className="rounded-lg px-4 py-3 text-base font-medium text-fg-muted transition-colors hover:bg-bg-3 hover:text-accent"
              activeClassName="bg-bg-3 text-accent"
            />
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-3">
          {/* <Button variant="outline" className="w-full" onClick={() => { setMenuOpen(false); onInquiry(); }}>
            Enquire
          </Button> */}
          <Button className="w-full" onClick={() => window.open("https://admin.partshubaustralia.com.au/login", "_blank")}>
            Sign In
          </Button>
        </div>
      </div>
    </>
  );
}