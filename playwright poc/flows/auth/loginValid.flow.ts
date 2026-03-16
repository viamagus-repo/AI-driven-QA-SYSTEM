import { Page, expect } from "@playwright/test";
import { AuthTestCase } from "../../core/data/authTypes";
import { authLoginInputSchema } from "../../core/data/flowInputSchemas";
import { getValidatedInput } from "../../core/data/testData";

export async function loginValid(page: Page, testCase?: AuthTestCase) {
  const input = getValidatedInput(testCase, authLoginInputSchema);

  await page.getByRole("button", { name: "I ACKNOWLEDGE" }).click();
  await page.getByRole("textbox", { name: "Email" }).click();
  await page.getByRole("textbox", { name: "Email" }).fill(input.email);
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill(input.password);
  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForTimeout(2000);
  await expect(page).toHaveURL(/staff\/appointments/);
}
