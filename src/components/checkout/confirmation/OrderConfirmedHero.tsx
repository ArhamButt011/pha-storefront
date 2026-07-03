import { ShieldCheck, Copy, Check } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

export function OrderConfirmedHero({ orderReference }: { orderReference: string }) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <div>
      <div className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent">
        <ShieldCheck className="h-3.5 w-3.5" />
        Transaction Secure
      </div>

      <h1 className="font-display text-3xl font-black tracking-wide text-fg sm:text-4xl">Order Confirmed</h1>
      <p className="mt-3 max-w-md text-fg-muted">
        Your high-performance components have been secured. We're preparing your shipment at our Melbourne facility.
      </p>

      <div className="mt-5 inline-flex items-center gap-3 rounded-xl border border-border bg-bg-2 px-4 py-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-fg-muted">Order Reference</p>
          <p className="font-bold text-fg">#{orderReference}</p>
        </div>
        <button
          type="button"
          onClick={() => copy(orderReference)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-bg-3 hover:text-fg"
          aria-label="Copy order reference"
        >
          {copied ? <Check className="h-4 w-4 text-ok" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
