# Test Workflow

## Scope
This document explains the complete runtime pipeline for:

```bash
npm run test:controlled
```

It covers:
- npm script entrypoint
- environment/config resolution
- framework validation
- data preparation (Excel -> JSON)
- flow registry generation
- Playwright project execution
- orchestrator behavior
- dynamic flow resolution and flow function execution
- validated input schema enforcement for known flows

## 0. Module Lifecycle Automation (Onboard/Offboard)

### Onboard new module
```bash
npm run generate:module -- <moduleName> --route=/staff/<moduleName>
```

### Scaffold new flow (recommended)
```bash
npm run generate:flow -- --module=<moduleName> --flowCode=<flowCode>
```

Flow generator creates:
1. `flows/<module>/<flowCode>.flow.ts` using `getValidatedInput(...)`
2. schema entry in `core/data/flowInputSchemas.ts`
3. module page object scaffold linkage

Generator updates:
1. module scaffold files (`flows/tests/json/excel`)
2. Playwright project entry
3. `AppNavigator` enum + route mapping
4. module orchestrator navigation lines

### Remove existing module safely
```bash
npm run delete:module -- <moduleName> --dry-run
npm run delete:module -- <moduleName> --yes
```

Delete command removes only module-specific artifacts and related routing/project entries.

## 1. Entry Point: npm Script

### File: `package.json`
- Script:
  - `test:controlled = npx ts-node tools/test-control.ts`

### Purpose
- Provides one command for controlled runs via environment variables.

### When executed
- First step when you run `npm run test:controlled`.

### Why required
- Centralizes run mode selection (`suite` vs `module`) and avoids typing long Playwright commands manually.

## 2. Runtime Control Layer

### File: `tools/test-control.ts`

### Purpose
- Reads `.env` values.
- Validates control inputs.
- Decides what command to run next.
- Always performs data prep before Playwright execution.

### Key inputs
- `TEST_TYPE` (`suite` or `module`)
- `TEST_SUITE` (`smoke`, `regression`, `e2e`) when `TEST_TYPE=suite`
- `TEST_MODULE` (`auth`, `user`, `email`, `billing`, or any generated module) when `TEST_TYPE=module`
- Module names are exact after lowercase normalization (example: `users` is distinct from `user`).

### When executed
- Immediately after npm invokes `ts-node`.

### Why required
- It is the orchestration layer for selecting test subsets and enforcing a predictable command sequence.

### Behavior
- Loads env via `dotenv.config()`.
- If `TEST_TYPE=suite`:
  1. `npm run testdata:prepare`
  2. `npx playwright test <all discovered orchestrators> --grep "@<suite>"`
- If `TEST_TYPE=module`:
  1. `npm run testdata:prepare`
  2. Runs one orchestrator file with project mapping:
     - auth -> `--project=auth`
     - user -> `--project=user`
     - email -> `--project=email`

## 3. Environment Configuration

### Files
- `.env`
- `.env.example`

### Purpose
- Supplies runtime controls and `BASE_URL`.

### When used
- `tools/test-control.ts` and `playwright.config.ts` both load env via `dotenv`.

### Why required
- Allows switching suite/module and target URL without code changes.

## 4. Data Preparation Stage

This stage runs before Playwright in controlled mode.

### File: `tools/prepare-data.ts`

### Purpose
- Prepares all runtime data artifacts needed by orchestrators.
- Calls:
  1. `generateFlowRegistry()`
  2. `convertExcelToJson(...)`

### When executed
- Called by `npm run testdata:prepare` from `test-control.ts`.

### Why required
- Ensures latest Excel data and latest flow files are reflected in executable JSON + registry before tests start.

### Internal generation sequence inside `prepare-data.ts`
1. Calls `generateFlowRegistry()` first.
2. Calls `convertExcelToJson(...)` second.
3. Exits only after both generation steps complete successfully.
4. If either fails, process exits with error and Playwright run is blocked.

## 4A. Optional Pre-Run Validation Stage (Recommended)

### File: `tools/validate-framework.ts`

### Command
```bash
npm run validate:framework
```

### Purpose
- Fails fast before execution if Excel/JSON/flow references are inconsistent.
- Gives exact location details so users know what to fix.

### When executed
- Manually before `testdata:prepare` or before full controlled runs.

