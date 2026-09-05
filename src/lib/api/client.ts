import axios from "axios";

// VERIFICATION FINDING (confirmed by reading pha-dashboard's backend, not
// assumed): every guest product/category/order/etc. route requires
// X-Tenant-Slug — see server/src/middlewares/tenant.js. Checked whether
// production instead resolves the tenant from the Host header (it would
// explain "the old SPA never sent this and still works") — it does not.
// Across the entire backend, `req.tenant` is assigned in exactly three
// places: a staff JWT (admin dashboard), this X-Tenant-Slug header (or a
// tenant_slug in body/query), or an order id (the shared cross-tenant
// /pay/:orderId page only). There is no Host/Domain-based path — the
// Domain model that exists is wired only into CORS origin checking
// (app.js), confirmed by its own header comment and by grepping every
// `req.tenant =` assignment in the codebase. This is unchanged on every
// branch that has multi-tenancy at all (origin/dev, where X-Tenant-Slug
// support was deliberately added via PR #12 "allow X-tenant-slug", and
// marketplace-integration, which branches from dev).
//
// So this is a required, per-tenant build value — not optional or
// dev-only — and it is exactly as sensitive as VITE_API_URL, arguably more
// so: since it's the *only* tenant signal, a build shipped with the WRONG
// (but syntactically valid) slug does not error. It successfully and
// silently serves a *different* tenant's entire catalog and lets checkouts
// write orders under the wrong tenant — a data leak, not a 500. Nothing on
// the storefront side can detect "right format, wrong tenant" (it has no
// independent source of truth to check the slug against); the only half
// of this risk that's catchable is "missing entirely", so this fails loud
// and immediately for that case instead of the previous silent
// send-no-header behavior. See MIGRATION.md for the full writeup and the
// deployment-process implication (source this from the same per-tenant
// config as VITE_API_URL, never guess or copy-paste across tenants).
const tenantSlug = import.meta.env.VITE_TENANT_SLUG;
if (!tenantSlug) {
  throw new Error(
    "VITE_TENANT_SLUG is not set. Every guest request requires X-Tenant-Slug " +
      "(see server/src/middlewares/tenant.js in pha-dashboard) — there is no " +
      "Host-based fallback, so this is a required per-tenant build arg, not optional.",
  );
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:7000/api/v1",
  headers: {
    "Content-Type": "application/json",
    "X-Tenant-Slug": tenantSlug,
  },
  timeout: 15_000,
});

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const message: string =
      err.response?.data?.message ?? err.message ?? "Something went wrong";
    return Promise.reject(new ApiError(message, err.response?.status));
  },
);