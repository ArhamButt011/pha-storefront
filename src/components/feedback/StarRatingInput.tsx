import { useState, type KeyboardEvent } from "react";
import { Star } from "lucide-react";
import { RATING_LABELS, RATING_MAX, RATING_MIN } from "@/constants/feedback";
import { cn } from "@/utils/cn";

interface StarRatingInputProps {
  value: number | null;
  onChange: (rating: number) => void;
  // Names the group for screen readers, e.g. the product being rated.
  label: string;
  disabled?: boolean;
}

const STARS = Array.from({ length: RATING_MAX - RATING_MIN + 1 }, (_, i) => RATING_MIN + i);

/** Clickable 1-5 stars, a radio group for keyboards and screen readers. */
export function StarRatingInput({ value, onChange, label, disabled }: StarRatingInputProps) {
  const [hover, setHover] = useState<number | null>(null);
  const shown = hover ?? value ?? 0;

  function handleKey(e: KeyboardEvent<HTMLDivElement>) {
    const step = e.key === "ArrowRight" || e.key === "ArrowUp" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -1 : 0;
    if (!step || disabled) return;
    e.preventDefault();
    onChange(Math.min(RATING_MAX, Math.max(RATING_MIN, (value ?? 0) + step)));
  }

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <div role="radiogroup" aria-label={label} className="flex gap-1" onKeyDown={handleKey} onMouseLeave={() => setHover(null)}>
        {STARS.map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} out of ${RATING_MAX}: ${RATING_LABELS[n]}`}
            tabIndex={value === n || (!value && n === RATING_MIN) ? 0 : -1}
            disabled={disabled}
            onMouseEnter={() => setHover(n)}
            onClick={() => onChange(n)}
            className="rounded-md p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:cursor-not-allowed"
          >
            <Star className={cn("h-7 w-7 sm:h-9 sm:w-9", n <= shown ? "fill-accent text-accent" : "text-bg-3")} />
          </button>
        ))}
      </div>
      {shown ? <span className="text-sm font-medium text-fg-muted">{RATING_LABELS[shown]}</span> : null}
    </div>
  );
}
