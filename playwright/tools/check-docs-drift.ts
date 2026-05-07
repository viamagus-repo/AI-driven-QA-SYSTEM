#!/usr/bin/env node

import { execSync } from "child_process";
import { logError, logInfo } from "../core/utils/logger";

function getChangedFiles(baseSha: string, headSha: string): string[] {
  const output = execSync(`git diff --name-only ${baseSha}...${headSha}`, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return output
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function isCodePath(filePath: string): boolean {
  return /^(core\/|tools\/|tests\/|flows\/|playwright\.config\.ts|package\.json|tsconfig\.json)/.test(
    filePath
  );
}

function isDocsPath(filePath: string): boolean {
  return /^(docs\/|documentation$|README\.md$)/.test(filePath);
}

function checkDocsDrift(): void {
  const baseSha = process.env.GITHUB_BASE_SHA;
  const headSha = process.env.GITHUB_HEAD_SHA;

  if (!baseSha || !headSha) {
    logInfo("DOCS-DRIFT", "Skipping docs drift check (GITHUB_BASE_SHA/GITHUB_HEAD_SHA not set).");
    return;
  }

  const changedFiles = getChangedFiles(baseSha, headSha);
  const codeChanged = changedFiles.some(isCodePath);
  const docsChanged = changedFiles.some(isDocsPath);

  if (codeChanged && !docsChanged) {
    logError(
      "DOCS-DRIFT",
      "Code changed but docs were not updated. Update docs/ or documentation before merging."
    );
    process.exit(1);
  }

  logInfo("DOCS-DRIFT", "Docs/code drift check passed.");
}

if (require.main === module) {
  try {
    checkDocsDrift();
  } catch (error) {
    logError("DOCS-DRIFT", `Failed: ${(error as Error).message}`);
    process.exit(1);
  }
}

