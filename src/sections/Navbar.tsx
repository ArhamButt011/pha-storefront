import { useEffect, useState } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onInquiry: () => void;
}

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Categories", href: "#categories" },
  { label: "Products", href: "#products" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function Navbar({ onInquiry }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-bg/95 shadow-lg backdrop-blur-md border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-3 group">
            <img
              src="/branding/logo.png"
              alt="Parts Hub Australia"
              className="h-12 w-12 rounded-xl object-contain transition-transform duration-300 group-hover:scale-110"
            />
            <div className="hidden sm:block">
              <span className="font-display text-lg font-bold tracking-wider text-fg">
                PARTS HUB{" "}
                <span className="text-accent">AUSTRALIA</span>
              </span>
            </div>
          </a>

          {/* Desktop nav */}
          <div className="hidden items-center gap-6 lg:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="nav-link text-sm font-medium text-fg-muted transition-colors hover:text-fg"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Right actions */}
          <div className="hidden items-center gap-3 lg:flex">
            <button className="relative p-2 text-fg-muted transition-colors hover:text-fg">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-fg">
                  {cartCount}
                </span>
              )}
            </button>
            <Button size="sm" variant="outline" onClick={onInquiry}>
              Enquire
            </Button>
            <Button size="sm" onClick={() => window.open("https://admin.partshubaustralia.com.au/login", "_blank")}>
              Sign In
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="p-2 text-fg lg:hidden"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`mobile-menu fixed right-0 top-0 z-50 flex h-full w-72 flex-col bg-bg-2 p-8 lg:hidden ${menuOpen ? "open" : ""}`}
      >
        <div className="flex items-center justify-between mb-8">
          <a href="#home" onClick={() => setMenuOpen(false)} className="flex items-center gap-2">
            <img
              src="/branding/logo.png"
              alt="Parts Hub Australia"
              className="h-10 w-10 rounded-xl object-contain"
            />
            <span className="font-display text-sm font-bold tracking-wider text-fg">
              PH<span className="text-accent">A</span>
            </span>
          </a>
          <button
            onClick={() => setMenuOpen(false)}
            className="rounded-lg p-1.5 text-fg-muted hover:bg-bg-3 hover:text-fg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-4 py-3 text-base font-medium text-fg-muted transition-colors hover:bg-bg-3 hover:text-accent"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-2">
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
