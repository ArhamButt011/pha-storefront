import { Package, User, Mail, Phone, Home, Building2 } from "lucide-react";
import { IconInput } from "@/components/ui/icon-input";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AU_STATES } from "@/constants/checkout";

export interface ShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  billingSameAsShipping: boolean;
}

interface ShippingFormProps {
  values: ShippingDetails;
  onChange: (patch: Partial<ShippingDetails>) => void;
}

export function ShippingForm({ values, onChange }: ShippingFormProps) {
  return (
    <div className="rounded-2xl border border-border bg-bg-2 p-6">
      <div className="mb-6 flex items-center gap-2">
        <Package className="h-5 w-5 text-accent" />
        <h2 className="text-lg font-bold text-fg">Shipping Details</h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Full Name</label>
          <IconInput
            icon={User}
            placeholder="John Doe"
            value={values.fullName}
            onChange={(e) => onChange({ fullName: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Email Address</label>
            <IconInput
              icon={Mail}
              type="email"
              placeholder="john@example.com"
              value={values.email}
              onChange={(e) => onChange({ email: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Phone Number</label>
            <IconInput
              icon={Phone}
              type="tel"
              placeholder="+61 400 000 000"
              value={values.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
            />
          </div>
        </div>

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
            <Select value={values.state} onChange={(e) => onChange({ state: e.target.value })}>
              {AU_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Postcode</label>
            <Input
              placeholder="3000"
              value={values.postcode}
              onChange={(e) => onChange({ postcode: e.target.value })}
            />
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-2 pt-2 text-sm text-fg-muted">
          <Checkbox
            checked={values.billingSameAsShipping}
            onChange={(e) => onChange({ billingSameAsShipping: e.target.checked })}
          />
          My billing address is the same as shipping
        </label>
      </div>
    </div>
  );
}
