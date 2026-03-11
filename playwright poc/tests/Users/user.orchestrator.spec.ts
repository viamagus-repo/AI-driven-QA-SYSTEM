import { test } from "@playwright/test";
import { AppNavigator, AppPage } from "../../core/navigation/AppNavigator";
import { loadAllTestCases } from "../../core/data/testCaseLoader";
import { logError, logInfo } from "../../core/utils/logger";
import { getFlowHandler } from "../../core/flows/flowResolver";

function buildTags(tags: string[]): string {
  return tags.map((tag) => `@${tag}`).join(" ");
}

const userCases = loadAllTestCases("user");

test.describe("User Module", () => {
  test.beforeAll(() => {
    logInfo("USER-ORCH", `Loaded ${userCases.length} user testcase(s)`);
  });

  test.beforeEach(async ({ page }) => {
    const navigator = new AppNavigator(page);
    await navigator.goTo(AppPage.USERS);
  });

  for (const testCase of userCases) {
    const tags = buildTags(testCase.tags || []);
    const testTitle = `${testCase.id} ${testCase.description} ${tags}`.trim();

    test(testTitle, async ({ page }, testInfo) => {
      logInfo(
        "USER-ORCH",
        `START ${testCase.id} | flowCode=${testCase.flowCode} | tags=${(testCase.tags || []).join(",")}`,
      );
      const handler = getFlowHandler(testCase.module, testCase.flowCode);
      try {
        await handler(page, testCase);
        logInfo("USER-ORCH", `PASS ${testCase.id} | status=${testInfo.status}`);
      } catch (error) {
        logError(
          "USER-ORCH",
          `FAIL ${testCase.id} | ${(error as Error).message}`,
        );
        throw error;
      }
    });
  }
});
