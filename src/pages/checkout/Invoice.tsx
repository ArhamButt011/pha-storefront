import { InvoiceHeader } from "@/components/checkout/invoice/InvoiceHeader";
import { InvoiceTitleBlock } from "@/components/checkout/invoice/InvoiceTitleBlock";
import { InvoiceAddressCard } from "@/components/checkout/invoice/InvoiceAddressCard";
import { InvoiceFitmentBadge } from "@/components/checkout/invoice/InvoiceFitmentBadge";
import { InvoiceItemsTable } from "@/components/checkout/invoice/InvoiceItemsTable";
import { InvoicePaymentAndTotals } from "@/components/checkout/invoice/InvoicePaymentAndTotals";
import { DUMMY_ORDER, getDummyOrderTotals } from "@/data/dummyOrder";

export function Invoice() {
  const totals = getDummyOrderTotals();

  return (
    <div className="min-h-screen bg-bg">
      <InvoiceHeader />

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
        <InvoiceTitleBlock
          invoiceNumber={DUMMY_ORDER.invoiceNumber}
          orderReference={DUMMY_ORDER.reference}
          date={DUMMY_ORDER.placedAt}
        />

        <div className="grid gap-6 sm:grid-cols-3">
          <InvoiceAddressCard label="Bill To" address={DUMMY_ORDER.billingAddress} />
          <InvoiceAddressCard label="Ship To" address={DUMMY_ORDER.shippingAddress} />
          <InvoiceFitmentBadge vehicleLabel={DUMMY_ORDER.vehicleLabel} />
        </div>

        <InvoiceItemsTable items={DUMMY_ORDER.items} />

        <InvoicePaymentAndTotals
          paymentMethod={DUMMY_ORDER.paymentMethod}
          subtotal={totals.subtotal}
          shipping={totals.shipping}
          gst={totals.gst}
          total={totals.total}
        />
      </main>
    </div>
  );
}
