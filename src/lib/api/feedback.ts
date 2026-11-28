import { apiClient } from "./client";
import type { BeResponse } from "./base";
import type { FeedbackForm, FeedbackRatingInput, FeedbackSaveResult } from "@/types/feedback";

export const getFeedbackForm = async (token: string) => {
  const { data } = await apiClient.get<BeResponse<FeedbackForm>>(`/feedback/public/${encodeURIComponent(token)}`);
  return data;
};

export const submitFeedback = async (token: string, ratings: FeedbackRatingInput[]) => {
  const { data } = await apiClient.post<BeResponse<FeedbackSaveResult>>(`/feedback/public/${encodeURIComponent(token)}`, { ratings });
  return data;
};
