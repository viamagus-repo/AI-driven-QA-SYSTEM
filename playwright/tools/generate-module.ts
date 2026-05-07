#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import * as XLSX from "xlsx";
import * as ts from "typescript";
import * as readline from "readline/promises";
import { stdin as input, stdout as output } from "process";
import { logError, logInfo } from "../core/utils/logger";
import { validateModuleName } from "../core/utils/moduleNames";

type ModuleScaffold = {
  moduleName: string;
  flowDir: string;
  testDir: string;
  jsonModuleDir: string;
  excelTestsDir: string;
  pagesDir: string;
  modulePagesDir: string;
  flowFile: string;
  orchestratorFile: string;
  moduleConfigFile: string;
  excelFile: string;
  basePageFile: string;
  modulePageFile: string;
};

type FileBackup = {
  path: string;
  content: string;
};

function normalizeModuleName(raw: string | undefined): string {
  return validateModuleName(
    raw,
    "Module name is required. Usage: npm run generate:module -- <moduleName> [--route=/staff/<module>]",
    "Invalid module name. Use lowercase letters, numbers, '-' or '_' and start with a letter."
  );
}

function normalizeRoute(raw: string | undefined): string {
  const value = (raw || "").trim();
  if (!value) {
    throw new Error(
      "Route is required. Pass --route=/your/path or provide it when prompted."
    );
  }
  if (/^https?:\/\//i.test(value)) {
    throw new Error("Use a relative route path only (for example: /staff/billing).");
  }
  if (!value.startsWith("/")) {
    return `/${value}`;
  }
  return value;
}

function toAppPageKey(moduleName: string): string {
  return moduleName.replace(/[^a-zA-Z0-9]+/g, "_").toUpperCase();
}

function toPascalCase(value: string): string {
  return value
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("");
}

function toSchemaName(moduleName: string, flowCode: string): string {
  return `${toPascalCase(moduleName)}${toPascalCase(flowCode)}InputSchema`.replace(/^([A-Z])/, (m) =>
    m.toLowerCase()
  );
}

function toKeyLiteral(value: string): string {
  return JSON.stringify(value);
}

function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeFileIfMissing(filePath: string, content: string): boolean {
  if (fs.existsSync(filePath)) {
    logInfo("MODULE-GENERATOR", `Skipped existing file: ${filePath}`);
    return false;
  }
  fs.writeFileSync(filePath, content, "utf8");
  logInfo("MODULE-GENERATOR", `Created file: ${filePath}`);
  return true;
}

function buildModuleScaffold(moduleName: string): ModuleScaffold {
  const root = process.cwd();
  const flowDir = path.join(root, "flows", moduleName);
  const testDir = path.join(root, "tests", moduleName);
  const jsonModuleDir = path.join(root, "data", "json", "modules", moduleName);
  const excelTestsDir = path.join(root, "data", "excel", "tests");
  const pagesDir = path.join(root, "core", "pages");
  const modulePagesDir = path.join(pagesDir, "modules");
  const titleModule = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);

  return {
    moduleName,
    flowDir,
    testDir,
    jsonModuleDir,
    excelTestsDir,
    pagesDir,
    modulePagesDir,
    flowFile: path.join(flowDir, "sample.flow.ts"),
    orchestratorFile: path.join(testDir, `${moduleName}.orchestrator.spec.ts`),
    moduleConfigFile: path.join(jsonModuleDir, "config.json"),
    excelFile: path.join(excelTestsDir, `${titleModule}_Test_Cases.xlsx`),
    basePageFile: path.join(pagesDir, "BasePage.ts"),
    modulePageFile: path.join(modulePagesDir, `${moduleName}.page.ts`),
  };
}

