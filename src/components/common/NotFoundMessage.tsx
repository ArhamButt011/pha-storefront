import { Link } from "react-router-dom";
import { ArrowLeft, SearchX } from "lucide-react";
import { buttonClassName } from "@/components/ui/button-styles";

/** Friendly 404 body, shown inside the normal navbar and footer. */
export function NotFoundMessage() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-4 px-4 pb-16 pt-32 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent">
        <SearchX className="h-8 w-8" />
      </span>
      <h1 className="font-display text-3xl font-black text-fg">Page not found</h1>
      <p className="text-fg-muted">The page you're looking for has moved or no longer exists.</p>
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <Link to="/shop" className={buttonClassName({ variant: "primary" })}>
          Browse parts
        </Link>
        <Link to="/" className={buttonClassName({ variant: "outline" })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Home
        </Link>
      </div>
    </main>
  );
}
