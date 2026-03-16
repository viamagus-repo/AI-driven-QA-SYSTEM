import * as fs from "fs";
import * as path from "path";
import { BaseTestCase, ModuleConfig } from "./authTypes";
import { RuntimeTestCaseSchema } from "./testCaseSchema";
import { logInfo } from "../utils/logger";

function readJsonFile<T>(filePath: string): T {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Data file not found: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, "utf8");
  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    throw new Error(`Invalid JSON at ${filePath}: ${(error as Error).message}`);
  }
}

function getModuleBasePath(moduleName: string): string {
  return path.join(process.cwd(), "data", "json", "modules", moduleName);
}

function parseTestCase(value: unknown, sourcePath: string): BaseTestCase {
  const parsed = RuntimeTestCaseSchema.safeParse(value);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `${issue.path.join(".") || "<root>"}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid testcase shape in ${sourcePath}: ${issues}`);
  }
  return parsed.data as BaseTestCase;
}

export function loadModuleConfig(moduleName: string): ModuleConfig {
  const configPath = path.join(getModuleBasePath(moduleName), "config.json");
  logInfo("TESTCASE-LOADER", `Loading module config: ${configPath}`);
  return readJsonFile<ModuleConfig>(configPath);
}

export function loadTestCase(moduleName: string, testCaseId: string): BaseTestCase {
  const config = loadModuleConfig(moduleName);
  const fileName = config.testDataFiles[testCaseId];
  if (!fileName) {
    throw new Error(
      `Test case '${testCaseId}' not found in ${moduleName} config mapping`
    );
  }

  const fullPath = path.join(getModuleBasePath(moduleName), fileName);
  const parsed = readJsonFile<unknown>(fullPath);
  return parseTestCase(parsed, fullPath);
}

export function loadAllTestCases(moduleName: string): BaseTestCase[] {
  const config = loadModuleConfig(moduleName);
  const ids = Object.keys(config.testDataFiles);
  logInfo(
    "TESTCASE-LOADER",
    `Loading ${ids.length} testcase(s) for module '${moduleName}'`
  );
  const moduleBasePath = getModuleBasePath(moduleName);
  return ids.map((id) => {
    const fileName = config.testDataFiles[id];
    const fullPath = path.join(moduleBasePath, fileName);
    const parsed = readJsonFile<unknown>(fullPath);
    return parseTestCase(parsed, fullPath);
  });
}
