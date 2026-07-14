import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";

interface Props {
  href: string;
  label: string;
  onClick?: () => void;
  className?: string;
  activeClassName?: string;
}


export function NavLinkItem({ href, label, onClick, className, activeClassName }: Props) {
  const [basePath, hash] = href.split("#");
  const isHashLink = Boolean(hash);
  const { pathname } = useLocation();
  const [sectionInView, setSectionInView] = useState(false);

  useEffect(() => {
    if (!isHashLink) return;

    // Only spy while we're actually on the page the section lives on
    // (href like "/#about" implies "/" when no path is given).
    if (pathname !== (basePath || "/")) {
      setSectionInView(false);
      return;
    }

    const el = document.getElementById(hash);
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setSectionInView(entry.isIntersecting),
      // Shrink the viewport box by the fixed navbar height on top, and
      // require the section to reach past the vertical midpoint before
      // counting as "in view" — standard scroll-spy behavior.
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isHashLink, hash, basePath, pathname]);

  return (
    <NavLink
      to={href}
      onClick={onClick}
      className={({ isActive }) => {
        const active = isHashLink ? sectionInView : isActive;
        return cn(
          className,
          active && "nav-link-active",
          active && (activeClassName ?? "text-accent")
        );
      }}
    >
      {label}
    </NavLink>
  );
}