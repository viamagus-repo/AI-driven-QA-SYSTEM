import * as fs from "fs";
import * as path from "path";
import { BaseTestCase, ModuleConfig } from "./authTypes";
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

function assertValidAuthTestCase(
  value: unknown,
  sourcePath: string
): asserts value is BaseTestCase {
  const data = value as Partial<BaseTestCase>;
  if (!data || typeof data !== "object") {
    throw new Error(`Invalid testcase shape in ${sourcePath}`);
  }
  if (!data.id || typeof data.id !== "string") {
    throw new Error(`Missing/invalid 'id' in ${sourcePath}`);
  }
  if (!data.module || typeof data.module !== "string") {
    throw new Error(`Missing/invalid 'module' in ${sourcePath}`);
  }
  const flowCode = data.flowCode ?? data.flowKey;
  if (!flowCode || typeof flowCode !== "string") {
    throw new Error(`Missing/invalid 'flowCode' in ${sourcePath}`);
  }
  if (!data.flowCode) {
    data.flowCode = flowCode;
  }
  if (!data.testData || typeof data.testData !== "object") {
    throw new Error(`Missing/invalid 'testData' in ${sourcePath}`);
  }
  if (!data.testData.input || typeof data.testData.input !== "object") {
    throw new Error(`Missing/invalid 'testData.input' in ${sourcePath}`);
  }
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
  assertValidAuthTestCase(parsed, fullPath);
  return parsed;
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
    assertValidAuthTestCase(parsed, fullPath);
    return parsed;
  });
}
