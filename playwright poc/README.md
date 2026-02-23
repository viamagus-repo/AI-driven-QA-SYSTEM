# Playwright TypeScript Automation Framework

## 1. Overview

### Purpose
This repository implements a local Playwright + TypeScript UI automation framework for three modules:
- `auth`
- `users`
- `emails`

The framework executes data-driven tests generated from Excel files and mapped to flow functions.

### Architecture Pattern
The framework uses a **data-driven orchestrator + flow-handler pattern**:
- Test data source: `data/excel/tests/*.xlsx`
- Generated runtime data: `data/json/modules/<module>/*.json`
- Orchestrators load all cases and dispatch to flow handlers by `flowKey`
- Shared utilities handle navigation, test data parsing, and logging

### Key Design Decisions Observed in Code
- Centralized navigation via `AppNavigator` (`core/navigation/AppNavigator.ts`)
- Storage-state auth setup as a dedicated Playwright project (`auth-setup`)
- Module-level orchestrators generate test titles from JSON data and tags
- Data prep pipeline converts Excel to normalized JSON before execution
- Single-worker sequential execution (`workers: 1`, `fullyParallel: false`)
- Service worker blocking enabled (`serviceWorkers: "block"`)

## 2. Prerequisites

| Requirement | Value in repo | Notes |
|---|---|---|
| Node.js | Not pinned in `package.json` | CI uses `lts/*` in `.github/workflows/playwright.yml` |
| Playwright test runner | `@playwright/test@^1.58.1` | From `package.json` |
| TypeScript runtime | `ts-node@^10.9.2` | Used by data prep and test-control tools |
| Excel parser | `xlsx@^0.18.5` | Converts Excel test cases to JSON |

Required tools:
- `npm`
- Playwright browsers (`npx playwright install --with-deps`)

## 3. Installation & Setup

### Clone and install
```bash
git clone <your-repo-url>
cd "playwright poc"
npm ci
```

### Install Playwright browsers
```bash
npx playwright install --with-deps
```

### Configure environment
Create `.env` from `.env.example`.

Current variables used by tools/config:
- `BASE_URL`
- `TEST_TYPE`
- `TEST_SUITE`
- `TEST_MODULE`

### Prepare generated test data
```bash
npm run testdata:prepare
```

### Verify setup
```bash
npx playwright test --list
```

## 4. Project Structure

### Folder tree (auto-generated from repository source; dependency/artifact folders omitted)
```text
.env
.env.example
.github/workflows/playwright.yml
.gitignore
core/
  data/
    authTypes.ts
    testCaseLoader.ts
    testData.ts
  navigation/
    AppNavigator.ts
  utils/
    logger.ts
data/
  excel/
    tests/
      Auth_Test_Cases.xlsx
      Email_Test_Cases.xlsx
      User_Test_Cases.xlsx
  json/
    modules/
      auth/
        config.json
        TC-AUTH-LOGIN-TC01.json
        TC-AUTH-LOGIN-TC02.json
        TC-AUTH-LOGIN-TC03.json
        TC-AUTH-LOGIN-TC05.json
      email/
        config.json
        TC-EMAIL-01.json
      user/
        config.json
        TC-USER-01.json
        TC-USER-02.json
        TC-USER-03.json
flows/
  auth/
    loginInvalidPassword.flow.ts
    loginInvalidUsername.flow.ts
    loginLogout.flow.ts
    loginValid.flow.ts
  email/
    send.flow.ts
  Users/
    create.flow.ts
    delete.flow.ts
    edituserpass.flow.ts
package.json
package-lock.json
playwright.config.ts
tests/
  auth/
    auth.orchestrator.spec.ts
    auth.setup.spec.ts
    global.setup.ts
  emails/
    email.orchestrator.spec.ts
  Users/
    user.orchestrator.spec.ts
tools/
  excel-to-json-test-case.ts
  prepare-data.ts
  test-control.ts
tsconfig.json
```

### Responsibilities
- `core/data`: typing and data-loading contracts
- `core/navigation`: route enum and page navigation strategy
- `core/utils`: timestamped logger
- `flows`: executable UI actions per business operation
- `tests/*/*.orchestrator.spec.ts`: module-level flow dispatchers
- `tests/auth/auth.setup.spec.ts`: authenticated storage-state generation
- `data/excel/tests`: editable source of truth for test cases
- `data/json/modules`: generated runtime test data consumed by tests
- `tools`: data conversion and execution control scripts
- `.github/workflows/playwright.yml`: CI pipeline definition

