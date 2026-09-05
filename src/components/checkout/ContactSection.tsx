import { User, Mail, Phone } from "lucide-react";
import { IconInput } from "@/components/ui/icon-input";

interface ContactSectionProps {
  fullName: string;
  email: string;
  phone: string;
  onChange: (patch: { fullName?: string; email?: string; phone?: string }) => void;
}

export function ContactSection({ fullName, email, phone, onChange }: ContactSectionProps) {
  return (
    <div className="rounded-2xl border border-border bg-bg-2 p-6">
      <div className="mb-6 flex items-center gap-2">
        <User className="h-5 w-5 text-accent" />
        <h2 className="text-lg font-bold text-fg">Contact Details</h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Full Name</label>
          <IconInput
            icon={User}
            placeholder="John Doe"
            value={fullName}
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
              value={email}
              onChange={(e) => onChange({ email: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Phone Number</label>
            <IconInput
              icon={Phone}
              type="tel"
              placeholder="+61 400 000 000"
              value={phone}
              onChange={(e) => onChange({ phone: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