function flowTemplate(moduleName: string): string {
  const pageClassName = `${toPascalCase(moduleName)}Page`;
  const schemaName = toSchemaName(moduleName, "sample");
  return `import { expect, Page } from "@playwright/test";
import { BaseTestCase } from "../../core/data/authTypes";
import { ${schemaName} } from "../../core/data/flowInputSchemas";
import { getValidatedInput } from "../../core/data/testData";
import { ${pageClassName} } from "../../core/pages/modules/${moduleName}.page";

export async function sample(page: Page, testCase?: BaseTestCase): Promise<void> {
  const input = getValidatedInput(testCase, ${schemaName});
  const modulePage = new ${pageClassName}(page);

  // TODO: Replace with actual steps for '${moduleName}' module.
  // Example: keep reusable locators/actions in module page object.
  void expect;
  await modulePage.waitForModuleReady();

  void input;
}
`;
}

function basePageTemplate(): string {
  return `import { Locator, Page, expect } from "@playwright/test";

export abstract class BasePage {
  protected constructor(protected readonly page: Page) {}

  protected locator(selector: string): Locator {
    return this.page.locator(selector);
  }

  protected byRole(role: Parameters<Page["getByRole"]>[0], options?: Parameters<Page["getByRole"]>[1]): Locator {
    return this.page.getByRole(role, options);
  }

  async waitForUrlContains(pathFragment: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(pathFragment));
  }

  async waitForIdle(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
  }

  async click(locator: Locator): Promise<void> {
    await locator.click();
  }

  async fill(locator: Locator, value: string): Promise<void> {
    await locator.fill(value);
  }
}
`;
}

function modulePageTemplate(moduleName: string): string {
  const className = `${toPascalCase(moduleName)}Page`;
  return `import { Locator, Page } from "@playwright/test";
import { BasePage } from "../BasePage";

export class ${className} extends BasePage {
  readonly locators: Record<string, Locator>;

  constructor(page: Page) {
    super(page);
    this.locators = {
      // Add stable module-specific locators here.
      pageTitle: page.locator("h1"),
    };
  }

  async waitForModuleReady(): Promise<void> {
    await this.waitForIdle();
  }
}
`;
}

