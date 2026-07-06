import { ShieldCheck } from "lucide-react";

export function PrecisionGuaranteedCard({ img }: { img: string }) {
  return (
    <div className="rounded-2xl border border-border bg-bg-2 p-6 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-accent/30 text-accent">
        <ShieldCheck className="h-6 w-6" />
      </span>
      <h3 className="mt-4 font-bold text-fg">Precision Guaranteed</h3>
      <p className="mx-auto mt-1.5 max-w-xs text-sm text-fg-muted">
        Every component is checked against OEM specifications before leaving our warehouse.
      </p>
      <div className="mx-auto mt-5 h-40 w-40 overflow-hidden rounded-xl">
        <img src={img} alt="Precision-checked component" className="h-full w-full object-cover" loading="lazy" />
      </div>
    </div>
  );
}
