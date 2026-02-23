#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import * as XLSX from "xlsx";
import { logError, logInfo } from "../core/utils/logger";

interface RawRow {
  [key: string]: unknown;
}

interface ConvertedTestCase {
  id: string;
  module: string;
  flowKey: string;
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

function toConvertedTestCase(row: RawRow): ConvertedTestCase {
  const id = asString(row.id);
  const moduleName = asString(row.module).toLowerCase();
  const flowKey = asString(row.flowKey ?? row.flowkey);
  const description = asString(row.scenario);
  const type = asString(row.type);
  const priority = asString(row.priority);
  const suite = asString(row.suite);
  const tags = splitCsv(asString(row.tags));

  if (!id || !moduleName || !flowKey) {
    throw new Error(
      `Missing required fields. Required: id, module, flowKey. Row id: '${id || "UNKNOWN"}'`
    );
  }

  return {
    id,
    module: moduleName,
    flowKey,
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
      throw new Error(`No rows found in sheet '${sheetName}' for file ${file}`);
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
          `Writing testcase '${testCase.id}' (flowKey=${testCase.flowKey})`
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