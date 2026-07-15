import { COMPANY_INFO } from "@/constants/checkout";

interface InvoiceTitleBlockProps {
  invoiceNumber: string;
  orderReference: string;
  date: string;
  isPaid?: boolean;
}

export function InvoiceTitleBlock({ invoiceNumber, orderReference, date, isPaid = true }: InvoiceTitleBlockProps) {
  const formattedDate = new Date(date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

  return (
    <div className="flex flex-wrap items-start justify-between gap-6 rounded-2xl border border-border bg-bg-2 p-6">
      <div>
        <h1 className="font-display text-2xl font-black tracking-wide text-fg sm:text-3xl">Tax Invoice</h1>
        <p className="mt-1 text-sm text-fg-muted">
          {COMPANY_INFO.name} | ABN {COMPANY_INFO.abn}
        </p>
      </div>

      <div className="text-right">
        <span
          className={
            isPaid
              ? "inline-block rounded-full bg-ok/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ok"
              : "inline-block rounded-full bg-accent/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent"
          }
        >
          {isPaid ? "Payment Status: Paid & Secured" : "Payment Status: Pending"}
        </span>
        <dl className="mt-3 space-y-1 text-sm">
          <div className="flex items-center justify-end gap-2">
            <dt className="text-fg-muted">Invoice #</dt>
            <dd className="font-semibold text-fg">{invoiceNumber}</dd>
          </div>
          <div className="flex items-center justify-end gap-2">
            <dt className="text-fg-muted">Date</dt>
            <dd className="font-semibold text-fg">{formattedDate}</dd>
          </div>
          <div className="flex items-center justify-end gap-2">
            <dt className="text-fg-muted">Order Ref</dt>
            <dd className="font-semibold text-fg">#{orderReference}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
