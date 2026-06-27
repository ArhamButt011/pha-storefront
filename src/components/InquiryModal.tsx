import { useState } from "react";
import { Send, CheckCircle2, ChevronDown } from "lucide-react";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

const SUBJECTS = [
  "General Inquiry",
  "Parts Request",
  "Trade Account",
  "Warranty & Returns",
  "Bulk / Wholesale Order",
  "Other",
];

export function InquiryModal({ open, onOpenChange }: Props) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/inquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          subject: form.subject,
          message: form.message,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Something went wrong. Please try again.");
      }
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleClose(o: boolean) {
    if (!o) {
      setTimeout(() => {
        setSent(false);
        setError(null);
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      }, 300);
    }
    onOpenChange(o);
  }

  return (
    <Modal open={open} onOpenChange={handleClose}>
      <ModalContent className="max-w-md">
        {sent ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ok/15">
              <CheckCircle2 className="h-8 w-8 text-ok" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-fg">Inquiry Sent!</h3>
              <p className="mt-2 text-sm text-fg-muted">
                Thanks, we'll get back to you within 1 business day.
              </p>
            </div>
            <Button onClick={() => handleClose(false)} className="mt-2">
              Close
            </Button>
          </div>
        ) : (
          <>
            <ModalHeader>
              <ModalTitle>Send an Inquiry</ModalTitle>
              <ModalDescription>
                Fill in the form and our team will get back to you within 1 business day.
              </ModalDescription>
            </ModalHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">
                    Name <span className="text-accent">*</span>
                  </label>
                  <Input
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">
                    Phone
                  </label>
                  <Input
                    placeholder="(03) XXXX XXXX"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">
                  Email <span className="text-accent">*</span>
                </label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">
                  Subject <span className="text-accent">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    value={form.subject}
                    onChange={(e) => handleChange("subject", e.target.value)}
                    className="w-full appearance-none rounded-lg border border-border bg-bg-2 py-3 pl-4 pr-10 text-sm text-fg outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
                  >
                    <option value="" disabled>Select a subject…</option>
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">
                  Message <span className="text-accent">*</span>
                </label>
                <Textarea
                  placeholder="Tell us what you need…"
                  value={form.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  rows={4}
                  required
                />
              </div>

              {error && (
                <p className="text-sm text-danger">{error}</p>
              )}

              <Button type="submit" className="w-full gap-2" disabled={loading}>
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent-fg/30 border-t-accent-fg" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Inquiry
                  </>
                )}
              </Button>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
