import { Locator, Page } from "@playwright/test";
import { BasePage } from "../BasePage";

export class AuthPage extends BasePage {
  readonly locators: Record<string, Locator>;

  constructor(page: Page) {
    super(page);
    this.locators = {
      acknowledgeButton: page.getByRole("button", { name: "I ACKNOWLEDGE" }),
      emailInput: page.locator('input[type="email"]'),
      passwordInput: page.locator('input[type="password"]'),
      submitButton: page.getByRole("button", { name: /login|sign in/i }),
      profileBadge: page.getByText("Vi", { exact: true }),
      logoutIcon: page.locator(".icons.icon-logout"),
      warningDialog: page.getByRole("dialog", { name: "Warning" }),
    };
  }

  async waitForModuleReady(): Promise<void> {
    await this.waitForIdle();
  }

  async acknowledgeIfPresent(): Promise<void> {
    if (await this.locators.acknowledgeButton.count()) {
      await this.locators.acknowledgeButton.click();
    }
  }

  async fillEmail(value: string): Promise<void> {
    await this.locators.emailInput.click();
    await this.locators.emailInput.fill(value);
  }

  async fillPassword(value: string): Promise<void> {
    await this.locators.passwordInput.click();
    await this.locators.passwordInput.fill(value);
  }

  async submit(): Promise<void> {
    await this.locators.submitButton.click();
  }

  async openProfileMenu(): Promise<void> {
    await this.locators.profileBadge.click();
  }

  async clickLogout(): Promise<void> {
    await this.locators.logoutIcon.click();
  }
}
