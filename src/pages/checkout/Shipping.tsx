import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckoutHeader } from "@/components/checkout/CheckoutHeader";
import { CheckoutStepper } from "@/components/checkout/CheckoutStepper";
import { FitmentGuaranteeBanner } from "@/components/checkout/FitmentGuaranteeBanner";
import { ShippingForm, type ShippingDetails } from "@/components/checkout/ShippingForm";
import { CheckoutOrderSummary } from "@/components/checkout/CheckoutOrderSummary";
import { useCart } from "@/hooks/useCart";
import { useVehicle } from "@/context/VehicleContext";

const INITIAL_SHIPPING: ShippingDetails = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  suburb: "",
  state: "VIC",
  postcode: "",
  billingSameAsShipping: true,
};

export function CheckoutShipping() {
  const { items, totalPrice } = useCart();
  const { vehicle } = useVehicle();
  const navigate = useNavigate();
  const [shipping, setShipping] = useState<ShippingDetails>(INITIAL_SHIPPING);

  useEffect(() => {
    if (items.length === 0) navigate("/cart", { replace: true });
  }, [items.length, navigate]);

  if (items.length === 0) return null;

  const vehicleLabel = vehicle?.make
    ? [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(" ")
    : undefined;

  function updateShipping(patch: Partial<ShippingDetails>) {
    setShipping((prev) => ({ ...prev, ...patch }));
  }

  return (
    <div className="min-h-screen bg-bg">
      <CheckoutHeader />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <CheckoutStepper currentStep={1} />

        {vehicleLabel && (
          <div className="mt-8">
            <FitmentGuaranteeBanner vehicleLabel={vehicleLabel} />
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <ShippingForm values={shipping} onChange={updateShipping} />
          <div className="min-w-0 lg:sticky lg:top-8 lg:self-start">
            <CheckoutOrderSummary items={items} subtotal={totalPrice} vehicleMake={vehicle?.make} />
          </div>
        </div>
      </main>
    </div>
  );
}
