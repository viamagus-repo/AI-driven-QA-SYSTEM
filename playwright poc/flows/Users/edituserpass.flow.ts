import { Page, expect } from "@playwright/test";
import { BaseTestCase } from "../../core/data/authTypes";
import { getTestData } from "../../core/data/testData";

export async function EditUserPassword(page: Page, testCase?: BaseTestCase) {
  const input = getTestData(testCase).input as Record<string, string>;

  await page.getByRole("textbox", { name: "Quick search" }).fill(input.searchName);
  await page.getByRole("textbox", { name: "Quick search" }).press("Enter");
  await page.waitForTimeout(2000);
  await page.getByText(input.searchName).click();
  await page.waitForTimeout(2000);
  await page.getByRole("link").nth(1).click();
  await page.getByText("CHANGE PASSWORD").click();

  await page.locator("#child").getByRole("textbox").fill(input.newPassword);
  await page.getByRole("link", { name: "Submit" }).click();

  await expect(page.getByText("Password has been")).toBeVisible();
}