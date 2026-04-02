import { expect, Page } from "@playwright/test";
import { BaseTestCase } from "../../core/data/authTypes";
import { usersDeleteInputSchema } from "../../core/data/flowInputSchemas";
import { getValidatedInput } from "../../core/data/testData";
import { UsersPage } from "../../core/pages/modules/users.page";

export default async function flow(
  page: Page,
  testCase?: BaseTestCase,
): Promise<void> {
  const input = getValidatedInput(testCase, usersDeleteInputSchema);
  const modulePage = new UsersPage(page);

  await page.getByRole("textbox", { name: "Quick search" }).click();
  await page
    .getByRole("textbox", { name: "Quick search" })
    .fill(input.firstName);
  await page.getByRole("textbox", { name: "Quick search" }).press("Enter");
  await page.getByRole("link").filter({ hasText: /^$/ }).nth(5).click();
  await page.getByRole("button", { name: "Yes" }).click();
  await page.getByText("User has been successfully").click();
}