### Page Object status
No dedicated Page Object classes are implemented in this repository.

## 5. Execution Guide

### Commands from `package.json`

| Command | What it does |
|---|---|
| `npm run testdata:prepare` | Converts all Excel files to JSON test modules |
| `npm run testdata:prepare:auth` | Converts only `Auth_Test_Cases.xlsx` |
| `npm run test:controlled` | Runs `tools/test-control.ts` using `.env` selectors |
| `npm run test:auth` | Data prep + auth orchestrator on `auth` project |
| `npm run test:auth:smoke` | Data prep + auth tests with `--grep @smoke` |
| `npm run test:auth:regression` | Data prep + auth tests with `--grep @regression` |
| `npm run test:user` | Data prep + user orchestrator on `users` project |
| `npm run test:email` | Data prep + email orchestrator on `emails` project |

### Run all tests
```bash
npx playwright test
```

### Run a specific file
```bash
npx playwright test tests/Users/user.orchestrator.spec.ts --project=users
```

### Run a specific test by name
```bash
npx playwright test tests/auth/auth.orchestrator.spec.ts --project=auth --grep "TC-AUTH-LOGIN-TC01"
```

### Headed mode
Repo default is headed (`headless: false`), so no extra flag is required.

### Debug mode
```bash
npx playwright test tests/Users/user.orchestrator.spec.ts --project=users --debug
```

### Browser-specific execution
Current config defines only Desktop Chrome device settings in `use` and no separate browser projects.

You can still force browser at CLI level:
```bash
npx playwright test --browser=chromium
npx playwright test --browser=firefox
npx playwright test --browser=webkit
```

No browser-specific project tuning exists in this repo.

## 6. How to Add a New Test Case

### Step 1: Add test row in Excel
Update module sheet in:
- `data/excel/tests/Auth_Test_Cases.xlsx`
- `data/excel/tests/User_Test_Cases.xlsx`
- `data/excel/tests/Email_Test_Cases.xlsx`

Required fields inferred by converter:
- `id`
- `module`
- `flowKey`
- `scenario`
- `type`
- `priority`
- `suite`
- `tags`
- `input` (JSON string)
- `expectedData` (optional JSON string)

### Step 2: Ensure a flow handler exists
If `flowKey` is new, add a new flow function in corresponding `flows/<module>/` file and wire it in orchestrator mapping.

### Step 3: Regenerate JSON
```bash
npm run testdata:prepare
```

### Step 4: Verify mapping
Confirm generated case file exists in:
- `data/json/modules/<module>/<ID>.json`

### Step 5: Run targeted module tests
```bash
npm run test:user
# or
npm run test:email
# or
npm run test:auth
```

### Example template (based on actual architecture)
```ts
// tests/<module>/<module>.orchestrator.spec.ts pattern
const flowHandlers = {
  myFlowKey: myFlowFunction,
};

for (const testCase of loadAllTestCases("mymodule")) {
  test(`${testCase.id} ${testCase.description}`, async ({ page }) => {
    const handler = flowHandlers[testCase.flowKey as keyof typeof flowHandlers];
    if (!handler) throw new Error(`Unknown flowKey '${testCase.flowKey}'`);
    await handler(page, testCase);
  });
}
```

## 7. How to Modify or Delete a Test Case

### Modify a test case
1. Update row data in the relevant Excel file.
2. Run `npm run testdata:prepare`.
3. Confirm JSON output changed for that test ID.
4. Run the module tests.

### Delete a test case safely
1. Remove the row from Excel.
2. Run `npm run testdata:prepare`.
3. Remove stale JSON file manually if converter does not remove it.
4. Confirm module `config.json` no longer maps removed ID.
5. Run module tests to verify no orphan references.

### Flow dependency considerations
- If a removed case is the only consumer of a flow, decide whether to keep or delete the flow function.
- If deleting a flow function, remove it from orchestrator `flowHandlers` map.

## 8. Locator Strategy

### Locator types used
- `getByRole(...)`
- `getByText(...)`
- `locator("css-selector")`
- `locator(...).filter(...)`
- Indexed locators (`first()`, `nth()`)

### Strictness behavior
Playwright strict mode applies by default.

### Observed anti-patterns
- Fixed sleeps (`waitForTimeout(2000)`) in multiple flows
- Broad positional selectors (`nth(1)`, `nth(2)`, `.message-new-panel > div:nth-child(4)`)
- CSS class selectors tied to icon classes (`.icons.icon-trash`)

