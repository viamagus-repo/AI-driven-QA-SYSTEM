#!/usr/bin/env node

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { logError, logInfo } from "../core/utils/logger";
import {
  normalizeModuleValue,
  resolveModuleFromAvailable,
  validateModuleName,
} from "../core/utils/moduleNames";

dotenv.config({ quiet: true });

type TestType = "suite" | "module";
type SuiteName = "smoke" | "regression" | "e2e";

type ModuleTarget = {
  project: string;
  file: string;
  needsDataPrep: boolean;
};

const DEFAULT_MODULE_MAP: Record<string, ModuleTarget> = {
  auth: {
    project: "auth",
    file: "tests/auth/auth.orchestrator.spec.ts",
    needsDataPrep: true,
  },
  user: {
    project: "user",
    file: "tests/user/user.orchestrator.spec.ts",
    needsDataPrep: true,
  },
  email: {
    project: "email",
    file: "tests/email/email.orchestrator.spec.ts",
    needsDataPrep: true,
  },
};

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

function normalizeModule(raw: string | undefined): string {
  return validateModuleName(
    raw,
    "Invalid TEST_MODULE. Provide a module name.",
    "Invalid TEST_MODULE. Use lowercase letters, numbers, '-' or '_' and start with a letter."
  );
}

function toPosixPath(filePath: string): string {
  return filePath.replace(/\\/g, "/");
}

function findAllOrchestrators(): string[] {
  const testsRoot = path.join(process.cwd(), "tests");
  if (!fs.existsSync(testsRoot)) {
    return [];
  }

  const out: string[] = [];
  const stack = [testsRoot];

  while (stack.length) {
    const current = stack.pop() as string;
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
        continue;
      }
      if (entry.isFile() && entry.name.endsWith(".orchestrator.spec.ts")) {
        out.push(toPosixPath(path.relative(process.cwd(), fullPath)));
      }
    }
  }

  return out.sort((a, b) => a.localeCompare(b));
}

function resolveModuleTarget(moduleName: string): ModuleTarget {
  const exactDefault = DEFAULT_MODULE_MAP[moduleName];
  if (exactDefault) {
    return exactDefault;
  }

  const orchestrators = findAllOrchestrators();
  const normalizedModuleName = normalizeModuleValue(moduleName);
  const candidates = orchestrators.filter((file) =>
    normalizeModuleValue(path.basename(file).replace(/\.orchestrator\.spec\.ts$/, "")) ===
      normalizedModuleName
  );

  if (candidates.length > 1) {
    throw new Error(
      `Multiple orchestrators found for TEST_MODULE='${moduleName}': ${candidates.join(", ")}`
    );
  }

  if (candidates.length === 1) {
    return {
      project: normalizedModuleName,
      file: candidates[0],
      needsDataPrep: true,
    };
  }

  const resolvedDefaultKey = resolveModuleFromAvailable(
    moduleName,
    Object.keys(DEFAULT_MODULE_MAP)
  );
  if (resolvedDefaultKey) {
    return DEFAULT_MODULE_MAP[resolvedDefaultKey];
  }

  const resolvedModuleName = resolveModuleFromAvailable(
    moduleName,
    orchestrators.map((file) =>
      path.basename(file).replace(/\.orchestrator\.spec\.ts$/, "")
    )
  );
  if (resolvedModuleName) {
    return resolveModuleTarget(resolvedModuleName);
  }

  throw new Error(
    `No orchestrator found for TEST_MODULE='${moduleName}'. Expected tests/<module>/${moduleName}.orchestrator.spec.ts`
  );
}

function runBySuite(): void {
  const suite = normalizeSuite(process.env.TEST_SUITE);
  const testFiles = findAllOrchestrators();
  if (!testFiles.length) {
    throw new Error("No orchestrator spec files found under tests/");
  }
  logInfo("TEST-CONTROL", `Mode=suite, suite=@${suite}`);
  run("npm run testdata:prepare");
  run(`npx playwright test ${testFiles.join(" ")} --grep "@${suite}"`);
}

function runByModule(): void {
  const moduleName = normalizeModule(process.env.TEST_MODULE);
  logInfo("TEST-CONTROL", `Mode=module, module=${moduleName}`);
  const target = resolveModuleTarget(moduleName);
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
