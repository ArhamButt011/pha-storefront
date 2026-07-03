import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LOYALTY_PROGRAM } from "@/constants/checkout";

export function LoyaltyProgramBanner({ pointsEarned }: { pointsEarned: number }) {
  const description = LOYALTY_PROGRAM.description.replace("{points}", pointsEarned.toLocaleString());

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-accent/25 bg-accent/10 px-5 py-4">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-fg">
          <Star className="h-4 w-4 fill-current" />
        </span>
        <div>
          <p className="font-bold text-accent">{LOYALTY_PROGRAM.title}</p>
          <p className="text-xs text-fg-muted">{description}</p>
        </div>
      </div>
      <Button size="sm" className="shrink-0">{LOYALTY_PROGRAM.actionLabel}</Button>
    </div>
  );
}
