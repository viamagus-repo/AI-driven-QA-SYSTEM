import { Page, expect } from "@playwright/test";
import { BaseTestCase } from "../../core/data/authTypes";
import { getTestData } from "../../core/data/testData";

export async function CreateUser(page: Page, testCase?: BaseTestCase) {
  const input = getTestData(testCase).input as Record<string, string>;

  await page.getByRole("textbox", { name: "First Name" }).fill(input.firstName);
  await page.getByRole("textbox", { name: "Last Name" }).fill(input.lastName);

  await page.getByRole("button", { name: "Choose date" }).click();
  await page.getByRole("button", { name: "calendar view is open, switch" }).click();
  await page.locator("div").filter({ hasText: new RegExp(`^${input.dobYear}$`) }).click();
  await page.getByRole("radio", { name: input.dobMonth }).click();
  await page.getByRole("gridcell", { name: input.dobDay }).click();

  await page.getByRole("textbox", { name: "User Email" }).fill(input.email);
  await page.getByRole("textbox", { name: "Reason for Visit" }).fill(input.reason);
  await page.getByRole("textbox", { name: "Phone" }).fill(input.phone);

  await page.getByRole("combobox", { name: "State" }).fill(input.state);
  await page.getByRole("option", { name: input.state }).click();

  await page.getByRole("button", { name: "Submit" }).click();
  await page.waitForTimeout(2000);
  const userCell = page.getByRole("cell", {
    name: `${input.firstName} ${input.lastName}`,
  });

  const count = await userCell.count();

  if (count === 1) {
    await expect(userCell).toBeVisible();
  } else if (count > 1) {
    await expect(userCell.first()).toBeVisible();
  } else {
    throw new Error(`User cell not found for ${input.firstName} ${input.lastName}`);
  }
}