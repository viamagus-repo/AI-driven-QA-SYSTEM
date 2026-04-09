# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Running Tests
```bash
npm run test:auth                  # Prepares data + runs all auth tests
npm run test:auth:smoke            # Auth smoke suite (@smoke tag)
npm run test:auth:regression       # Auth regression suite (@regression tag)
npm run test:user                  # Run users tests
npm run test:controlled            # Run via TEST_TYPE/TEST_SUITE/TEST_MODULE env vars
```

### Test Data
```bash
npm run testdata:prepare           # Regenerate flow registry + convert ALL Excel → JSON
npm run testdata:prepare:auth      # Regenerate flow registry + convert only auth Excel
npm run flow:registry              # Regenerate generatedFlowRegistry.ts only
```

> `testdata:prepare` always regenerates the flow registry first, then converts Excel. Run it after adding or renaming any flow file.

### Validation & Quality
```bash
npm run validate:framework         # Validate Excel rows, JSON testcases, and flowCode resolution
npm run ci:quality                 # Full gate: validate + tsc + testdata:prepare + test:tools
npm run test:tools                 # Vitest unit tests for the scaffolding tools
npx tsc --noEmit                   # Type-check only
npm run check:docs-drift           # Check for drift between docs and actual tool behavior
npm run reset:framework            # Reset AppNavigator + remove all module page objects (use with --yes)
```

### Module & Flow Scaffolding
```bash
npm run generate:module -- <name> --route=/path   # Full module scaffold + wires config/nav/playwright
npm run generate:flow -- --module=<name> --flowCode=<code>  # Scaffold a new flow + registers Zod schema
npm run delete:module -- <name> [--dry-run] [--yes]         # Remove all artifacts for a module
```

### Running a Single Test
```bash
npx playwright test tests/auth/auth.orchestrator.spec.ts --project=auth
npx playwright test tests/auth/auth.orchestrator.spec.ts --project=auth --grep @smoke
npx playwright test tests/users/users.orchestrator.spec.ts --project=users
```

## Environment Variables

Copy `.env.example` to `.env`:
```
BASE_URL=https://web-tmp.ognomy.com
TEST_TYPE=suite          # "suite" or "module"
TEST_SUITE=smoke         # "smoke", "regression", "e2e"
TEST_MODULE=auth         # used when TEST_TYPE=module
```

The config falls back to `https://example.com` if `BASE_URL` is unset. The browser runs **headless: false** by default — set `headless: true` in `playwright.config.ts` or use `--headed=false` for CI.

## Architecture

### Core Concept: Data-Driven Flow Execution

Tests are never written manually. The pipeline is:

1. **Excel** (`data/excel/tests/*.xlsx`) — one row per test case, with `flowCode` and a JSON `input` column
2. **`npm run testdata:prepare`** — converts Excel → JSON (`data/json/modules/<module>/`) and rebuilds the flow registry
3. **Orchestrator** (`tests/<module>/<module>.orchestrator.spec.ts`) — loads all JSON testcases, builds Playwright `test()` entries dynamically, dispatches each to the correct flow via `getFlowHandler(module, flowCode)`
4. **Flow** (`flows/<module>/<flowCode>.flow.ts`) — implements the actual browser steps; receives `page` and the `testCase` payload

The same flow runs against every Excel row that references it.

### Flow Registry & Resolution

`core/flows/generatedFlowRegistry.ts` is auto-generated — **never edit it manually**. It statically imports every `*.flow.ts` file and groups them by module.

`core/flows/flowResolver.ts` resolves a `(module, flowCode)` pair at runtime:
- All values are normalized to lowercase before comparison (`loginValid` = `LOGIN_VALID` = `login-valid`)
- Supports prefix partial matching; throws if ambiguous
- Module name lookup in the registry is also case-insensitive
- A flow file may export `default`, a named export matching the flowCode, or a single named function

**Legacy:** `flowKey` in JSON testcases is a deprecated alias for `flowCode`. The schema accepts both; `flowCode` always wins.

### Input Validation with Zod

