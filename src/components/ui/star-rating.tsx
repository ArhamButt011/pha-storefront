import { Star } from "lucide-react";
import { cn } from "@/utils/cn";

export function StarRating({ rating, className }: { rating: number; className?: string }) {
  return (
    <div className={cn("flex gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={cn("h-3.5 w-3.5", i <= Math.round(rating) ? "fill-accent text-accent" : "text-bg-3")} />
      ))}
    </div>
  );
}
