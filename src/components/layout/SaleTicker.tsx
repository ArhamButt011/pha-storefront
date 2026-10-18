import { Zap } from "lucide-react";
import { CountdownTiles } from "@/components/common/CountdownTiles";
import { saleTickerText } from "@/utils/flashSale";
import { TICKER_DURATION_SECONDS, TICKER_THEME_CLASS } from "@/constants/storefront";
import type { FlashSale } from "@/types/storefront";
import { cn } from "@/utils/cn";

// animate-marquee shifts by -50%, so the repeat count must stay even.
const REPEATS = 6;

export function SaleTicker({ sale, className }: { sale: FlashSale; className?: string }) {
  const text = saleTickerText(sale);

  return (
    <div
      className={cn("relative z-10 flex items-stretch overflow-hidden shadow-glow", TICKER_THEME_CLASS[sale.ticker_theme], className)}
      style={sale.ticker_theme === "custom" ? { backgroundColor: sale.ticker_bg_color, color: sale.ticker_text_color } : undefined}
    >
      <div className="z-10 flex shrink-0 items-center gap-3 bg-scrim/40 px-4 py-2 backdrop-blur-sm sm:px-6">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-on-media opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-on-media" />
        </span>
        <span className="hidden font-display text-xs font-black uppercase tracking-widest text-on-media sm:block">Flash sale</span>
        {sale.show_countdown && <CountdownTiles endsAt={sale.ends_at} size="sm" />}
      </div>
      <div className="min-w-0 flex-1 overflow-hidden">
        <div
          className="flex w-max animate-marquee items-center gap-10 py-3 text-sm font-black uppercase tracking-wider"
          style={{ animationDuration: `${TICKER_DURATION_SECONDS[sale.ticker_speed]}s` }}
        >
          {Array.from({ length: REPEATS }, (_, i) => (
            <span key={i} className="flex items-center gap-10 whitespace-nowrap">
              {text}
              <Zap className="h-4 w-4 fill-current" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
