import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/utils/cn";

interface Props {
  onClick?: () => void;
  className?: string;
}

export function CartLink({ onClick, className }: Props) {
  const { totalItems: cartCount } = useCart();

  return (
    <Link
      to="/cart"
      onClick={onClick}
      className={cn("relative p-2 text-fg-muted transition-colors hover:text-fg", className)}
      aria-label={cartCount > 0 ? `Cart (${cartCount} items)` : "Cart"}
    >
      <ShoppingCart className="h-5 w-5" />
      {cartCount > 0 && (
        <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-fg">
          {cartCount}
        </span>
      )}
    </Link>
  );
}