These increase flakiness under UI layout changes.

## 9. Waiting & Stability Strategy

### Current implementation
- Navigation waits for `networkidle` in `AppNavigator.goTo(...)`.
- Assertions use `expect(...)` in flows for end-state checks.
- Several explicit fixed waits remain (`waitForTimeout(2000)`).

### Retries
- Global retries are set to `0` in `playwright.config.ts`.

### Timeouts
- No explicit global `timeout` or `expect.timeout` override in config.
- Playwright defaults apply.

## 10. Configuration Explanation

### `playwright.config.ts`
- `testDir`: `./tests`
- `fullyParallel`: `false`
- `workers`: `1`
- `retries`: `0`
- `reporter`: `html`
- `use.baseURL`: from `BASE_URL` env or fallback `https://web-tmp.ognomy.com`
- `use.trace`: `retain-on-failure`
- `use.screenshot`: `only-on-failure`
- `use.video`: `retain-on-failure`
- `use.headless`: `false`
- `use.serviceWorkers`: `block`

### Projects
- `auth-setup`
  - Runs `tests/auth/auth.setup.spec.ts`
  - Creates `storage/auth.json`
  - Uses clean state
- `auth`
  - Runs auth module orchestrator
  - Uses clean state (no storageState)
- `users`
  - Depends on `auth-setup`
  - Uses `storage/auth.json`
- `emails`
  - Depends on `auth-setup`
  - Uses `storage/auth.json`

### Storage state behavior
- Setup test sanitizes storage state and keeps only localStorage keys:
  - `auth`
  - `O_AUTH_KEY`

### Legacy setup file status
- `tests/auth/global.setup.ts` exists but is not currently wired in `playwright.config.ts`.

## 11. Debugging Guide

### Common failure patterns in this codebase
- `Unknown flowKey ...`: JSON test case flow key not mapped in orchestrator
- `Data file not found` / `Invalid JSON`: generated data missing or malformed
- Strict mode locator collisions due to broad `getByText` or `nth()` usage
- Timeout failures from dynamic UI + fixed sleeps
- Test data mismatch between Excel and generated JSON

### Local debugging workflow
1. Regenerate data.
```bash
npm run testdata:prepare
```
2. List tests with projects.
```bash
npx playwright test --list
```
3. Run one case with debug inspector.
```bash
npx playwright test tests/Users/user.orchestrator.spec.ts --project=users --grep "TC-USER-01" --debug
```
4. Open HTML report.
```bash
npx playwright show-report
```

### Async and state checks
- Confirm `storage/auth.json` is updated after `auth-setup` run.
- Confirm expected `flowKey` exists in map for each module orchestrator.

## 12. Coding Standards & Framework Rules

### Inferred standards
- Keep test definitions in orchestrators.
- Keep UI action logic in `flows/`.
- Keep routing in `AppNavigator`.
- Keep test data externalized in JSON generated from Excel.
- Validate data shape before execution (`testCaseLoader`, `getTestData`).

### Assertion placement
- Assertions are primarily inside flow functions.
- Orchestrators focus on dispatch, logging, and error handling.

### What should not be done
- Do not hardcode test data in test files when data is expected from JSON.
- Do not add new `flowKey` values without updating flow mappings.
- Do not skip data regeneration after Excel changes.

## 13. Reporting

### Configured reporters
- `html` only

### Artifact behavior from config
- `trace`: retained on failure
- `screenshot`: captured on failure
- `video`: retained on failure

### Local report locations
- HTML report output: `playwright-report/`
- Test artifacts: `test-results/`

Open report:
```bash
npx playwright show-report
```

## 14. Future CI Readiness

### Current status
The repository includes a CI workflow at `.github/workflows/playwright.yml` with:
- checkout
- Node setup (`lts/*`)
- dependency install (`npm ci`)
- Playwright browser install
- data prep
- test run (`npx playwright test`)
- HTML report artifact upload

### Gaps to address before reliable CI scaling
- No explicit Node version pin in `package.json` (`engines` missing)
- No environment matrix (`dev/staging/prod`) in workflow
- No secrets strategy documented for auth credentials
- No lint/typecheck/test gates beyond Playwright execution
- No sharding/parallel CI strategy (`workers` fixed to `1`)
- `global.setup.ts` remains in repo though not active (can confuse maintainers)

