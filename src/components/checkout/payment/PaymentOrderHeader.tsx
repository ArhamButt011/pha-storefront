import { PICKUP_LOCATION } from "@/constants/checkout";
import type { DeliveryMethod } from "@/types/checkout";
import type { OrderAddressPayload } from "@/lib/api/orders";

interface PaymentOrderHeaderProps {
  customerName: string;
  orderNumber: string;
  deliveryMethod: DeliveryMethod;
  shippingAddress: OrderAddressPayload | null;
}

// Centered identity block shown above the Stripe payment form — lets someone
// arriving cold from an admin-generated payment link (no prior session,
// nothing in Redux) immediately confirm "yes, this is my order" before
// entering card details.
export function PaymentOrderHeader({
  customerName,
  orderNumber,
  deliveryMethod,
  shippingAddress,
}: PaymentOrderHeaderProps) {
  const locationLine =
    deliveryMethod === "pickup"
      ? `${PICKUP_LOCATION.name} — ${PICKUP_LOCATION.address}`
      : shippingAddress
        ? `${shippingAddress.address}, ${shippingAddress.suburb} ${shippingAddress.state} ${shippingAddress.postcode}`
        : null;

  return (
    <div className="mb-8 text-center">
      <h1 className="font-display text-2xl font-black tracking-wide text-fg sm:text-3xl">{customerName}</h1>
      <p className="mt-2 text-sm font-semibold text-fg-muted">Order #{orderNumber}</p>
      {locationLine && <p className="mt-1 text-sm text-fg-muted">{locationLine}</p>}
    </div>
  );
}
