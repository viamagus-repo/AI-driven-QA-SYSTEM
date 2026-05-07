import { test } from "@playwright/test";
import { loadAllTestCases } from "../../core/data/testCaseLoader";
import { getFlowHandler } from "../../core/flows/flowResolver";
import { AppNavigator, AppPage } from "../../core/navigation/AppNavigator";
import { logError, logInfo } from "../../core/utils/logger";

function buildTags(tags: string[]): string {
  return tags.map((tag) => `@${tag}`).join(" ");
}

const moduleCases = loadAllTestCases("users");

test.describe("users Module", () => {
  test.beforeAll(() => {
    logInfo("USERS-ORCH", `Loaded ${moduleCases.length} users testcase(s)`);
  });

  for (const testCase of moduleCases) {
    const tags = buildTags(testCase.tags || []);
    const testTitle = `${testCase.id} ${testCase.description} ${tags}`.trim();

    test(testTitle, async ({ page }, testInfo) => {
      logInfo(
        "USERS-ORCH",
        `START ${testCase.id} | flowCode=${testCase.flowCode} | tags=${(testCase.tags || []).join(",")}`
      );

      const nav = new AppNavigator(page);
      await nav.goTo(AppPage.USERS);

      const handler = getFlowHandler(testCase.module, testCase.flowCode);
      try {
        await handler(page, testCase);
        logInfo("USERS-ORCH", `PASS ${testCase.id} | status=${testInfo.status}`);
      } catch (error) {
        logError("USERS-ORCH", `FAIL ${testCase.id} | ${(error as Error).message}`);
        throw error;
      }
    });
  }
});