Every flow's input data is validated by a Zod schema registered in `core/data/flowInputSchemas.ts`. Schema keys are stored **lowercase** and looked up with `normalizeModuleValue()`. When adding a flow manually (not via generator), register the schema in both the `export const` declarations and the `flowInputSchemas` map.

Inside a flow, always call `getValidatedInput(testCase, schema)` — it parses and throws with a clear field-level error if validation fails.

### Auth Setup & Storage State

- The `auth-setup` Playwright project runs first (headless, no `storageState`), logs in using `TC-AUTH-LOGIN-TC01`, and writes `storage/auth.json`
- The `auth` project does **not** use `storageState` — it runs all auth flows (including invalid login tests) from a fresh, unauthenticated browser context
- All other module projects (`users`, etc.) depend on `auth-setup` and load `storage/auth.json`
- `AppNavigator.goTo()` injects an init script that clears stale localStorage on first navigation while preserving the `auth` and `O_AUTH_KEY` keys

### Page Object Model

- `core/pages/BasePage.ts` — abstract base with `click`, `fill`, `waitForIdle`, `waitForUrlContains`, `byRole`, `locator`
- `core/pages/modules/<module>.page.ts` — module-specific locators in a `locators: Record<string, Locator>` map + `waitForModuleReady()`
- Page objects are used within flows. Keep stable locators in the page object; inline one-off locators are acceptable for now

### Navigation

`core/navigation/AppNavigator.ts` owns the `AppPage` enum and `ROUTES` map. Always navigate with `navigator.goTo(AppPage.<KEY>)` — never pass raw URL strings in flows or orchestrators. `generate:module` updates both automatically.

### Flows Can Compose

Flows may call other flows directly. Example: `loginLogout.flow.ts` calls `loginValid()` internally before performing the logout steps.

## Key Files

| File | Purpose |
|------|---------|
| `core/flows/generatedFlowRegistry.ts` | Auto-generated static import registry — do not edit |
| `core/flows/flowResolver.ts` | Runtime flow lookup with case/partial-match normalization |
| `core/data/flowInputSchemas.ts` | All Zod schemas; keys must be lowercase |
| `core/data/testCaseSchema.ts` | Zod schema for the JSON testcase shape; `flowKey` legacy alias lives here |
| `core/data/testCaseLoader.ts` | Loads testcases from `data/json/modules/<module>/` via `config.json` |
| `core/navigation/AppNavigator.ts` | `AppPage` enum + routes + init-script for auth state |
| `core/pages/BasePage.ts` | Shared POM base |
| `playwright.config.ts` | Projects, browser settings, storage state wiring |
| `tools/generate-module.ts` | Scaffolds a full module with rollback on failure |
| `tools/generate-flow.ts` | Scaffolds a flow file + registers its Zod schema |
| `tools/validate-framework.ts` | Validates Excel and JSON testcases against flow files |
| `tools/__tests__/tooling.spec.ts` | Vitest integration tests for all scaffolding tools |

## Naming & Casing Conventions

- Flow file stems use **camelCase**: `loginValid.flow.ts`, `loginInvalidPassword.flow.ts`
- Module directories under `flows/` must be **lowercase** to avoid case-sensitivity failures on Linux CI (note: `flows/Users/` currently violates this)
- JSON testcase IDs follow the pattern: `TC-{MODULE}-{ACTION}-{NUMBER}` (e.g. `TC-AUTH-LOGIN-TC01`)
- Zod schema names follow the pattern: `<module><FlowCode>InputSchema` in camelCase (e.g. `authLoginInputSchema`, `usersCreateInputSchema`)

## Playwright Config Highlights

- `fullyParallel: false`, `workers: 1` — tests run sequentially
- `headless: false` — browser is visible by default; override for CI
- `forbidOnly: !!process.env.CI` — `test.only` causes CI failure
- `retries: 0` — no automatic retries
- `trace`, `screenshot`, `video` all set to `"retain-on-failure"`
- `serviceWorkers: "block"` — prevents service workers from intercepting requests
