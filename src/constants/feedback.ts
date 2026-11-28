// Feedback page: rating scale, labels and limits.

export const FEEDBACK_PATH = "/feedback";
export const RATING_MIN = 1;
export const RATING_MAX = 5;
export const FEEDBACK_COMMENT_MAX = 2000;

// Read aloud by screen readers and shown beside the picked star.
export const RATING_LABELS: Record<number, string> = {
  1: "Poor",
  2: "Not great",
  3: "OK",
  4: "Good",
  5: "Excellent",
};

// A rating at or above this suggests telling others about the product.
export const HAPPY_RATING = 4;
