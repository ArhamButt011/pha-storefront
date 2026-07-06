import { Link } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";

interface CheckoutHeaderProps {
  showReturnToCart?: boolean;
}

export function CheckoutHeader({ showReturnToCart = true }: CheckoutHeaderProps) {
  return (
    <header className="border-b border-border bg-bg-2">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="font-display text-base font-bold tracking-wider text-accent">
          PARTS HUB AUSTRALIA
        </Link>

        <div className="flex items-center gap-6">
          {showReturnToCart && (
            <Link
              to="/cart"
              className="flex items-center gap-1.5 text-sm font-medium text-fg-muted transition-colors hover:text-fg"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Return to Cart</span>
            </Link>
          )}
          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent">
            <Lock className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Secure Checkout</span>
          </span>
        </div>
      </div>
    </header>
  );
}
