# New Project Migration Guide

Use this guide when reusing this framework for a completely new product/project.

## Goal
Reset project-specific artifacts, keep framework core, and configure new app details safely.

## Quick reset command (recommended)
Use built-in reset utility before migration:

1. Preview changes:
```bash
npm run reset:framework -- --dry-run
```

2. Apply reset (keeps auth scaffolding by default):
```bash
npm run reset:framework
```
This command asks for confirmation (`y/N`) before making changes.

3. If your new project has no authenticated area:
```bash
npm run reset:framework -- --drop-auth
```

4. For CI/non-interactive runs:
```bash
npm run reset:framework -- --yes
```

What reset command does:
- Cleans project-specific module flows/tests/excel/json artifacts.
- Removes `core/flows/generatedFlowRegistry.ts`, report artifacts, and `storage/auth.json`.
- Resets `playwright.config.ts` to a clean baseline.

## 1. Keep vs Delete

## Keep (framework core)
- `core/` (data loader, flow resolver, navigator, logger)
- `tools/` (module generator, flow registry, excel conversion, validator, controlled runner)
- `package.json`, `package-lock.json`, `tsconfig.json`
- `playwright.config.ts` (will be edited, not deleted)
- `docs/` documentation set

## Delete or reset (project-specific content)
- Existing module flows you do not need:
  - `flows/Users/*`
  - `flows/email/*`
- Existing module tests you do not need:
  - `tests/Users/*`
  - `tests/emails/*`
- Existing Excel test data you do not need:
  - `data/excel/tests/*.xlsx`
- Existing generated JSON:
  - `data/json/modules/*`
- Existing auth storage state:
  - `storage/auth.json`
- Previous reports/artifacts:
  - `playwright-report/`
  - `test-results/`

## Important auth note (usually keep and update)
For most projects, authenticated pages are required. In that case:
- Keep `tests/auth/auth.setup.spec.ts` and update selectors/flow/test data for new login.
- Keep `auth-setup` project in `playwright.config.ts`.
- Keep dependent module projects linked to `auth-setup`.
- Keep `flows/auth/*` and replace with your new project auth flows.

Only remove auth setup if the new project truly has no authenticated areas.

## Generated files to never edit manually
- `core/flows/generatedFlowRegistry.ts`
- `data/json/modules/**` (source of truth is Excel + flow files)

## 2. Critical Changes Required

## Base URL
Where:
- `.env`
- `.env.example`
- fallback in `playwright.config.ts`

What to change:
1. Set `BASE_URL` in `.env` to your new application URL.
2. Update `.env.example` with a sample URL for new users.
3. Optionally update fallback URL in `playwright.config.ts`:
   - `use.baseURL: process.env.BASE_URL || "<your-default-url>"`

## Auth model (important)
Where:
- `tests/auth/auth.setup.spec.ts`
- `playwright.config.ts` project dependencies
- `storage/auth.json`

What to change:
1. Update login flow and selectors for your new app in auth setup path.
2. Keep or redesign setup dependency model:
   - modules needing login should depend on `auth-setup`.
3. Remove old localStorage key assumptions if not applicable:
   - `auth`, `O_AUTH_KEY` handling in setup/navigator.

## Navigation routes
Where:
- `core/navigation/AppNavigator.ts`

What to change:
1. Replace route paths in `ROUTES`.
2. Verify each module start page exists and is correct.
3. If localStorage cleanup is not valid for new app, adjust/remove `addInitScript`.

## Project names and module layout
Where:
- `playwright.config.ts`
- `tests/<module>/<module>.orchestrator.spec.ts`
- `flows/<module>/`
- Excel `Module` column values

Default approach:
1. Use `npm run generate:module -- <moduleName>` for every new module.
2. Do not manually create module folders/files/config if generator is available.

When manual checks/changes are still needed:
1. Migration from legacy modules with inconsistent names (for example `Users` vs `user`).
2. Existing `playwright.config.ts` entries that were created before generator usage.
3. Old Excel files where `Module` values do not match generated module names.

What to verify:
1. Module names are standardized (recommended lowercase).
2. Playwright project names align with test directories.
3. Excel `Module` values match module directories/resolver expectations.

## 3. Bootstrap a New Module Set

For each new screen/module:

```bash
npm run generate:module -- <moduleName>
```

This creates:
- `flows/<moduleName>/sample.flow.ts`
- `tests/<moduleName>/<moduleName>.orchestrator.spec.ts`
- `data/json/modules/<moduleName>/config.json`
- `data/excel/tests/<ModuleName>_Test_Cases.xlsx`
- Playwright project entry in `playwright.config.ts`

Then:
1. Replace sample flow with real implementation.
2. Add Excel rows with `flowCode`.
3. Keep flow file naming rule:
   - `flowCode=loginValid` -> `loginValid.flow.ts`

## 4. Environment Variables to Review

Where:
- `.env`
- `.env.example`
- `tools/test-control.ts`

Variables currently used:
- `BASE_URL`
- `TEST_TYPE` (`suite` or `module`)
- `TEST_SUITE` (`smoke`, `regression`, `e2e`)
- `TEST_MODULE` (module name)

If your run modes differ, update `tools/test-control.ts` accordingly.

## 5. Data Pipeline for New Project

Run in this order:

1. Validate:
```bash
npm run validate:framework
```

2. Generate runtime data:
```bash
npm run testdata:prepare
```

3. Run controlled execution:
```bash
npm run test:controlled
```

What these do:
- `validate:framework`: checks Excel/module/flow consistency.
- `testdata:prepare`: regenerates flow registry + JSON testcases.
- `test:controlled`: executes Playwright by suite/module mode.

## 6. New Project Hardening Checklist

1. Confirm no old module files remain.
2. Confirm no old credentials/secrets remain in `.env` or test data.
3. Confirm auth setup works and writes fresh `storage/auth.json`.
4. Confirm each module has:
   - Excel file
   - flow files
   - orchestrator
   - Playwright project
5. Confirm `npm run validate:framework` passes.
6. Confirm at least one smoke case per module passes.
7. Confirm report generation and artifacts are working.

## 7. Typical Migration Mistakes

1. Updating only `.env` but not route mappings in `AppNavigator`.
2. Reusing old auth localStorage key logic for a different app.
3. Keeping old Excel with stale module names.
4. Editing generated registry manually instead of running prep.
5. Running tests without validation/prep after changes.

## 8. Recommended Minimal First Run

1. Set `BASE_URL` and auth credentials/config.
2. Generate one module (`generate:module`).
3. Add one Excel testcase row with `flowCode`.
4. Implement one flow file.
5. Run:
```bash
npm run validate:framework
npm run testdata:prepare
npx playwright test tests/<module>/<module>.orchestrator.spec.ts --project=<module>
```

Once this passes, scale to additional modules and suites.
