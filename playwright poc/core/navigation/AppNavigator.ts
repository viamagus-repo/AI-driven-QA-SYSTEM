import { Page } from "@playwright/test";

export enum AppPage {
  HOME = "home",
  USERS = "users",
  EMAILS = "emails",
  LOGIN = "login",
}

const ROUTES: Record<AppPage, string> = {
  [AppPage.LOGIN]: "/",
  [AppPage.HOME]: "/staff/appointments",
  [AppPage.USERS]: "/staff/users",
  [AppPage.EMAILS]: "/staff/messages/inboxList",
};

const pagesWithFreshBootInit = new WeakSet<Page>();

async function ensureFreshBootInitScript(page: Page): Promise<void> {
  if (pagesWithFreshBootInit.has(page)) {
    return;
  }

  await page.addInitScript(() => {
    // Keep auth keys only; drop persisted app cache keys to avoid stale UI hydration.
    const auth = window.localStorage.getItem("auth");
    const oAuthKey = window.localStorage.getItem("O_AUTH_KEY");
    window.localStorage.clear();
    if (auth) window.localStorage.setItem("auth", auth);
    if (oAuthKey) window.localStorage.setItem("O_AUTH_KEY", oAuthKey);
  });

  pagesWithFreshBootInit.add(page);
}

export class AppNavigator {
  constructor(private readonly page: Page) {}

  async goTo(target: AppPage) {
    const route = ROUTES[target];

    if (!route) {
      throw new Error(`Route not defined for page: ${target}`);
    }

    await ensureFreshBootInitScript(this.page);
    await this.page.goto(route);
    await this.page.waitForLoadState("networkidle");
  }
}