function orchestratorTemplate(moduleName: string): string {
  const upper = moduleName.toUpperCase();
  const appPageKey = toAppPageKey(moduleName);
  return `import { test } from "@playwright/test";
import { loadAllTestCases } from "../../core/data/testCaseLoader";
import { getFlowHandler } from "../../core/flows/flowResolver";
import { AppNavigator, AppPage } from "../../core/navigation/AppNavigator";
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

      const nav = new AppNavigator(page);
      await nav.goTo(AppPage.${appPageKey});

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

function updateFlowInputSchemas(moduleName: string, flowCode: string): void {
  const schemasPath = path.join(process.cwd(), "core", "data", "flowInputSchemas.ts");
  if (!fs.existsSync(schemasPath)) {
    throw new Error(`flowInputSchemas.ts not found at ${schemasPath}`);
  }

  const schemaName = toSchemaName(moduleName, flowCode);
  let source = fs.readFileSync(schemasPath, "utf8");

  if (!source.includes(`export const ${schemaName} =`)) {
    const requiredStringPattern = /const requiredString = z\.string\(\)\.trim\(\)\.min\(1\);\r?\n/;
    const requiredStringMatch = source.match(requiredStringPattern);
    if (!requiredStringMatch) {
      throw new Error("Could not locate requiredString declaration in flowInputSchemas.ts");
    }
    const insertAfter = requiredStringMatch[0];
    const newline = insertAfter.includes("\r\n") ? "\r\n" : "\n";
    const schemaBlock = `${newline}export const ${schemaName} = z.record(z.string());${newline}`;
    source = source.replace(insertAfter, `${insertAfter}${schemaBlock}`);
  }

  const moduleKeyPattern = `(?:${toKeyLiteral(moduleName)}|${moduleName})`;
  const moduleBlockPattern = new RegExp(`(${moduleKeyPattern}:\\s*\\{[\\s\\S]*?)(\\n\\s*\\},)`, "m");
  const moduleBlockMatch = source.match(moduleBlockPattern);

  if (moduleBlockMatch) {
    const flowKeyPattern = `(?:${toKeyLiteral(flowCode)}|${flowCode})`;
    const existingEntryPattern = new RegExp(`${flowKeyPattern}:\\s*${schemaName}\\b`);
    if (!existingEntryPattern.test(moduleBlockMatch[1])) {
      const nextBlock = `${moduleBlockMatch[1]}\n    ${toKeyLiteral(flowCode)}: ${schemaName},${moduleBlockMatch[2]}`;
      source = source.replace(moduleBlockPattern, nextBlock);
    }
  } else {
    const rootBlockPattern = /const flowInputSchemas: Record<string, Record<string, z.ZodTypeAny>> = \{([\s\S]*?)\n\};/m;
    const rootBlockMatch = source.match(rootBlockPattern);
    if (!rootBlockMatch) {
      throw new Error("Could not locate flowInputSchemas map in flowInputSchemas.ts");
    }
    const body = rootBlockMatch[1].replace(/\s+$/, "");
    const bodyWithComma = body.trimEnd().endsWith(",") ? body : `${body},`;
    const moduleEntry = `\n  ${toKeyLiteral(moduleName)}: {\n    ${toKeyLiteral(flowCode)}: ${schemaName},\n  },`;
    source = source.replace(
      rootBlockPattern,
      `const flowInputSchemas: Record<string, Record<string, z.ZodTypeAny>> = {${bodyWithComma}${moduleEntry}\n};`
    );
  }

  fs.writeFileSync(schemasPath, source, "utf8");
  logInfo("MODULE-GENERATOR", `Updated flow input schemas: ${schemasPath}`);
}

function isNamedProperty(name: ts.PropertyName, expected: string): boolean {
  if (ts.isIdentifier(name)) {
    return name.text === expected;
  }
  if (ts.isStringLiteral(name) || ts.isNumericLiteral(name)) {
    return name.text === expected;
  }
  return false;
}

function findProjectsArrayLiteral(source: string): {
  sourceFile: ts.SourceFile;
  arrayNode: ts.ArrayLiteralExpression;
} {
  const sourceFile = ts.createSourceFile(
    "playwright.config.ts",
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );

  let arrayNode: ts.ArrayLiteralExpression | null = null;
  const visit = (node: ts.Node): void => {
    if (arrayNode) {
      return;
    }
    if (
      ts.isPropertyAssignment(node) &&
      isNamedProperty(node.name, "projects") &&
      ts.isArrayLiteralExpression(node.initializer)
    ) {
      arrayNode = node.initializer;
      return;
    }
    ts.forEachChild(node, visit);
  };
  ts.forEachChild(sourceFile, visit);

  if (!arrayNode) {
    throw new Error("Could not locate projects array in playwright.config.ts");
  }

  return { sourceFile, arrayNode };
}

function readObjectStringProperty(
  sourceFile: ts.SourceFile,
  node: ts.ObjectLiteralExpression,
  propertyName: string
): string | undefined {
  for (const prop of node.properties) {
    if (!ts.isPropertyAssignment(prop)) {
      continue;
    }
    if (!isNamedProperty(prop.name, propertyName)) {
      continue;
    }
    if (ts.isStringLiteralLike(prop.initializer)) {
      return prop.initializer.text;
    }
  }
  return undefined;
}

function injectProjectIntoPlaywrightConfig(moduleName: string): void {
  const configPath = path.join(process.cwd(), "playwright.config.ts");
  if (!fs.existsSync(configPath)) {
    throw new Error(`playwright.config.ts not found at ${configPath}`);
  }

  const source = fs.readFileSync(configPath, "utf8");
  const { sourceFile, arrayNode } = findProjectsArrayLiteral(source);

  const alreadyExists = arrayNode.elements.some((element) => {
    if (!ts.isObjectLiteralExpression(element)) {
      return false;
    }
    const nameValue = readObjectStringProperty(sourceFile, element, "name");
    const testDirValue = readObjectStringProperty(sourceFile, element, "testDir");
    return nameValue === moduleName || testDirValue === `./tests/${moduleName}`;
  });
  if (alreadyExists) {
    logInfo("MODULE-GENERATOR", `Playwright project '${moduleName}' already exists.`);
    return;
  }

  const projectEntry = `    {
      name: "${moduleName}",
      dependencies: ["auth-setup"],
      testDir: "./tests/${moduleName}",
      use: {
        storageState: "storage/auth.json",
      },
    }`;

  const existingElements = arrayNode.elements.map((element) =>
    source.slice(element.getStart(sourceFile), element.getEnd())
  );
  const nextElements = [...existingElements, projectEntry];
  const nextArrayText = `[\n${nextElements.join(",\n")}\n  ]`;

  const next =
    source.slice(0, arrayNode.getStart(sourceFile)) +
    nextArrayText +
    source.slice(arrayNode.getEnd());

  fs.writeFileSync(configPath, next, "utf8");
  logInfo("MODULE-GENERATOR", `Added Playwright project '${moduleName}' to playwright.config.ts`);
}

function injectRouteIntoAppNavigator(moduleName: string, route: string): void {
  const appNavigatorPath = path.join(process.cwd(), "core", "navigation", "AppNavigator.ts");
  if (!fs.existsSync(appNavigatorPath)) {
    throw new Error(`AppNavigator.ts not found at ${appNavigatorPath}`);
  }

  let source = fs.readFileSync(appNavigatorPath, "utf8");
  const appPageKey = toAppPageKey(moduleName);
  const appPageValue = moduleName.toLowerCase();

  const enumEntryPattern = new RegExp(`\\b${appPageKey}\\s*=\\s*"${appPageValue}"`);
  if (!enumEntryPattern.test(source)) {
    const enumBlockPattern = /export enum AppPage \{([\s\S]*?)\n\}/m;
    const enumBlockMatch = source.match(enumBlockPattern);
    if (!enumBlockMatch) {
      throw new Error("Could not locate AppPage enum in AppNavigator.ts");
    }
    const enumBody = enumBlockMatch[1].replace(/\s+$/, "");
    const enumBodyWithComma = enumBody.trimEnd().endsWith(",") ? enumBody : `${enumBody},`;
    const nextEnumBody = `${enumBodyWithComma}\n  ${appPageKey} = "${appPageValue}",`;
    source = source.replace(enumBlockPattern, `export enum AppPage {${nextEnumBody}\n}`);
    logInfo("MODULE-GENERATOR", `Added AppPage.${appPageKey} to AppNavigator.ts`);
  } else {
    logInfo("MODULE-GENERATOR", `AppPage.${appPageKey} already exists in AppNavigator.ts`);
  }

  const routeEntryPattern = new RegExp(`\\[AppPage\\.${appPageKey}\\]\\s*:\\s*"`);
  if (!routeEntryPattern.test(source)) {
    const routesBlockPattern = /const ROUTES: Record<AppPage, string> = \{([\s\S]*?)\n\};/m;
    const routesBlockMatch = source.match(routesBlockPattern);
    if (!routesBlockMatch) {
      throw new Error("Could not locate ROUTES map in AppNavigator.ts");
    }
    const routesBody = routesBlockMatch[1].replace(/\s+$/, "");
    const routesBodyWithComma = routesBody.trimEnd().endsWith(",") ? routesBody : `${routesBody},`;
    const nextRoutesBody = `${routesBodyWithComma}\n  [AppPage.${appPageKey}]: "${route}",`;
    source = source.replace(
      routesBlockPattern,
      `const ROUTES: Record<AppPage, string> = {${nextRoutesBody}\n};`
    );
    logInfo("MODULE-GENERATOR", `Added route mapping for AppPage.${appPageKey} in AppNavigator.ts`);
  } else {
    logInfo("MODULE-GENERATOR", `Route mapping for AppPage.${appPageKey} already exists in AppNavigator.ts`);
  }

  fs.writeFileSync(appNavigatorPath, source, "utf8");
}

