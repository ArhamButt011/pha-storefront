import { ShieldCheck, Truck } from "lucide-react";

export function WhyChooseBundles() {
  return (
    <section className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
      <div className="relative min-h-64 flex-1 overflow-hidden rounded-2xl">
        <img
          src="https://images.unsplash.com/photo-1777903586357-23398a0b0a87?w=900&h=1000&fit=crop"
          alt="Engine bay"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6">
          <h3 className="font-display text-xl font-bold text-white">Why Choose Bundles?</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/70">
            Our kits are curated by mechanics and engineers to ensure every essential fix and
            upgrade is accounted for. No more mid-job hardware store runs. Just pure performance
            out of the box.
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <div className="flex items-start gap-4 rounded-2xl border border-border bg-bg-2 p-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-accent">Guaranteed Fitment</h4>
            <p className="mt-1.5 text-sm text-fg-muted">
              Enter your VIN and we guarantee the bundle will fit your vehicle or we'll swap it for free.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border bg-bg-2 p-5">
            <div className="font-display text-2xl font-black text-accent">15%</div>
            <p className="mt-1 text-xs text-fg-muted">Average Bundle Savings compared to individual parts.</p>
          </div>
          <div className="rounded-2xl border border-border bg-bg-2 p-5">
            <Truck className="h-5 w-5 text-accent" />
            <p className="mt-2 text-xs text-fg-muted">Free Express Shipping on all bundles over $500.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
