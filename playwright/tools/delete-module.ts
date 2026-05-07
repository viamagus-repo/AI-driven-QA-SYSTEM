#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";
import { createInterface } from "readline";
import { logError, logInfo, logWarn } from "../core/utils/logger";
import { validateModuleName } from "../core/utils/moduleNames";
import { generateFlowRegistry } from "./generate-flow-registry";

type Options = {
  moduleName: string;
  dryRun: boolean;
  yes: boolean;
};

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeModuleName(raw: string): string {
  return validateModuleName(
    raw,
    "Module name is required. Usage: npm run delete:module -- <moduleName> [--dry-run] [--yes]",
    "Invalid module name. Use lowercase letters, numbers, '-' or '_' and start with a letter."
  );
}

function parseOptions(argv: string[]): Options {
  let moduleName = "";
  let dryRun = false;
  let yes = false;

  for (const arg of argv) {
    if (arg === "--dry-run") {
      dryRun = true;
      continue;
    }
    if (arg === "--yes" || arg === "-y") {
      yes = true;
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
      "Module name is required. Usage: npm run delete:module -- <moduleName> [--dry-run] [--yes]"
    );
  }

  return { moduleName, dryRun, yes };
}

function toAppPageKey(moduleName: string): string {
  return moduleName.replace(/[^a-zA-Z0-9]+/g, "_").toUpperCase();
}

function moduleAliases(moduleName: string): string[] {
  return [moduleName.toLowerCase()];
}

function exists(targetPath: string): boolean {
  return fs.existsSync(targetPath);
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

function askQuestion(question: string): Promise<string> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function confirmDelete(options: Options): Promise<void> {
  if (options.dryRun || options.yes) {
    return;
  }

  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error(
      "Interactive confirmation is required. Re-run with --yes in non-interactive mode."
    );
  }

  logWarn(
    "DELETE-MODULE",
    `This will remove artifacts only for module '${options.moduleName}'. This action is not reversible.`
  );
  const answer = (await askQuestion(`Proceed deleting module '${options.moduleName}'? (y/N): `))
    .trim()
    .toLowerCase();
  if (answer !== "y" && answer !== "yes") {
    throw new Error("Delete cancelled by user.");
  }
}

function removePath(targetPath: string, dryRun: boolean): void {
  if (!exists(targetPath)) {
    return;
  }

  const stat = fs.lstatSync(targetPath);
  if (dryRun) {
    logInfo(
      "DELETE-MODULE",
      `[dry-run] remove ${stat.isDirectory() ? "directory" : "file"}: ${targetPath}`
    );
    return;
  }

  if (stat.isDirectory()) {
    fs.rmSync(targetPath, { recursive: true, force: true });
    logInfo("DELETE-MODULE", `Removed directory: ${targetPath}`);
    return;
  }

  fs.rmSync(targetPath, { force: true });
  logInfo("DELETE-MODULE", `Removed file: ${targetPath}`);
}

function findCaseInsensitiveDir(parentDir: string, targetName: string): string | null {
  if (!exists(parentDir)) {
    return null;
  }
  const entries = fs.readdirSync(parentDir, { withFileTypes: true });
  const match = entries.find(
    (entry) => entry.isDirectory() && entry.name.toLowerCase() === targetName.toLowerCase()
  );
  return match ? path.join(parentDir, match.name) : null;
}

function removeModuleFolders(root: string, moduleName: string, dryRun: boolean): void {
  const aliases = moduleAliases(moduleName);
  const moduleDirs = [
    path.join(root, "flows"),
    path.join(root, "tests"),
    path.join(root, "data", "json", "modules"),
  ];

  for (const parentDir of moduleDirs) {
    for (const alias of aliases) {
      const resolved = findCaseInsensitiveDir(parentDir, alias);
      if (resolved) {
        removePath(resolved, dryRun);
      }
    }
  }
}

