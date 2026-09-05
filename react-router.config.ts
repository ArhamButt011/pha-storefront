import type { Config } from "@react-router/dev/config";

export default {
  // Server-render by default — this is what fixes Google Merchant Center's
  // crawler seeing an empty <div id="root"> on /product/<slug>. RR7 v7's ssr
  // flag is app-wide (there is no per-route ssr:false); /cart and the
  // /checkout/* routes stay effectively client-driven by simply not
  // exporting a `loader` and keeping all localStorage/Stripe access inside
  // effects/handlers (see MIGRATION.md).
  ssr: true,
  // Keep the existing `src/` layout instead of moving everything under the
  // framework's default `app/` directory — avoids rewriting ~150 existing
  // imports/paths for a purely cosmetic rename.
  appDirectory: "src",
} satisfies Config;
