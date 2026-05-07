import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tools/__tests__/**/*.spec.ts"],
  },
});
