import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  // NOTE: @react-router/dev/vite's reactRouter() plugin includes the React
  // JSX/fast-refresh transform itself — @vitejs/plugin-react is no longer
  // needed alongside it (and conflicts if both are registered).
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  // NOTE: tried ssr.noExternal (both `true` and an explicit package list)
  // to bundle app dependencies into build/server/index.js and shrink the
  // Docker runtime image — reverted. Confirmed by actually running `npm
  // run dev`: several dependencies here (react/jsx-dev-runtime.js,
  // redux-persist's storage module, likely others) are old-style CJS that
  // break with "module"/"exports is not defined" when Vite's dev-mode SSR
  // module runner processes them as non-external — production's
  // Rollup-based build has robust-enough CJS interop to paper over this
  // (confirmed working), but dev mode doesn't, and this is a dependency
  // set with too many legacy-CJS packages to safely cherry-pick around.
  // A working `npm run dev` matters more than the image-size win — see
  // MIGRATION.md's "Shrinking the server image" for what was kept instead
  // (Dockerfile's `--omit=optional`, which doesn't touch bundling at all).
});
