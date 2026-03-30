# New Screen Onboarding

Use this guide when a new product screen/module needs automation support in the framework.

## Goal
Add a new module with minimal manual setup so QA can continue using:
1. Excel updates
2. `flowCode` values

## Step 1: Generate Module Scaffold
Run:

```bash
npm run generate:module -- <moduleName> --route=/staff/<moduleName>
npm run generate:flow -- --module=<moduleName> --flowCode=<flowCode>
```

Example:

```bash
npm run generate:module -- billing --route=/staff/billing
```

This creates:
- `flows/<moduleName>/sample.flow.ts`
- `tests/<moduleName>/<moduleName>.orchestrator.spec.ts`
- `data/json/modules/<moduleName>/config.json`
- `data/excel/tests/<ModuleName>_Test_Cases.xlsx`
- `core/pages/modules/<moduleName>.page.ts`
- Playwright project entry in `playwright.config.ts`
- `AppPage.<MODULE>` + route mapping in `core/navigation/AppNavigator.ts`
- Navigation lines in module orchestrator test body:
  - `const nav = new AppNavigator(page);`
  - `await nav.goTo(AppPage.<MODULE>);`

Notes:
- Safe to run multiple times. Existing files are skipped.
- Existing orchestrator is auto-patched to ensure navigation lines.
- Shared `core/pages/BasePage.ts` is created once and reused by all module page objects.
- `generate:flow` scaffolds a flow file that already imports the module page object and validated input helper.
- If `--route` is omitted, the command asks for route path interactively.

## Step 2: Add Test Cases in Excel
Open generated Excel file:
- `data/excel/tests/<ModuleName>_Test_Cases.xlsx`

Add rows with required fields:
- `ID`
- `Module`
- `Scenario`
- `Type`
- `Priority`
- `Suite`
- `Tags`
- `input` (valid JSON)
- `flowCode`

Important:
- `Module` should match module name used in generator.
- `flowCode` should match your flow file stem.

## Step 3: Implement Flow Files
Create/update flows in:
- `flows/<moduleName>/`

Recommended scaffold command:
```bash
npm run generate:flow -- --module=<moduleName> --flowCode=<flowCode>
```

Naming rule:
- file name: `<flowCode>.flow.ts`
- if `flowCode=CreateInvoice`, file should be `CreateInvoice.flow.ts`

Implementation notes:
- Keep one clear executable flow function per file.
- Prefer using module page object methods for locators/actions to avoid locator duplication in flows.
- `sample.flow.ts` contains placeholder code; replace it with real steps/assertions.

## Step 4: Validate Framework Consistency
Run:

```bash
npm run validate:framework
```

This catches:
- missing `flowCode`
- unknown/ambiguous flow mappings
- missing flow folders
- invalid JSON in generated data

## Step 5: Prepare Runtime Data
Run:

```bash
npm run testdata:prepare
```

This:
1. Regenerates `core/flows/generatedFlowRegistry.ts`
2. Converts Excel rows to JSON under `data/json/modules/<moduleName>/`

## Step 6: Execute Tests
Option A: Controlled mode via `.env`
```bash
npm run test:controlled
```

Option B: Direct module run
```bash
npx playwright test tests/<moduleName>/<moduleName>.orchestrator.spec.ts --project=<moduleName>
```

## Quick Checklist
1. Generated module scaffold.
2. Added Excel rows with `flowCode`.
3. Added or scaffolded flow files matching `flowCode`.
4. `npm run validate:framework` passes.
5. `npm run testdata:prepare` passes.
6. Module test run passes.

## Common Mistakes
1. `flowCode` does not match file stem.
2. Wrong module name in Excel row.
3. Invalid JSON in Excel `input` cell.
4. Skipping validation/prep before running tests.

## Remove an Existing Module (Optional)
When a module is no longer needed:

```bash
npm run delete:module -- <moduleName> --dry-run
npm run delete:module -- <moduleName> --yes
```

This removes only that module's folders/files and related entries in:
- `playwright.config.ts`
- `core/navigation/AppNavigator.ts`
- `package.json` module-specific scripts
- `core/flows/generatedFlowRegistry.ts` is regenerated automatically
