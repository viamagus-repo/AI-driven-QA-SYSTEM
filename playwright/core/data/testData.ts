import { BaseTestCase } from "./authTypes";
import { z } from "zod";

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

export function getValidatedInput<TSchema extends z.ZodTypeAny>(
  testCase: BaseTestCase | undefined,
  schema: TSchema
): z.infer<TSchema> {
  const input = getTestData(testCase).input;
  return schema.parse(input) as z.infer<TSchema>;
}