function ensureOrchestratorNavigation(moduleName: string): void {
  const orchestratorPath = path.join(
    process.cwd(),
    "tests",
    moduleName,
    `${moduleName}.orchestrator.spec.ts`
  );
  if (!fs.existsSync(orchestratorPath)) {
    return;
  }

  let source = fs.readFileSync(orchestratorPath, "utf8");
  const appPageKey = toAppPageKey(moduleName);

  const navImport = 'import { AppNavigator, AppPage } from "../../core/navigation/AppNavigator";';
  if (!source.includes(navImport)) {
    source = source.replace(
      'import { test } from "@playwright/test";\n',
      `import { test } from "@playwright/test";\n${navImport}\n`
    );
  }

  source = source.replace(
    /(?:\n\s*test\.beforeEach\(async \(\{ page \}\) => \{\n\s*const (?:navigator|nav) = new AppNavigator\(page\);\n\s*await (?:navigator|nav)\.goTo\(AppPage\.[A-Z0-9_]+\);\n\s*\}\);\n)/m,
    "\n"
  );

  const hasNavInTest = new RegExp(`await\\s+nav\\.goTo\\(AppPage\\.${appPageKey}\\);`).test(source);
  if (!hasNavInTest) {
    source = source.replace(
      /(\s*const handler = getFlowHandler\(testCase\.module, testCase\.flowCode\);)/,
      `\n      const nav = new AppNavigator(page);\n      await nav.goTo(AppPage.${appPageKey});\n\n$1`
    );
  }

  fs.writeFileSync(orchestratorPath, source, "utf8");
  logInfo("MODULE-GENERATOR", `Ensured orchestrator navigation in ${orchestratorPath}`);
}

