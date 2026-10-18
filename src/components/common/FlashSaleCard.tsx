import { Check, Copy, Sparkles, Zap } from "lucide-react";
import { CountdownTiles } from "@/components/common/CountdownTiles";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { saleAudienceLabel, saleHeadline } from "@/utils/flashSale";
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
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-5 text-on-media",
        variant === "glass"
          ? "border border-on-media/15 bg-scrim/45 backdrop-blur-md"
          : "bg-gradient-to-br from-danger via-danger to-accent shadow-glow",
        className,
      )}
    >
      <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-sheen bg-gradient-to-r from-transparent via-on-media/15 to-transparent" />
      <div className="relative flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-on-media/20">
          <Zap className="h-4 w-4 fill-current" />
        </span>
        <span className="font-display text-xs font-bold uppercase tracking-widest text-on-media/85">{sale.name || "Flash sale"}</span>
      </div>
      <p className="relative mt-3 font-display text-3xl font-black leading-none">{saleHeadline(sale)}</p>
      {note && <p className="relative mt-2 text-sm font-semibold text-on-media/90">{note}</p>}
      {sale.show_countdown && sale.ends_at && (
        <div className="relative mt-4">
          <p className="mb-1.5 text-xs font-bold uppercase tracking-widest text-on-media/70">Ends in</p>
          <CountdownTiles endsAt={sale.ends_at} />
        </div>
      )}
      {code ? (
        <Button
          type="button"
          variant="ghost"
          onClick={() => copy(code)}
          className="mt-4 h-auto w-full justify-between gap-3 rounded-xl border border-dashed border-on-media/50 bg-on-media/10 px-4 py-2.5 text-left text-on-media hover:bg-on-media/20"
        >
          <span>
            <span className="block text-xs font-bold uppercase tracking-widest text-on-media/70">Use code</span>
            <span className="font-mono text-lg font-black tracking-wider">{code}</span>
          </span>
          <span className="flex items-center gap-1.5 text-xs font-bold uppercase">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </span>
        </Button>
      ) : (
        <p className="relative mt-4 flex items-center gap-2 rounded-xl bg-on-media/10 px-4 py-3 text-sm font-bold">
          <Sparkles className="h-4 w-4" />
          {saleAudienceLabel(sale) ?? "No code needed"}: applied at checkout
        </p>
      )}
    </div>
  );
}
