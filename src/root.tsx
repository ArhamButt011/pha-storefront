import { useEffect, useState, type ReactNode } from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  type ErrorResponse,
} from "react-router";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import { VehicleProvider } from "@/context/VehicleContext";
import { createServerStore } from "@/store/store";
import { getBrowserStore, startPersisting } from "@/store/browserStore";
import { TooltipProvider } from "@/components/ui/tooltip";

// Runs before hydration (inline, in <head>) so a light-mode visitor never
// sees a flash of the default dark theme. Dark is still the default: the
// server always renders `class="dark"` on <html> already, so this only
// ever needs to *remove* the class for someone who has actually chosen
// light (or whose system preference is light and they've never overridden
// it) — kept in manual sync with useTheme.ts's getInitialTheme(), which
// this necessarily duplicates since it must run outside the React bundle.
const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem("pha-theme");var d=s==="light"?false:s==="dark"?true:window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d);}catch(e){}})();`;

export function Layout({ children }: { children: ReactNode }) {
  return (
    // suppressHydrationWarning: the inline theme script above may mutate
    // this element's class attribute before React hydrates, which would
    // otherwise be flagged as a mismatch — this is the standard, documented
    // way to opt that one attribute out of hydration warnings (same pattern
    // as next-themes / the Remix Indie Stack).
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/branding/logo.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* Site-wide fallback — SSR routes override via their own `meta` export,
            which <Meta/> renders after this (later tag wins for <title> / a
            duplicate name="description"), so non-SSR routes (cart/checkout)
            keep exactly this. */}
        <title>Parts Hub Australia | Premium Automotive Parts</title>
        <meta
          name="description"
          content="Australia's #1 destination for premium automotive parts. Genuine parts, fast delivery, expert support."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  // A fresh, unpersisted store per render on the server (this component
  // instance is re-created for every request), a persisted singleton in the
  // browser — see store.ts / browserStore.ts for why.
  const [store] = useState(() =>
    typeof document === "undefined" ? createServerStore() : getBrowserStore().store,
  );

  // Deliberately NOT inside the useState initializer above (see
  // browserStore.ts's own comment on the #418 hydration race this fixes) —
  // an effect is guaranteed to run after the commit, so redux-persist's
  // localStorage read can never land mid-hydration.
  useEffect(() => {
    startPersisting();
  }, []);

  return (
    <Provider store={store}>
      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <VehicleProvider>
        <TooltipProvider delayDuration={200}>
          <Outlet />
        </TooltipProvider>
      </VehicleProvider>
    </Provider>
  );
}

export function ErrorBoundary({ error }: { error: unknown }) {
  let status = 500;
  let message = "Something went wrong.";

  if (isRouteErrorResponse(error)) {
    const routeError = error as ErrorResponse;
    status = routeError.status;
    message =
      routeError.status === 404
        ? "This page could not be found."
        : routeError.statusText || message;
  }

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-3 px-4 pt-32 text-center sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-black text-fg">{status}</h1>
      <p className="text-fg-muted">{message}</p>
      {import.meta.env.DEV && error instanceof Error && (
        <pre className="mt-4 max-w-full overflow-auto rounded-lg bg-bg-2 p-4 text-left text-xs text-fg-muted">
          {error.stack}
        </pre>
      )}
    </main>
  );
}
