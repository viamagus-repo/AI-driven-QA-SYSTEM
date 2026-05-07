import { test } from "@playwright/test";
import { AppNavigator, AppPage } from "../../core/navigation/AppNavigator";
import { loadAllTestCases } from "../../core/data/testCaseLoader";
import { getFlowHandler } from "../../core/flows/flowResolver";
import { logError, logInfo } from "../../core/utils/logger";

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
        `START ${testCase.id} | flowCode=${testCase.flowCode} | tags=${(testCase.tags || []).join(",")}`
      );

      const nav = new AppNavigator(page);
      await nav.goTo(AppPage.LOGIN);

      const handler = getFlowHandler(testCase.module, testCase.flowCode);

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
