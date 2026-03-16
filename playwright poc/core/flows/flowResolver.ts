import { Page } from "@playwright/test";
import { BaseTestCase } from "../data/authTypes";
import { generatedFlowRegistry, FlowModuleNamespace } from "./generatedFlowRegistry";
import { normalizeModuleValue, resolveModuleFromAvailable } from "../utils/moduleNames";

type FlowHandler = (page: Page, testCase: BaseTestCase) => Promise<void>;

function normalize(value: string): string {
  return normalizeModuleValue(value);
}

function resolveFlowCode(moduleName: string, flowCode: string): string {
  const moduleFlows = generatedFlowRegistry[moduleName];
  const requested = normalize(flowCode);
  const codes = Object.keys(moduleFlows);

  const exact = codes.find((code) => normalize(code) === requested);
  if (exact) return exact;

  const partialMatches = codes.filter((code) => {
    const candidate = normalize(code);
    return candidate.startsWith(requested) || requested.startsWith(candidate);
  });
  if (partialMatches.length === 1) return partialMatches[0];
  if (partialMatches.length > 1) {
    throw new Error(
      `Ambiguous flowCode '${flowCode}' for module '${moduleName}'. Matches: ${partialMatches.join(", ")}`
    );
  }

  throw new Error(
    `Unknown flowCode '${flowCode}' for module '${moduleName}'. Available: ${codes.join(", ")}`
  );
}

function resolveFlowFunction(flowCode: string, moduleNs: FlowModuleNamespace): FlowHandler {
  if (typeof moduleNs.default === "function") {
    return moduleNs.default as FlowHandler;
  }

  const exact = moduleNs[flowCode];
  if (typeof exact === "function") {
    return exact as FlowHandler;
  }

  const functions = Object.entries(moduleNs).filter(
    ([, value]) => typeof value === "function"
  );

  if (functions.length === 1) {
    return functions[0][1] as FlowHandler;
  }

  throw new Error(
    `Flow module for '${flowCode}' must export default, '${flowCode}', or a single function export`
  );
}

export function getFlowHandler(moduleName: string, flowCode: string): FlowHandler {
  const resolvedModuleName = resolveModuleFromAvailable(
    moduleName,
    Object.keys(generatedFlowRegistry)
  );
  const moduleFlows = resolvedModuleName
    ? generatedFlowRegistry[resolvedModuleName]
    : undefined;

  if (!moduleFlows) {
    throw new Error(
      `No flow registry found for module '${moduleName}'. Available modules: ${Object.keys(
        generatedFlowRegistry
      ).join(", ")}`
    );
  }

  const resolvedCode = resolveFlowCode(resolvedModuleName, flowCode);
  const moduleNs = moduleFlows[resolvedCode];
  return resolveFlowFunction(resolvedCode, moduleNs);
}
