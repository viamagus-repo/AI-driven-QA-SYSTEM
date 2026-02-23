import { chromium } from "@playwright/test";
import * as dotenv from "dotenv";
import * as fs from "fs";
import { loginValid } from "../../flows/auth/loginValid.flow";
import { AppNavigator, AppPage } from "../../core/navigation/AppNavigator";
import { loadTestCase } from "../../core/data/testCaseLoader";
import { AuthTestCase } from "../../core/data/authTypes";

dotenv.config({ quiet: true });

type StorageState = {
  cookies: Array<Record<string, unknown>>;
  origins: Array<{
    origin: string;
    localStorage: Array<{ name: string; value: string }>;
  }>;
};

const AUTH_LOCAL_STORAGE_KEYS = new Set(["auth", "O_AUTH_KEY"]);

function sanitizeStorageState(state: StorageState): StorageState {
  return {
    cookies: state.cookies,
    origins: state.origins.map((originState) => ({
      origin: originState.origin,
      // Remove app cache keys (like "global") to force fresh backend hydration.
      localStorage: originState.localStorage.filter((entry) =>
        AUTH_LOCAL_STORAGE_KEYS.has(entry.name)
      ),
    })),
  };
}

export default async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    baseURL: process.env.BASE_URL || "https://web-tmp.ognomy.com",
  });

  const navigator = new AppNavigator(page);

  await navigator.goTo(AppPage.LOGIN);

  const loginSetupCase = loadTestCase("auth", "TC-AUTH-LOGIN-TC01") as AuthTestCase;
  await loginValid(page, loginSetupCase);

  await navigator.goTo(AppPage.HOME);

  const rawState = (await page.context().storageState()) as StorageState;
  const cleanState = sanitizeStorageState(rawState);

  if (!fs.existsSync("storage")) {
    fs.mkdirSync("storage", { recursive: true });
  }

  fs.writeFileSync("storage/auth.json", JSON.stringify(cleanState, null, 2), {
    encoding: "utf8",
    flag: "w",
  });

  await browser.close();
};