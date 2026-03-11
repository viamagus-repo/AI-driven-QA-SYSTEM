#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import { createInterface } from "readline";
import { logError, logInfo, logWarn } from "../core/utils/logger";

type Options = {
  keepAuth: boolean;
  dryRun: boolean;
  yes: boolean;
};

function parseOptions(argv: string[]): Options {
  return {
    keepAuth: !argv.includes("--drop-auth"),
    dryRun: argv.includes("--dry-run"),
    yes: argv.includes("--yes") || argv.includes("-y"),
  };
}

function exists(targetPath: string): boolean {
  return fs.existsSync(targetPath);
}

function removeFile(filePath: string, dryRun: boolean): void {
  if (!exists(filePath)) return;
  if (dryRun) {
    logInfo("RESET-FRAMEWORK", `[dry-run] remove file: ${filePath}`);
    return;
  }
  fs.rmSync(filePath, { force: true });
  logInfo("RESET-FRAMEWORK", `Removed file: ${filePath}`);
}

function removeDir(dirPath: string, dryRun: boolean): void {
  if (!exists(dirPath)) return;
  if (dryRun) {
    logInfo("RESET-FRAMEWORK", `[dry-run] remove directory: ${dirPath}`);
    return;
  }
  fs.rmSync(dirPath, { recursive: true, force: true });
  logInfo("RESET-FRAMEWORK", `Removed directory: ${dirPath}`);
}

function cleanDirectory(
  dirPath: string,
  keep: (name: string, fullPath: string, isDirectory: boolean) => boolean,
  dryRun: boolean
): void {
  if (!exists(dirPath)) return;

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (keep(entry.name, fullPath, entry.isDirectory())) {
      logInfo("RESET-FRAMEWORK", `Keeping: ${fullPath}`);
      continue;
    }
    if (entry.isDirectory()) {
      removeDir(fullPath, dryRun);
    } else {
      removeFile(fullPath, dryRun);
    }
  }
}

function resetPlaywrightConfig(configPath: string, keepAuth: boolean, dryRun: boolean): void {
  const projects = keepAuth
    ? `
  projects: [
    {
      name: "auth-setup",
      testMatch: /tests\\/auth\\/auth\\.setup\\.spec\\.ts/,
      use: {
        storageState: undefined,
        headless: true,
      },
    },
    {
      name: "auth",
      testMatch: /tests\\/auth\\/auth\\.orchestrator\\.spec\\.ts/,
      use: {
        storageState: undefined,
      },
    },
  ],
`
    : `
  projects: [],
`;

  const content = `import { defineConfig, devices } from "@playwright/test";
import * as dotenv from "dotenv";

dotenv.config({ quiet: true });

export default defineConfig({
  testDir: "./tests",

  fullyParallel: false,
  workers: 1,

  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: "html",

  use: {
    baseURL: process.env.BASE_URL || "https://example.com",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    headless: false,
    serviceWorkers: "block",
    ...devices["Desktop Chrome"],
  },
${projects}});
`;

  if (dryRun) {
    logInfo("RESET-FRAMEWORK", `[dry-run] reset playwright config: ${configPath}`);
    return;
  }
  fs.writeFileSync(configPath, content, "utf8");
  logInfo("RESET-FRAMEWORK", `Reset playwright config: ${configPath}`);
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

async function confirmReset(options: Options): Promise<void> {
  if (options.dryRun || options.yes) {
    return;
  }

  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error(
      "Interactive confirmation is required. Re-run with --yes in non-interactive mode."
    );
  }

  logWarn(
    "RESET-FRAMEWORK",
    "This will delete/reset project-specific artifacts. This action is not reversible."
  );
  const answer = (await askQuestion("Proceed with reset:framework? (y/N): ")).trim().toLowerCase();
  if (answer !== "y" && answer !== "yes") {
    throw new Error("Reset cancelled by user.");
  }
}

async function resetFramework(options: Options): Promise<void> {
  const root = process.cwd();

  const flowsDir = path.join(root, "flows");
  const testsDir = path.join(root, "tests");
  const excelTestsDir = path.join(root, "data", "excel", "tests");
  const jsonModulesDir = path.join(root, "data", "json", "modules");

  const generatedRegistryFile = path.join(root, "core", "flows", "generatedFlowRegistry.ts");
  const storageStateFile = path.join(root, "storage", "auth.json");
  const playwrightReportDir = path.join(root, "playwright-report");
  const testResultsDir = path.join(root, "test-results");
  const playwrightConfigPath = path.join(root, "playwright.config.ts");

  logWarn(
    "RESET-FRAMEWORK",
    `Starting reset (keepAuth=${options.keepAuth}, dryRun=${options.dryRun})`
  );
  await confirmReset(options);

  cleanDirectory(
    flowsDir,
    (name, _fullPath, isDir) => Boolean(options.keepAuth && isDir && name.toLowerCase() === "auth"),
    options.dryRun
  );

  cleanDirectory(
    testsDir,
    (name, _fullPath, isDir) => Boolean(options.keepAuth && isDir && name.toLowerCase() === "auth"),
    options.dryRun
  );

  cleanDirectory(
    excelTestsDir,
    (name, _fullPath, isDir) =>
      Boolean(
        options.keepAuth &&
          !isDir &&
          name.toLowerCase() === "auth_test_cases.xlsx"
      ),
    options.dryRun
  );

  cleanDirectory(
    jsonModulesDir,
    (name, _fullPath, isDir) => Boolean(options.keepAuth && isDir && name.toLowerCase() === "auth"),
    options.dryRun
  );

  removeFile(generatedRegistryFile, options.dryRun);
  removeFile(storageStateFile, options.dryRun);
  removeDir(playwrightReportDir, options.dryRun);
  removeDir(testResultsDir, options.dryRun);
  resetPlaywrightConfig(playwrightConfigPath, options.keepAuth, options.dryRun);

  logInfo("RESET-FRAMEWORK", "Reset completed.");
  if (options.dryRun) {
    logInfo("RESET-FRAMEWORK", "No files were changed because --dry-run was used.");
  }
  logInfo(
    "RESET-FRAMEWORK",
    "Next: set .env/.env.example BASE_URL, run generate:module, validate:framework, and testdata:prepare."
  );
}

  if (require.main === module) {
  (async () => {
    try {
      const options = parseOptions(process.argv.slice(2));
      await resetFramework(options);
    } catch (error) {
      logError("RESET-FRAMEWORK", `Failed: ${(error as Error).message}`);
      process.exit(1);
    }
  })();
}
