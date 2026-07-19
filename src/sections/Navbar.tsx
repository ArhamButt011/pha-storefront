import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingCart, User, Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLinkItem } from "@/components/layout/NavLinkItem";
import { useCart } from "@/hooks/useCart";
import { useVehicle } from "@/context/VehicleContext";
import { useSearchModal } from "@/context/SearchModalContext";

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
  const { openModal } = useSearchModal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function openFilters() {
    setMenuOpen(false);
    openModal();
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
          <Link to="/" className="flex shrink-0 items-center gap-0 group">
            <img
              src="/branding/logo.svg"
              alt="Parts Hub Australia"
              className="h-16 w-16 object-contain transition-transform duration-300"
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

          <div className="ml-auto hidden items-center gap-1 lg:flex">
            <button
              type="button"
              onClick={openFilters}
              className="p-2 text-fg-muted transition-colors hover:text-fg"
              aria-label="Search"
            >
              <SearchIcon className="h-5 w-5" />
            </button>
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

        <button
          type="button"
          onClick={openFilters}
          aria-label="Search"
          className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-bg-3 text-fg-muted transition-colors hover:text-fg"
        >
          <SearchIcon className="h-5 w-5" />
        </button>

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
          <Button variant="outline" className="w-full" onClick={() => { setMenuOpen(false); onInquiry(); }}>
            Enquire
          </Button>
          <Button className="w-full" onClick={() => window.open("https://admin.partshubaustralia.com.au/login", "_blank")}>
            Sign In
          </Button>
        </div>
      </div>
    </>
  );
}