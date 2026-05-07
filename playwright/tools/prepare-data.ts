#!/usr/bin/env node

import * as path from "path";
import { convertExcelToJson } from "./excel-to-json-test-case";
import { generateFlowRegistry } from "./generate-flow-registry";
import { logError, logInfo } from "../core/utils/logger";

const moduleName = (process.argv[2] || "all").toLowerCase();

const baseExcelDir = path.join(process.cwd(), "data", "excel", "tests");
const outputDir = path.join(process.cwd(), "data", "json", "modules");
const authFile = path.join(baseExcelDir, "Auth_Test_Cases.xlsx");

try {
  logInfo("DATA-PREP", `Started for module mode '${moduleName}'`);
  logInfo("DATA-PREP", `Excel source: ${baseExcelDir}`);
  logInfo("DATA-PREP", `JSON output: ${outputDir}`);
  generateFlowRegistry();

  if (moduleName === "auth") {
    logInfo("DATA-PREP", `Converting auth file: ${authFile}`);
    convertExcelToJson(authFile, outputDir);
  } else if (moduleName === "all") {
    logInfo("DATA-PREP", "Converting all Excel files");
    convertExcelToJson(baseExcelDir, outputDir);
  } else {
    logInfo("DATA-PREP", `Unknown module selector '${moduleName}', converting all`);
    convertExcelToJson(baseExcelDir, outputDir);
  }
  logInfo("DATA-PREP", `Completed successfully for '${moduleName}'`);
} catch (error) {
  logError("DATA-PREP", `Failed: ${(error as Error).message}`);
  process.exit(1);
}
