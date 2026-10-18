import { ArrowRight, X } from "lucide-react";
import { SmartLink } from "@/components/common/SmartLink";
import { Button } from "@/components/ui/button";
import { ANNOUNCEMENT_ICONS, ANNOUNCEMENT_THEME_CLASS } from "@/constants/storefront";
import type { Announcement } from "@/types/storefront";
import { cn } from "@/utils/cn";

interface AnnouncementBarProps {
  announcement: Announcement;
  onDismiss: () => void;
}

// Fixed h-9 so Layout offsets the navbar and page by the same amount.
export function AnnouncementBar({ announcement, onDismiss }: AnnouncementBarProps) {
  const { message, link_url, link_label, theme, bg_color, text_color, icon, dismissible } = announcement;
  const Icon = icon === "none" ? null : ANNOUNCEMENT_ICONS[icon];
  const custom = theme === "custom" ? { backgroundColor: bg_color, color: text_color } : undefined;
  const className =
    "group flex h-full flex-1 items-center justify-center gap-2.5 overflow-hidden px-10 text-center text-xs font-semibold tracking-wide sm:text-sm";
  const content = (
    <>
      <span className="pointer-events-none absolute inset-y-0 left-0 w-1/4 animate-sheen bg-gradient-to-r from-transparent via-on-media/25 to-transparent" />
      {Icon && <Icon className="hidden h-3.5 w-3.5 shrink-0 sm:block" />}
      <span className="relative truncate">{message}</span>
      {link_url && (
        <span className="relative hidden shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ring-1 ring-current/40 ring-inset transition group-hover:ring-current sm:inline-flex">
          {link_label || "Shop now"}
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </span>
      )}
    </>
  );

  return (
    <div className={cn("fixed inset-x-0 top-0 z-60 flex h-9", ANNOUNCEMENT_THEME_CLASS[theme])} style={custom}>
      {link_url ? (
        <SmartLink to={link_url} className={className}>
          {content}
        </SmartLink>
      ) : (
        <div className={className}>{content}</div>
      )}
      {dismissible && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          aria-label="Close announcement"
          className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 text-current opacity-70 hover:bg-transparent hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
