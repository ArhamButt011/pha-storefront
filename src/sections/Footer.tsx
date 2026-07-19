import { useState } from "react";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { subscribeNewsletter } from "@/lib/api/newsletter";

const CUSTOMER_SERVICE_LINKS = ["Returns Policy", "Shipping Info"];

export function Footer() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setSubmitting(true);
    try {
      const res = await subscribeNewsletter({ email: email.trim() });
      toast.success(res.message || "Subscribed successfully.");
      setEmail("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Couldn't subscribe. Please try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <footer id="contact" className="border-t border-border bg-bg pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 border-b border-border pb-12 lg:grid-cols-[1.6fr_1fr_1.2fr]">
          {/* Brand column */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <img src="/branding/logo.svg" alt="Parts Hub Australia" className="h-12 w-12 rounded-lg object-contain" />
              <span className="font-display text-base font-bold tracking-wider text-accent">
                PARTS HUB
              </span>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-fg-muted">
              Australia's leading independent supplier of high-performance and genuine
              automotive components. Engineered for the enthusiast.
            </p>

            <div className="flex gap-3">
              <a href="tel:0393575313" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-fg-muted transition-all hover:border-accent/50 hover:bg-accent/10 hover:text-accent">
                <Phone className="h-4 w-4" />
              </a>
              <a href="mailto:sales@partshubaustralia.com.au" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-fg-muted transition-all hover:border-accent/50 hover:bg-accent/10 hover:text-accent">
                <Mail className="h-4 w-4" />
              </a>
              <a
                href="https://maps.google.com/?q=34+Killara+Rd+Campbellfield+VIC+3061"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-fg-muted transition-all hover:border-accent/50 hover:bg-accent/10 hover:text-accent">
                <MapPin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="mb-5 font-display text-xs font-bold uppercase tracking-wider text-fg">Customer Service</h4>
            <ul className="space-y-3">
              {CUSTOMER_SERVICE_LINKS.map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-fg-muted transition-colors hover:text-accent">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-2 font-display text-sm font-bold text-fg">Subscribe to our newsletter</h4>
            <p className="mb-4 text-sm leading-relaxed text-fg-muted">
              Get occasional product updates to your inbox.
            </p>

          
            <form onSubmit={handleSubscribe} className="flex overflow-hidden rounded-md border border-border">
              <Input
                type="email"
                placeholder="Your Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={submitting}
                className="rounded-none border-0 focus-visible:ring-0 bg-transparent"
              />
<Button
  type="submit"
  className="rounded-r-sm rounded-l-none w-20 transition-none hover:scale-100 hover:translate-y-0"
  aria-label="Subscribe"
>
  <ArrowRight className="h-4 w-4" />
</Button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 pt-6 sm:flex-row">
          <p className="text-xs text-fg-muted">
            © {new Date().getFullYear()} Parts Hub Australia. All rights reserved. Precision Engineered.
          </p>
        </div>
      </div>
    </footer>
  );
}