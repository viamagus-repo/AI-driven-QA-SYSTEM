import { expect, Page } from "@playwright/test";
import { BaseTestCase } from "../../core/data/authTypes";
import { authEmailFieldInputSchema } from "../../core/data/flowInputSchemas";
import { getValidatedInput } from "../../core/data/testData";
import { AuthPage } from "../../core/pages/modules/auth.page";

export default async function flow(
  page: Page,
  testCase?: BaseTestCase,
): Promise<void> {
  const input = getValidatedInput(testCase, authEmailFieldInputSchema);
  const modulePage = new AuthPage(page);

  let label = await page.getByTitle("Email").locator("label");
  await expect(label).toBeVisible();
  await page.getByTestId("AccountCircleIcon").locator("path");
  await expect(
    page.getByTestId("AccountCircleIcon").locator("path"),
  ).toBeVisible();
  await page.getByPlaceholder("Email");
  await expect(page.getByPlaceholder("Email")).toBeVisible();
  await expect(page.getByPlaceholder("Email")).toBeEditable();
}
