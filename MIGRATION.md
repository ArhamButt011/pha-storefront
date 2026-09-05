# SSR migration (React Router v7 framework mode)

## Why

Google Merchant Center's landing-page crawler doesn't execute JavaScript. It
fetched `/product/<slug>` and got `<div id="root"></div>` — every product was
disapproved for an unavailable landing page or a price/availability
mismatch, and the same gap meant zero organic search presence for the whole
catalog. This converts the storefront from a client-only Vite SPA to React
Router v7 **framework mode** (SSR), so crawlers get fully-rendered HTML.

Every tenant gets a storefront going forward, so this needed to be a real
fix, not a metadata-injection workaround.

## What changed, at a glance

- `react-router-dom` (library mode, `BrowserRouter`) → React Router v7
  **framework mode**: `react-router.config.ts`, `src/root.tsx`,
  `src/routes.ts`, `src/entry.server.tsx`, `src/entry.client.tsx`.
- Six routes now server-render with real data via route `loader`s: `/`,
  `/categories`, `/shop`, `/shop/:categoryId`, `/product/:slug`, `/bundles`.
- `/product/:slug` emits SEO `meta` (title/description/canonical/OG) and a
  schema.org `Product` JSON-LD block whose price/availability come straight
  from the same backend response the page renders — never rounded,
  reformatted, or re-derived.
- `/cart` and `/checkout*` are unchanged functionally (no loaders, same
  `useEffect`-driven fetches) — see "Routes that stay client-driven" below
  for why they don't need more than that.
- Deployment is now two processes behind nginx: a Node server (renders
  pages) and nginx (TLS/static assets/proxy) — see "New deploy shape".

## Runtime env vars

- **`VITE_API_URL`** — unchanged behavior: still a Docker **build** ARG
  (`docker-compose.yml` / `Dockerfile`), not a container-runtime env var.
  `react-router build` compiles both the client bundle and the server
  bundle in one step, and Vite inlines `import.meta.env.VITE_API_URL` into
  *both* at that time — so the loaders (which run inside the built server
  bundle) read back the exact same value the client was built with. This
  is still a per-tenant image: each tenant's build points at its own
  backend, same as before.
- **`VITE_TENANT_SLUG`** — new, **required build ARG, not optional or
  dev-only** (a follow-up verification pass specifically checked this — see
  "Is X-Tenant-Slug really required everywhere?" below for the full
  investigation). Sent as `X-Tenant-Slug` on every request via
  `src/lib/api/client.ts`. **Missing** → the app refuses to start at all
  (throws at module load, both server boot and first client page load) —
  loud and immediate, by design, so a forgotten build arg can't ship.
  **Wrong-but-present** → NOT an error of any kind. The backend has no way
  to know the value is wrong, so it silently serves that OTHER tenant's
  entire product catalog, categories, and lets checkouts write real orders
  under the wrong tenant. This is a data leak, not a bug that shows up in
  logs or a 500 — treat this value with the same care as a credential:
  source it from the same per-tenant deployment config as `VITE_API_URL`,
  never copy-paste it from another tenant's `.env`/compose file/CI config.
