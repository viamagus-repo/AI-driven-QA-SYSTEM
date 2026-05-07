import { Locator, Page, expect } from "@playwright/test";

export abstract class BasePage {
  protected constructor(protected readonly page: Page) {}

  protected locator(selector: string): Locator {
    return this.page.locator(selector);
  }

  protected byRole(role: Parameters<Page["getByRole"]>[0], options?: Parameters<Page["getByRole"]>[1]): Locator {
    return this.page.getByRole(role, options);
  }

  async waitForUrlContains(pathFragment: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(pathFragment));
  }

  async waitForIdle(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
  }

  async click(locator: Locator): Promise<void> {
    await locator.click();
  }

  async fill(locator: Locator, value: string): Promise<void> {
    await locator.fill(value);
  }
}

