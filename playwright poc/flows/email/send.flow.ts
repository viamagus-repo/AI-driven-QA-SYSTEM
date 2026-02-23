import { Page, expect } from "@playwright/test";
import { BaseTestCase } from "../../core/data/authTypes";
import { getTestData } from "../../core/data/testData";

export async function sendemail(page: Page, testCase?: BaseTestCase) {
  const input = getTestData(testCase).input as Record<string, string>;

  await page.getByRole("link", { name: "New Message" }).click();

  const toBox = page.getByRole("textbox").first();
  await toBox.click();
  await toBox.fill(input.recipientSearch);
  await toBox.press("Enter");
  await page
    .getByRole("link", { name: new RegExp(input.recipientSearch, "i") })
    .first()
    .click();

  const ccBox = page.getByRole("textbox").nth(2);
  await ccBox.click();
  await ccBox.fill(input.ccSearch);
  await ccBox.press("Enter");
  await page
    .getByRole("link", { name: new RegExp(input.ccSearch, "i") })
    .first()
    .click();

  await page.locator(".message-new-panel > div:nth-child(4)").click();
  await page.getByRole("textbox", { name: "Enter Subject..." }).fill(input.subject);
  await page.locator(".ql-editor").click();
  await page.locator(".ql-editor").fill(input.body);
  await page.getByRole("link", { name: "Send" }).click();
  await expect(page.getByRole("alert")).toBeVisible();
}