- **`VITE_STRIPE_PUBLISHABLE_KEY`** — unchanged: build-time, baked into the
  client bundle only (Stripe.js never loads on the server — see "SSR
  hazards" below).
- **`NODE_ENV=production`** — new, set in the `server` image stage. Without
  it, redux-persist's storage-detection code logs a harmless
  `console.error` on every server boot (see hazard #3); sets nothing else
  differently. Do not remove this from the runtime image.
- **`PORT`** — new, consumed by `@react-router/serve` for the Node
  process (defaults to `3000`, matches `nginx.conf`'s upstream). No need to
  set it explicitly in `docker-compose.yml` unless you need a different
  port.

## New deploy shape

```
        ┌────────────────────────┐
        │  nginx (target: nginx) │  :80 — pha-net-facing, hostname pha-storefront
        │  - /assets/, /branding/  → served from disk (immutable/short cache)
        │  - everything else       → proxy_pass to `app`
        └───────────┬─────────────┘
                     │
        ┌────────────▼────────────┐
        │  app (target: server)   │  :3000 — internal only
        │  react-router-serve     │  renders loaders/meta/JSON-LD
        └──────────────────────────┘
```

`docker-compose.yml` now builds two services from the same `Dockerfile`
(`--target server` and `--target nginx`); `pha-net` and the `pha-storefront`
hostname are unchanged, so nothing upstream of this compose file needs to
change. `Dockerfile` has three stages: `builder` (shared), `server` (Node
runtime), `nginx` (static + proxy).

## How to roll back

Two paths, in the order you should reach for them. Both are described in
past-tense/pre-deploy form below — the first only works if you did the
"before deploying" step ahead of time; the second always works, but means
rebuilding under pressure (git history is never rewritten).

### Path A — tag ahead, then re-point compose (no rebuild) — DO THIS BEFORE DEPLOYING

`docker-compose.yml` now names its images explicitly
(`pha-storefront-app`/`pha-storefront-nginx`), parameterized by a
`STOREFRONT_TAG` env var (defaults to `latest`). Tag and keep the
currently-running (pre-SSR, or whatever's live right now) image under a
fixed name **before** building/deploying this migration, so rollback is
just repointing compose at that tag — no rebuild, no waiting on `npm ci`
under pressure:

```bash
# 1. Before deploying the SSR build: snapshot whatever's live right now.
#    If it was already built/running via this same compose file under some
#    tag (or "latest"), just re-tag the existing images — no rebuild:
docker tag pha-storefront-app:latest pha-storefront-app:pre-ssr
docker tag pha-storefront-nginx:latest pha-storefront-nginx:pre-ssr
# (if you also push to a registry other hosts pull from, push the tag too:)
docker tag pha-storefront-app:pre-ssr <registry>/pha-storefront-app:pre-ssr
docker push <registry>/pha-storefront-app:pre-ssr
docker tag pha-storefront-nginx:pre-ssr <registry>/pha-storefront-nginx:pre-ssr
docker push <registry>/pha-storefront-nginx:pre-ssr

# 2. Deploy the SSR build under its own tag:
STOREFRONT_TAG=ssr-v1 docker compose build
STOREFRONT_TAG=ssr-v1 docker compose up -d

# 3. If it has problems: roll back by re-pointing at the pre-ssr tag —
#    no build step at all.
STOREFRONT_TAG=pre-ssr docker compose up -d
```

If `pha-storefront-app:latest`/`pha-storefront-nginx:latest` don't already
exist locally under those names (e.g. this is the very first deploy through
this compose file), build the pre-SSR commit once to produce them before
step 1 — see Path B's checkout command, then `docker compose build` from
that checked-out tree.

### Path B — git checkout + rebuild (always works, slower)

There is **no** static-SPA build target left in the current `Dockerfile` —
it can't rebuild the old SPA, because the old entry points
(`index.html`, `src/main.tsx`, `src/App.tsx`) and the old `vite build`
script no longer exist in this tree. Rolling back this way means going back
to the commit before this migration, which is untouched in git history:

```bash
# Commit immediately before this migration:
git log --oneline -1 7208c54   # "Merge pull request #16 from ArhamButt011/dev"

# Build & deploy that commit's Dockerfile/nginx.conf/docker-compose.yml as-is:
git checkout 7208c54 -- Dockerfile nginx/nginx.conf docker-compose.yml \
  index.html src/main.tsx src/App.tsx package.json package-lock.json vite.config.ts
docker compose build && docker compose up -d
# (or simpler/safer: `git checkout 7208c54` onto a deploy branch and build that)
```

This is the "keep the old path working" requirement — satisfied by not
rewriting history, rather than by keeping a half-working Dockerfile stage
that would silently build against the wrong source tree.

## Routes that stay client-driven

`/cart`, `/checkout`, `/checkout/payment`, `/checkout/confirmation`,
`/checkout/invoice` have no `loader` and are unchanged internally (same
`useEffect` + axios calls as before). **Important nuance**: React Router
v7's `ssr` flag in `react-router.config.ts` is app-wide — there is no
per-route `ssr: false`. These routes still pass through the same SSR render
pass as everything else; they just have nothing for the server to fetch,
and every localStorage/Stripe/`window` access already lived inside
`useEffect`/event handlers (verified by grepping the whole tree), so
nothing crashes. The net effect for a real visitor is the same as "client
rendered" — Cart's item list and the checkout flow only become interactive
after hydration — it's just achieved by omission (no loader) rather than a
framework switch that doesn't exist in this version.

## SSR hazards found and how each was handled

1. **`main.tsx`: `document.documentElement.classList.add("dark")` at module
   scope.** Moved into `root.tsx`'s `Layout` — the `<html>` tag now always
   renders `class="dark"` server-side (dark stays the default, matching
   before). An inline `<script>` in `<head>` (before `<Meta/>`/`<Links/>`)
   runs before hydration and *removes* the class if the visitor's
   stored/system preference is light — this is the one hazard where the
   fix is strictly better than the old SPA behavior, which had a real
   dark→light flash on every load for light-mode users (the correction
   only ran in a post-mount `useEffect`). `<html>` has
   `suppressHydrationWarning` since the inline script can change its
   `class` attribute before React hydrates.
2. **`useTheme.ts`: reads `localStorage`/`matchMedia` in `getInitialTheme`.**
   Already SSR-safe as written — that function is only ever called from
   inside a `useEffect`, so it never runs server-side, and its `useState`
   initial value (`"light"`) is identical on server and client's first
   pass. No code change needed there; call this out because I checked it,
   not because it needed fixing.
3. **`store.ts`: `persistStore(store)` at module scope, touching
   `localStorage`.** Split into `src/store/store.ts` (plain
   `configureStore`, `createServerStore()` — no persistence, called fresh
   per render in `root.tsx` when `typeof document === "undefined"`) and
   `src/store/browserStore.ts` (the persisted singleton, used only when
   `typeof document !== "undefined"`). A fresh store per server request
   matters even though nothing writes to it: a module-level singleton would
   be shared across every concurrent request in that Node process, and
   Redux/SSR best practice is a new store per request regardless. One
   residual quirk: merely *importing* `browserStore.ts` (even without
   calling `getBrowserStore()`) makes Node evaluate
   `redux-persist/lib/storage`'s `getStorage('local')`, which checks
   `typeof self` and falls back to a no-op storage — safe, but it
   `console.error`s once per server boot unless `NODE_ENV=production`
   (that check is guarded on `NODE_ENV !== 'production'`). Fixed by setting
   `NODE_ENV=production` in the `server` image stage — verified the log
   line disappears with it set.
4. **`main.tsx`: `<PersistGate loading={null}>` wrapping the whole app.**
   Not used anywhere, on either side — not "moved to client-only". A
   `<PersistGate>` in the shared root tree would render `null` during the
   client's *first* render pass (until redux-persist finishes reading
   localStorage), while the server had already rendered full markup for
   that same pass — a guaranteed hydration mismatch. Since the SSR'd tree
   has to render *something* real for crawlers, gating it behind "not yet
   rehydrated" is fundamentally incompatible with SSR here. `persistStore()`
   is still created and still rehydrates in the background; components
   using `useSelector` (e.g. the cart badge) just pick up the `REHYDRATE`
   action naturally a tick after mount via react-redux's normal
   subscription, instead of being gated on it. Net effect: the cart
   badge/count may render as 0 for a moment before popping in, rather than
   the whole app being blank until rehydrated.
5. **`lib/stripe.ts`: `loadStripe(...)` at module scope**, touching
   `document`. Changed to `getStripe()`, which dynamically `import()`s
   `@stripe/stripe-js` itself (not just delays calling `loadStripe`) and is
   only ever invoked from `Payment.tsx`'s `useEffect`. `<Elements
   stripe={...}>` accepts `null` while this resolves, which is Stripe's own
   documented way to defer initialization — no loading-state changes needed
   beyond that.
6. **Grepped the whole tree for `window`/`document`/`localStorage`/
   `sessionStorage`/`navigator`** beyond the five hazards above:
   `Navbar.tsx`, `NavLinkItem.tsx`, `ImageLightbox.tsx`,
   `InvoiceHeader.tsx`, `useCopyToClipboard.ts`, `useFullscreen.ts`,
   `Home.tsx`'s hash-scroll effect, `Payment.tsx`'s `window.location`
   usage. All of these were already inside `useEffect`/event handlers —
   confirmed by inspection, no changes needed.

## Step 0 findings (dependencies + docs)

- **redux-persist** — unmaintained, and the one flagged as most likely to
  fight this migration, did (see hazard #3/#4 above), but never actually
  *crashed*: its storage engine checks `typeof self` and no-ops rather than
  throwing. The real fix was architectural (server vs. browser store
  split), not a library swap.
- **react-select 5.x** — used on three SSR'd routes (`VehicleSelector` on
  Home, `ResultsHeader`/others on the shop listing, `BundlesHero`). Modern
  react-select generates its internal ids via React's `useId`, which is
  guaranteed to match between server and client renders of the same tree
  shape — no `instanceId` prop was needed. Rendered correctly in the
  curl-based checks below with no server error; **not** independently
  verified for zero hydration warnings in an actual browser (no browser
  available in this environment — see "Not verified" below).
- **@radix-ui/react-dialog** (`InquiryModal`) — closed by default
  (`open={false}`), and Radix's own portal-mounting is already
  effect-gated; no changes needed.
- **react-toastify, @stripe/react-stripe-js, @stripe/stripe-js,
  lucide-react, @tailwindcss/vite** — no module-scope DOM/window access;
  all fine as-is (Stripe's own module-scope behavior is moot now that it's
  only ever imported via the dynamic `import()` in hazard #5).
- **@types/node** — types only, irrelevant to SSR runtime.
- No package needed to be replaced or removed.

**Docs vs. this prompt**: the live docs at reactrouter.com now default to
v7's *successor* (v8) — I fetched the version-pinned `/7.18.3/...` docs
throughout instead of the default (unversioned) pages, since this project
is deliberately staying on v7 (matching the already-pinned
`react-router-dom@^7.18.1`), not upgrading. Two things the prompt assumed
that the confirmed v7.18.3 docs don't support:
- **No per-route `ssr: false`.** `ssr` in `react-router.config.ts` is
  app-wide. See "Routes that stay client-driven" above for how `/cart` and
  `/checkout*` are still effectively client-rendered without it.
- **`links()` doesn't receive loader data**, so it can't build a
  slug-specific canonical URL. Used React 19's native behavior instead —
  a `<link rel="canonical">` rendered directly in `ProductDetails`'s JSX is
  hoisted into `<head>` automatically; confirmed present in the rendered
  HTML during verification.

Also encountered (not prompted, but load-bearing): RR7 requires a distinct
route id per file — `route("shop", ...)` and `route("shop/:categoryId",
...)` both pointing at `ProductsListing.tsx` failed typegen with
`duplicate route id`. Fixed with a single optional-param route,
`route("shop/:categoryId?", "pages/ProductsListing.tsx")`.

## `// NOTE:` judgment calls (grep the code for the full comments)

- `react-router.config.ts`: `appDirectory: "src"` — kept the existing
  `src/` layout instead of the framework's default `app/`, to avoid
  rewriting ~150 existing `@/...` imports for a cosmetic rename.
- `root.tsx`: site-wide `<title>`/description live as static tags before
  `<Meta/>`; each SSR route's own `meta` renders after, so its tags are
  later in the DOM and win (this is React Router's standard, documented
  meta-override mechanism — later route wins). Cart/checkout have no
  `meta` export, so they keep exactly the old static title/description.
- Loaders were added for the fetches that actually matter for SEO/crawled
  content (product/category/listing data). Left as unchanged client
  `useEffect`s: `VehicleSelector`'s cascading make/model/code/year
  dropdowns and `Navbar`'s category dropdown — neither is crawled content,
  both are interaction-driven in a way a one-shot loader can't help with,
  and moving them server-side would add a fetch to every single SSR
  request for zero SEO benefit.
- `ProductsListing`/`CategoriesGrid`: once a route has a loader, RR7
  automatically re-runs it on every client-side navigation whose URL
  changes (including search-param-only changes) — since both pages already
  drive their filters through the URL, this **replaced** the old
  `useEffect`-on-filter-change fetch in `ProductsListing` entirely
  (~50 lines removed; loading state now comes from `useNavigation()`).
  `CategoriesGrid`'s search box never wrote to the URL, and changing that
  felt like more behavior change than "what SSR requires", so it keeps its
  original debounced client-side fetch — only its *initial* (unfiltered)
  render is now loader-seeded.
- `ProductDetails`/`ProductsListing` loaders: a backend **404** throws a
  404 `Response` (per spec). Any *other* loader error (network blip,
  backend 5xx) is left to propagate to the root `ErrorBoundary` as a 500
  instead of being coerced into a fake 404 — coercing it would risk Google
  deindexing a product page over a transient outage, which is worse than
  showing an error page.
- JSON-LD's `mpn` is sourced from `sku` (no dedicated `gtin`/`mpn` field
  exists in `ApiProduct` — not invented, and not emitted when `sku` is
  absent, per spec: "never emit empty or null fields").
- `getOrigin()` (canonical/OG URLs) defaults to `https://` when
  `X-Forwarded-Proto` is absent, since nginx always terminates TLS and the
  Node server never legitimately sees a plain-HTTP request in production;
  `nginx.conf` also now explicitly sets `X-Forwarded-Proto`/`-Host`.

## Verification actually run

1. **`tsc -b` clean** — ran `npx react-router typegen && npx tsc -b --force`
   (forced, not relying on a cached `.tsbuildinfo`): zero errors.
2. **`npm run build`** (`react-router typegen && tsc -b && react-router
   build`) — succeeds against the real `.env`, producing `build/client/`
   and `build/server/index.js`. Also re-ran pointed at a local mock backend
   for the curl checks below (the real backend at the `.env`'s configured
   `localhost:7000` wasn't reachable in this environment — that port is
   occupied by macOS's own AirPlay/ControlCenter service, not
   pha-dashboard; a mock on `:7055` returning the same `ApiProduct`/
   `ApiCategory` response shapes stood in for it).
3. **`curl` against a running `react-router-serve` build**:
   - `GET /product/brembo-gt-6-piston-front-brake-kit` → `200`, body
     contains `<title>Brembo GT 6-Piston Front Brake Kit | Parts Hub
     Australia</title>`, rendered price `A$2,499.00` (matches the mock's
     raw `price: 2499`), stock label `In Stock`, a `<link
     rel="canonical">`, `og:*` tags, and a valid `application/ld+json`
     block: `"price":"2499","priceCurrency":"AUD","availability":
     "https://schema.org/InStock","itemCondition":
     "https://schema.org/NewCondition","mpn":"BRM-GT6-F"`. No empty
     `<div id="root">` anywhere in the response.
   - A second mock product with `stock_status: "out_of_stock"` →
     `"availability":"https://schema.org/OutOfStock"` in the same response,
     confirming the mapping (not hardcoded).
   - `GET /product/does-not-exist` → **`404`**, rendered by the root
     `ErrorBoundary` ("This page could not be found.").
   - `GET /`, `/categories`, `/shop`, `/shop/brakes`, `/bundles`, `/cart`,
     `/checkout` → all `200`; `/` and `/shop` bodies contain the mock
     product/category names, confirming their loaders actually ran
     server-side rather than serving an empty shell.
   - Server log across all of the above: clean, no stack traces, no
     unhandled errors — including the redux-persist `console.error` from
     hazard #3, once `NODE_ENV=production` was set.

## Verification pass 2 — real backend, real Docker, real headless browser

A second pass re-verified everything in the "Not verified" list from the
first pass, against the real backend, real Docker, and a real (headless)
browser. It found and fixed three real bugs the mock-backend/no-Docker/
no-browser pass above could not have caught, plus one pre-existing gap
unrelated to SSR. Full detail in each fix's own code comment; summarized
here.

### Fixed

1. **Missing `X-Tenant-Slug` header (pre-existing, not caused by this
   migration).** pha-dashboard's backend requires every guest product/
   category/order call to carry `X-Tenant-Slug` (see
   `server/src/middlewares/tenant.js`) — `apiClient.ts` never sent one, so
   every real request 400'd with "Missing tenant identifier". This was
   invisible before because nothing had ever pointed the storefront (old
   SPA or new SSR) at the real multi-tenant backend. Fixed by adding a
   `VITE_TENANT_SLUG` env var, sent as `X-Tenant-Slug` on every request
   (`src/lib/api/client.ts`). Added to `.env`/`.env.example`.

   **Follow-up verification specifically checked whether this reasoning
   holds** — the concern raised was that the *current production SPA works
   today without ever sending this header*, so production must resolve the
   tenant some other way (most likely Host, matched against a Domain
   record), and the local failure might just be "localhost matches no
   Domain" rather than a real gap. Investigated by reading
   `server/src/middlewares/tenant.js` and grepping every place
   `req.tenant` is ever assigned across the whole backend:

   - **Every mechanism, in the order tried**: (1) a staff JWT via
     `auth(false)` (admin dashboard only), (2) `X-Tenant-Slug` header (or
     `tenant_slug` in body/query) via `resolveGuestTenant()`, (3) an order
     id lookup — but only for the shared, cross-tenant `/pay/:orderId`
     payment-link page, not general browsing. That is the complete list —
     grepped for `req.tenant =` across the entire codebase and found
     exactly these three assignments, nowhere else.
   - **Host-based resolution does not exist in production, or anywhere.**
     There IS a `Domain` model (custom per-tenant hostnames), which looked
     like the obvious candidate — but its own header comment states its
     only two consumers are CORS origin validation (`app.js`) and an
     unbuilt future Stripe Payment Method Domain feature. Confirmed by
     reading `app.js`'s CORS logic directly: `Domain` is consulted only to
     decide whether to *accept a request's Origin header*, never to look up
     a tenant. No code path anywhere resolves `req.tenant` from `Host`/
     hostname.
   - Checked this wasn't just true on the currently-checked-out feature
     branch: `origin/main` in pha-dashboard is a single "first commit" stub
     with no `tenant.js` at all (clearly not what's deployed); `origin/dev`
     (the repo's actual default branch) already has the identical
     `X-Tenant-Slug`-only `tenant.js`, added deliberately (`61e1b00 tenant
     based system`, immediately followed by `0c42c60 allow X-tenant-slug`,
     merged via PR #12) — not accidental or half-finished. The
     `marketplace-integration` branch this was checked out on branches from
     `dev` and inherits it unchanged.
   - **Which wins if both are present**: moot — there is no second
     mechanism to win or lose against for guest routes.
   - **Can a wrong slug override correct resolution and leak data — this
     was the important one**: reframed by the evidence, not just answered.
     There's no "override" happening because there's nothing correct to
     override — `X-Tenant-Slug` is the *only* signal. That makes the risk
     worse, not moot: a build shipped with a wrong-but-validly-formatted
     slug doesn't error at all, it successfully and silently serves that
     other tenant's catalog and lets checkouts write orders under the wrong
     tenant. Nothing on the storefront side can detect "right format, wrong
     tenant" (there's no independent source of truth to check it against);
     only the "completely missing" half of this risk is catchable.

   **Conclusion**: the header is genuinely required in all environments,
   not a local-dev-only workaround for a Host-based scheme that works in
   production — there is no such scheme anywhere in this backend, on any
   branch. Per the decision rule this investigation was run to apply,
   `VITE_TENANT_SLUG` is treated as a **mandatory** build arg (not made
   optional/dev-only), and `apiClient.ts` now **throws immediately** at
   module load if it's unset (verified: rebuilt with `.env` removed,
   confirmed the server crashes on startup with a clear message instead of
   silently sending no header) — closing the catchable half of the risk.
   The uncatchable half (wrong-but-present) is documented prominently above
   under "Runtime env vars" and in `Dockerfile`/`docker-compose.yml`'s own
   comments, per instruction not to leave it silent.
2. **React error #418 (hydration mismatch) for a returning visitor with a
   cart.** `persistStore()` was called eagerly, as soon as the browser
   store was created — its localStorage read resolves on a microtask that
   could land *during* React's hydration commit for a visitor who already
   had a persisted cart, mutating `state.cart` mid-hydration. React
   recovers by discarding and client-rendering the affected subtree, but
   since the cart badge lives in Navbar (shared by every route via Layout),
   this could hit any SSR'd page, not just `/cart`. Confirmed via a real
   headless-Chrome run (fresh browser launch + pre-populated localStorage
   profile), fixed by moving `persistStore()` into a `useEffect` in
   `root.tsx` (guaranteed to run after commit) — see
   `src/store/browserStore.ts`'s `startPersisting()`.
3. **Fresh load of `/checkout` bounced a visitor with a real cart to
   `/cart`.** A direct consequence of fix #2: Shipping.tsx's "redirect to
   /cart if empty" effect is a *child* of root.tsx's now-deferred
   persistence-start effect, and child effects run before parent effects —
   so it always saw the pre-rehydration empty cart on every fresh full-page
   load. Fixed with a `useHasRehydrated()` hook (`src/hooks/
   useHasRehydrated.ts`) reading redux-persist's own `_persist.rehydrated`
   flag, which Shipping.tsx's effect now waits on before deciding.
   (First attempt at this hook defaulted to `true` when `_persist` was
   absent, which re-introduced the exact same bug through a different
   path — `_persist` isn't stamped onto state at store-creation, only once
   `persistStore()` actually runs — the working version defaults to
   `false`; see that file's comment.)
4. **nginx took ~14s to return an error with the `app` container down.**
   nginx's default connect timeout (60s) meant a real backend outage would
   leave users staring at a hung request before eventually getting a 502.
   Confirmed by actually killing the `app` container under Docker. Fixed
   with explicit `proxy_connect_timeout 5s` / `proxy_send_timeout 10s` /
   `proxy_read_timeout 10s` in `nginx.conf` — re-tested, now fails in ~5s
   with a proper 504.
5. **JSON-LD `mpn` was sourced from `sku`, and `brand` was fabricated as
   "Generic" for products with no real brand.** Both only surfaced against
   real seeded data (the mock always had a brand, and never modeled `mpn`
   as a field distinct from `sku`). Cross-checked against
   pha-dashboard's own `listing.resolver.js#resolveIdentifiers` (the
   function its Google Merchant adapter uses for the same purpose) — see
   "Feed/page consistency" below for the full comparison. Fixed in
   `ProductDetails.tsx`'s `buildProductJsonLd`; `ApiProduct`/
   `ApiProductDisplay` types updated with the real `mpn` field.

### Confirmed working (no changes needed)

- All 8 routes (`/`, `/categories`, `/shop`, `/shop/<real-category-id>`,
  `/product/<real-slug>`, `/bundles`, `/cart`, `/checkout`) return correct
  status codes and real fetched content against the real backend;
  `/product/does-not-exist` → 404.
- Cart survives a page reload and a full browser restart (killed the Chrome
  process and relaunched against the same profile dir — a stronger test
  than closing/reopening a tab) — verified via headless Chrome, contents
  read back byte-for-byte identical from `localStorage`'s
  `persist:pha-storefront` key both times.
- No cart data ever appears in server-rendered HTML for any route — grepped
  fresh (no browser state) responses for the test product's title/price;
  zero matches. This is inherent to the architecture (cart lives only in
  browser localStorage, never sent to the server), not something that could
  regress, but is now empirically confirmed rather than assumed.
- Zero hydration console warnings/errors across all 7 non-checkout-submit
  routes, both with an empty browser profile and with a pre-populated cart
  (the scenario that used to trigger finding #2) — real headless-Chrome
  console capture via the Chrome DevTools Protocol, not a static review.
- `docker compose build` equivalent (`docker build --target server` /
  `--target nginx`) succeeds; both containers actually run together on a
  Docker network exactly like `docker-compose.yml` wires them, nginx
  proxies `/` to `app` and serves `/assets/` (immutable, 1y) and
  `/branding/` (1h) directly with correct `Content-Type`/`Cache-Control` —
  confirmed via response headers from the running containers.
- `VITE_API_URL` read at runtime, inside the container, correctly: the
  server-stage image was built with `VITE_API_URL=http://
  host.docker.internal:7001/api/v1` (the only way a container can reach a
  service on the host), and the containerized loader successfully fetched
  real data through it — this is the concrete build-time-vs-runtime concern
  the task flagged, and it works exactly as `## Runtime env vars` above
  describes.
- Image sizes (before the size-reduction pass below): old single static
  image **106MB**; new setup **two** images, `nginx` **106MB** (identical
  shape — nginx:alpine + static assets) + `server` **388MB** — **494MB
  total**. See "Shrinking the server image" for what most of that 388MB
  actually was and how it was cut to 281MB.

## Shrinking the server image

`docker history` plus `du -sh node_modules/*` inside the built image (not
guessed) showed the 388MB was not "an SSR server needs a lot of runtime" —
it was the runtime stage's `npm ci --omit=dev` reinstalling the app's
**entire** dependency tree, most of which the running server never
actually touches:

| Path | Size |
|---|---|
| `node_modules/lucide-react` | 41MB |
| `node_modules/typescript` | 22.9MB |
| `node_modules/@babel` | 8.1MB |
| `node_modules/react-dom` | 7.1MB |
| `node_modules/@reduxjs` | 6.3MB |
| `node_modules/react-router` | 5.1MB |
| `node_modules/@emotion`, `@stripe`, `axios`, `react-select`, `@radix-ui`, `redux-persist`, etc. | ~15MB combined |

Two separate causes:

1. **`typescript` (22.9MB) was never supposed to be there at all.**
   `npm explain typescript` traced it to `@react-router/express` (a real
   transitive dependency of `@react-router/serve`, which the runtime image
   genuinely needs) declaring `typescript` as a `peerOptional` dependency —
   npm auto-installs optional peers by default. Not a devDependency leak;
   fixed with `--omit=optional` on the runtime install. **This part
   shipped** — see "What actually shipped" below.
2. **Everything else (lucide-react, @reduxjs, react-select, @radix-ui,
   @stripe, redux-persist, axios, react-dom, react-router, …) didn't need
   to be physical `node_modules` in the runtime image at all** — in
   principle. `react-router build`'s SSR bundle (`build/server/index.js`)
   was only 225KB, meaning Vite was *externalizing* these (leaving them as
   `require()`s resolved from `node_modules` at runtime) rather than
   bundling them, and the runtime stage's `npm ci` against the full
   project `package.json` dutifully reinstalled every one of them just so
   those `require()` calls would resolve. **This part was attempted, and
   reverted** — see below for why.

### What was tried and reverted

Set `vite.config.ts`'s `ssr.noExternal` to bundle the app's own
dependencies into `build/server/index.js` instead of externalizing them
(first `true`, i.e. bundle everything; then, after that broke, an explicit
list of just the worst offenders), paired with a minimal
`docker/server-package.json` (just `@react-router/serve`) so the runtime
stage's install wouldn't need the app's UI/state dependencies at all. This
got the `server` image down to **281MB** and shrank runtime
`node_modules` from 124.5MB to 11.5MB — verified working end to end
against real Docker containers (JSON-LD, 404, static headers, and the
kill-container 504-timing check all passed).

It was reverted anyway, because **`npm run dev` was not re-tested until
after reporting success**, and broke: Vite's SSR *dev* module runner
(different code path from the production Rollup build) threw `module is
not defined` trying to process `react/jsx-dev-runtime.js` as bundleable
ESM — that file is old-style CJS. Narrowing `noExternal` to an explicit
list (excluding React/React Router) didn't fix it either — `redux-persist`
tripped the identical `exports is not defined` failure next, confirming
this dependency set has multiple legacy-CJS packages that don't survive
being marked non-external under Vite's dev-mode SSR module runner, even
though production's build handles them fine. Rather than keep
narrowing the list against an unknown number of remaining landmines, the
whole `noExternal` change was reverted — **a working `npm run dev` matters
more than an image-size win**, and this was only caught because the
person running this migration happened to run `npm run dev` themselves
and hit the crash; it should have been re-checked before being reported
as done.

### What actually shipped

Just the `--omit=optional` fix (item 1 above) — safe, independent of any
bundling strategy, doesn't touch how the app runs in dev or prod.

**Result: `server` image 388MB → 350MB** (a 10% cut — smaller than the
reverted attempt's 281MB, but the reverted version doesn't ship). Most of
the remaining 350MB is the `node:20-alpine` base image itself (Node
runtime + yarn) plus the app's real runtime dependencies (react-dom,
redux, lucide-react, etc.), which — confirmed by the revert above — need
to stay as real `node_modules` given this dependency set. `nginx` image
unchanged at 106MB. New total: **456MB**, down from 494MB.

**Re-verified, twice** — once against the (reverted) bundled version, once
against what actually shipped, both against the real backend on a real
Docker network:
- `docker build --target server` / `--target nginx` — both succeed.
- `npm run dev` — starts clean, `/` and `/product/ipsam-corrupti-maio`
  both return `200` with real content over actual HTTP requests (not just
  "no crash on boot").
- `GET /product/ipsam-corrupti-maio` → `200`, JSON-LD unchanged and
  correct: `"price":"305"`, `"availability":"https://schema.org/InStock"`,
  `"mpn":"Sed facilis cillum v"`.
- `GET /product/does-not-exist` → `404`.
- Static asset headers unchanged: `/assets/*.css` →
  `Content-Type: text/css`, `Cache-Control: max-age=31536000, public,
  immutable`; `/branding/logo.svg` → `Content-Type: image/svg+xml`,
  `Cache-Control: max-age=3600`.
- Killed the `app` container: `GET /` → `504` in **5.020s** (measured with
  `time curl`), matching the earlier timing — the `proxy_connect_timeout
  5s` fix from the first verification pass is unaffected by any of this.

### Checkout / Stripe — partially verified, blocked on tenant config

Ran the full flow through real order creation (added the real test product
to cart, filled the Shipping form, submitted) against the real backend —
a real Order was created (`_id: 6a9bf0ba54fa186ac19b9771`, order_number
`00001`) and the flow correctly navigated to `/checkout/payment` with a
real `order_id`/`token`. It could not go further: the tenant's Stripe
secret key was not actually saved in the local dev database
(`tenants.stripe_connection_status: "not_connected"`, despite an attempt to
configure one) — confirmed directly against MongoDB and by calling `POST
/api/v1/payment/create-intent` by hand (`409`, `"This store has not added
its Stripe keys yet"`). The Payment page handled this exactly as designed:
rendered that message with a "Try Again" button, no crash, no console
error. **This means the actual Stripe Elements mount + `confirmPayment()`
+ redirect-to-confirmation path is still unverified** — re-run this once a
tenant has a real Stripe test secret key configured, with card
4242 4242 4242 4242 / 12/34 / 123.

The test Order above was deleted after verification and confirmed gone
(re-queried by `_id` — not found).

### Feed/page consistency (Step 6)

For the real seeded product (`ipsam-corrupti-maio`, price 305, stock_status
`in_stock`, condition `USED`, brand `null`, sku `PHA-000002`, mpn
`Sed facilis cillum v`), the JSON-LD now emits:

```json
{
  "offers": {
    "price": "305",
    "priceCurrency": "AUD",
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/UsedCondition",
    "mpn": "Sed facilis cillum v"
  },
  "sku": "PHA-000002"
}
```
(`brand` correctly omitted — see fix #5.)

Compared directly against pha-dashboard's `google.adapter.js` +
`listing.resolver.js` (the code that builds the real Merchant Center feed):

- **Price**: `listing.resolver.js#resolvePrice` returns `product.price`
  completely unchanged (no cents conversion) before the adapter multiplies
  it into Merchant API's `amountMicros` format — confirms `product.price`
  is already in whole dollars, so `String(product.price)` needs no
  conversion either. Numbers agree (305 in both); the *string format*
  necessarily differs (`"305"` vs. `amountMicros: "305000000"`) because
  they're for two different specs (schema.org vs. Google's Merchant API),
  not because of a bug.
- **Availability**: the adapter's `availability: "in stock"` (lowercase,
  space — Google's Merchant API literal enum) and this page's
  `"https://schema.org/InStock"` (schema.org's required URL format) are
  different strings by design/spec, not a mismatch — Merchant Center
  itself expects each format in its own context. What has to agree is the
  underlying fact (in stock or not); the adapter derives it from a live
  stock-quantity lookup, this page from `stock_status` — both ultimately
  reflect the same stock state for a normally-tracked product. One
  caveat: `stock_control: false` (untracked) products are silently
  *excluded* from the Google feed entirely (`isUntrackedStock` in
  `google.adapter.js`) rather than reported with any availability value —
  for such a product, this storefront page still renders whatever
  `stock_status` says, but there's nothing in the feed to disagree with,
  so no real mismatch is possible either way.
- **mpn**: `listing.resolver.js#resolveIdentifiers` resolves
  `listing.mpn || listing.item_specifics?.mpn || product.mpn` — the exact
  same precedence the backend already pre-resolves into
  `product.display.mpn`, which this page now reads (fix #5). Confirmed
  identical value in the real API response (`"Sed facilis cillum v"` in
  both `product.mpn` and `product.display.mpn`).
- **gtin**: `listing.resolver.js`'s own comment confirms Product has no
  gtin field at all (only a per-listing override, which the storefront's
  curated `ApiMarketplaceListing` type never exposes) — correctly never
  emitted here either.
- **brand**: `resolveIdentifiers`'s `brand = listing.item_specifics?.brand
  || product.brand || null` — never fabricates a value, matching this
  page's fix #5 (omit rather than default to "Generic").

## Not verified (be aware before deploying)

- **Stripe Elements mount → `confirmPayment()` → confirmation page.** See
  "Checkout / Stripe" above — blocked on the tenant's Stripe secret key not
  actually being saved in this local dev environment, not on anything in
  this codebase. Re-run with a real tenant Stripe test key.
- **No flash of light theme, visually.** Verified `<html class="dark">`
  renders server-side and the inline theme script runs before
  `<Meta/>`/`<Links/>`, and confirmed no hydration warning fires for the
  `<html>` tag's class attribute — did not visually confirm in a browser
  with an actual light-mode system/stored preference.
- **Production TLS/domain behavior of `getOrigin()`.** Confirmed
  `X-Forwarded-Proto`/`X-Forwarded-Host` are set by `nginx.conf` and read
  correctly in a local Docker run; did not test behind a real TLS
  terminator/CDN in front of nginx.
- **The `admin.partshubaustralia.com.au` production backend itself** — all
  of the above ran against a local pha-dashboard instance with seeded test
  data, not the real production API.

## For whoever runs this per tenant

- The per-tenant build contract now has **two** required build args, not
  one: `--build-arg VITE_API_URL=<tenant backend>` (unchanged) AND
  `--build-arg VITE_TENANT_SLUG=<tenant's own slug>` (new, required — see
  "Runtime env vars" above). Get the slug wrong and the build still
  succeeds and the container still runs — it just serves a different
  tenant's data. Get it missing and the container refuses to start at all.
  Source both from the same per-tenant deployment config; never hand-type
  or copy from another tenant's.
- New: the image now runs as **two** containers (`app` + `storefront`)
  instead of one — both come from the same `Dockerfile` via `--target`, so
  `docker compose build` still builds everything from this one repo/branch.
  `pha-net` and the `pha-storefront` hostname other infrastructure depends
  on are unchanged.
- New: set `NODE_ENV=production` on the `app` service (already in
  `Dockerfile`'s `server` stage — don't override it to something else in
  compose/orchestration).
- If a tenant's SSR deploy has problems, roll back per "How to roll back"
  above rather than trying to patch the new Dockerfile back to a static
  build.
