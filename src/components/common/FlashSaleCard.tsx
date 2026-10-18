import { Check, Copy, Sparkles, Zap } from "lucide-react";
import { CountdownTiles } from "@/components/common/CountdownTiles";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { promoThemeStyle, saleAudienceLabel, saleHeadline } from "@/utils/flashSale";
import type { FlashSale } from "@/types/storefront";
import { cn } from "@/utils/cn";

interface FlashSaleCardProps {
  sale: FlashSale;
  // "glass" floats over imagery (hero), "solid" sits on the page (PDP).
  variant?: "glass" | "solid";
  // Extra line under the headline, e.g. the savings on this product.
  note?: string;
  className?: string;
}

export function FlashSaleCard({ sale, variant = "solid", note, className }: FlashSaleCardProps) {
  const { copied, copy } = useCopyToClipboard();
  const { code } = sale;
  const theme = promoThemeStyle(sale.card_theme, sale.card_bg_color, sale.card_text_color);
  // Glass sits on hero photos, so it stays light text on a dark scrim.
  const glass = variant === "glass";
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-5",
        glass ? "border border-on-media/15 bg-scrim/45 text-on-media backdrop-blur-md" : cn(theme.className, "shadow-glow"),
        className,
      )}
      style={glass ? undefined : theme.style}
    >
      <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-sheen bg-gradient-to-r from-transparent via-current/15 to-transparent" />
      <div className="relative flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-current/20">
          <Zap className="h-4 w-4 fill-current" />
        </span>
        <span className="font-display text-xs font-bold uppercase tracking-widest opacity-85">{sale.name || "Flash sale"}</span>
      </div>
      <p className="relative mt-3 font-display text-3xl font-black leading-none">{saleHeadline(sale)}</p>
      {note && <p className="relative mt-2 text-sm font-semibold opacity-90">{note}</p>}
      {sale.show_countdown && sale.ends_at && (
        <div className="relative mt-4">
          <p className="mb-1.5 text-xs font-bold uppercase tracking-widest opacity-70">Ends in</p>
          <CountdownTiles endsAt={sale.ends_at} />
        </div>
      )}
      {code ? (
        <Button
          type="button"
          variant="ghost"
          onClick={() => copy(code)}
          className="mt-4 h-auto w-full justify-between gap-3 rounded-xl border border-dashed border-current/50 bg-current/10 px-4 py-2.5 text-left text-current hover:bg-current/20"
        >
          <span>
            <span className="block text-xs font-bold uppercase tracking-widest opacity-70">Use code</span>
            <span className="font-mono text-lg font-black tracking-wider">{code}</span>
          </span>
          <span className="flex items-center gap-1.5 text-xs font-bold uppercase">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </span>
        </Button>
      ) : (
        <p className="relative mt-4 flex items-center gap-2 rounded-xl bg-current/10 px-4 py-3 text-sm font-bold">
          <Sparkles className="h-4 w-4" />
          {saleAudienceLabel(sale) ?? "No code needed"}: applied at checkout
        </p>
      )}
    </div>
  );
}
