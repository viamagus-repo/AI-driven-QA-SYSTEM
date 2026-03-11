import { test } from "@playwright/test";
import { loadAllTestCases } from "../../core/data/testCaseLoader";
import { getFlowHandler } from "../../core/flows/flowResolver";
import { logError, logInfo } from "../../core/utils/logger";

function buildTags(tags: string[]): string {
  return tags.map((tag) => `@${tag}`).join(" ");
}

const moduleCases = loadAllTestCases("billing");

test.describe("billing Module", () => {
  test.beforeAll(() => {
    logInfo("BILLING-ORCH", `Loaded ${moduleCases.length} billing testcase(s)`);
  });

  for (const testCase of moduleCases) {
    const tags = buildTags(testCase.tags || []);
    const testTitle = `${testCase.id} ${testCase.description} ${tags}`.trim();

    test(testTitle, async ({ page }, testInfo) => {
      logInfo(
        "BILLING-ORCH",
        `START ${testCase.id} | flowCode=${testCase.flowCode} | tags=${(testCase.tags || []).join(",")}`
      );

      const handler = getFlowHandler(testCase.module, testCase.flowCode);
      try {
        await handler(page, testCase);
        logInfo("BILLING-ORCH", `PASS ${testCase.id} | status=${testInfo.status}`);
      } catch (error) {
        logError("BILLING-ORCH", `FAIL ${testCase.id} | ${(error as Error).message}`);
        throw error;
      }
    });
  }
});
