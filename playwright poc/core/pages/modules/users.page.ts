import { Locator, Page } from "@playwright/test";
import { BasePage } from "../BasePage";

export class UsersPage extends BasePage {
  readonly locators: Record<string, Locator>;

  constructor(page: Page) {
    super(page);
    this.locators = {
      // Add stable module-specific locators here.
      pageTitle: page.locator("h1"),
    };
  }

  async waitForModuleReady(): Promise<void> {
    await this.waitForIdle();
  }
}