type CliOptions = {
  moduleName: string;
  route?: string;
};

function parseCliArgs(argv: string[]): CliOptions {
  let moduleName: string | undefined;
  let route: string | undefined = process.env.npm_config_route;

  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];

    if (arg.endsWith("generate-module.ts")) {
      continue;
    }
    if (arg.startsWith("--route=")) {
      route = arg.slice("--route=".length);
      continue;
    }
    if (arg === "--route") {
      const nextArg = argv[index + 1];
      if (!nextArg || nextArg.startsWith("--")) {
        throw new Error("Invalid --route usage. Use --route=/your/path or --route /your/path");
      }
      route = nextArg;
      index += 1;
      continue;
    }
    if (arg.startsWith("--")) {
      throw new Error(`Unknown option: ${arg}`);
    }
    if (moduleName) {
      throw new Error("Only one module name is allowed.");
    }
    moduleName = normalizeModuleName(arg);
  }

  if (!moduleName) {
    throw new Error(
      "Module name is required. Usage: npm run generate:module -- <moduleName> [--route=/staff/<module>]"
    );
  }

  return { moduleName, route };
}

async function promptRouteIfMissing(moduleName: string, route?: string): Promise<string> {
  if (route) {
    return normalizeRoute(route);
  }

  const rl = readline.createInterface({ input, output });
  try {
    const answer = await rl.question(
      `No --route value was received for '${moduleName}'. If you already passed one in PowerShell, use '--route /staff/${moduleName}' or run the node command directly.\nEnter base route path for '${moduleName}' (example: /staff/${moduleName}): `
    );
    return normalizeRoute(answer);
  } finally {
    rl.close();
  }
}