function removeModuleExcelFile(root: string, moduleName: string, dryRun: boolean): void {
  const excelDir = path.join(root, "data", "excel", "tests");
  if (!exists(excelDir)) {
    return;
  }

  const aliases = moduleAliases(moduleName);
  const expectedNames = new Set<string>();
  for (const alias of aliases) {
    expectedNames.add(`${alias}_test_cases.xlsx`.toLowerCase());
    expectedNames.add(`${alias.charAt(0).toUpperCase()}${alias.slice(1)}_Test_Cases.xlsx`.toLowerCase());
  }

  const files = fs.readdirSync(excelDir, { withFileTypes: true });
  for (const entry of files) {
    if (!entry.isFile()) {
      continue;
    }
    if (expectedNames.has(entry.name.toLowerCase())) {
      removePath(path.join(excelDir, entry.name), dryRun);
    }
  }
}

function removeProjectFromPlaywrightConfig(root: string, moduleName: string, dryRun: boolean): void {
  const configPath = path.join(root, "playwright.config.ts");
  if (!exists(configPath)) {
    return;
  }

  const source = fs.readFileSync(configPath, "utf8");
  const { sourceFile, arrayNode } = findProjectsArrayLiteral(source);
  const aliases = new Set(moduleAliases(moduleName));

  const keptElements = arrayNode.elements.filter((element) => {
    if (!ts.isObjectLiteralExpression(element)) {
      return true;
    }
    const nameValue = readObjectStringProperty(sourceFile, element, "name")?.toLowerCase();
    const testDirValue = readObjectStringProperty(sourceFile, element, "testDir")?.toLowerCase();

    if (nameValue && aliases.has(nameValue)) {
      return false;
    }
    if (!testDirValue) {
      return true;
    }

    const matchedAlias = [...aliases].some((alias) => testDirValue === `./tests/${alias}`);
    return !matchedAlias;
  });

  if (keptElements.length === arrayNode.elements.length) {
    return;
  }

  const keptTexts = keptElements.map((element) =>
    source.slice(element.getStart(sourceFile), element.getEnd())
  );
  const nextArrayText = keptTexts.length ? `[\n${keptTexts.join(",\n")}\n  ]` : "[]";

  const nextSource =
    source.slice(0, arrayNode.getStart(sourceFile)) +
    nextArrayText +
    source.slice(arrayNode.getEnd());

  if (dryRun) {
    logInfo("DELETE-MODULE", `[dry-run] remove Playwright project for module '${moduleName}'`);
    return;
  }

  fs.writeFileSync(configPath, nextSource, "utf8");
  logInfo("DELETE-MODULE", `Updated Playwright config: ${configPath}`);
}

function removeModulePageObjects(root: string, moduleName: string, dryRun: boolean): void {
  const pagesModulesDir = path.join(root, "core", "pages", "modules");
  if (!exists(pagesModulesDir)) {
    return;
  }

  for (const alias of moduleAliases(moduleName)) {
    const filePath = path.join(pagesModulesDir, `${alias}.page.ts`);
    removePath(filePath, dryRun);
  }
}

function removeModuleScriptsFromPackageJson(root: string, moduleName: string, dryRun: boolean): void {
  const packageJsonPath = path.join(root, "package.json");
  if (!exists(packageJsonPath)) {
    return;
  }

  const raw = fs.readFileSync(packageJsonPath, "utf8");
  const parsed = JSON.parse(raw) as { scripts?: Record<string, string> };
  const scripts = parsed.scripts || {};

  const aliases = moduleAliases(moduleName);
  const toDelete = Object.keys(scripts).filter((key) =>
    aliases.some((alias) => key === `test:${alias}` || key.startsWith(`test:${alias}:`))
  );

  if (!toDelete.length) {
    return;
  }

  for (const key of toDelete) {
    if (dryRun) {
      logInfo("DELETE-MODULE", `[dry-run] remove package script: ${key}`);
      continue;
    }
    delete scripts[key];
    logInfo("DELETE-MODULE", `Removed package script: ${key}`);
  }

  if (dryRun) {
    return;
  }

  parsed.scripts = scripts;
  fs.writeFileSync(packageJsonPath, `${JSON.stringify(parsed, null, 2)}\n`, "utf8");
  logInfo("DELETE-MODULE", `Updated package scripts: ${packageJsonPath}`);
}

