import { useEffect, useState, type ReactNode } from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLocation,
  useRouteLoaderData,
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
import { STRIP_URL_SECRETS_SCRIPT } from "@/lib/guestOrderAccess";
import { EMPTY_SEO_SETTINGS, LAYOUT_ROUTE_ID, NOINDEX_PATH_PREFIXES } from "@/constants/seo";
import { buildOrganizationJsonLd, safeJsonLd } from "@/lib/seo";
import type { LayoutSeoData } from "@/types/seo";

// NOTE: picks the theme pre-hydration so light mode never flashes (useTheme).
const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem("pha-theme");var d=s==="light"?false:s==="dark"?true:window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d);}catch(e){}})();`;

// Google Tag Manager as supplied by the SEO team; unset ID means no GTM.
const GTM_ID = import.meta.env.VITE_GTM_ID;
const GTM_SCRIPT = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`;

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const layoutData = useRouteLoaderData(LAYOUT_ROUTE_ID) as LayoutSeoData | undefined;
  const seo = layoutData?.seo ?? EMPTY_SEO_SETTINGS;
  const noindex = NOINDEX_PATH_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  return (
    // The theme script may change <html>'s class before hydration.
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        {/* Must run before GTM so its first page_view never carries the token. */}
        <script dangerouslySetInnerHTML={{ __html: STRIP_URL_SECRETS_SCRIPT }} />
        {GTM_ID && <script dangerouslySetInnerHTML={{ __html: GTM_SCRIPT }} />}
        <link rel="icon" type="image/svg+xml" href="/branding/logo.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {noindex ? <meta name="robots" content="noindex,follow" /> : null}
        {seo.google_verification ? <meta name="google-site-verification" content={seo.google_verification} /> : null}
        {seo.bing_verification ? <meta name="msvalidate.01" content={seo.bing_verification} /> : null}
        {layoutData?.origin ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: safeJsonLd(buildOrganizationJsonLd(seo, layoutData.origin)) }}
          />
        ) : null}
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
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  // Fresh store per server render, persisted singleton in the browser.
  const [store] = useState(() =>
    typeof document === "undefined" ? createServerStore() : getBrowserStore().store,
  );

  // In an effect, not the initializer, to avoid the #418 hydration race.
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
