import type { Route } from "./+types/NotFoundPage";
import { NotFoundMessage } from "@/components/common/NotFoundMessage";
import { redirectOrNotFound } from "@/lib/redirects";

// Any unmatched URL: a dashboard redirect if one exists, else a real 404.
export async function loader({ request }: Route.LoaderArgs) {
  return redirectOrNotFound(request);
}

export function meta() {
  return [{ title: "Page not found" }, { name: "robots", content: "noindex,follow" }];
}

export function ErrorBoundary() {
  return <NotFoundMessage />;
}

export default function NotFoundPage() {
  return <NotFoundMessage />;
}
