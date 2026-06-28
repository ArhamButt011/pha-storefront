import { Phone, MapPin, Mail, Zap, Share2, Link2, Globe, ArrowRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const SHOP_LINKS = ["All Products", "Engine & Drivetrain", "Brakes & Suspension", "Electrical & Ignition", "Tools & Equipment"];
const SUPPORT_LINKS = ["Track Order", "Returns Policy", "Shipping Info", "Warranty Claims", "Contact Us"];
const COMPANY_LINKS = ["About Us", "Trade Accounts", "Careers", "Privacy Policy", "Terms of Service"];

interface Props {
  onInquiry: () => void;
}

export function Footer({ onInquiry }: Props) {
  return (
    <footer id="contact" className="border-t border-border bg-bg pt-20 pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Top CTA bar */}
        <div className="mb-16 flex flex-col items-center justify-between gap-8 rounded-2xl border border-accent/20 bg-accent/5 px-8 py-10 sm:flex-row">
          <div>
            <h3 className="font-display text-2xl font-bold text-fg">
              Have a question or need a part?
            </h3>
            <p className="mt-2 text-fg-muted">
              Our team is ready to help — response within 1 business day.
            </p>
          </div>
          <Button size="lg" className="shrink-0 gap-2" onClick={onInquiry}>
            <MessageSquare className="h-5 w-5" />
            Send an Inquiry
          </Button>
        </div>

        {/* Main footer grid */}
        <div className="grid gap-12 border-b border-border pb-16 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <img src="/branding/logo.svg" alt="Parts Hub Australia" className="h-20 w-20 rounded-xl object-contain" />
              <div>
                <span className="font-display text-base font-bold tracking-wider text-fg">
                  PARTS HUB <span className="text-accent">AUSTRALIA</span>
                </span>
              </div>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-fg-muted">
              Australia's trusted destination for premium automotive parts.
              Genuine parts, fast delivery, expert support nationwide.
            </p>

            {/* Contact info */}
            <div className="space-y-3">
              <a href="tel:0393575313" className="flex items-center gap-3 text-sm text-fg-muted transition-colors hover:text-accent">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                  <Phone className="h-3.5 w-3.5 text-accent" />
                </div>
                (03) 9357 5313
              </a>
              <a
                href="https://maps.google.com/?q=34+Killara+Rd+Campbellfield+VIC+3061"
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 text-sm text-fg-muted transition-colors hover:text-accent"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                  <MapPin className="h-3.5 w-3.5 text-accent" />
                </div>
                34 Killara Rd, Campbellfield VIC 3061
              </a>
              <a href="mailto:sales@partshubaustralia.com.au" className="flex items-center gap-3 text-sm text-fg-muted transition-colors hover:text-accent">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                  <Mail className="h-3.5 w-3.5 text-accent" />
                </div>
                sales@partshubaustralia.com.au
              </a>
            </div>

            {/* Socials */}
            <div className="mt-6 flex gap-3">
              {[Globe, Share2, Link2].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-fg-muted transition-all hover:border-accent/50 hover:bg-accent/10 hover:text-accent"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="mb-5 font-display text-xs font-bold uppercase tracking-wider text-fg">Shop</h4>
            <ul className="space-y-3">
              {SHOP_LINKS.map((l) => (
                <li key={l}>
                  <a href="#" className="group flex items-center gap-1.5 text-sm text-fg-muted transition-colors hover:text-accent">
                    <ArrowRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100" />
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-5 font-display text-xs font-bold uppercase tracking-wider text-fg">Support</h4>
            <ul className="space-y-3">
              {SUPPORT_LINKS.map((l) => (
                <li key={l}>
                  <a href="#" className="group flex items-center gap-1.5 text-sm text-fg-muted transition-colors hover:text-accent">
                    <ArrowRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100" />
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-5 font-display text-xs font-bold uppercase tracking-wider text-fg">Company</h4>
            <ul className="space-y-3">
              {COMPANY_LINKS.map((l) => (
                <li key={l}>
                  <a href="#" className="group flex items-center gap-1.5 text-sm text-fg-muted transition-colors hover:text-accent">
                    <ArrowRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100" />
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 pt-8 sm:flex-row">
          <div className="flex items-center gap-2 text-xs text-fg-muted">
            <Zap className="h-3.5 w-3.5 text-accent" />
            <span>
              © {new Date().getFullYear()} Parts Hub Australia Pty Ltd. All rights reserved.
            </span>
          </div>
          <div className="flex gap-5 text-xs text-fg-muted">
            <a href="#" className="transition-colors hover:text-accent">Privacy Policy</a>
            <a href="#" className="transition-colors hover:text-accent">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
