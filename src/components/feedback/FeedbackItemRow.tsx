import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { StarRatingInput } from "@/components/feedback/StarRatingInput";
import { FEEDBACK_COMMENT_MAX } from "@/constants/feedback";
import type { FeedbackItem } from "@/types/feedback";

interface FeedbackItemRowProps {
  item: FeedbackItem;
  rating: number | null;
  comment: string;
  onRate: (rating: number) => void;
  onComment: (comment: string) => void;
  disabled?: boolean;
}

/** One bought product: photo, name, stars, and a comment once rated. */
export function FeedbackItemRow({ item, rating, comment, onRate, onComment, disabled }: FeedbackItemRowProps) {
  const name = item.product_slug ? (
    <Link to={`/product/${item.product_slug}`} className="font-medium text-fg hover:text-accent">
      {item.name}
    </Link>
  ) : (
    <span className="font-medium text-fg">{item.name}</span>
  );

  return (
    <div className="flex gap-4 rounded-2xl border border-border bg-bg-2 p-4 sm:p-5">
      {item.image ? (
        <img src={item.image} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover sm:h-20 sm:w-20" />
      ) : (
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-bg-3 text-fg-muted sm:h-20 sm:w-20">
          <Package className="h-7 w-7" />
        </span>
      )}
      <div className="min-w-0 flex-1 space-y-3">
        {name}
        <StarRatingInput value={rating} onChange={onRate} label={`Rate ${item.name}`} disabled={disabled} />
        {rating ? (
          <Textarea
            value={comment}
            onChange={(e) => onComment(e.target.value)}
            maxLength={FEEDBACK_COMMENT_MAX}
            placeholder="Anything to add? Fit, quality, delivery… (optional)"
            aria-label={`Comment on ${item.name}`}
            disabled={disabled}
            className="min-h-20"
          />
        ) : null}
      </div>
    </div>
  );
}
