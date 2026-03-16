import { z } from "zod";
import { normalizeModuleValue } from "../utils/moduleNames";

const requiredString = z.string().trim().min(1);

export const usersSampleInputSchema = z.record(requiredString);

export const usersDeleteInputSchema = z.record(requiredString);

export const authLoginInputSchema = z.object({
  email: requiredString,
  password: requiredString,
});

export const usersCreateInputSchema = z.object({
  firstName: requiredString,
  lastName: requiredString,
  dobYear: requiredString,
  dobMonth: requiredString,
  dobDay: requiredString,
  email: requiredString,
  reason: requiredString,
  phone: requiredString,
  state: requiredString,
});

const flowInputSchemas: Record<string, Record<string, z.ZodTypeAny>> = {
  auth: {
    loginvalid: authLoginInputSchema,
    logininvalidusername: authLoginInputSchema,
    logininvalidpassword: authLoginInputSchema,
  },
  users: {
    create: usersCreateInputSchema,
    "delete": usersDeleteInputSchema,
    "sample": usersSampleInputSchema,
  },
};

function normalizeFlowCode(value: string | undefined): string {
  return normalizeModuleValue(value);
}

export function getFlowInputSchema(
  moduleName: string,
  flowCode: string
): z.ZodTypeAny | undefined {
  const moduleSchemas = flowInputSchemas[normalizeModuleValue(moduleName)];
  if (!moduleSchemas) {
    return undefined;
  }
  return moduleSchemas[normalizeFlowCode(flowCode)];
}

export function validateFlowInputData(
  moduleName: string,
  flowCode: string,
  input: unknown
): void {
  const schema = getFlowInputSchema(moduleName, flowCode);
  if (!schema) {
    return;
  }

  const result = schema.safeParse(input);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `${issue.path.join(".") || "<root>"}: ${issue.message}`)
      .join("; ");
    throw new Error(
      `Invalid testData.input for module '${moduleName}', flow '${flowCode}': ${issues}`
    );
  }
}
