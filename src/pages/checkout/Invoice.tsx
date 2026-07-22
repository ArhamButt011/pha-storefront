import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Loader2, AlertTriangle, Printer, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InvoiceTitleBlock } from "@/components/checkout/invoice/InvoiceTitleBlock";
import { InvoiceAddressCard, type InvoiceAddress } from "@/components/checkout/invoice/InvoiceAddressCard";
import { InvoicePickupCard } from "@/components/checkout/invoice/InvoicePickupCard";
import { InvoiceItemsTable, type InvoiceItem } from "@/components/checkout/invoice/InvoiceItemsTable";
import { InvoicePaymentAndTotals } from "@/components/checkout/invoice/InvoicePaymentAndTotals";
import { getOrder, type ApiOrder, type OrderAddressPayload } from "@/lib/api/orders";

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function toInvoiceAddress(fullName: string, addr: OrderAddressPayload): InvoiceAddress {
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
        <main className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 pb-24 pt-20 text-center sm:px-6 lg:pt-28">
          <Loader2 className="h-6 w-6 animate-spin text-accent" />
          <p className="text-sm text-fg-muted">Loading invoice…</p>
        </main>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-bg">
        <main className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 pb-24 pt-20 text-center sm:px-6 lg:pt-28">
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
      <main className="mx-auto max-w-5xl space-y-6 px-4 pb-10 pt-20 sm:px-6 lg:px-8 lg:pt-28">
        <div className="flex items-center justify-between gap-3 print:hidden">
          <Link
            to={`/checkout/confirmation?order_id=${orderId}&token=${token}`}
            className="flex items-center gap-1.5 text-sm font-medium text-fg-muted transition-colors hover:text-fg"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Confirmation
          </Link>
          <Button size="sm" variant="secondary" className="gap-2" onClick={() => window.print()}>
            <Printer className="h-4 w-4" />
            Print Invoice
          </Button>
        </div>

        <InvoiceTitleBlock
          invoiceNumber={order.order_number}
          orderReference={order.order_number}
          date={order.created_at}
          isPaid={isPaid}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          {order.shipping_address ? (
            <>
              <InvoiceAddressCard
                label="Bill To"
                address={toInvoiceAddress(order.customer.name, order.billing_address ?? order.shipping_address)}
              />
              <InvoiceAddressCard label="Ship To" address={toInvoiceAddress(order.customer.name, order.shipping_address)} />
            </>
          ) : (
            <InvoicePickupCard customerName={order.customer.name} />
          )}
        </div>

        <InvoiceItemsTable items={items} />

        <InvoicePaymentAndTotals
          paymentMethod={paymentMethod}
          subtotal={order.subtotal / 100}
          shipping={order.shipping_cost / 100}
          total={order.total / 100}
          deliveryMethod={order.delivery_method}
        />
      </main>
    </div>
  );
}
