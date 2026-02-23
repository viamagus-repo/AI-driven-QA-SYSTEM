import { test, Page } from "@playwright/test";
import { AppNavigator, AppPage } from "../../core/navigation/AppNavigator";
import { BaseTestCase } from "../../core/data/authTypes";
import { loadAllTestCases } from "../../core/data/testCaseLoader";
import { CreateUser } from "../../flows/Users/create.flow";
import { DeleteUser } from "../../flows/Users/delete.flow";
import { EditUserPassword } from "../../flows/Users/edituserpass.flow";
import { logError, logInfo } from "../../core/utils/logger";

type UserFlowKey = "createUser" | "deleteUser" | "editUserPassword";

const flowHandlers: Record<UserFlowKey, (page: Page, testCase: BaseTestCase) => Promise<void>> =
  {
    createUser: CreateUser,
    deleteUser: DeleteUser,
    editUserPassword: EditUserPassword,
  };

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
        `START ${testCase.id} | flowKey=${testCase.flowKey} | tags=${(testCase.tags || []).join(",")}`
      );
      const handler = flowHandlers[testCase.flowKey as UserFlowKey];
      if (!handler) {
        throw new Error(
          `Unknown flowKey '${testCase.flowKey}' for testcase '${testCase.id}'`
        );
      }
      try {
        await handler(page, testCase);
        logInfo("USER-ORCH", `PASS ${testCase.id} | status=${testInfo.status}`);
      } catch (error) {
        logError(
          "USER-ORCH",
          `FAIL ${testCase.id} | ${(error as Error).message}`
        );
        throw error;
      }
    });
  }
});
