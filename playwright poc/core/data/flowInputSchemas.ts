import { z } from "zod";
import { normalizeModuleValue } from "../utils/moduleNames";

const requiredString = z.string().trim().min(1);

export const authEmailFieldInputSchema = z.record(z.string());

export const authEmailfieldInputSchema = z.record(z.string());

export const trackingValidateInputSchema = z.record(z.string());

export const trackingSampleInputSchema = z.record(requiredString);

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
    "emailfield": authEmailfieldInputSchema,
    "emailField": authEmailFieldInputSchema,
  },
  users: {
    create: usersCreateInputSchema,
    "delete": usersDeleteInputSchema,
    "sample": usersSampleInputSchema,
  },
  "tracking": {
    "sample": trackingSampleInputSchema,
    "validate": trackingValidateInputSchema,
  },
};

function normalizeFlowCode(value: string | undefined): string {
  return normalizeModuleValue(value);
}

function resolveFlowSchema(
  moduleSchemas: Record<string, z.ZodTypeAny>,
  flowCode: string
): z.ZodTypeAny | undefined {
  const exactMatch = moduleSchemas[flowCode];
  if (exactMatch) {
    return exactMatch;
  }

  const normalizedRequested = normalizeFlowCode(flowCode);
  const matchedKey = Object.keys(moduleSchemas).find(
    (key) => normalizeFlowCode(key) === normalizedRequested
  );
  return matchedKey ? moduleSchemas[matchedKey] : undefined;
}

export function getFlowInputSchema(
  moduleName: string,
  flowCode: string
): z.ZodTypeAny | undefined {
  const moduleSchemas = flowInputSchemas[normalizeModuleValue(moduleName)];
  if (!moduleSchemas) {
    return undefined;
  }
  return resolveFlowSchema(moduleSchemas, flowCode);
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
