import { redirect } from "react-router";
import { resolveRedirect } from "@/lib/api/seo";

/** Follows a dashboard redirect for this URL, else throws a real 404. */
export async function redirectOrNotFound(request: Request): Promise<never> {
  const { pathname } = new URL(request.url);
  // A failed lookup must still 404, never turn a missing page into a 500.
  const target = await resolveRedirect(pathname)
    .then((res) => res.data)
    .catch(() => null);
  if (target) throw redirect(target.to, target.status);
  throw new Response("Not Found", { status: 404 });
}
