// Follow-up email feedback, mirroring pha-dashboard's feedback.service.

export interface FeedbackItem {
  item_id: string;
  name: string;
  image: string | null;
  product_slug: string | null;
  rating: number | null;
  comment: string;
}

export interface FeedbackForm {
  store_name: string;
  order_number: string;
  first_name: string;
  items: FeedbackItem[];
}

export interface FeedbackRatingInput {
  item_id: string;
  rating: number;
  comment?: string;
}

export interface FeedbackSaveResult {
  saved: { item_id: string; rating: number; comment: string }[];
}
