#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import * as XLSX from "xlsx";
import { validateFlowInputData } from "../core/data/flowInputSchemas";
import { RuntimeTestCaseSchema } from "../core/data/testCaseSchema";
import { logError, logInfo, logWarn } from "../core/utils/logger";
import {
  normalizeModuleValue,
  resolveModuleFromAvailable,
} from "../core/utils/moduleNames";

interface RawRow {
  [key: string]: unknown;
}

interface ConvertedTestCase {
  id: string;
  module: string;
  flowCode: string;
  description: string;
  type: string;
  priority: string;
  suite: string;
  tags: string[];
  steps?: string;
  expectedResult?: string;
  testData: {
    input: Record<string, unknown>;
    expectedData?: Record<string, unknown>;
  };
}

function toCamelCase(key: string): string {
  return key
    .trim()
    .toLowerCase()
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""));
}

function normalizeKeys(row: RawRow): RawRow {
  const out: RawRow = {};
  for (const key of Object.keys(row)) {
    out[toCamelCase(key)] = row[key];
  }
  return out;
}

function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function asString(value: unknown): string {
  if (value === undefined || value === null) return "";
  return String(value).trim();
}

function parseJsonColumn(
  id: string,
  columnName: string,
  value: unknown
): Record<string, unknown> | undefined {
  const raw = asString(value);
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch (error) {
    throw new Error(
      `Invalid JSON in '${columnName}' for ${id}: ${(error as Error).message}`
    );
  }
}

function splitCsv(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalize(value: string): string {
  return normalizeModuleValue(value);
}

function validateFlowCode(moduleName: string, flowCode: string): void {
  const flowsRoot = path.join(process.cwd(), "flows");
  if (!fs.existsSync(flowsRoot)) return;

  const moduleDirs = fs
    .readdirSync(flowsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory());

  const matchedModuleDirName = resolveModuleFromAvailable(
    moduleName,
    moduleDirs.map((entry) => entry.name)
  );
  const matchedModuleDir = matchedModuleDirName
    ? moduleDirs.find((entry) => entry.name === matchedModuleDirName)
    : undefined;

  if (!matchedModuleDir) {
    throw new Error(
      `No flow folder found for module '${moduleName}' under ${flowsRoot}`
    );
  }

  const flowFiles = fs
    .readdirSync(path.join(flowsRoot, matchedModuleDir.name), { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".flow.ts"))
    .map((entry) => entry.name.replace(/\.flow\.ts$/, ""));

  const requested = normalize(flowCode);
  const matches = flowFiles.filter((fileStem) => {
    const stem = normalize(fileStem);
    return stem === requested || stem.startsWith(requested) || requested.startsWith(stem);
  });

  if (matches.length === 1) return;

  if (matches.length === 0) {
    throw new Error(
      `flowCode '${flowCode}' not found in module '${moduleName}'. Available flows: ${flowFiles.join(", ")}`
    );
  }

  throw new Error(
    `flowCode '${flowCode}' is ambiguous in module '${moduleName}'. Matches: ${matches.join(", ")}`
  );
}

function toConvertedTestCase(row: RawRow): ConvertedTestCase {
  const id = asString(row.id);
  const moduleName = normalizeModuleValue(asString(row.module));
  const flowCode = asString(row.flowCode ?? row.flowcode ?? row.flowKey ?? row.flowkey);
  const description = asString(row.scenario);
  const type = asString(row.type);
  const priority = asString(row.priority);
  const suite = asString(row.suite);
  const tags = splitCsv(asString(row.tags));

  if (!id || !moduleName || !flowCode) {
    throw new Error(
      `Missing required fields. Required: id, module, flowCode. Row id: '${id || "UNKNOWN"}'`
    );
  }
  validateFlowCode(moduleName, flowCode);

  const candidate: ConvertedTestCase = {
    id,
    module: moduleName,
    flowCode,
    description,
    type,
    priority,
    suite,
    tags,
    steps: asString(row.steps) || undefined,
    expectedResult: asString(row.expectedResult) || undefined,
    testData: {
      input: parseJsonColumn(id, "input", row.input) || {},
      expectedData: parseJsonColumn(id, "expectedData", row.expectedData),
    },
  };

  const parsed = RuntimeTestCaseSchema.safeParse(candidate);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `${issue.path.join(".") || "<root>"}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid testcase data for ${id}: ${issues}`);
  }

  validateFlowInputData(moduleName, flowCode, candidate.testData.input);
  return parsed.data as ConvertedTestCase;
}

