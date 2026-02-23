#!/usr/bin/env node

import { execSync } from "child_process";
import * as dotenv from "dotenv";
import { logError, logInfo } from "../core/utils/logger";

dotenv.config({ quiet: true });

type TestType = "suite" | "module";
type SuiteName = "smoke" | "regression" | "e2e";
type ModuleName = "auth" | "user" | "email";

const TEST_FILES = [
  "tests/auth/auth.orchestrator.spec.ts",
  "tests/Users/user.orchestrator.spec.ts",
  "tests/emails/email.orchestrator.spec.ts",
];

function run(command: string): void {
  logInfo("TEST-CONTROL", `Running command: ${command}`);
  execSync(command, { stdio: "inherit" });
}

function normalizeTestType(raw: string | undefined): TestType {
  const value = (raw || "").toLowerCase() as TestType;
  if (value !== "suite" && value !== "module") {
    throw new Error("Invalid TEST_TYPE. Allowed values: suite, module");
  }
  return value;
}

function normalizeSuite(raw: string | undefined): SuiteName {
  const value = (raw || "").toLowerCase() as SuiteName;
  if (value !== "smoke" && value !== "regression" && value !== "e2e") {
    throw new Error("Invalid TEST_SUITE. Allowed values: smoke, regression, e2e");
  }
  return value;
}

function normalizeModule(raw: string | undefined): ModuleName {
  const value = (raw || "").toLowerCase();
  if (value === "auth" || value === "user" || value === "email") {
    return value;
  }
  throw new Error("Invalid TEST_MODULE. Allowed values: auth, user, email");
}

function runBySuite(): void {
  const suite = normalizeSuite(process.env.TEST_SUITE);
  logInfo("TEST-CONTROL", `Mode=suite, suite=@${suite}`);
  run("npm run testdata:prepare");
  run(
    `npx playwright test ${TEST_FILES.join(" ")} --grep "@${suite}"`
  );
}

function runByModule(): void {
  const moduleName = normalizeModule(process.env.TEST_MODULE);
  logInfo("TEST-CONTROL", `Mode=module, module=${moduleName}`);
  const moduleMap = {
    auth: {
      project: "auth",
      file: "tests/auth/auth.orchestrator.spec.ts",
      needsDataPrep: true,
    },
    user: {
      project: "users",
      file: "tests/Users/user.orchestrator.spec.ts",
      needsDataPrep: true,
    },
    email: {
      project: "emails",
      file: "tests/emails/email.orchestrator.spec.ts",
      needsDataPrep: true,
    },
  } as const;

  const target = moduleMap[moduleName];
  if (target.needsDataPrep) {
    run("npm run testdata:prepare");
  }
  run(`npx playwright test ${target.file} --project=${target.project}`);
}

try {
  const testType = normalizeTestType(process.env.TEST_TYPE);
  logInfo("TEST-CONTROL", `Using TEST_TYPE=${testType}`);
  if (testType === "suite") {
    runBySuite();
  } else {
    runByModule();
  }
} catch (error) {
  logError("TEST-CONTROL", `Failed: ${(error as Error).message}`);
  process.exit(1);
}