### Why required
- Prevents avoidable runtime failures caused by missing or incorrect `flowCode`.

### What it checks
1. Excel row has `module`.
2. Excel row has `flowCode` (or legacy `flowKey` fallback).
3. `flowCode` resolves to module flow files.
4. Flags unknown `flowCode`.
5. Flags ambiguous `flowCode` matches.
6. Flags missing module flow folders.
7. Validates generated JSON parseability and `flowCode` presence.
8. Validates known flow input schemas against `input` payloads.

### Error detail format
- file path + sheet + row number + testcase id + module + issue text

## 5. Flow Registry Generation

### File: `tools/generate-flow-registry.ts`

### Purpose
- Scans `flows/**` for `*.flow.ts` files.
- Generates `core/flows/generatedFlowRegistry.ts` with static imports and a module->flow map.

### When executed
- At start of `tools/prepare-data.ts`.

### Why required
- Eliminates manual mapping in orchestrator specs.
- Makes dynamic flow lookup deterministic and type-safe at runtime.

### Generated output file
- `core/flows/generatedFlowRegistry.ts`

### What it contains
- Import per flow file.
- Registry structure like:
  - `auth -> { loginValid, ... }`
  - `users -> { create, delete, ... }`
  - `email -> { send, ... }`

### How generation actually works (step-by-step)
1. Reads the `flows/` directory.
2. Discovers module folders under `flows/` (for example `auth`, `users`, `email`).
3. In each module folder, collects files matching `*.flow.ts`.
4. Derives `flowCode` from file stem:
   - `loginValid.flow.ts` -> `loginValid`
5. Builds TypeScript import statements for every discovered flow file.
6. Builds a registry object:
   - `moduleName -> flowCode -> imported module namespace`
7. Writes final generated code to:
   - `core/flows/generatedFlowRegistry.ts`
8. This generated file is then consumed at runtime by `core/flows/flowResolver.ts`.

## 6. Excel to JSON Conversion

### File: `tools/excel-to-json-test-case.ts`

### Purpose
- Reads Excel test rows from `data/excel/tests/*.xlsx`.
- Normalizes columns.
- Validates required fields.
- Validates `flowCode` against available flow files.
- Writes JSON test case files and module `config.json`.

### When executed
- Called by `tools/prepare-data.ts`.

### Why required
- Converts tester-friendly Excel into machine-consumable runtime data.

### Input files
- `data/excel/tests/Auth_Test_Cases.xlsx`
- `data/excel/tests/Users_Test_Cases.xlsx`
- `data/excel/tests/Email_Test_Cases.xlsx`

### Output files
- `data/json/modules/<module>/<TESTCASE_ID>.json`
- `data/json/modules/<module>/config.json`

### Important behavior
- Primary column is `flowCode`.
- Legacy `flowKey` is still accepted as fallback.
- Fails if flowCode is missing, unknown, or ambiguous for a module.

### How generation actually works (step-by-step)
1. Finds Excel file(s) in `data/excel/tests/` (or uses specific file path input).
2. Reads first worksheet from each workbook.
3. Converts rows to JSON objects.
4. Normalizes header keys (for example `Expected result` -> normalized key).
5. Extracts testcase fields:
   - `id`, `module`, `flowCode`, metadata, `input`, `expectedData`
6. Validates required fields:
   - must have `id`, `module`, `flowCode`
7. Validates `flowCode` by checking available files in `flows/<module>/`.
8. Groups cases by module.
9. Writes testcase JSON files:
   - `data/json/modules/<module>/<TESTCASE_ID>.json`
10. Builds and writes module config:
   - `data/json/modules/<module>/config.json`
   - includes `testDataFiles`, `suites`, and `tags`
11. These generated JSON files are later loaded by `core/data/testCaseLoader.ts` during orchestrator execution.

## 7. Playwright Runner Configuration

### File: `playwright.config.ts`

### Purpose
- Defines test projects, dependencies, global `use` settings, retries/workers/reporter.

### When executed
- When `npx playwright test ...` runs.

### Why required
- Central source of Playwright runtime behavior.

### Key runtime settings
- `workers: 1`
- `fullyParallel: false`
- `retries: 0`
- reporter: `html`
- artifacts: trace/video/screenshot on failure
- `baseURL` from env

