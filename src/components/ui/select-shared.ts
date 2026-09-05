import type { CSSObjectWithLabel } from "react-select";

// Shared react-select config for <Select> and <MultiSelect> — every field
// dropdown in the app needs to escape overflow-clipping ancestors (e.g. the
// search modal's scrollable body) and survive being rendered inside a Radix
// Dialog. Both fixes here took real debugging to track down; centralizing
// them means fixing it once instead of risking one component getting the
// fix and the other silently regressing.
export const SELECT_MENU_PORTAL_PROPS = {
  // Portals the menu to <body> instead of rendering it inline — without
  // this, a Select inside any overflow:auto/hidden container gets its
  // dropdown silently clipped, and menuPlacement="auto" can't correctly
  // measure space against the real viewport since it's boxed in by the
  // scrollable ancestor instead.
  menuPortalTarget: typeof document !== "undefined" ? document.body : undefined,
  menuPosition: "fixed" as const,
  // react-select computes the portal wrapper's z-index via this `styles`
  // escape hatch, which always wins over a Tailwind class in `classNames`
  // (an inline style beats any stylesheet rule regardless of specificity) —
  // needs to clear the Modal overlay/content's z-50.
  //
  // pointerEvents: "auto" is equally load-bearing and easy to miss: Radix
  // Dialog sets `pointer-events: none` on <body> while a modal is open (its
  // scroll-lock mechanism) and only re-enables `auto` on the Dialog's own
  // content element. This portal is a sibling of that content (not a
  // descendant), so it inherits `none` from <body> and becomes permanently
  // unclickable — it still renders and looks interactive, but every click
  // silently falls through to whatever's behind it.
  styles: {
    menuPortal: (base: CSSObjectWithLabel): CSSObjectWithLabel => ({
      ...base,
      zIndex: 100,
      pointerEvents: "auto" as const,
    }),
  },
};
