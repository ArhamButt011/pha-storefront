import { useEffect, useRef, useState } from "react";
import { Link, isRouteErrorResponse, useRouteError, useSearchParams } from "react-router-dom";
import { CheckCircle2, Heart } from "lucide-react";
import type { Route } from "./+types/FeedbackPage";
import { NotFoundMessage } from "@/components/common/NotFoundMessage";
import { FeedbackItemRow } from "@/components/feedback/FeedbackItemRow";
import { Button } from "@/components/ui/button";
import { FEEDBACK_PATH, HAPPY_RATING, RATING_MAX, RATING_MIN } from "@/constants/feedback";
import { ApiError } from "@/lib/api/client";
import { getFeedbackForm, submitFeedback } from "@/lib/api/feedback";
import { buildMeta } from "@/lib/seo";
import type { FeedbackItem } from "@/types/feedback";

interface Draft {
  rating: number | null;
  comment: string;
}

export async function loader({ params }: Route.LoaderArgs) {
  try {
    return { form: (await getFeedbackForm(params.token)).data, token: params.token };
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) throw new Response("Not Found", { status: 404 });
    throw err;
  }
}

export function meta({ matches, params }: Route.MetaArgs) {
  return buildMeta(matches, {
    title: "How was your order?",
    path: `${FEEDBACK_PATH}/${params.token}`,
    seo: { noindex: true },
  });
}

export function ErrorBoundary() {
  const error = useRouteError();
  const missing = isRouteErrorResponse(error) && error.status === 404;
  return missing ? (
    <NotFoundMessage title="This link isn't valid" message="It may be incomplete or out of date. Check the latest email from us." />
  ) : (
    <NotFoundMessage title="Something went wrong" message="We couldn't load your order just now. Please try again shortly." />
  );
}

const draftsFrom = (items: FeedbackItem[]) =>
  Object.fromEntries(items.map((i) => [i.item_id, { rating: i.rating, comment: i.comment ?? "" }])) as Record<string, Draft>;

/** The email's star, valid only if it names a product on this order. */
function emailRating(params: URLSearchParams, items: FeedbackItem[]) {
  const itemId = params.get("item");
  const rating = Number(params.get("rating"));
  const valid = items.some((i) => i.item_id === itemId) && Number.isInteger(rating) && rating >= RATING_MIN && rating <= RATING_MAX;
  return valid ? { itemId: itemId as string, rating } : null;
}

export default function FeedbackPage({ loaderData }: Route.ComponentProps) {
  const { form, token } = loaderData;
  const [searchParams] = useSearchParams();
  const [drafts, setDrafts] = useState(() => draftsFrom(form.items));
  const [savedStar, setSavedStar] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const autoSaved = useRef(false);

  // Saved from the browser only: mail scanners prefetch links, never run JS.
  useEffect(() => {
    if (autoSaved.current) return;
    autoSaved.current = true;
    const picked = emailRating(searchParams, form.items);
    if (!picked) return;
    setDrafts((d) => ({ ...d, [picked.itemId]: { ...d[picked.itemId], rating: picked.rating } }));
    submitFeedback(token, [{ item_id: picked.itemId, rating: picked.rating }])
      .then(() => setSavedStar(true))
      .catch(() => setError("We couldn't save that rating. Pick it again below."));
  }, [searchParams, form.items, token]);

  const update = (itemId: string, patch: Partial<Draft>) => setDrafts((d) => ({ ...d, [itemId]: { ...d[itemId], ...patch } }));
  const rated = form.items.filter((i) => drafts[i.item_id]?.rating);
  const happy = rated.find((i) => (drafts[i.item_id].rating ?? 0) >= HAPPY_RATING && i.product_slug);

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const ratings = rated.map((i) => ({ item_id: i.item_id, rating: drafts[i.item_id].rating as number, comment: drafts[i.item_id].comment }));
      await submitFeedback(token, ratings);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't send your feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 px-4 pb-16 pt-32 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ok/10 text-ok">
          <CheckCircle2 className="h-8 w-8" />
        </span>
        <h1 className="font-display text-3xl font-black text-fg">Thanks{form.first_name ? `, ${form.first_name}` : ""}!</h1>
        <p className="text-fg-muted">Your feedback goes straight to {form.store_name || "our team"} and helps us stock better parts.</p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          {happy ? (
            <Button asChild variant="outline">
              <Link to={`/product/${happy.product_slug}`}>
                <Heart className="mr-2 h-4 w-4" />
                Love it? Tell others
              </Link>
            </Button>
          ) : null}
          <Button asChild>
            <Link to="/shop">Keep shopping</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 pb-16 pt-28 sm:px-6">
      <h1 className="font-display text-3xl font-black text-fg sm:text-4xl">
        Hi{form.first_name ? ` ${form.first_name}` : ""}, how's your order?
      </h1>
      <p className="mt-2 text-fg-muted">
        Order {form.order_number}. Rate each part: it takes a few seconds and helps {form.store_name || "us"} a lot.
      </p>
      {savedStar ? (
        <p role="status" className="mt-4 rounded-lg bg-ok/10 px-4 py-3 text-sm text-ok">
          Got your rating, thanks! Add a comment or rate the rest below.
        </p>
      ) : null}
      <div className="mt-6 space-y-4">
        {form.items.map((item) => (
          <FeedbackItemRow
            key={item.item_id}
            item={item}
            rating={drafts[item.item_id]?.rating ?? null}
            comment={drafts[item.item_id]?.comment ?? ""}
            onRate={(rating) => update(item.item_id, { rating })}
            onComment={(comment) => update(item.item_id, { comment })}
            disabled={submitting}
          />
        ))}
      </div>
      {error ? (
        <p role="alert" className="mt-4 text-sm text-danger">
          {error}
        </p>
      ) : null}
      <Button type="button" className="mt-6 w-full sm:w-auto" disabled={!rated.length || submitting} onClick={handleSubmit}>
        {submitting ? "Sending…" : "Send feedback"}
      </Button>
    </main>
  );
}
