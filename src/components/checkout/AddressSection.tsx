import { Home, Building2, CreditCard, Store } from "lucide-react";
import { IconInput } from "@/components/ui/icon-input";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AU_STATES, PICKUP_LOCATION } from "@/constants/checkout";
import type { AddressFields, DeliveryMethod } from "@/types/checkout";

function AddressFieldGroup({
  values,
  onChange,
}: {
  values: AddressFields;
  onChange: (patch: Partial<AddressFields>) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Street Address</label>
        <IconInput
          icon={Home}
          placeholder="123 Performance Way"
          value={values.address}
          onChange={(e) => onChange({ address: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_120px_120px]">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Suburb</label>
          <IconInput
            icon={Building2}
            placeholder="Melbourne"
            value={values.suburb}
            onChange={(e) => onChange({ suburb: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">State</label>
          <Select
            value={values.state}
            onValueChange={(v) => onChange({ state: v })}
            options={AU_STATES.map((s) => ({ value: s, label: s }))}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Postcode</label>
          <Input placeholder="3000" value={values.postcode} onChange={(e) => onChange({ postcode: e.target.value })} />
        </div>
      </div>
    </div>
  );
}

interface AddressSectionProps {
  deliveryMethod: DeliveryMethod;
  shippingAddress: AddressFields;
  onShippingChange: (patch: Partial<AddressFields>) => void;
  billingSameAsShipping: boolean;
  onBillingSameChange: (checked: boolean) => void;
  billingAddress: AddressFields;
  onBillingChange: (patch: Partial<AddressFields>) => void;
}

export function AddressSection({
  deliveryMethod,
  shippingAddress,
  onShippingChange,
  billingSameAsShipping,
  onBillingSameChange,
  billingAddress,
  onBillingChange,
}: AddressSectionProps) {
  if (deliveryMethod === "pickup") {
    return (
      <div className="rounded-2xl border border-border bg-bg-2 p-6">
        <div className="mb-6 flex items-center gap-2">
          <Store className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-bold text-fg">Pickup Location</h2>
        </div>
        <div className="rounded-xl border border-border bg-bg-3 p-4 text-sm text-fg-muted">
          <p className="font-semibold text-fg">{PICKUP_LOCATION.name}</p>
          <p className="mt-1">{PICKUP_LOCATION.address}</p>
          <p className="mt-3">{PICKUP_LOCATION.note}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl border border-border bg-bg-2 p-6">
        <div className="mb-6 flex items-center gap-2">
          <Home className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-bold text-fg">Shipping Address</h2>
        </div>
        <AddressFieldGroup values={shippingAddress} onChange={onShippingChange} />
      </div>

      <div className="rounded-2xl border border-border bg-bg-2 p-6">
        <div className="mb-6 flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-bold text-fg">Billing Address</h2>
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-fg-muted">
          <Checkbox checked={billingSameAsShipping} onChange={(e) => onBillingSameChange(e.target.checked)} />
          Use same address for billing
        </label>

        {!billingSameAsShipping && (
          <div className="mt-4">
            <AddressFieldGroup values={billingAddress} onChange={onBillingChange} />
          </div>
        )}
      </div>
    </>
  );
}