### Project dependency behavior
- Non-auth modules can depend on `auth-setup`.
- So Playwright runs `auth-setup` first to create `storage/auth.json`, then dependent module tests use that state.

### Note
- Keep Playwright project names aligned with generated module names/directories.

## 8. Setup Project (Authentication State)

### File: `tests/auth/auth.setup.spec.ts`

### Purpose
- Logs in once using `loginValid` flow and writes sanitized storage state to `storage/auth.json`.

### When executed
- Automatically before `user` or `email` projects due to project dependency.

### Why required
- User/email modules appear to require authenticated session.
- Avoids repeated login per test and keeps module tests focused.

### Interactions
- Uses `AppNavigator` to navigate.
- Uses `loadTestCase("auth", "TC-AUTH-LOGIN-TC01")` to get login credentials from JSON data.
- Calls `flows/auth/loginValid.flow.ts`.

## 9. Test Case Loading Layer

### File: `core/data/testCaseLoader.ts`

### Purpose
- Loads module `config.json`.
- Resolves testcase IDs to JSON files.
- Validates testcase structure (`id`, `module`, `flowCode`, `testData.input`).

### When executed
- At orchestrator module load time (`const authCases = loadAllTestCases("auth")`, etc.).
- Also used by auth setup for single testcase loading.

### Why required
- Provides strict runtime contract between generated JSON and test execution.

### Related types
- `core/data/authTypes.ts`

## 10. Orchestrator Specs (Test Runners at Module Level)

### Files
- `tests/auth/auth.orchestrator.spec.ts`
- `tests/users/users.orchestrator.spec.ts`
- `tests/email/email.orchestrator.spec.ts`

### Purpose
- Convert JSON cases into Playwright `test(...)` definitions.
- Build test title from ID/description/tags.
- Navigate to module start page.
- Resolve and execute flow function dynamically.
- Log start/pass/fail.

### When executed
- During Playwright test discovery and execution for selected file/project.

### Why required
- Decouples data iteration/dispatch from UI action implementation.

### Key interactions
- `loadAllTestCases(module)` -> gets test cases
- `getFlowHandler(module, flowCode)` -> dynamic flow selection
- `AppNavigator` -> standardized navigation
- Flow function -> actual UI steps/assertions

## 11. Dynamic Flow Resolution Layer

### File: `core/flows/flowResolver.ts`

### Purpose
- Uses generated registry to find flow module by `module + flowCode`.
- Resolves exact or unambiguous prefix match.
- Picks callable function export from flow module.

### When executed
- Inside each test case execution in orchestrators.

### Why required
- Removes manual `flowHandlers` mapping maintenance.
- Allows QA to control execution via Excel `flowCode`.

### Resolution strategy
1. Find module bucket (exact module name) in generated registry.
2. Find flow by exact match first.
3. If not exact, allow unambiguous startsWith compatibility.
4. Determine function to run:
   - default export, or
   - named export matching flowCode, or
   - single function export in module.

## 12. Navigation Utility

### File: `core/navigation/AppNavigator.ts`

### Purpose
- Defines route map (baseline includes `LOGIN` and `HOME`, module entries are generated).
- Applies fresh-init script to clear stale localStorage cache keys while preserving auth keys.
- Performs `page.goto(route)` + `waitForLoadState("networkidle")`.

### When executed
- In setup and orchestrators before flow actions.

### Why required
- Consistent entry navigation and cleaner test stability.

## 13. Flow Implementation Layer

### Files (examples)
- `flows/auth/loginValid.flow.ts`
- `flows/users/create.flow.ts`
- `flows/email/send.flow.ts`

### Purpose
- Encapsulate UI actions/assertions for one business flow.

### When executed
- After orchestrator resolves handler for a testcase.

### Why required
- Isolates test logic from orchestration/data plumbing.

### Data dependency
- Generated and modernized flows use `getValidatedInput(...)` with a flow schema.
- Existing flows may still use `getTestData(testCase)` for backward compatibility.

## 14. Logging Utility

### File: `core/utils/logger.ts`

### Purpose
- Structured timestamped logs with scope (`TEST-CONTROL`, `DATA-PREP`, `AUTH-ORCH`, etc.).

### When executed
- Throughout all stages.

### Why required
- Execution traceability and easier debugging.

