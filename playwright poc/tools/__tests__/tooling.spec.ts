import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { execFileSync } from "child_process";
import * as XLSX from "xlsx";
import { afterEach, describe, expect, it } from "vitest";

const REPO_ROOT = process.cwd();
const TS_NODE_BIN = path.join(REPO_ROOT, "node_modules", "ts-node", "dist", "bin.js");
const GENERATE_FLOW_SCRIPT = path.join(REPO_ROOT, "tools", "generate-flow.ts");
const GENERATE_MODULE_SCRIPT = path.join(REPO_ROOT, "tools", "generate-module.ts");
const DELETE_MODULE_SCRIPT = path.join(REPO_ROOT, "tools", "delete-module.ts");
const RESET_FRAMEWORK_SCRIPT = path.join(REPO_ROOT, "tools", "reset-framework.ts");
const VALIDATE_FRAMEWORK_SCRIPT = path.join(REPO_ROOT, "tools", "validate-framework.ts");

const tempDirs: string[] = [];

function mkTempWorkspace(prefix: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `fw-${prefix}-`));
  tempDirs.push(dir);
  return dir;
}

function writeFile(root: string, relativePath: string, content: string): void {
  const filePath = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

function runCli(scriptPath: string, args: string[], cwd: string): { stdout: string; stderr: string } {
  try {
    const stdout = execFileSync("node", [TS_NODE_BIN, scriptPath, ...args], {
      cwd,
      encoding: "utf8",
      stdio: "pipe",
    });
    return { stdout, stderr: "" };
  } catch (error) {
    const err = error as { stdout?: Buffer | string; stderr?: Buffer | string; message: string };
    const stdout = Buffer.isBuffer(err.stdout) ? err.stdout.toString("utf8") : err.stdout || "";
    const stderr = Buffer.isBuffer(err.stderr) ? err.stderr.toString("utf8") : err.stderr || err.message;
    throw new Error(`${stdout}\n${stderr}`);
  }
}

function runCliWithEnv(
  scriptPath: string,
  args: string[],
  cwd: string,
  env: Record<string, string>
): { stdout: string; stderr: string } {
  try {
    const stdout = execFileSync("node", [TS_NODE_BIN, scriptPath, ...args], {
      cwd,
      encoding: "utf8",
      stdio: "pipe",
      env: { ...process.env, ...env },
    });
    return { stdout, stderr: "" };
  } catch (error) {
    const err = error as { stdout?: Buffer | string; stderr?: Buffer | string; message: string };
    const stdout = Buffer.isBuffer(err.stdout) ? err.stdout.toString("utf8") : err.stdout || "";
    const stderr = Buffer.isBuffer(err.stderr) ? err.stderr.toString("utf8") : err.stderr || err.message;
    throw new Error(`${stdout}\n${stderr}`);
  }
}

function runCliExpectFailure(scriptPath: string, args: string[], cwd: string): string {
  try {
    runCli(scriptPath, args, cwd);
    throw new Error("Expected command to fail but it succeeded.");
  } catch (error) {
    return (error as Error).message;
  }
}

function createBaseWorkspace(root: string): void {
  writeFile(
    root,
    "package.json",
    JSON.stringify(
      {
        name: "fixture",
        version: "1.0.0",
        scripts: {
          "test:controlled": "echo controlled",
          "test:user": "echo user",
          "test:user:smoke": "echo user smoke",
          "test:email": "echo email",
        },
      },
      null,
      2
    )
  );

  writeFile(
    root,
    "playwright.config.ts",
    `import { defineConfig } from "@playwright/test";
export default defineConfig({
  projects: [
    { name: "auth-setup", testMatch: /tests\\/auth\\/auth\\.setup\\.spec\\.ts/ },
    { name: "auth", testMatch: /tests\\/auth\\/auth\\.orchestrator\\.spec\\.ts/ },
    { name: "user", testDir: "./tests/user", dependencies: ["auth-setup"] },
    { name: "email", testDir: "./tests/email", dependencies: ["auth-setup"] },
  ],
});
`
  );

  writeFile(
    root,
    "core/navigation/AppNavigator.ts",
    `import { Page } from "@playwright/test";
export enum AppPage {
  LOGIN = "login",
  HOME = "home",
  USER = "user",
  USERS = "users",
  EMAIL = "email",
  EMAILS = "emails",
}
const ROUTES: Record<AppPage, string> = {
  [AppPage.LOGIN]: "/",
  [AppPage.HOME]: "/staff/appointments",
  [AppPage.USER]: "/staff/users",
  [AppPage.USERS]: "/staff/users",
  [AppPage.EMAIL]: "/staff/messages/inboxList",
  [AppPage.EMAILS]: "/staff/messages/inboxList",
};
export class AppNavigator {
  constructor(private readonly page: Page) {}
  async goTo(target: AppPage) { await this.page.goto(ROUTES[target]); }
}
`
  );

  writeFile(
    root,
    "flows/auth/loginValid.flow.ts",
    `export async function loginValid(): Promise<void> { return; }`
  );

  writeFile(
    root,
    "core/data/flowInputSchemas.ts",
    `import { z } from "zod";
import { normalizeModuleValue } from "../utils/moduleNames";

const requiredString = z.string().trim().min(1);

const flowInputSchemas: Record<string, Record<string, z.ZodTypeAny>> = {
  auth: {
    loginvalid: z.record(requiredString),
  },
};

export function getFlowInputSchema(moduleName: string, flowCode: string): z.ZodTypeAny | undefined {
  const moduleSchemas = flowInputSchemas[normalizeModuleValue(moduleName)];
  if (!moduleSchemas) {
    return undefined;
  }
  return moduleSchemas[normalizeModuleValue(flowCode)];
}

export function validateFlowInputData(): void {
  return;
}
`
  );
}

afterEach(() => {
  for (const dir of tempDirs.splice(0, tempDirs.length)) {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }
});

describe("tooling scripts", () => {
  it("generate:module creates scaffold and stays idempotent for config/nav updates", () => {
    const root = mkTempWorkspace("generate");
    createBaseWorkspace(root);

    runCli(GENERATE_MODULE_SCRIPT, ["billing", "--route=/staff/billing"], root);
    runCli(GENERATE_MODULE_SCRIPT, ["billing", "--route=/staff/billing"], root);

    expect(fs.existsSync(path.join(root, "flows/billing/sample.flow.ts"))).toBe(true);
    expect(fs.existsSync(path.join(root, "tests/billing/billing.orchestrator.spec.ts"))).toBe(true);
    expect(fs.existsSync(path.join(root, "core/pages/BasePage.ts"))).toBe(true);
    expect(fs.existsSync(path.join(root, "core/pages/modules/billing.page.ts"))).toBe(true);
    const sampleFlow = fs.readFileSync(path.join(root, "flows/billing/sample.flow.ts"), "utf8");
    expect(sampleFlow).toContain('import { expect, Page } from "@playwright/test";');
    expect(sampleFlow).toContain('import { billingSampleInputSchema } from "../../core/data/flowInputSchemas";');
    expect(sampleFlow).toContain("const input = getValidatedInput(testCase, billingSampleInputSchema);");
    expect(sampleFlow).toContain('import { BillingPage } from "../../core/pages/modules/billing.page";');

    const flowSchemas = fs.readFileSync(path.join(root, "core/data/flowInputSchemas.ts"), "utf8");
    expect(flowSchemas).toContain("export const billingSampleInputSchema = z.record(requiredString);");
    expect(flowSchemas).toContain('"billing": {');
    expect(flowSchemas).toContain('"sample": billingSampleInputSchema');

    const playwrightConfig = fs.readFileSync(path.join(root, "playwright.config.ts"), "utf8");
    expect((playwrightConfig.match(/name:\s*"billing"/g) || []).length).toBe(1);

    const navigator = fs.readFileSync(path.join(root, "core/navigation/AppNavigator.ts"), "utf8");
    expect((navigator.match(/BILLING\s*=\s*"billing"/g) || []).length).toBe(1);
    expect((navigator.match(/\[AppPage\.BILLING\]:\s*"\/staff\/billing"/g) || []).length).toBe(1);
  });

  it("generate:module preserves explicit plural module names", () => {
    const root = mkTempWorkspace("generate-users");
    createBaseWorkspace(root);

    runCli(GENERATE_MODULE_SCRIPT, ["users", "--route=/staff/users"], root);

    expect(fs.existsSync(path.join(root, "flows/users/sample.flow.ts"))).toBe(true);
    expect(fs.existsSync(path.join(root, "tests/users/users.orchestrator.spec.ts"))).toBe(true);
    expect(fs.existsSync(path.join(root, "data/json/modules/users/config.json"))).toBe(true);
    expect(fs.existsSync(path.join(root, "core/pages/modules/users.page.ts"))).toBe(true);

    const playwrightConfig = fs.readFileSync(path.join(root, "playwright.config.ts"), "utf8");
    expect(playwrightConfig.includes('name: "users"')).toBe(true);
    expect(playwrightConfig.includes('testDir: "./tests/users"')).toBe(true);

    const navigator = fs.readFileSync(path.join(root, "core/navigation/AppNavigator.ts"), "utf8");
    expect(navigator.includes('USERS = "users"')).toBe(true);
    expect(navigator.includes('[AppPage.USERS]: "/staff/users"')).toBe(true);
  });

  it("generate:module accepts route from npm_config_route fallback", () => {
    const root = mkTempWorkspace("generate-users-env");
    createBaseWorkspace(root);

    runCliWithEnv(GENERATE_MODULE_SCRIPT, ["users"], root, {
      npm_config_route: "/staff/users",
    });

    const navigator = fs.readFileSync(path.join(root, "core/navigation/AppNavigator.ts"), "utf8");
    expect(navigator.includes('[AppPage.USERS]: "/staff/users"')).toBe(true);
  });

  it("generate:flow creates a scaffold for the requested module and flow code", () => {
    const root = mkTempWorkspace("generate-flow");
    createBaseWorkspace(root);

    runCli(GENERATE_FLOW_SCRIPT, ["--module=users", "--flowCode=delete"], root);

    const flowFile = path.join(root, "flows/users/delete.flow.ts");
    expect(fs.existsSync(flowFile)).toBe(true);

    const source = fs.readFileSync(flowFile, "utf8");
    expect(source).toContain('export default async function flow');
    expect(source).toContain('import { usersDeleteInputSchema } from "../../core/data/flowInputSchemas";');
    expect(source).toContain("const input = getValidatedInput(testCase, usersDeleteInputSchema);");
    expect(source).toContain('import { UsersPage } from "../../core/pages/modules/users.page";');
    expect(source).toContain("const modulePage = new UsersPage(page);");
    expect(source).toContain("await modulePage.waitForModuleReady();");
    expect(source).toContain("Implement flow 'delete' for module 'users'.");

    const schemas = fs.readFileSync(path.join(root, "core/data/flowInputSchemas.ts"), "utf8");
    expect(schemas).toContain("export const usersDeleteInputSchema = z.record(requiredString);");
    expect(schemas).toContain('"users": {');
    expect(schemas).toContain('"delete": usersDeleteInputSchema');
  });

  it("generate:flow accepts npm_config fallback values", () => {
    const root = mkTempWorkspace("generate-flow-env");
    createBaseWorkspace(root);

    runCliWithEnv(GENERATE_FLOW_SCRIPT, [], root, {
      npm_config_module: "users",
      npm_config_flowcode: "archive",
    });

    expect(fs.existsSync(path.join(root, "flows/users/archive.flow.ts"))).toBe(true);
  });

  it("delete:module removes only the requested module artifacts", () => {
    const root = mkTempWorkspace("delete");
    createBaseWorkspace(root);

    writeFile(root, "flows/user/create.flow.ts", `export async function create(): Promise<void> { return; }`);
    writeFile(root, "tests/user/user.orchestrator.spec.ts", `import { test } from "@playwright/test"; test("x", async () => {});`);
    writeFile(root, "data/json/modules/user/config.json", `{"module":"user","testDataFiles":{},"suites":{},"tags":{},"lastUpdated":"2026-01-01","description":"x"}`);
    writeFile(root, "core/pages/modules/user.page.ts", `export class UserPage {}`);
    writeFile(root, "data/excel/tests/User_Test_Cases.xlsx", "");

    runCli(DELETE_MODULE_SCRIPT, ["user", "--yes"], root);

    expect(fs.existsSync(path.join(root, "flows/user"))).toBe(false);
    expect(fs.existsSync(path.join(root, "tests/user"))).toBe(false);
    expect(fs.existsSync(path.join(root, "data/json/modules/user"))).toBe(false);
    expect(fs.existsSync(path.join(root, "core/pages/modules/user.page.ts"))).toBe(false);

    const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8")) as {
      scripts: Record<string, string>;
    };
    expect(pkg.scripts["test:user"]).toBeUndefined();
    expect(pkg.scripts["test:user:smoke"]).toBeUndefined();
    expect(pkg.scripts["test:controlled"]).toBeDefined();

    const navigator = fs.readFileSync(path.join(root, "core/navigation/AppNavigator.ts"), "utf8");
    expect(/\bUSER\s*=\s*"user"/.test(navigator)).toBe(false);
    expect(/\[AppPage\.USER\]:/.test(navigator)).toBe(false);

    const generatedRegistry = fs.readFileSync(
      path.join(root, "core/flows/generatedFlowRegistry.ts"),
      "utf8"
    );
    expect(generatedRegistry.includes("flows/user")).toBe(false);
  });

  it("reset:framework resets AppNavigator back to baseline routes", () => {
    const root = mkTempWorkspace("reset-framework");
    createBaseWorkspace(root);
    writeFile(root, "core/pages/modules/user.page.ts", `export class UserPage {}`);
    writeFile(root, "core/pages/modules/users.page.ts", `export class UsersPage {}`);
    writeFile(root, "core/pages/modules/email.page.ts", `export class EmailPage {}`);

    runCli(RESET_FRAMEWORK_SCRIPT, ["--yes"], root);

    const navigator = fs.readFileSync(path.join(root, "core/navigation/AppNavigator.ts"), "utf8");
    expect(navigator).toContain('HOME = "home"');
    expect(navigator).toContain('LOGIN = "login"');
    expect(navigator).not.toContain('USER = "user"');
    expect(navigator).not.toContain('USERS = "users"');
    expect(navigator).not.toContain('EMAIL = "email"');
    expect(navigator).not.toContain('AppPage.USER');
    expect(navigator).not.toContain('AppPage.USERS');
    expect(navigator).not.toContain('AppPage.EMAIL');

    expect(fs.existsSync(path.join(root, "core/pages/modules/user.page.ts"))).toBe(false);
    expect(fs.existsSync(path.join(root, "core/pages/modules/users.page.ts"))).toBe(false);
    expect(fs.existsSync(path.join(root, "core/pages/modules/email.page.ts"))).toBe(false);
  });

  it("validate:framework fails fast for invalid testcase data", () => {
    const root = mkTempWorkspace("validate");
    createBaseWorkspace(root);

    const workbook = XLSX.utils.book_new();
    const rows = [
      ["ID", "Module", "Scenario", "Type", "Priority", "Suite", "Tags", "input", "flowCode"],
      ["TC-AUTH-01", "auth", "login scenario", "positive", "high", "smoke", "auth", '{"email":"a@b.com"}', ""],
    ];
    const sheet = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, sheet, "TestCases");
    fs.mkdirSync(path.join(root, "data/excel/tests"), { recursive: true });
    XLSX.writeFile(workbook, path.join(root, "data/excel/tests/Auth_Test_Cases.xlsx"));

    const output = runCliExpectFailure(VALIDATE_FRAMEWORK_SCRIPT, [], root);
    expect(output).toContain("Missing 'flowCode'");
  });

  it("validate:framework fails when required flow input fields are missing", () => {
    const root = mkTempWorkspace("validate-users-create");
    createBaseWorkspace(root);

    writeFile(root, "flows/users/create.flow.ts", `export async function create(): Promise<void> { return; }`);

    const workbook = XLSX.utils.book_new();
    const rows = [
      ["ID", "Module", "Scenario", "Type", "Priority", "Suite", "Tags", "input", "flowCode"],
      ["TC-USER-01", "users", "create user", "positive", "high", "smoke", "users", '{"firstName":"A","lastName":"B","dobYear":"1990","dobMonth":"January","dobDay":"10","email":"a@b.com","reason":"visit","phone":"123"}', "create"],
    ];
    const sheet = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, sheet, "TestCases");
    fs.mkdirSync(path.join(root, "data/excel/tests"), { recursive: true });
    fs.mkdirSync(path.join(root, "data/json/modules"), { recursive: true });
    XLSX.writeFile(workbook, path.join(root, "data/excel/tests/Users_Test_Cases.xlsx"));

    const output = runCliExpectFailure(VALIDATE_FRAMEWORK_SCRIPT, [], root);
    expect(output).toContain("Invalid testData.input for module 'users', flow 'create'");
    expect(output).toContain("state");
  });
});
