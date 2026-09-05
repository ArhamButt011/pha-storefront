# Project conventions

This repo is the public storefront (React Router / Vite, FE only — no
backend here; it talks to the `pha-dashboard` API). Follow these
conventions on **every** change, not just when reminded.

## Reuse existing components before writing raw HTML

Check `src/components/ui/` (`button.tsx`, `modal.tsx`, `input.tsx`,
`icon-input.tsx`, `select.tsx`, `checkbox.tsx`, `pagination.tsx`,
`quantity-stepper.tsx`, `star-rating.tsx`, ...) and the relevant feature
folder under `src/components/` (`product/`, `products/`, `cart/`,
`checkout/`, `categories/`, `bundles/`, `common/`, `layout/`) for an
existing component that already does the job before writing a new one from
raw HTML/Tailwind. `src/sections/` holds page-level composed sections built
from those components — check there too for page-section-shaped reuse.

## Use the app's own design tokens, not arbitrary Tailwind values

- **Colors** are CSS vars defined in `src/index.css` (`@theme` block +
  `:root`/`.dark`): `bg`, `bg-2`, `bg-3`, `fg`, `fg-muted`, `accent`,
  `accent-fg`, `border`, `ring`, `danger`, `danger-fg`, `ok`, `ok-fg` —
  used via Tailwind classes like `bg-bg`, `text-fg`, `text-fg-muted`,
  `bg-accent`, `border-border`, `text-danger`, etc. Both light and dark
  values are already defined per token — don't hardcode a hex color or an
  arbitrary Tailwind palette color (`text-gray-500`, `bg-orange-600`, ...)
  when a token already covers it, and don't hand-roll a dark-mode variant
  that a token would give you for free.
- **Typography**: two font families only — `font-sans` (Inter, body/UI
  text) and `font-display` (Orbitron, used for headings/brand-forward
  copy — see the `.font-display` utility and how it's applied around the
  codebase). There is no separate custom type-scale beyond Tailwind's own
  `text-*` size utilities — use those directly rather than inventing new
  font-size values.
- Reuse the existing motion/utility classes already defined in
  `src/index.css` where they fit (`.reveal`/`.stagger` for scroll-reveal,
  `.float`/`.float-delay`, `.glow-orange`, `.shine`, `.pulse-ring`,
  `.scrollbar-hide`) instead of writing new bespoke animation CSS for the
  same effect.

## A new component gets its own file, in the relevant feature folder

Place it under the matching subfolder of `src/components/` (e.g. a new
product-detail component goes in `src/components/product/`, a new listing
component in `src/components/products/`, a new cart component in
`src/components/cart/`) rather than inlining it into a page/route file.
Match this repo's existing filename casing per folder — `src/components/ui/`
uses lowercase-hyphenated filenames (`button.tsx`, `icon-input.tsx`), while
feature folders under `src/components/` use PascalCase (`ProductCard.tsx`,
`ImageGallery.tsx`, `FitmentBadge.tsx`) — follow whichever convention the
folder you're adding to already uses.

## Where types/constants go

- **Domain/API model interfaces** go in `src/types/*.ts` (see
  `apiProduct.ts`, `category.ts`) — this is for shapes that mirror backend
  API responses/domain models, not component props.
- **Constant value sets / option lists / enums** used across the app go in
  `src/constants/*.ts` (see `cart.ts`, `checkout.ts`, `product.ts`,
  `shopFilters.ts`, `stock.ts`) — this repo keeps constants in their own
  top-level folder, separate from `src/types/`; don't put a constant object
  inside a types file or vice versa.
- A component's own local `Props` interface, and small constants used only
  by that one component, stay inline in the component's file.
- `src/data/` is for static/mock data fixtures specifically — don't put
  real domain types or app-wide constants there.

## General

Follow industry-standard React/TypeScript/React-Router structure otherwise —
keep the existing folder shape (`components/`, `sections/`, `pages/`,
`hooks/`, `context/`, `store/`, `lib/`, `utils/`, `constants/`, `types/`,
`data/`) and naming conventions rather than introducing a new pattern or a
new top-level folder for one feature.

## Before finishing any change

Reusable component used (not raw HTML)? Design tokens used (not arbitrary
colors, no hand-rolled dark-mode override)? New component is its own file,
in the right feature folder, matching that folder's filename casing?
Types/constants placed per the rule above (`types/` for API/domain models,
`constants/` for value sets, inline for component-local props)?
