export interface InvoiceAddress {
  fullName: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
}

export function InvoiceAddressCard({ label, address }: { label: string; address: InvoiceAddress }) {
  return (
    <div className="rounded-2xl border border-border bg-bg-2 p-5">
      <p className="text-xs font-bold uppercase tracking-wider text-accent">{label}</p>
      <div className="mt-2 text-sm leading-relaxed text-fg">
        <p className="font-semibold">{address.fullName}</p>
        <p className="text-fg-muted">{address.address}</p>
        <p className="text-fg-muted">
          {address.suburb}, {address.state} {address.postcode}
        </p>
        <p className="text-fg-muted">{address.country}</p>
      </div>
    </div>
  );
}
