/// <reference types="vitest/config" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isLocalPreview = (globalThis as any).process?.env?.VITE_LOCAL_PREVIEW === 'true';

export default defineConfig(({ command }) => ({
  base: isLocalPreview
    ? '/'
    : (command === 'build' ? '/Kaikiei-Group-Site-Codex/' : '/'),
  plugins: [react()],
  server: {
    allowedHosts: true,
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    exclude: ["**/._*"],
  },
}));
