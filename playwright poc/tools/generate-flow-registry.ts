#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import { logError, logInfo } from "../core/utils/logger";
import { normalizeModuleValue } from "../core/utils/moduleNames";

type FlowEntry = {
  importAlias: string;
  importPath: string;
  moduleName: string;
  flowCode: string;
};

function normalizeModuleName(moduleDirName: string): string {
  return normalizeModuleValue(moduleDirName);
}

function toPosix(p: string): string {
  return p.replace(/\\/g, "/");
}

function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function discoverFlowFiles(flowsRoot: string): FlowEntry[] {
  const entries: FlowEntry[] = [];
  const moduleDirs = fs
    .readdirSync(flowsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  let importIndex = 0;
  for (const moduleDirName of moduleDirs) {
    const moduleDir = path.join(flowsRoot, moduleDirName);
    const files = fs
      .readdirSync(moduleDir, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith(".flow.ts"))
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b));

    for (const fileName of files) {
      const flowCode = fileName.replace(/\.flow\.ts$/, "");
      entries.push({
        importAlias: `flowModule${importIndex++}`,
        importPath: toPosix(path.join("../../flows", moduleDirName, flowCode + ".flow")),
        moduleName: normalizeModuleName(moduleDirName),
        flowCode,
      });
    }
  }

  return entries;
}

function buildRegistryContent(entries: FlowEntry[]): string {
  const imports = entries
    .map((entry) => `import * as ${entry.importAlias} from "${entry.importPath}";`)
    .join("\n");

  const modules = Array.from(new Set(entries.map((entry) => entry.moduleName))).sort();

  const registryRows = modules
    .map((moduleName) => {
      const moduleEntries = entries.filter((entry) => entry.moduleName === moduleName);
      const flowRows = moduleEntries
        .map((entry) => `    "${entry.flowCode}": ${entry.importAlias},`)
        .join("\n");
      return `  "${moduleName}": {\n${flowRows}\n  },`;
    })
    .join("\n");

  return `/* eslint-disable */
// AUTO-GENERATED FILE. DO NOT EDIT.
// Run: npx ts-node tools/generate-flow-registry.ts

${imports}

export type FlowModuleNamespace = Record<string, unknown> & {
  default?: unknown;
};

export const generatedFlowRegistry: Record<
  string,
  Record<string, FlowModuleNamespace>
> = {
${registryRows}
};
`;
}

export function generateFlowRegistry(): void {
  const projectRoot = process.cwd();
  const flowsRoot = path.join(projectRoot, "flows");
  const outputFile = path.join(projectRoot, "core", "flows", "generatedFlowRegistry.ts");

  if (!fs.existsSync(flowsRoot)) {
    throw new Error(`Flows directory not found: ${flowsRoot}`);
  }

  ensureDir(path.dirname(outputFile));
  const entries = discoverFlowFiles(flowsRoot);
  const content = buildRegistryContent(entries);
  fs.writeFileSync(outputFile, content, "utf8");
  logInfo("FLOW-REGISTRY", `Generated ${outputFile} with ${entries.length} flow(s)`);
}

if (require.main === module) {
  try {
    generateFlowRegistry();
  } catch (error) {
    logError("FLOW-REGISTRY", `Failed: ${(error as Error).message}`);
    process.exit(1);
  }
}
