import { Page } from "@playwright/test";
import { BaseTestCase } from "../../core/data/authTypes";
import { getTestData } from "../../core/data/testData";

export async function SearchPhycisian(page: Page, testCase?: BaseTestCase) {
  const input = getTestData(testCase).input as Record<string, string>;
  await page.getByRole("link", { name: "physicians" }).click();
  await page.getByRole("textbox", { name: "Quick search" }).click();

  await page
    .getByRole("textbox", { name: "Quick search" })
    .fill(input.searchName);
  await page.getByRole("textbox", { name: "Quick search" }).press("Enter");
  await page.getByText("Lokid").click();
}
