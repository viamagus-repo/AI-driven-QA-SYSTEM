import { Page, expect } from "@playwright/test";
import { AuthTestCase } from "../../core/data/authTypes";
import { loginValid } from "./loginValid.flow";

export async function loginLogout(page: Page, testCase?: AuthTestCase) {
  await loginValid(page, testCase);

  await page.getByText("Vi", { exact: true }).click();
  await page.locator(".icons.icon-logout").click();
  await expect(page.getByRole("dialog", { name: "Warning" })).toBeVisible();
  await page.getByRole("dialog", { name: "Warning" }).click();
}
