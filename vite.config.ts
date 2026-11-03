import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

// RECONCILE_IMPL=original runs the tests against the code as it was given (used by `npm run check`).
const original = process.env.RECONCILE_IMPL === "original";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: original
      ? [{ find: /^(?:\.\.?\/)+src\/reconcile(?:\.ts)?$/, replacement: fileURLToPath(new URL("./check/original.ts", import.meta.url)) }]
      : [],
  },
  test: {
    environment: "jsdom",
    include: ["tests/**/*.test.{ts,tsx}"],
  },
});
