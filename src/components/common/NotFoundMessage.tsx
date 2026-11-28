import { Link } from "react-router-dom";
import { ArrowLeft, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotFoundMessageProps {
  title?: string;
  message?: string;
}

/** Friendly 404 body, shown inside the normal navbar and footer. */
export function NotFoundMessage({
  title = "Page not found",
  message = "The page you're looking for has moved or no longer exists.",
}: NotFoundMessageProps) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-4 px-4 pb-16 pt-32 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent">
        <SearchX className="h-8 w-8" />
      </span>
      <h1 className="font-display text-3xl font-black text-fg">{title}</h1>
      <p className="text-fg-muted">{message}</p>
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <Button asChild>
          <Link to="/shop">Browse parts</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Home
          </Link>
        </Button>
      </div>
    </main>
  );
}
