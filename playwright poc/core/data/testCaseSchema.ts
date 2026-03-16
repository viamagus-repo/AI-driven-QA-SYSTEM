import { z } from "zod";

const BaseRuntimeTestCaseSchema = z.object({
  id: z.string().min(1),
  module: z.string().min(1),
  flowCode: z.string().min(1).optional(),
  flowKey: z.string().min(1).optional(),
  description: z.string().optional(),
  type: z.string().optional(),
  priority: z.string().optional(),
  suite: z.string().optional(),
  tags: z.array(z.string()).optional(),
  steps: z.string().optional(),
  expectedResult: z.string().optional(),
  testData: z.object({
    input: z.record(z.unknown()),
    expectedData: z.record(z.unknown()).optional(),
  }),
});

export const RuntimeTestCaseSchema = BaseRuntimeTestCaseSchema.superRefine((value, ctx) => {
  if (!value.flowCode && !value.flowKey) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Missing required 'flowCode' (or legacy 'flowKey').",
      path: ["flowCode"],
    });
  }
}).transform((value) => ({
  ...value,
  flowCode: value.flowCode ?? value.flowKey ?? "",
  description: value.description ?? "",
  type: value.type ?? "",
  priority: value.priority ?? "",
  suite: value.suite ?? "",
  tags: value.tags ?? [],
}));

export type RuntimeTestCase = z.infer<typeof RuntimeTestCaseSchema>;

