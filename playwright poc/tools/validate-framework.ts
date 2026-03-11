#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import * as XLSX from "xlsx";
import { logError, logInfo } from "../core/utils/logger";

type RawRow = Record<string, unknown>;

type FlowIndex = Record<string, string[]>;

function toCamelCase(key: string): string {
  return key
    .trim()
    .toLowerCase()
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""));
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function normalizeModuleName(value: string): string {
  const lower = normalize(value);
  if (lower === "users") return "user";
  if (lower === "emails") return "email";
  return lower;
}

function asString(value: unknown): string {
  if (value === undefined || value === null) return "";
  return String(value).trim();
}

function normalizeKeys(row: RawRow): RawRow {
  const out: RawRow = {};
  for (const key of Object.keys(row)) {
    out[toCamelCase(key)] = row[key];
  }
  return out;
}

function buildFlowIndex(flowsRoot: string): FlowIndex {
  const index: FlowIndex = {};
  if (!fs.existsSync(flowsRoot)) {
    return index;
  }

  const moduleDirs = fs
    .readdirSync(flowsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory());

  for (const moduleDir of moduleDirs) {
    const normalizedModule = normalizeModuleName(moduleDir.name);
    const stems = fs
      .readdirSync(path.join(flowsRoot, moduleDir.name), { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith(".flow.ts"))
      .map((entry) => entry.name.replace(/\.flow\.ts$/, ""))
      .sort((a, b) => a.localeCompare(b));

    index[normalizedModule] = stems;
  }

  return index;
}

function validateFlowCodeMatch(moduleName: string, flowCode: string, flowIndex: FlowIndex): string[] {
  const moduleFlows = flowIndex[normalizeModuleName(moduleName)];
  if (!moduleFlows) {
    return [`No flow folder found for module '${moduleName}'`];
  }

  const requested = normalize(flowCode);
  const matches = moduleFlows.filter((stem) => {
    const value = normalize(stem);
    return value === requested || value.startsWith(requested) || requested.startsWith(value);
  });

  if (matches.length === 1) {
    return [];
  }
  if (!matches.length) {
    return [
      `Unknown flowCode '${flowCode}' for module '${moduleName}'. Available: ${moduleFlows.join(", ")}`,
    ];
  }
  return [
    `Ambiguous flowCode '${flowCode}' for module '${moduleName}'. Matches: ${matches.join(", ")}`,
  ];
}

function validateExcelFiles(excelRoot: string, flowIndex: FlowIndex): string[] {
  const issues: string[] = [];
  if (!fs.existsSync(excelRoot)) {
    issues.push(`Excel folder not found: ${excelRoot}`);
    return issues;
  }

  const files = fs
    .readdirSync(excelRoot)
    .filter((name) => name.toLowerCase().endsWith(".xlsx"))
    .map((name) => path.join(excelRoot, name));

  for (const file of files) {
    const workbook = XLSX.readFile(file);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<RawRow>(sheet);

    rows.forEach((raw, idx) => {
      const rowNum = idx + 2; // row 1 is header
      const row = normalizeKeys(raw);
      const id = asString(row.id) || "UNKNOWN_ID";
      const moduleName = asString(row.module);
      const flowCode = asString(row.flowCode ?? row.flowcode ?? row.flowKey ?? row.flowkey);

      if (!moduleName) {
        issues.push(`${file} [${sheetName} row ${rowNum}] id=${id}: Missing 'module'`);
        return;
      }

      if (!flowCode) {
        issues.push(
          `${file} [${sheetName} row ${rowNum}] id=${id} module=${moduleName}: Missing 'flowCode'`
        );
        return;
      }

      const flowIssues = validateFlowCodeMatch(moduleName, flowCode, flowIndex);
      for (const issue of flowIssues) {
        issues.push(`${file} [${sheetName} row ${rowNum}] id=${id} module=${moduleName}: ${issue}`);
      }
    });
  }

  return issues;
}

function validateGeneratedJson(jsonModulesRoot: string): string[] {
  const issues: string[] = [];
  if (!fs.existsSync(jsonModulesRoot)) {
    issues.push(`Generated JSON folder not found: ${jsonModulesRoot}`);
    return issues;
  }

  const moduleDirs = fs
    .readdirSync(jsonModulesRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(jsonModulesRoot, entry.name));

  for (const moduleDir of moduleDirs) {
    const files = fs
      .readdirSync(moduleDir)
      .filter((name) => name.endsWith(".json") && name !== "config.json")
      .map((name) => path.join(moduleDir, name));

    for (const file of files) {
      const raw = fs.readFileSync(file, "utf8");
      try {
        const parsed = JSON.parse(raw) as Record<string, unknown>;
        const id = asString(parsed.id) || path.basename(file);
        const flowCode = asString(parsed.flowCode ?? parsed.flowKey);
        if (!flowCode) {
          issues.push(`${file} id=${id}: Missing 'flowCode'`);
        }
      } catch (error) {
        issues.push(`${file}: Invalid JSON (${(error as Error).message})`);
      }
    }
  }

  return issues;
}

function validateFramework(): void {
  const root = process.cwd();
  const flowsRoot = path.join(root, "flows");
  const excelRoot = path.join(root, "data", "excel", "tests");
  const jsonModulesRoot = path.join(root, "data", "json", "modules");

  const flowIndex = buildFlowIndex(flowsRoot);
  const issues = [
    ...validateExcelFiles(excelRoot, flowIndex),
    ...validateGeneratedJson(jsonModulesRoot),
  ];

  if (!issues.length) {
    logInfo("VALIDATE-FRAMEWORK", "Validation passed. No framework consistency issues found.");
    return;
  }

  logError("VALIDATE-FRAMEWORK", `Validation failed with ${issues.length} issue(s):`);
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

if (require.main === module) {
  try {
    validateFramework();
  } catch (error) {
    logError("VALIDATE-FRAMEWORK", `Failed: ${(error as Error).message}`);
    process.exit(1);
  }
}
