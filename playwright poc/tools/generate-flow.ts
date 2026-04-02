#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import { logError, logInfo } from "../core/utils/logger";
import { normalizeModuleValue, validateModuleName } from "../core/utils/moduleNames";

type CliOptions = {
  moduleName: string;
  flowCode: string;
};

function validateFlowCode(raw: string | undefined): string {
  const value = normalizeModuleValue(raw);
  if (!value) {
    throw new Error(
      "Flow code is required. Usage: npm run generate:flow -- --module=<moduleName> --flowCode=<flowCode>"
    );
  }
  if (!/^[a-z][a-z0-9_-]*$/.test(value)) {
    throw new Error(
      "Invalid flow code. Use lowercase letters, numbers, '-' or '_' and start with a letter."
    );
  }
  return value;
}

function parseCliArgs(argv: string[]): CliOptions {
  let moduleName = process.env.npm_config_module;
  let flowCode = process.env.npm_config_flowcode || process.env.npm_config_flow_code;

  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];

    if (arg.endsWith("generate-flow.ts")) {
      continue;
    }
    if (arg.startsWith("--module=")) {
      moduleName = arg.slice("--module=".length);
      continue;
    }
    if (arg === "--module") {
      const nextArg = argv[index + 1];
      if (!nextArg || nextArg.startsWith("--")) {
        throw new Error("Invalid --module usage. Use --module=<moduleName> or --module <moduleName>");
      }
      moduleName = nextArg;
      index += 1;
      continue;
    }
    if (arg.startsWith("--flowCode=")) {
      flowCode = arg.slice("--flowCode=".length);
      continue;
    }
    if (arg.startsWith("--flowcode=")) {
      flowCode = arg.slice("--flowcode=".length);
      continue;
    }
    if (arg === "--flowCode" || arg === "--flowcode") {
      const nextArg = argv[index + 1];
      if (!nextArg || nextArg.startsWith("--")) {
        throw new Error("Invalid --flowCode usage. Use --flowCode=<flowCode> or --flowCode <flowCode>");
      }
      flowCode = nextArg;
      index += 1;
      continue;
    }
    if (arg.startsWith("--")) {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  return {
    moduleName: validateModuleName(
      moduleName,
      "Module name is required. Usage: npm run generate:flow -- --module=<moduleName> --flowCode=<flowCode>",
      "Invalid module name. Use lowercase letters, numbers, '-' or '_' and start with a letter."
    ),
    flowCode: validateFlowCode(flowCode),
  };
}

function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
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

function flowTemplate(moduleName: string, flowCode: string, schemaName: string): string {
  const pageClassName = `${toPascalCase(moduleName)}Page`;
  return `import { expect, Page } from "@playwright/test";
import { BaseTestCase } from "../../core/data/authTypes";
import { ${schemaName} } from "../../core/data/flowInputSchemas";
import { getValidatedInput } from "../../core/data/testData";
import { ${pageClassName} } from "../../core/pages/modules/${moduleName}.page";

export default async function flow(page: Page, testCase?: BaseTestCase): Promise<void> {
  const input = getValidatedInput(testCase, ${schemaName});
  const modulePage = new ${pageClassName}(page);

  void expect;
  void input;
  await modulePage.waitForModuleReady();

  throw new Error("Implement flow '${flowCode}' for module '${moduleName}'.");
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

function ensurePageObjects(moduleName: string): void {
  const pagesDir = path.join(process.cwd(), "core", "pages");
  const modulesDir = path.join(pagesDir, "modules");
  const basePageFile = path.join(pagesDir, "BasePage.ts");
  const modulePageFile = path.join(modulesDir, `${moduleName}.page.ts`);

  ensureDir(pagesDir);
  ensureDir(modulesDir);

  if (!fs.existsSync(basePageFile)) {
    fs.writeFileSync(basePageFile, basePageTemplate(), "utf8");
    logInfo("FLOW-GENERATOR", `Created page scaffold: ${basePageFile}`);
  }

  if (!fs.existsSync(modulePageFile)) {
    fs.writeFileSync(modulePageFile, modulePageTemplate(moduleName), "utf8");
    logInfo("FLOW-GENERATOR", `Created page scaffold: ${modulePageFile}`);
  }
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
    source = source.replace(rootBlockPattern, `const flowInputSchemas: Record<string, Record<string, z.ZodTypeAny>> = {${bodyWithComma}${moduleEntry}\n};`);
  }

  fs.writeFileSync(schemasPath, source, "utf8");
  logInfo("FLOW-GENERATOR", `Updated flow input schemas: ${schemasPath}`);
}

function generateFlow(moduleName: string, flowCode: string): void {
  const flowDir = path.join(process.cwd(), "flows", moduleName);
  const flowFile = path.join(flowDir, `${flowCode}.flow.ts`);
  const schemaName = toSchemaName(moduleName, flowCode);

  ensureDir(flowDir);
  ensurePageObjects(moduleName);

  if (fs.existsSync(flowFile)) {
    throw new Error(`Flow file already exists: ${flowFile}`);
  }

  updateFlowInputSchemas(moduleName, flowCode);
  fs.writeFileSync(flowFile, flowTemplate(moduleName, flowCode, schemaName), "utf8");
  logInfo("FLOW-GENERATOR", `Created flow scaffold: ${flowFile}`);
}

if (require.main === module) {
  try {
    const options = parseCliArgs(process.argv.slice(2));
    generateFlow(options.moduleName, options.flowCode);
  } catch (error) {
    logError("FLOW-GENERATOR", `Failed: ${(error as Error).message}`);
    process.exit(1);
  }
}
