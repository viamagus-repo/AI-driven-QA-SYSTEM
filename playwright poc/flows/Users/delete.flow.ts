import { Page, expect } from "@playwright/test";
import { BaseTestCase } from "../../core/data/authTypes";
import { getTestData } from "../../core/data/testData";

export async function DeleteUser(page: Page, testCase?: BaseTestCase) {
  const input = getTestData(testCase).input as Record<string, string>;

  await page.getByRole("textbox", { name: "Quick search" }).fill(input.searchName);
  await page.getByRole("textbox", { name: "Quick search" }).press("Enter");
  await page.waitForTimeout(2000);

  const trashIcons = page.locator(".icons.icon-trash");

  if ((await trashIcons.count()) === 1) {
    await trashIcons.click();
  } else if ((await trashIcons.count()) > 1) {
    await trashIcons.first().click();
  } else {
    throw new Error("Trash icon not found");
  }
  await page.getByRole("button", { name: "Yes" }).click();
  await page.waitForTimeout(2000);

  await expect(page.getByText("User has been successfully")).toBeVisible();
}