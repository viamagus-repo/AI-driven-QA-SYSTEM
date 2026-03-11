import { defineConfig, devices } from "@playwright/test";
import * as dotenv from "dotenv";

dotenv.config({ quiet: true });

export default defineConfig({
  testDir: "./tests",

  fullyParallel: false,
  workers: 1,

  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: "html",

  use: {
    baseURL: process.env.BASE_URL || "https://web-tmp.ognomy.com",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    headless: false,
    serviceWorkers: "block",
    ...devices["Desktop Chrome"],
  },

  projects: [
    {
      name: "auth-setup",
      testMatch: /tests\/auth\/auth\.setup\.spec\.ts/,
      use: {
        storageState: undefined,
        headless: true,
      },
    },
    {
      name: "auth",
      testMatch: /tests\/auth\/auth\.orchestrator\.spec\.ts/,
      use: {
        storageState: undefined,
      },
    },
    {
      name: "users",
      dependencies: ["auth-setup"],
      testDir: "./tests/Users",
      use: {
        storageState: "storage/auth.json",
      },
    },
    {
      name: "emails",
      dependencies: ["auth-setup"],
      testDir: "./tests/emails",
      use: {
        storageState: "storage/auth.json",
      },
    },
    {
      name: "billing",
      dependencies: ["auth-setup"],
      testDir: "./tests/billing",
      use: {
        storageState: "storage/auth.json",
      },
    },
  ],
});