function writeModuleConfig(
  moduleName: string,
  moduleDir: string,
  cases: ConvertedTestCase[]
): void {
  const suites: Record<string, string[]> = {};
  const tags: Record<string, string[]> = {};
  const testDataFiles: Record<string, string> = {};

  for (const testCase of cases) {
    testDataFiles[testCase.id] = `${testCase.id}.json`;

    for (const suiteName of splitCsv(testCase.suite || "regression")) {
      suites[suiteName] = suites[suiteName] || [];
      suites[suiteName].push(testCase.id);
    }

    for (const tagName of testCase.tags) {
      tags[tagName] = tags[tagName] || [];
      tags[tagName].push(testCase.id);
    }
  }

  const config = {
    module: moduleName,
    lastUpdated: new Date().toISOString().split("T")[0],
    description: `${moduleName} module test suite configuration`,
    suites,
    testDataFiles,
    tags,
  };

  fs.writeFileSync(
    path.join(moduleDir, "config.json"),
    JSON.stringify(config, null, 2),
    "utf8"
  );
  logInfo(
    "EXCEL-TO-JSON",
    `Wrote config for module '${moduleName}' with ${cases.length} testcases`
  );
}

export function convertExcelToJson(inputFileOrDir: string, outputBaseDir: string): void {
  logInfo("EXCEL-TO-JSON", `Input: ${inputFileOrDir}`);
  logInfo("EXCEL-TO-JSON", `Output: ${outputBaseDir}`);

  if (!fs.existsSync(inputFileOrDir)) {
    throw new Error(`Input path not found: ${inputFileOrDir}`);
  }

  const files = fs.lstatSync(inputFileOrDir).isDirectory()
    ? fs
        .readdirSync(inputFileOrDir)
        .filter((f) => f.endsWith(".xlsx"))
        .map((f) => path.join(inputFileOrDir, f))
    : [inputFileOrDir];

  if (!files.length) {
    throw new Error(`No .xlsx files found at: ${inputFileOrDir}`);
  }

  logInfo("EXCEL-TO-JSON", `Found ${files.length} excel file(s)`);

  for (const file of files) {
    logInfo("EXCEL-TO-JSON", `Processing file: ${file}`);
    const workbook = XLSX.readFile(file);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawRows = XLSX.utils.sheet_to_json<RawRow>(sheet);

    if (!rawRows.length) {
      logWarn(
        "EXCEL-TO-JSON",
        `No testcase rows found in sheet '${sheetName}' for file ${file}. Skipping file.`
      );
      continue;
    }
    logInfo(
      "EXCEL-TO-JSON",
      `Sheet '${sheetName}' has ${rawRows.length} row(s)`
    );

    const byModule: Record<string, ConvertedTestCase[]> = {};
    for (const raw of rawRows) {
      const normalized = normalizeKeys(raw);
      const converted = toConvertedTestCase(normalized);
      byModule[converted.module] = byModule[converted.module] || [];
      byModule[converted.module].push(converted);
    }

    for (const moduleName of Object.keys(byModule)) {
      const moduleDir = path.join(outputBaseDir, moduleName);
      ensureDir(moduleDir);
      logInfo(
        "EXCEL-TO-JSON",
        `Writing ${byModule[moduleName].length} testcase(s) for module '${moduleName}'`
      );

      for (const testCase of byModule[moduleName]) {
        logInfo(
          "EXCEL-TO-JSON",
          `Writing testcase '${testCase.id}' (flowCode=${testCase.flowCode})`
        );
        fs.writeFileSync(
          path.join(moduleDir, `${testCase.id}.json`),
          JSON.stringify(testCase, null, 2),
          "utf8"
        );
      }

      writeModuleConfig(moduleName, moduleDir, byModule[moduleName]);
    }
  }
}

if (require.main === module) {
  const input = process.argv[2];
  const output = process.argv[3] || path.join(process.cwd(), "data", "json", "modules");

  if (!input) {
    console.error(
      "Usage: npx ts-node tools/excel-to-json-test-case.ts <input.xlsx|folder> [outputDir]"
    );
    process.exit(1);
  }

  try {
    convertExcelToJson(input, output);
    logInfo("EXCEL-TO-JSON", "Excel conversion completed.");
  } catch (error) {
    logError("EXCEL-TO-JSON", `Conversion failed: ${(error as Error).message}`);
    process.exit(1);
  }
}
