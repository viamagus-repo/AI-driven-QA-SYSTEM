import { Page, expect } from "@playwright/test";
import { AuthTestCase } from "../../core/data/authTypes";
import { getTestData } from "../../core/data/testData";

export async function loginInvalidUsername(page: Page, testCase?: AuthTestCase) {
  const testData = getTestData(testCase);
  const input = testData.input as Record<string, string>;
  const expectedData = (testData.expectedData || {}) as Record<string, string>;

  await page.getByRole("button", { name: "I ACKNOWLEDGE" }).click();
  await page.getByRole("textbox", { name: "Email" }).click();
  await page.getByRole("textbox", { name: "Email" }).fill(input.email);
  await page.getByRole("textbox", { name: "Email" }).press("Enter");
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill(input.password);
  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForTimeout(2000);
  await expect(page.getByText(expectedData.message || "Invalid credentials")).toBeVisible();
}