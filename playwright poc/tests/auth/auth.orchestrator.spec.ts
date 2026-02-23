import { test } from "@playwright/test";
import { AppNavigator, AppPage } from "../../core/navigation/AppNavigator";
import { AuthFlowKey, AuthTestCase } from "../../core/data/authTypes";
import { loadAllTestCases } from "../../core/data/testCaseLoader";
import { loginValid } from "../../flows/auth/loginValid.flow";
import { loginInvalidUsername } from "../../flows/auth/loginInvalidUsername.flow";
import { loginInvalidPassword } from "../../flows/auth/loginInvalidPassword.flow";
import { loginLogout } from "../../flows/auth/loginLogout.flow";
import { logError, logInfo } from "../../core/utils/logger";

const flowHandlers: Record<
  AuthFlowKey,
  (page: Parameters<typeof loginValid>[0], testCase: AuthTestCase) => Promise<void>
> = {
  loginValid,
  loginInvalidUsername,
  loginInvalidPassword,
  loginLogout,
};

function buildTags(tags: string[]): string {
  return tags.map((tag) => `@${tag}`).join(" ");
}

const authCases = loadAllTestCases("auth");

test.describe("Auth Module", () => {
  test.beforeAll(() => {
    logInfo("AUTH-ORCH", `Loaded ${authCases.length} auth testcase(s)`);
  });

  for (const testCase of authCases) {
    const tags = buildTags(testCase.tags || []);
    const testTitle = `${testCase.id} ${testCase.description} ${tags}`.trim();

    test(testTitle, async ({ page }, testInfo) => {
      logInfo(
        "AUTH-ORCH",
        `START ${testCase.id} | flowKey=${testCase.flowKey} | tags=${(testCase.tags || []).join(",")}`
      );

      const nav = new AppNavigator(page);
      await nav.goTo(AppPage.LOGIN);

      const handler = flowHandlers[testCase.flowKey];
      if (!handler) {
        throw new Error(
          `Unknown flowKey '${testCase.flowKey}' for testcase '${testCase.id}'`
        );
      }

      try {
        await handler(page, testCase);
        logInfo("AUTH-ORCH", `PASS ${testCase.id} | status=${testInfo.status}`);
      } catch (error) {
        logError(
          "AUTH-ORCH",
          `FAIL ${testCase.id} | ${(error as Error).message}`
        );
        throw error;
      }
    });
  }
});
