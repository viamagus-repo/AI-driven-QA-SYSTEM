# Troubleshooting

This guide helps diagnose and fix common issues in this Playwright data-driven framework.

## Recommended Debug Order
1. Run `npm run validate:framework`.
2. Run `npm run testdata:prepare`.
3. Run target tests (`npm run test:controlled` or module-specific command).

If step 1 or 2 fails, fix those errors first before running Playwright tests.

## Common Errors and Fixes

### 1) Missing `flowCode` in Excel
Symptoms:
- Validator error: `Missing 'flowCode'`
- Data prep failure during Excel conversion

Fix:
1. Open the mentioned Excel file/sheet/row.
2. Add value in `flowCode` column.
3. Ensure it matches intended flow file stem (for `loginValid.flow.ts`, use `loginValid`).

### 2) Unknown `flowCode`
Symptoms:
- Validator error: `Unknown flowCode ...`
- Data prep error during `validateFlowCode`

Fix:
1. Verify module value in Excel row (for example `auth`, `user`, `email`, `billing`).
2. Confirm flow file exists in `flows/<module>/` with `.flow.ts` suffix.
3. Ensure `flowCode` maps to file stem.
4. Re-run `npm run testdata:prepare`.

### 3) Ambiguous `flowCode`
Symptoms:
- Validator or runtime error: `Ambiguous flowCode ...`

Cause:
- `flowCode` loosely matches multiple flow files by prefix rules.

Fix:
1. Use a more specific `flowCode`.
2. Prefer exact match with file stem.

### 4) No flow folder found for module
Symptoms:
- Validator error: `No flow folder found for module ...`

Fix:
1. Create module scaffold: `npm run generate:module -- <moduleName>`
2. Ensure Excel `module` value matches generated module name.

### 5) Invalid JSON in Excel columns
Symptoms:
- Data prep error: `Invalid JSON in 'input' ...` or `expectedData`

Fix:
1. Correct JSON syntax in Excel cell.
2. Use valid JSON objects, for example:
   - `{"email":"a@b.com","password":"123"}`

### 6) Generated JSON missing `flowCode`
Symptoms:
- Validator error against `data/json/modules/**`

Fix:
1. Update source Excel row to include `flowCode`.
2. Re-run `npm run testdata:prepare` to regenerate JSON.

### 7) `Unknown flowCode` during test runtime
Symptoms:
- Orchestrator throws in `getFlowHandler(...)`

Fix:
1. Run `npm run validate:framework` first.
2. Confirm generated registry is current: `npm run flow:registry`.
3. Re-run prep: `npm run testdata:prepare`.

### 8) Auth storage problems for dependent modules
Symptoms:
- User/email/billing tests fail with auth/session issues

Cause:
- `auth-setup` dependency did not complete successfully.

Fix:
1. Run setup project directly:
   - `npx playwright test tests/auth/auth.setup.spec.ts --project=auth-setup`
2. Confirm `storage/auth.json` was updated.
3. Re-run module tests.

### 9) Module not found in controlled run
Symptoms:
- `TEST_MODULE` error or orchestrator not found

Fix:
1. Ensure `.env` has valid:
   - `TEST_TYPE=module`
   - `TEST_MODULE=<moduleName>`
2. Ensure orchestrator exists:
   - `tests/<moduleName>/<moduleName>.orchestrator.spec.ts`
3. For new modules, run generator first.

### 10) Generator run did not create expected files
Symptoms:
- Missing scaffold files after `generate:module`

Fix:
1. Run with argument separator:
   - `npm run generate:module -- <moduleName>`
2. Re-run safely (idempotent). Existing files are skipped, not overwritten.

## Quick Validation Commands

```bash
npm run validate:framework
npm run testdata:prepare
npx playwright test --list
```

## Log Scopes You Will See
- `TEST-CONTROL`: command orchestration
- `DATA-PREP`: preparation pipeline
- `FLOW-REGISTRY`: generated registry creation
- `EXCEL-TO-JSON`: Excel conversion
- `AUTH-ORCH` / `USER-ORCH` / `EMAIL-ORCH`: runtime test execution
- `VALIDATE-FRAMEWORK`: validation checks
