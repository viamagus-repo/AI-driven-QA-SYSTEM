import { test, Page } from "@playwright/test";
import { AppNavigator, AppPage } from "../../core/navigation/AppNavigator";
import { BaseTestCase } from "../../core/data/authTypes";
import { loadAllTestCases } from "../../core/data/testCaseLoader";
import { sendemail } from "../../flows/email/send.flow";
import { logError, logInfo } from "../../core/utils/logger";

type EmailFlowKey = "sendEmail";

const flowHandlers: Record<EmailFlowKey, (page: Page, testCase: BaseTestCase) => Promise<void>> =
  {
    sendEmail: sendemail,
  };

function buildTags(tags: string[]): string {
  return tags.map((tag) => `@${tag}`).join(" ");
}

const emailCases = loadAllTestCases("email");

test.describe("Email Module", () => {
  test.beforeAll(() => {
    logInfo("EMAIL-ORCH", `Loaded ${emailCases.length} email testcase(s)`);
  });

  test.beforeEach(async ({ page }) => {
    const navigator = new AppNavigator(page);
    await navigator.goTo(AppPage.EMAILS);
  });

  for (const testCase of emailCases) {
    const tags = buildTags(testCase.tags || []);
    const testTitle = `${testCase.id} ${testCase.description} ${tags}`.trim();

    test(testTitle, async ({ page }, testInfo) => {
      logInfo(
        "EMAIL-ORCH",
        `START ${testCase.id} | flowKey=${testCase.flowKey} | tags=${(testCase.tags || []).join(",")}`
      );
      const handler = flowHandlers[testCase.flowKey as EmailFlowKey];
      if (!handler) {
        throw new Error(
          `Unknown flowKey '${testCase.flowKey}' for testcase '${testCase.id}'`
        );
      }
      try {
        await handler(page, testCase);
        logInfo("EMAIL-ORCH", `PASS ${testCase.id} | status=${testInfo.status}`);
      } catch (error) {
        logError(
          "EMAIL-ORCH",
          `FAIL ${testCase.id} | ${(error as Error).message}`
        );
        throw error;
      }
    });
  }
});
