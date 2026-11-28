import { useState, type FormEvent } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal, ModalContent, ModalDescription, ModalTitle } from "@/components/ui/modal";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { useSignupPopup } from "@/hooks/useSignupPopup";
import { subscribeNewsletter } from "@/lib/api/newsletter";
import type { SignupPopup as SignupPopupContent } from "@/types/storefront";
import { saleHeadline } from "@/utils/flashSale";
import { formatDate } from "@/utils/format";

interface SignupPopupProps {
  popup: SignupPopupContent;
}

interface SignupResult {
  email: string;
  code: string | null;
  expiresAt: string | null;
  alreadyUsed: boolean;
  expired: boolean;
}


function noCodeMessage(done: SignupResult) {
  if (done.alreadyUsed) return "You've already used your welcome offer with this email. Thanks for being with us!";
  if (done.expired) return "Your welcome code for this email has expired, but you're on the list for future deals.";
  return "Thanks for joining. Keep an eye on your inbox.";
}

/** Timed newsletter modal; reveals the discount code once they sign up. */
export function SignupPopup({ popup }: SignupPopupProps) {
  const { open, setOpen, markSeen } = useSignupPopup(popup);
  const { copied, copy } = useCopyToClipboard();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<SignupResult | null>(null);

  function handleOpenChange(next: boolean) {
    // Seen before closing, or the delay timer would reopen it straight away.
    if (!next) markSeen();
    setOpen(next);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await subscribeNewsletter({
        email: email.trim(),
        first_name: firstName.trim() || undefined,
        source: "popup",
      });
      markSeen(true);
      setDone({
        email: email.trim(),
        code: res.data?.discount_code ?? null,
        expiresAt: res.data?.expires_at ?? null,
        alreadyUsed: Boolean(res.data?.already_used),
        expired: Boolean(res.data?.expired),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't sign you up. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const offer = popup.offer ? saleHeadline(popup.offer) : null;

  return (
    <Modal open={open} onOpenChange={handleOpenChange}>
      <ModalContent className="max-w-md overflow-hidden p-0">
        {popup.image_url ? <img src={popup.image_url} alt="" className="h-40 w-full object-cover" /> : null}
        <div className="space-y-4 p-8 text-center">
          {done ? (
            <>
              <ModalTitle>{popup.success_message || "You're subscribed!"}</ModalTitle>
              {done.code ? (
                <div className="space-y-3">
                  <ModalDescription>Your personal code for checkout:</ModalDescription>
                  <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-accent/60 bg-accent/10 p-3">
                    <span className="font-display text-xl font-bold tracking-widest text-accent">{done.code}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => copy(done.code!)}
                      aria-label={copied ? "Code copied" : "Copy code"}
                    >
                      {copied ? <Check className="h-4 w-4 text-ok" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-fg-muted">
                    Works once, with {done.email} at checkout
                    {popup.offer?.minimum_order ? ` on orders over $${popup.offer.minimum_order}` : ""}
                    {done.expiresAt ? `. Valid until ${formatDate(done.expiresAt)}.` : "."}
                  </p>
                </div>
              ) : (
                <ModalDescription>{noCodeMessage(done)}</ModalDescription>
              )}
              <Button type="button" className="w-full" onClick={() => handleOpenChange(false)}>
                Continue shopping
              </Button>
            </>
          ) : (
            <>
              {offer ? (
                <span className="inline-block rounded-full bg-accent/15 px-3 py-1 text-xs font-bold tracking-wide text-accent">
                  {offer}
                </span>
              ) : null}
              <ModalTitle>{popup.headline}</ModalTitle>
              {popup.body ? <ModalDescription>{popup.body}</ModalDescription> : null}
              <form onSubmit={handleSubmit} className="space-y-3 pt-1">
                {popup.collect_first_name ? (
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    autoComplete="given-name"
                    maxLength={80}
                  />
                ) : null}
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  autoComplete="email"
                  aria-label="Email address"
                />
                {error ? <p className="text-sm text-danger">{error}</p> : null}
                <Button type="submit" className="w-full" disabled={submitting || !email.trim()}>
                  {submitting ? "Signing up…" : popup.button_label || "Sign up"}
                </Button>
              </form>
              <Button type="button" variant="ghost" size="sm" onClick={() => handleOpenChange(false)}>
                No thanks
              </Button>
            </>
          )}
        </div>
      </ModalContent>
    </Modal>
  );
}
