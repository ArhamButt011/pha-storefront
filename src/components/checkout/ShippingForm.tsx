import { ContactSection } from "./ContactSection";
import { DeliveryMethodSection } from "./DeliveryMethodSection";
import { AddressSection } from "./AddressSection";
import type { ShippingDetails } from "@/types/checkout";

interface ShippingFormProps {
  values: ShippingDetails;
  onChange: (patch: Partial<ShippingDetails>) => void;
}

export function ShippingForm({ values, onChange }: ShippingFormProps) {
  return (
    <div className="space-y-6">
      <ContactSection fullName={values.fullName} email={values.email} phone={values.phone} onChange={onChange} />

      <DeliveryMethodSection value={values.deliveryMethod} onChange={(deliveryMethod) => onChange({ deliveryMethod })} />

      <AddressSection
        deliveryMethod={values.deliveryMethod}
        shippingAddress={values.shippingAddress}
        onShippingChange={(patch) => onChange({ shippingAddress: { ...values.shippingAddress, ...patch } })}
        billingSameAsShipping={values.billingSameAsShipping}
        onBillingSameChange={(billingSameAsShipping) => onChange({ billingSameAsShipping })}
        billingAddress={values.billingAddress}
        onBillingChange={(patch) => onChange({ billingAddress: { ...values.billingAddress, ...patch } })}
      />
    </div>
  );
}
