import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// import { CheckoutHeader } from "@/components/checkout/CheckoutHeader";
import { CheckoutStepper } from "@/components/checkout/CheckoutStepper";
import { FitmentGuaranteeBanner } from "@/components/checkout/FitmentGuaranteeBanner";
import { ShippingForm } from "@/components/checkout/ShippingForm";
import { CheckoutOrderSummary } from "@/components/checkout/CheckoutOrderSummary";
import { useCart } from "@/hooks/useCart";
import { useVehicle } from "@/context/VehicleContext";
import { createOrder } from "@/lib/api/orders";
import { setOrder } from "@/store/checkoutSlice";
import type { AppDispatch } from "@/store/store";
import type { AddressFields, ShippingDetails } from "@/types/checkout";

const EMPTY_ADDRESS: AddressFields = { address: "", suburb: "", state: "VIC", postcode: "" };

const INITIAL_SHIPPING: ShippingDetails = {
  fullName: "",
  email: "",
  phone: "",
  deliveryMethod: "delivery",
  shippingAddress: { ...EMPTY_ADDRESS },
  billingSameAsShipping: true,
  billingAddress: { ...EMPTY_ADDRESS },
};

function isAddressComplete(a: AddressFields) {
  return Boolean(a.address.trim() && a.suburb.trim() && a.postcode.trim());
}

function isShippingComplete(s: ShippingDetails) {
  if (!(s.fullName.trim() && s.email.trim() && s.phone.trim())) return false;
  if (s.deliveryMethod === "pickup") return true;
  if (!isAddressComplete(s.shippingAddress)) return false;
  return s.billingSameAsShipping || isAddressComplete(s.billingAddress);
}

export function CheckoutShipping() {
  const { items, totalPrice } = useCart();
  const { vehicle } = useVehicle();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [shipping, setShipping] = useState<ShippingDetails>(INITIAL_SHIPPING);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) navigate("/cart", { replace: true });
  }, [items.length, navigate]);

  if (items.length === 0) return null;

const vehicleLabel = vehicle?.make
  ? [vehicle.make, vehicle.model, vehicle.model_code].filter(Boolean).join(" ")
  : undefined;

  function updateShipping(patch: Partial<ShippingDetails>) {
    setShipping((prev) => ({ ...prev, ...patch }));
  }

  async function handleContinue() {
    if (!isShippingComplete(shipping)) {
      setError("Please fill in all shipping details before continuing.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const isPickup = shipping.deliveryMethod === "pickup";

    try {
      // Prices/stock are re-derived server-side from product/variant ids —
      // only ids and quantities are sent, never the cart's own line prices.
      const res = await createOrder({
        items: items.map((item) => ({ product: item.id, quantity: item.quantity })),
        customer: {
          name: shipping.fullName,
          email: shipping.email,
          phone: shipping.phone,
        },
        delivery_method: shipping.deliveryMethod,
        // Backend rejects these fields outright for pickup — omit rather
        // than send null/empty.
        ...(isPickup
          ? {}
          : {
              shipping_address: shipping.shippingAddress,
              billing_address: shipping.billingSameAsShipping ? null : shipping.billingAddress,
            }),
      });

      const order = res.data;
      dispatch(
        setOrder({
          orderId: order._id,
          guestToken: order.guest_access_token,
          orderNumber: order.order_number,
        }),
      );

      const params = new URLSearchParams({ order_id: order._id, token: order.guest_access_token });
      navigate(`/checkout/payment?${params.toString()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not place your order. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* <CheckoutHeader /> */}

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <CheckoutStepper currentStep={1} />

        {vehicleLabel && (
          <div className="mt-8">
            <FitmentGuaranteeBanner vehicleLabel={vehicleLabel} />
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div>
            <ShippingForm values={shipping} onChange={updateShipping} />
            {error && (
              <p role="alert" className="mt-4 text-sm font-medium text-danger">
                {error}
              </p>
            )}
          </div>
          <div className="min-w-0 lg:sticky lg:top-8 lg:self-start">
            <CheckoutOrderSummary
              items={items}
              subtotal={totalPrice}
              vehicleMake={vehicle?.make}
              deliveryMethod={shipping.deliveryMethod}
              onContinue={handleContinue}
              submitting={submitting}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
