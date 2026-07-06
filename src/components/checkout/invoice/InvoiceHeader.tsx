import { Link } from "react-router-dom";
import { Printer, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InvoiceHeader() {
  return (
    <header className="border-b border-border bg-bg-2 print:hidden">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="shrink-0 whitespace-nowrap font-display text-sm font-bold tracking-wider text-accent sm:text-base">
          PARTS HUB AUSTRALIA
        </Link>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <Link
            to="/checkout/confirmation"
            className="flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-fg-muted transition-colors hover:text-fg"
          >
            <ArrowLeft className="h-4 w-4 sm:hidden" />
            <span className="hidden sm:inline">Back to Confirmation</span>
          </Link>
          <Button size="sm" variant="secondary" className="gap-2" onClick={() => window.print()}>
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">Print Invoice</span>
          </Button>
          <Lock className="h-4 w-4 shrink-0 text-accent" />
        </div>
      </div>
    </header>
  );
}
