#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import * as XLSX from "xlsx";
import { logError, logInfo } from "../core/utils/logger";

type ModuleScaffold = {
  moduleName: string;
  flowDir: string;
  testDir: string;
  jsonModuleDir: string;
  excelTestsDir: string;
  flowFile: string;
  orchestratorFile: string;
  moduleConfigFile: string;
  excelFile: string;
};

function normalizeModuleName(raw: string | undefined): string {
  const value = (raw || "").trim().toLowerCase();
  if (!value) {
    throw new Error("Module name is required. Usage: npm run generate:module <moduleName>");
  }
  if (!/^[a-z][a-z0-9_-]*$/.test(value)) {
    throw new Error(
      "Invalid module name. Use lowercase letters, numbers, '-' or '_' and start with a letter."
    );
  }
  return value;
}

function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeFileIfMissing(filePath: string, content: string): void {
  if (fs.existsSync(filePath)) {
    logInfo("MODULE-GENERATOR", `Skipped existing file: ${filePath}`);
    return;
  }
  fs.writeFileSync(filePath, content, "utf8");
  logInfo("MODULE-GENERATOR", `Created file: ${filePath}`);
}

function buildModuleScaffold(moduleName: string): ModuleScaffold {
  const root = process.cwd();
  const flowDir = path.join(root, "flows", moduleName);
  const testDir = path.join(root, "tests", moduleName);
  const jsonModuleDir = path.join(root, "data", "json", "modules", moduleName);
  const excelTestsDir = path.join(root, "data", "excel", "tests");
  const titleModule = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);

  return {
    moduleName,
    flowDir,
    testDir,
    jsonModuleDir,
    excelTestsDir,
    flowFile: path.join(flowDir, "sample.flow.ts"),
    orchestratorFile: path.join(testDir, `${moduleName}.orchestrator.spec.ts`),
    moduleConfigFile: path.join(jsonModuleDir, "config.json"),
    excelFile: path.join(excelTestsDir, `${titleModule}_Test_Cases.xlsx`),
  };
}

function flowTemplate(moduleName: string): string {
  return `import { Page } from "@playwright/test";
import { BaseTestCase } from "../../core/data/authTypes";
import { getTestData } from "../../core/data/testData";

export async function sample(page: Page, testCase?: BaseTestCase): Promise<void> {
  const input = getTestData(testCase).input as Record<string, unknown>;
  // TODO: Replace with actual steps for '${moduleName}' module.
  // NOTE: The next line is only placeholder scaffold code and can be removed.
  // Add your real UI steps/assertions instead.
  await page.waitForLoadState("domcontentloaded");
  void input;
}
`;
}

function orchestratorTemplate(moduleName: string): string {
  const upper = moduleName.toUpperCase();
  return `import { test } from "@playwright/test";
import { loadAllTestCases } from "../../core/data/testCaseLoader";
import { getFlowHandler } from "../../core/flows/flowResolver";
import { logError, logInfo } from "../../core/utils/logger";

function buildTags(tags: string[]): string {
  return tags.map((tag) => \`@\${tag}\`).join(" ");
}

const moduleCases = loadAllTestCases("${moduleName}");

test.describe("${moduleName} Module", () => {
  test.beforeAll(() => {
    logInfo("${upper}-ORCH", \`Loaded \${moduleCases.length} ${moduleName} testcase(s)\`);
  });

  for (const testCase of moduleCases) {
    const tags = buildTags(testCase.tags || []);
    const testTitle = \`\${testCase.id} \${testCase.description} \${tags}\`.trim();

    test(testTitle, async ({ page }, testInfo) => {
      logInfo(
        "${upper}-ORCH",
        \`START \${testCase.id} | flowCode=\${testCase.flowCode} | tags=\${(testCase.tags || []).join(",")}\`
      );

      const handler = getFlowHandler(testCase.module, testCase.flowCode);
      try {
        await handler(page, testCase);
        logInfo("${upper}-ORCH", \`PASS \${testCase.id} | status=\${testInfo.status}\`);
      } catch (error) {
        logError("${upper}-ORCH", \`FAIL \${testCase.id} | \${(error as Error).message}\`);
        throw error;
      }
    });
  }
});
`;
}

function configTemplate(moduleName: string): string {
  return JSON.stringify(
    {
      module: moduleName,
      lastUpdated: new Date().toISOString().split("T")[0],
      description: `${moduleName} module test suite configuration`,
      suites: {},
      testDataFiles: {},
      tags: {},
    },
    null,
    2
  );
}

function createExcelTemplate(filePath: string): void {
  if (fs.existsSync(filePath)) {
    logInfo("MODULE-GENERATOR", `Skipped existing file: ${filePath}`);
    return;
  }

  const headers = [
    "ID",
    "Module",
    "Scenario",
    "Type",
    "Priority",
    "Suite",
    "Tags",
    "steps",
    "Expected result",
    "input",
    "Expected data",
    "flowCode",
  ];

  const workbook = XLSX.utils.book_new();
  const sheet = XLSX.utils.aoa_to_sheet([headers]);
  XLSX.utils.book_append_sheet(workbook, sheet, "TestCases");
  XLSX.writeFile(workbook, filePath);
  logInfo("MODULE-GENERATOR", `Created file: ${filePath}`);
}

function injectProjectIntoPlaywrightConfig(moduleName: string): void {
  const configPath = path.join(process.cwd(), "playwright.config.ts");
  if (!fs.existsSync(configPath)) {
    throw new Error(`playwright.config.ts not found at ${configPath}`);
  }

  const source = fs.readFileSync(configPath, "utf8");
  const projectNamePattern = new RegExp(`name:\\s*"${moduleName}"`);
  if (projectNamePattern.test(source)) {
    logInfo("MODULE-GENERATOR", `Playwright project '${moduleName}' already exists.`);
    return;
  }

  const marker = "  ],\n});";
  if (!source.includes(marker)) {
    throw new Error("Could not find projects array closing marker in playwright.config.ts");
  }

  const entry = `
    {
      name: "${moduleName}",
      dependencies: ["auth-setup"],
      testDir: "./tests/${moduleName}",
      use: {
        storageState: "storage/auth.json",
      },
    },
`;

  const next = source.replace(marker, `${entry}${marker}`);
  fs.writeFileSync(configPath, next, "utf8");
  logInfo("MODULE-GENERATOR", `Added Playwright project '${moduleName}' to playwright.config.ts`);
}

function generateModule(moduleName: string): void {
  const scaffold = buildModuleScaffold(moduleName);

  ensureDir(scaffold.flowDir);
  ensureDir(scaffold.testDir);
  ensureDir(scaffold.jsonModuleDir);
  ensureDir(scaffold.excelTestsDir);

  writeFileIfMissing(scaffold.flowFile, flowTemplate(moduleName));
  writeFileIfMissing(scaffold.orchestratorFile, orchestratorTemplate(moduleName));
  writeFileIfMissing(scaffold.moduleConfigFile, configTemplate(moduleName));
  createExcelTemplate(scaffold.excelFile);

  injectProjectIntoPlaywrightConfig(moduleName);

  logInfo("MODULE-GENERATOR", `Module '${moduleName}' scaffold is ready.`);
  logInfo(
    "MODULE-GENERATOR",
    "Next steps: add Excel file/rows with module + flowCode, then run npm run testdata:prepare"
  );
}

if (require.main === module) {
  try {
    const moduleName = normalizeModuleName(process.argv[2]);
    generateModule(moduleName);
  } catch (error) {
    logError("MODULE-GENERATOR", `Failed: ${(error as Error).message}`);
    process.exit(1);
  }
}
