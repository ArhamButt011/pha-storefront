import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, AlertTriangle } from "lucide-react";
import { InvoiceHeader } from "@/components/checkout/invoice/InvoiceHeader";
import { InvoiceTitleBlock } from "@/components/checkout/invoice/InvoiceTitleBlock";
import { InvoiceAddressCard, type InvoiceAddress } from "@/components/checkout/invoice/InvoiceAddressCard";
import { InvoiceItemsTable, type InvoiceItem } from "@/components/checkout/invoice/InvoiceItemsTable";
import { InvoicePaymentAndTotals } from "@/components/checkout/invoice/InvoicePaymentAndTotals";
import { getOrder, type ApiOrder } from "@/lib/api/orders";

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function toInvoiceAddress(order: ApiOrder, fullName: string): InvoiceAddress {
  const addr = order.billing_address ?? order.shipping_address;
  return {
    fullName,
    address: addr.address,
    suburb: addr.suburb,
    state: addr.state,
    postcode: addr.postcode,
    country: "Australia",
  };
}

export function Invoice() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const token = searchParams.get("token");

  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId || !token) {
      setError("Missing order reference — this link looks incomplete.");
      setLoading(false);
      return;
    }

    let cancelled = false;
    getOrder(orderId, token)
      .then((res) => {
        if (!cancelled) setOrder(res.data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load this invoice.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [orderId, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg">
        <InvoiceHeader />
        <main className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 py-24 text-center sm:px-6">
          <Loader2 className="h-6 w-6 animate-spin text-accent" />
          <p className="text-sm text-fg-muted">Loading invoice…</p>
        </main>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-bg">
        <InvoiceHeader />
        <main className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 py-24 text-center sm:px-6">
          <AlertTriangle className="h-6 w-6 text-danger" />
          <p className="text-sm text-fg-muted">{error ?? "Invoice not found."}</p>
        </main>
      </div>
    );
  }

  const items: InvoiceItem[] = order.items.map((item) => ({
    sku: item.sku,
    name: item.name,
    quantity: item.quantity,
    unitPrice: item.unit_price / 100,
  }));

  const isPaid = order.status !== "pending_payment" && order.status !== "cancelled";
  const paymentMethod = {
    brand: order.payment?.card_brand ? capitalize(order.payment.card_brand) : "Card",
    last4: order.payment?.card_last4 ?? "----",
  };

  return (
    <div className="min-h-screen bg-bg">
      <InvoiceHeader />

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
        <InvoiceTitleBlock
          invoiceNumber={order.order_number}
          orderReference={order.order_number}
          date={order.created_at}
          isPaid={isPaid}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <InvoiceAddressCard label="Bill To" address={toInvoiceAddress(order, order.customer.name)} />
          <InvoiceAddressCard
            label="Ship To"
            address={{
              fullName: order.customer.name,
              address: order.shipping_address.address,
              suburb: order.shipping_address.suburb,
              state: order.shipping_address.state,
              postcode: order.shipping_address.postcode,
              country: "Australia",
            }}
          />
        </div>

        <InvoiceItemsTable items={items} />

        <InvoicePaymentAndTotals
          paymentMethod={paymentMethod}
          subtotal={order.subtotal / 100}
          shipping={order.shipping_cost / 100}
          total={order.total / 100}
        />
      </main>
    </div>
  );
}
