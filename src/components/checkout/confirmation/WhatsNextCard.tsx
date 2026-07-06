import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import type { WhatsNextItem } from "@/constants/checkout";

interface WhatsNextCardProps {
  item: WhatsNextItem;
  icon: LucideIcon;
}

export function WhatsNextCard({ item, icon: Icon }: WhatsNextCardProps) {
  return (
    <div className="rounded-xl border border-border bg-bg-2 p-5">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15 text-accent">
        <Icon className="h-4 w-4" />
      </span>
      <h3 className="mt-3 font-bold text-fg">{item.title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{item.description}</p>
      <button type="button" className="mt-3 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-accent transition-all hover:gap-1.5">
        {item.actionLabel} <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  );
}