## 15. End-to-End Step-by-Step Sequence

### Starting command
```bash
npm run test:controlled
```

### Sequence
1. npm reads `package.json` and runs `npx ts-node tools/test-control.ts`.
2. `tools/test-control.ts` loads `.env`.
3. `test-control.ts` validates `TEST_TYPE` and suite/module values.
4. Recommended: run `npm run validate:framework` to fail fast on data/flow issues.
5. `test-control.ts` runs `npm run testdata:prepare`.
6. `tools/prepare-data.ts` starts.
7. `prepare-data.ts` runs `generateFlowRegistry()`.
8. `tools/generate-flow-registry.ts` scans `flows/**.flow.ts` and writes `core/flows/generatedFlowRegistry.ts`.
9. `prepare-data.ts` calls `convertExcelToJson(...)`.
10. `tools/excel-to-json-test-case.ts` reads Excel rows, validates `flowCode`, writes `data/json/modules/**` JSON testcases and module `config.json`.
11. `prepare-data.ts` exits successfully.
12. `test-control.ts` invokes Playwright command based on suite/module mode.
13. Playwright loads `playwright.config.ts` and project graph.
14. If project has `auth-setup` dependency, Playwright runs setup first.
15. `tests/auth/auth.setup.spec.ts` logs in and writes `storage/auth.json`.
16. Playwright executes selected orchestrator spec file(s).
17. Orchestrator calls `loadAllTestCases(module)` from `testCaseLoader`.
18. For each testcase JSON, orchestrator creates a Playwright test and logs start.
19. Orchestrator navigates with `AppNavigator`.
20. Orchestrator resolves handler via `getFlowHandler(module, flowCode)`.
21. `flowResolver` reads registry and returns executable function.
22. Flow function runs UI steps using `page` and data from `getTestData(testCase)`.
23. Assertions run inside flow.
24. Orchestrator logs pass/fail.
25. Playwright writes report/artifacts.

## 16. Visual Workflow Diagram

```text
npm run test:controlled
        |
        v
package.json:scripts
(test:controlled -> ts-node tools/test-control.ts)
        |
        v
tools/test-control.ts
(read .env, validate TEST_TYPE)
        |
        v
optional: npm run validate:framework
(tools/validate-framework.ts)
        |
        +------------------------------+
        |                              |
        v                              v
mode=suite                       mode=module
(run all orchestrators + grep)   (run one orchestrator + project)
        |                              |
        +--------------+---------------+
                       |
                       v
              npm run testdata:prepare
                       |
                       v
               tools/prepare-data.ts
                       |
         +-------------+-------------------+
         |                                 |
         v                                 v
tools/generate-flow-registry.ts    tools/excel-to-json-test-case.ts
(scan flows/*.flow.ts)             (read Excel, validate flowCode,
(write generatedFlowRegistry.ts)    write JSON + config)
         |                                 |
         +---------------+-----------------+
                         |
                         v
                 npx playwright test ...
                         |
                         v
                playwright.config.ts
        (projects, dependencies, baseURL, workers)
                         |
              +----------+----------+
              |                     |
              v                     v
      auth-setup dependency    selected project(s)
      tests/auth/auth.setup    auth/users/email orchestrator
      write storage/auth.json  specs
                                    |
                                    v
                       core/data/testCaseLoader.ts
                        (loadAllTestCases/loadTestCase)
                                    |
                                    v
                       tests/*/*.orchestrator.spec.ts
                       (iterate JSON cases, build tests)
                                    |
                                    v
                       core/flows/flowResolver.ts
                      + generatedFlowRegistry.ts
                                    |
                                    v
                           flows/<module>/*.flow.ts
                          (UI actions + assertions)
                                    |
                                    v
                            Playwright report/artifacts
```

## 17. Why this architecture works
- QA-friendly: test selection/data entry in Excel.
- Scalable: new flow files do not require manual orchestrator mapping.
- Deterministic: registry generation and runtime validation catch missing/ambiguous flow references early.
- Separation of concerns:
  - Control: `test-control.ts`
  - Data prep: `prepare-data.ts`, `excel-to-json-test-case.ts`
  - Dispatch: orchestrator specs
  - UI logic: `flows/*.flow.ts`
  - Runtime engine: Playwright config/projects
