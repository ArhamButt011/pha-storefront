import { formatCurrency } from "@/utils/currency";

export interface InvoiceItem {
  sku: string | null;
  name: string;
  quantity: number;
  unitPrice: number; // dollars
}

export function InvoiceItemsTable({ items }: { items: InvoiceItem[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-bg-2">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-bg-3 text-xs uppercase tracking-wider text-fg-muted">
            <th className="px-5 py-3 font-semibold">SKU</th>
            <th className="px-5 py-3 font-semibold">Description</th>
            <th className="px-5 py-3 text-right font-semibold">Qty</th>
            <th className="px-5 py-3 text-right font-semibold">Unit Price</th>
            <th className="px-5 py-3 text-right font-semibold">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={item.sku ?? i} className="border-b border-border last:border-0">
              <td className="px-5 py-4 font-semibold text-accent">{item.sku ?? "—"}</td>
              <td className="px-5 py-4">
                <p className="font-semibold text-fg">{item.name}</p>
              </td>
              <td className="px-5 py-4 text-right text-fg-muted">{item.quantity}</td>
              <td className="px-5 py-4 text-right text-fg-muted">{formatCurrency(item.unitPrice)}</td>
              <td className="px-5 py-4 text-right font-bold text-fg">{formatCurrency(item.unitPrice * item.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
