import { BaseTestCase } from "./authTypes";

export type TestDataBag = {
  input: Record<string, unknown>;
  expectedData?: Record<string, unknown>;
};

export function getTestData(testCase: BaseTestCase | undefined): TestDataBag {
  const testData = testCase?.testData as TestDataBag | undefined;
  if (!testData || typeof testData !== "object") {
    throw new Error("Missing testData in testcase payload");
  }
  if (!testData.input || typeof testData.input !== "object") {
    throw new Error("Missing testData.input in testcase payload");
  }
  return testData;
}