function removeModuleFromAppNavigator(root: string, moduleName: string, dryRun: boolean): void {
  const appNavigatorPath = path.join(root, "core", "navigation", "AppNavigator.ts");
  if (!exists(appNavigatorPath)) {
    return;
  }

  const original = fs.readFileSync(appNavigatorPath, "utf8");
  let nextSource = original;
  const appPageKeys = moduleAliases(moduleName).map(toAppPageKey);
  for (const appPageKey of appPageKeys) {
    const enumLinePattern = new RegExp(
      `^\\s*${escapeRegex(appPageKey)}\\s*=\\s*["'][^"']+["'],?\\r?\\n`,
      "m"
    );
    const routeLinePattern = new RegExp(
      `^\\s*\\[AppPage\\.${escapeRegex(appPageKey)}\\]\\s*:\\s*["'][^"']+["'],?\\r?\\n`,
      "m"
    );

    nextSource = nextSource.replace(enumLinePattern, "");
    nextSource = nextSource.replace(routeLinePattern, "");
  }

  if (nextSource === original) {
    return;
  }

  if (dryRun) {
    logInfo(
      "DELETE-MODULE",
      `[dry-run] remove AppNavigator entries for ${appPageKeys.map((k) => `AppPage.${k}`).join(", ")}`
    );
    return;
  }

  fs.writeFileSync(appNavigatorPath, nextSource, "utf8");
  logInfo("DELETE-MODULE", `Updated AppNavigator: ${appNavigatorPath}`);
}

function refreshFlowRegistry(dryRun: boolean): void {
  if (dryRun) {
    logInfo("DELETE-MODULE", "[dry-run] regenerate flow registry");
    return;
  }
  generateFlowRegistry();
  logInfo("DELETE-MODULE", "Regenerated flow registry.");
}

function runStep(stepName: string, fn: () => void, completed: string[]): void {
  fn();
  completed.push(stepName);
}

async function deleteModule(options: Options): Promise<void> {
  const root = process.cwd();
  await confirmDelete(options);
  const completedSteps: string[] = [];

  try {
    runStep("remove-module-folders", () => removeModuleFolders(root, options.moduleName, options.dryRun), completedSteps);
    runStep("remove-module-excel", () => removeModuleExcelFile(root, options.moduleName, options.dryRun), completedSteps);
    runStep("remove-module-pages", () => removeModulePageObjects(root, options.moduleName, options.dryRun), completedSteps);
    runStep(
      "remove-playwright-project",
      () => removeProjectFromPlaywrightConfig(root, options.moduleName, options.dryRun),
      completedSteps
    );
    runStep(
      "remove-module-scripts",
      () => removeModuleScriptsFromPackageJson(root, options.moduleName, options.dryRun),
      completedSteps
    );
    runStep(
      "remove-appnavigator-entries",
      () => removeModuleFromAppNavigator(root, options.moduleName, options.dryRun),
      completedSteps
    );
    runStep("refresh-flow-registry", () => refreshFlowRegistry(options.dryRun), completedSteps);
  } catch (error) {
    const completedText = completedSteps.length ? completedSteps.join(", ") : "none";
    throw new Error(
      `Delete stopped due to error. Completed steps: ${completedText}. Recovery: check git diff, restore if needed, then re-run delete:module. Root cause: ${
        (error as Error).message
      }`
    );
  }

  logInfo("DELETE-MODULE", `Delete module flow completed for '${options.moduleName}'.`);
  if (options.dryRun) {
    logInfo("DELETE-MODULE", "No files were changed because --dry-run was used.");
  }
}

if (require.main === module) {
  (async () => {
    try {
      const options = parseOptions(process.argv.slice(2));
      await deleteModule(options);
    } catch (error) {
      logError("DELETE-MODULE", `Failed: ${(error as Error).message}`);
      process.exit(1);
    }
  })();
}
