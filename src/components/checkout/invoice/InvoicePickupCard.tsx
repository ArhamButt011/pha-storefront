import { PICKUP_LOCATION } from "@/constants/checkout";

export function InvoicePickupCard({ customerName }: { customerName: string }) {
  return (
    <div className="rounded-2xl border border-border bg-bg-2 p-5 sm:col-span-2">
      <p className="text-xs font-bold uppercase tracking-wider text-accent">Collection</p>
      <div className="mt-2 text-sm leading-relaxed text-fg">
        <p className="font-semibold">{customerName}</p>
        <p className="text-fg-muted">{PICKUP_LOCATION.name}</p>
        <p className="text-fg-muted">{PICKUP_LOCATION.address}</p>
      </div>
    </div>
  );
}
