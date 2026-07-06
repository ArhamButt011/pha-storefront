import { useState } from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CUSTOMER_SERVICE_LINKS = ["Returns Policy", "Shipping Info", "Track Order", "Warranty"];
const LEGAL_LINKS = ["Privacy Policy", "Terms of Service", "Cookie Policy", "Compliance"];

export function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer id="contact" className="border-t border-border bg-bg pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 border-b border-border pb-12 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
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
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-fg-muted transition-all hover:border-accent/50 hover:bg-accent/10 hover:text-accent"
              >
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

          {/* Legal & Privacy */}
          <div>
            <h4 className="mb-5 font-display text-xs font-bold uppercase tracking-wider text-fg">Legal &amp; Privacy</h4>
            <ul className="space-y-3">
              {LEGAL_LINKS.map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-fg-muted transition-colors hover:text-accent">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-5 font-display text-xs font-bold uppercase tracking-wider text-fg">Newsletter</h4>
            <p className="mb-4 text-sm leading-relaxed text-fg-muted">
              Stay updated on new arrivals and exclusive performance deals.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex gap-2"
            >
              <Input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-full"
              />
              <Button type="submit" size="icon" aria-label="Subscribe">
                <Send className="h-4 w-4" />
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
