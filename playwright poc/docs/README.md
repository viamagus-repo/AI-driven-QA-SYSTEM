# Playwright TypeScript Automation Framework

## Overview
This framework runs data-driven Playwright tests for three modules:
- `auth`
- `user`
- `email`

Primary goal: QA engineers update Excel only, set `flowCode`, and tests execute matching flow files automatically.

## Core Concept
The framework uses dynamic flow resolution.

- Excel column: `flowCode` (example: `loginValid`)
- Runtime target file: `<flowCode>.flow.ts` (example: `loginValid.flow.ts`)
- Orchestrators do not contain hardcoded `flowHandlers` maps.

Flow execution pipeline:
1. Excel rows are converted to JSON test cases.
2. Flow registry is generated from `flows/**/.flow.ts`.
3. Orchestrator loads each test case.
4. Resolver maps `module + flowCode` to a flow file and executes it.

## Prerequisites
- Node.js LTS
- npm
- Playwright browsers

Install dependencies:
```bash
npm ci
npx playwright install --with-deps
```

## Project Structure
```text
core/
  data/
    authTypes.ts
    testCaseLoader.ts
    testData.ts
  flows/
    flowResolver.ts
    generatedFlowRegistry.ts   # auto-generated
  navigation/
    AppNavigator.ts
  utils/
    logger.ts

data/
  excel/tests/
    Auth_Test_Cases.xlsx
    User_Test_Cases.xlsx
    Email_Test_Cases.xlsx
  json/modules/
    <module>/
      config.json
      <TESTCASE_ID>.json

flows/
  auth/*.flow.ts
  Users/*.flow.ts
  email/*.flow.ts

tests/
  auth/auth.orchestrator.spec.ts
  Users/user.orchestrator.spec.ts
  emails/email.orchestrator.spec.ts

tools/
  excel-to-json-test-case.ts
  generate-flow-registry.ts
  prepare-data.ts
  test-control.ts
```

## Commands
From `package.json`:

- `npm run flow:registry` : generate `core/flows/generatedFlowRegistry.ts`
- `npm run generate:module -- <moduleName>` : scaffold a new module (flows/tests/json/excel + Playwright project)
- `npm run reset:framework -- --dry-run` : preview cleanup for new-project reuse
- `npm run reset:framework` : reset reusable project artifacts (keeps auth by default, asks for y/N confirmation)
- `npm run reset:framework -- --drop-auth` : reset and remove auth scaffolding too
- `npm run reset:framework -- --yes` : skip confirmation prompt (for CI/non-interactive usage)
- `npm run validate:framework` : validate Excel/JSON/flow consistency and report missing/invalid `flowCode` with location details
- `npm run testdata:prepare` : generate flow registry + convert all Excel to JSON
- `npm run testdata:prepare:auth` : auth-only conversion mode
- `npm run test:auth` : auth execution
- `npm run test:auth:smoke` : auth smoke by tags
- `npm run test:auth:regression` : auth regression by tags
- `npm run test:user` : user execution
- `npm run test:email` : email execution
- `npm run test:controlled` : env-driven run via `tools/test-control.ts`

## Module Generator Note
When you scaffold a module using `npm run generate:module -- <moduleName>`, it creates:
- `flows/<moduleName>/sample.flow.ts`
- `tests/<moduleName>/<moduleName>.orchestrator.spec.ts`
- `data/json/modules/<moduleName>/config.json`
- `data/excel/tests/<ModuleName>_Test_Cases.xlsx`
- Playwright project entry in `playwright.config.ts`

Important:
- `sample.flow.ts` contains `await page.waitForLoadState("domcontentloaded");` as placeholder scaffold code only.
- That line is not required by the framework. Replace/remove it and add your actual test steps/assertions.
- For complete steps when a new screen/module is introduced, see `NEW_SCREEN_ONBOARDING.md`.
- For reusing this framework in a completely new project, see `NEW_PROJECT_MIGRATION.md`.

## Framework Validation
Use this before running tests:

```bash
npm run validate:framework
```

### What it validates
1. Excel rows have required `module` and `flowCode`.
2. Excel `flowCode` values resolve to a valid flow file for that module.
3. Ambiguous flow matches are flagged.
4. Missing flow folders for modules are flagged.
5. Generated JSON testcase files are valid JSON.
6. Generated JSON testcase files contain `flowCode` (or fallback `flowKey`).

### Error output format
Validation errors include exact location so testers can fix quickly:
- Excel file path
- sheet name
- row number
- testcase `id`
- module name
- specific issue (missing/unknown/ambiguous flow code)

### Recommended run order
1. Update Excel and flow files.
2. Run `npm run validate:framework`.
3. Run `npm run testdata:prepare`.
4. Run `npm run test:controlled` (or module-specific run).

## QA Workflow (Only 2 Required Actions)
For any new/updated test case:

1. Update Excel row.
2. Set `flowCode` in that row.

Then ensure the corresponding flow file exists.

Example:
- Excel: `flowCode = loginValid`
- Flow file: `flows/auth/loginValid.flow.ts`

No orchestrator map updates are needed.

## Excel Format
Expected columns include:
- `id`
- `module`
- `scenario`
- `type`
- `priority`
- `suite`
- `tags`
- `steps`
- `expected result`
- `input` (JSON string)
- `expected data` (optional JSON string)
- `flowCode`

Compatibility note:
- Old `flowKey` is still accepted as fallback during transition.
- Prefer `flowCode` for all new and updated rows.

## Flow Naming Rules
Use this convention for maintainability:
- File name: `<flowCode>.flow.ts`
- One main exported function per file (recommended)

Resolver behavior:
- Tries exact flow code match first.
- Supports unambiguous prefix compatibility.
- Throws clear error if no match or ambiguous match.

## Add a New Test Case
1. Add row in module Excel file with `flowCode`.
2. Create flow file in corresponding module folder under `flows/`.
3. Run:
```bash
npm run testdata:prepare
```
4. Run module tests:
```bash
npm run test:auth
# or
npm run test:user
# or
npm run test:email
```

## Modify or Delete a Test Case
Modify:
1. Update Excel row.
2. Run `npm run testdata:prepare`.
3. Execute relevant module tests.

Delete:
1. Remove row from Excel.
2. Run `npm run testdata:prepare`.
3. Remove stale JSON manually if still present.
4. Run module tests.

## Debugging
Common errors:
- `Missing/invalid 'flowCode'` in generated JSON
- `Unknown flowCode ...` (no matching flow file)
- `Ambiguous flowCode ...` (multiple possible matches)
- Invalid JSON in `input` or `expectedData` columns

Useful commands:
```bash
npm run validate:framework
npm run testdata:prepare
npx playwright test --list
npx playwright test tests/Users/user.orchestrator.spec.ts --project=users --grep "TC-USER-01" --debug
npx playwright show-report
```

## Configuration Highlights
From `playwright.config.ts`:
- Sequential execution (`workers: 1`, `fullyParallel: false`)
- `retries: 0`
- `reporter: html`
- Failure artifacts retained (`trace`, `screenshot`, `video`)
- `headless: false`
- `serviceWorkers: "block"`

## Important Rules
- Do not add manual flow maps in orchestrators.
- Do not use `flowKey` for new entries; use `flowCode`.
- Regenerate data after every Excel change (`npm run testdata:prepare`).
