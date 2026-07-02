import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-border bg-bg-2 px-6 py-20 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-bg-3 text-fg-muted">
        <ShoppingCart className="h-6 w-6" />
      </span>
      <h2 className="mt-4 text-lg font-bold text-fg">Your cart is empty</h2>
      <p className="mt-2 max-w-sm text-sm text-fg-muted">
        Looks like you haven't added any parts yet. Browse our catalog to start building your setup.
      </p>
      <Button size="lg" className="mt-6" asChild>
        <Link to="/products">Browse Parts</Link>
      </Button>
    </div>
  );
}
