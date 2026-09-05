# SSR deployment (React Router v7 framework mode). Two runnable images come
# out of this file:
#   - `server` — the Node process that renders pages (loaders, meta, JSON-LD)
#   - `nginx`  — TLS/static-asset front door, proxying everything else to `server`
# docker-compose.yml builds both and wires them together. To roll back to
# the pre-SSR static SPA, see MIGRATION.md — that build no longer exists in
# this Dockerfile since it needs the pre-migration source tree, not just an
# old Dockerfile stage.
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Baked in at image-build time, not container-start time — this is a
# per-tenant image, so each tenant's build points at its own backend.
# Unchanged from the pre-SSR Dockerfile: react-router build's SSR bundle
# statically inlines import.meta.env.VITE_* exactly like the client bundle
# does, so the server (running inside this same built image) reads back the
# same value the client was built with — no runtime env plumbing needed.
ARG VITE_API_URL=https://admin.partshubaustralia.com.au/api/v1
ENV VITE_API_URL=$VITE_API_URL
# REQUIRED, not optional — see src/lib/api/client.ts and MIGRATION.md. No
# default here on purpose: every guest backend request needs this tenant's
# own slug (there is no Host-based fallback). Building without it still
# succeeds (Vite doesn't execute app code at build time) but client.ts
# throws at module load, so the resulting image crashes immediately on
# container startup and on first page load instead of silently serving
# broken (or, with the wrong-but-present value, WRONG TENANT'S) data.
ARG VITE_TENANT_SLUG
ENV VITE_TENANT_SLUG=$VITE_TENANT_SLUG
RUN npm run build

FROM node:20-alpine AS server
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
# --omit=optional (on top of the existing --omit=dev): a real production
# dependency here (@react-router/serve, via @react-router/express)
# declares `typescript` as a peerOptional dependency, which npm installs
# by default — a 22.9MB compiler this runtime image never uses. Confirmed
# via `npm explain typescript`. (Also tried bundling the app's own
# dependencies out of this image entirely via vite.config.ts's
# ssr.noExternal, to drop lucide-react etc. too — reverted after it broke
# `npm run dev`; see that file's own comment and MIGRATION.md's "Shrinking
# the server image".)
RUN npm ci --omit=dev --omit=optional
COPY --from=builder /app/build ./build
EXPOSE 3000
CMD ["npx", "react-router-serve", "./build/server/index.js"]

FROM nginx:alpine AS nginx
COPY --from=builder /app/build/client /usr/share/nginx/html/client
COPY nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
