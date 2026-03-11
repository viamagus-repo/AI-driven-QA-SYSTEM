# How to Add Test Case

This guide shows the exact steps to add a new testcase using this framework.

## Before You Start (For New Team Members)
Two columns are critical for execution behavior:

1. `Module`
- Decides which module orchestrator and flow folder are used.
- Must match your module structure (for example: `auth`, `user`, `email`, `billing`).
- If module is wrong, the framework may not find the right flow folder or tests.

2. `Suite`
- Groups testcases by execution type (for example: `smoke`, `regression`, `e2e`).
- Used when running suite-based execution (`TEST_TYPE=suite` with `TEST_SUITE=<suite>`).
- If suite is wrong, testcase may be skipped from expected suite runs.

In short:
- `Module` controls **where** testcase executes.
- `Suite` controls **when** testcase executes.

## Excel Columns Explained (Detailed)

### Required execution columns
1. `ID`
- Unique testcase identifier.
- Used in test title and `--grep` filtering.
- Example: `TC-AUTH-LOGIN-TC10`

2. `Module`
- Must match module context (`auth`, `user`, `email`, `billing`, etc.).
- Used to load the correct orchestrator/test data bucket and flow folder.
- Wrong value can break flow resolution.

3. `flowCode`
- Most important runtime mapping key.
- Must map to flow file stem:
  - `flowCode=loginValid` -> `loginValid.flow.ts`
- Used by resolver at execution time.

### Execution grouping columns
4. `Suite`
- Controls which suite runs pick this testcase.
- Typical values: `smoke`, `regression`, `e2e`.
- You can add comma-separated suites if your process needs multi-membership.

5. `Tags`
- Additional grouping/filter metadata.
- Usually comma-separated.
- Example: `smoke,auth,login`

### Business description columns
6. `Scenario`
- Human-readable test description.

7. `Type`
- Example: `positive`, `negative`.

8. `Priority`
- Example: `high`, `medium`, `low`.

9. `steps` / `Expected result`
- Documentation fields for readability and manual traceability.
- Not used for flow resolution, but useful for review and audit.

### Data payload columns
10. `input` (critical)
- JSON object consumed by your flow code.
- Flow functions read it via `getTestData(testCase).input`.
- Field names in JSON must match what flow code expects.

11. `Expected data` (optional)
- JSON object for expected values.
- Can be used by flow assertions when needed.

## `input` Column: How It Works

### Where it is used in code
- Excel -> JSON conversion stores it under:
  - `testData.input`
- Flow files read it as:
```ts
const input = getTestData(testCase).input as Record<string, string>;
```

### Valid example
```json
{"email":"user@example.com","password":"Password123"}
```

### Invalid examples
1. Not valid JSON:
```text
{email:"user@example.com",password:"Password123"}
```
Reason: keys must be in double quotes.

2. Trailing comma:
```json
{"email":"user@example.com","password":"Password123",}
```

3. Plain text instead of JSON:
```text
user@example.com / Password123
```

### Practical rule
- If flow file expects `input.email`, `input.password`, your Excel `input` JSON must contain both keys exactly.

## Example Scenario
We want to add an auth testcase:
- Testcase ID: `TC-AUTH-LOGIN-TC10`
- Module: `auth`
- Flow code: `loginValid`

That means framework will execute:
- `flows/auth/loginValid.flow.ts`

## Step 1: Add/Update Excel Row
Open:
- `data/excel/tests/Auth_Test_Cases.xlsx`

Add a new row with at least:
- `ID`: `TC-AUTH-LOGIN-TC10`
- `Module`: `auth`
- `Scenario`: `Login with valid user and verify dashboard`
- `Type`: `positive`
- `Priority`: `high`
- `Suite`: `smoke`
- `Tags`: `smoke,auth`
- `input`: `{"email":"user@example.com","password":"Password123"}`
- `Expected data` (optional): `{"landingPath":"/staff/appointments"}`
- `flowCode`: `loginValid`

Important:
- `flowCode` should match flow file stem.
- `input` must be valid JSON.
- `Module` should be exact and consistent across module folders/config.
- `Suite` should follow your team run strategy:
  - `smoke`: fast health checks
  - `regression`: broader functional checks
  - `e2e`: full end-to-end scenario coverage

## Step 2: Ensure Flow File Exists
Check this file exists:
- `flows/auth/loginValid.flow.ts`

If it does not exist, create it and implement flow steps/assertions.

## Step 3: Validate Framework Data
Run:

```bash
npm run validate:framework
```

Fix any reported issue (file/sheet/row/module/flowCode) before moving ahead.

## Step 4: Generate Runtime Data
Run:

```bash
npm run testdata:prepare
```

This will:
1. Regenerate flow registry.
2. Convert Excel rows to JSON.

Verify testcase JSON is generated:
- `data/json/modules/auth/TC-AUTH-LOGIN-TC10.json`

## Step 5: Execute Test
Run module test:

```bash
npm run test:auth
```

Or run targeted testcase:

```bash
npx playwright test tests/auth/auth.orchestrator.spec.ts --project=auth --grep "TC-AUTH-LOGIN-TC10"
```

Run by suite (example smoke) through controlled mode:
1. Set in `.env`:
   - `TEST_TYPE=suite`
   - `TEST_SUITE=smoke`
2. Run:
```bash
npm run test:controlled
```

## Optional: Add Test Case in a New Module
If module/screen does not exist yet:

```bash
npm run generate:module -- <moduleName>
```

Then:
1. Add row in generated Excel file.
2. Add flow file `flows/<moduleName>/<flowCode>.flow.ts`.
3. Run validate/prep/test steps from above.

## Quick Checklist
1. Excel row added with valid `flowCode`.
2. Matching flow file exists.
3. `npm run validate:framework` passes.
4. `npm run testdata:prepare` passes.
5. Test runs successfully.