function rollbackGenerate(createdPaths: string[], backups: FileBackup[]): void {
  for (const backup of backups) {
    fs.writeFileSync(backup.path, backup.content, "utf8");
    logInfo("MODULE-GENERATOR", `Rollback restored file: ${backup.path}`);
  }

  for (const filePath of [...createdPaths].reverse()) {
    if (!fs.existsSync(filePath)) {
      continue;
    }
    const stat = fs.lstatSync(filePath);
    if (stat.isDirectory()) {
      fs.rmSync(filePath, { recursive: true, force: true });
    } else {
      fs.rmSync(filePath, { force: true });
    }
    logInfo("MODULE-GENERATOR", `Rollback removed created path: ${filePath}`);
  }
}

function generateModule(moduleName: string, route: string): void {
  const scaffold = buildModuleScaffold(moduleName);
  const createdPaths: string[] = [];
  const mutableFiles = [
    path.join(process.cwd(), "playwright.config.ts"),
    path.join(process.cwd(), "core", "navigation", "AppNavigator.ts"),
    path.join(process.cwd(), "core", "data", "flowInputSchemas.ts"),
    scaffold.orchestratorFile,
  ];
  const backups: FileBackup[] = mutableFiles
    .filter((filePath) => fs.existsSync(filePath))
    .map((filePath) => ({
      path: filePath,
      content: fs.readFileSync(filePath, "utf8"),
    }));

  try {
    ensureDir(scaffold.flowDir);
    ensureDir(scaffold.testDir);
    ensureDir(scaffold.jsonModuleDir);
    ensureDir(scaffold.excelTestsDir);
    ensureDir(scaffold.pagesDir);
    ensureDir(scaffold.modulePagesDir);

    if (writeFileIfMissing(scaffold.basePageFile, basePageTemplate())) createdPaths.push(scaffold.basePageFile);
    if (writeFileIfMissing(scaffold.modulePageFile, modulePageTemplate(moduleName))) createdPaths.push(scaffold.modulePageFile);
    updateFlowInputSchemas(moduleName, "sample");
    if (writeFileIfMissing(scaffold.flowFile, flowTemplate(moduleName))) createdPaths.push(scaffold.flowFile);
    if (writeFileIfMissing(scaffold.orchestratorFile, orchestratorTemplate(moduleName))) createdPaths.push(scaffold.orchestratorFile);
    ensureOrchestratorNavigation(moduleName);
    if (writeFileIfMissing(scaffold.moduleConfigFile, configTemplate(moduleName))) createdPaths.push(scaffold.moduleConfigFile);
    const excelExistedBefore = fs.existsSync(scaffold.excelFile);
    createExcelTemplate(scaffold.excelFile);
    if (!excelExistedBefore && fs.existsSync(scaffold.excelFile)) {
      createdPaths.push(scaffold.excelFile);
    }

    injectProjectIntoPlaywrightConfig(moduleName);
    injectRouteIntoAppNavigator(moduleName, route);

    logInfo("MODULE-GENERATOR", `Module '${moduleName}' scaffold is ready.`);
    logInfo(
      "MODULE-GENERATOR",
      `Route '${route}' configured. Next steps: add Excel file/rows with module + flowCode, then run npm run testdata:prepare`
    );
  } catch (error) {
    rollbackGenerate(createdPaths, backups);
    throw new Error(
      `Module generation failed and rollback completed. Re-run the command after fixing the issue. Root cause: ${
        (error as Error).message
      }`
    );
  }
}

if (require.main === module) {
  (async () => {
    try {
      const options = parseCliArgs(process.argv.slice(2));
      const route = await promptRouteIfMissing(options.moduleName, options.route);
      generateModule(options.moduleName, route);
    } catch (error) {
      logError("MODULE-GENERATOR", `Failed: ${(error as Error).message}`);
      process.exit(1);
    }
  })().catch((error) => {
    logError("MODULE-GENERATOR", `Failed: ${(error as Error).message}`);
    process.exit(1);
  });
}
