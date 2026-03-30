# Command Reference

All custom `npm run` commands available in this framework, organised by category.

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm run generate:module -- <name> --route=<path>` | Scaffold a new module end-to-end |
| `npm run generate:flow -- --module=<m> --flowCode=<f>` | Add a single new flow to a module |
| `npm run flow:registry` | Rebuild the auto-generated flow index |
| `npm run testdata:prepare` | Excel → JSON + regenerate registry |
| `npm run testdata:prepare:auth` | Auth Excel → JSON only |
| `npm run test:auth` | Run all auth tests |
| `npm run test:auth:smoke` | Run auth @smoke tests |
| `npm run test:auth:regression` | Run auth @regression tests |
| `npm run test:user` | Run all user tests |
| `npm run test:email` | Run all email tests |
| `npm run test:controlled` | Env-var-driven test selection |
| `npm run validate:framework` | Check Excel/JSON/flow consistency |
| `npm run delete:module -- <name> --dry-run` | Preview module deletion |
| `npm run delete:module -- <name> --yes` | Execute module deletion |
| `npm run reset:framework -- --dry-run` | Preview full framework reset |
| `npm run reset:framework -- --yes` | Execute framework reset (keep auth) |
| `npm run reset:framework -- --drop-auth --yes` | Full reset including auth |
| `npm run check:docs-drift` | Detect stale documentation |
| `npm run ci:quality` | Full CI quality gate |
| `npm run test:tools` | Unit tests for generator tools |

---

## Scaffolding

### `generate:module`

Creates a complete module scaffold for a new screen/feature under test.

**What it creates:**
- `flows/<module>/sample.flow.ts` — placeholder flow
- `tests/<module>/<module>.orchestrator.spec.ts` — test orchestrator
- `core/pages/modules/<module>.page.ts` — page object class
- `data/json/modules/<module>/config.json` — test suite config
- `data/excel/tests/<Module>_Test_Cases.xlsx` — Excel template
- Injects a new Playwright project into `playwright.config.ts`
- Adds `AppPage.<MODULE>` enum entry and route into `AppNavigator.ts`
- Adds Zod input schema entry in `core/data/flowInputSchemas.ts`

**Syntax:**
```bash
npm run generate:module -- <moduleName> --route=<routePath>
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `<moduleName>` | Yes | Lowercase module name. Letters, numbers, `-` or `_` only. Must start with a letter. |
| `--route=<path>` | Yes | Relative URL path for the module (e.g. `/staff/billing`). Do not include the base URL. |

**Examples:**
```bash
# Full syntax
npm run generate:module -- billing --route=/staff/billing

# With equals sign
npm run generate:module -- billing --route=/staff/billing

# Without --route (will interactively prompt for it)
npm run generate:module -- billing
```

> If `--route` is omitted the tool will prompt you to enter it interactively. Rollback is automatic if any step fails — re-run after fixing the issue.

---

### `generate:flow`

Adds a single new flow file to an existing module.

**What it creates:**
- `flows/<module>/<flowCode>.flow.ts` — skeleton flow with a `throw new Error("Implement …")` guard
- Registers a Zod input schema entry in `core/data/flowInputSchemas.ts`
- Creates the module page object (`core/pages/modules/<module>.page.ts`) if it does not already exist

**Syntax:**
```bash
npm run generate:flow -- --module=<moduleName> --flowCode=<flowCode>
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `--module=<name>` | Yes | Target module name (must already have a folder under `flows/`). |
| `--flowCode=<code>` | Yes | Flow identifier in camelCase (e.g. `loginValid`, `createUser`). Lowercase letters, numbers, `-` or `_` only. |

**Examples:**
```bash
npm run generate:flow -- --module=auth --flowCode=loginValid
npm run generate:flow -- --module=users --flowCode=deleteUser
```

> After generating, run `npm run flow:registry` to register the new flow, then implement the body of the created `.flow.ts` file.

---

### `flow:registry`

Scans all `flows/**/*.flow.ts` files and regenerates `core/flows/generatedFlowRegistry.ts`.

**Syntax:**
```bash
npm run flow:registry
```

**When to run:**
- After adding a new flow file manually or via `generate:flow`
- After deleting a flow file
- When the registry is out of sync with the flow files on disk

**Example:**
```bash
npm run flow:registry
```

> Never edit `generatedFlowRegistry.ts` by hand — always regenerate it with this command.

---

## Test Data

### `testdata:prepare`

Regenerates the flow registry **and** converts all Excel files in `data/excel/tests/` to JSON test cases under `data/json/modules/`.

**Syntax:**
```bash
npm run testdata:prepare
```

**Run this after:**
- Adding or editing rows in any Excel test case file
- Adding a new module or flow
- Before running any test suite

**Example:**
```bash
npm run testdata:prepare
```

---

### `testdata:prepare:auth`

Same as `testdata:prepare` but converts only `Auth_Test_Cases.xlsx`. Faster when only the auth module has changed.

**Syntax:**
```bash
npm run testdata:prepare:auth
```

**Example:**
```bash
npm run testdata:prepare:auth
```

---

## Running Tests

All test commands run `testdata:prepare` first automatically, so your JSON data is always in sync with Excel before tests execute.

### `test:auth`

Runs all auth test cases.

**Syntax:**
```bash
npm run test:auth
```

**Example:**
```bash
# Run the full auth suite (all priorities and tags)
npm run test:auth
```

---

### `test:auth:smoke`

Runs only auth test cases tagged `@smoke`.

**Syntax:**
```bash
npm run test:auth:smoke
```

**Example:**
```bash
# Quick sanity check — only critical smoke tests
npm run test:auth:smoke
```

---

### `test:auth:regression`

Runs only auth test cases tagged `@regression`.

**Syntax:**
```bash
npm run test:auth:regression
```

**Example:**
```bash
# Full regression pass for auth
npm run test:auth:regression
```

---

### `test:user`

Runs all user module test cases.

**Syntax:**
```bash
npm run test:user
```

**Example:**
```bash
npm run test:user
```

---

### `test:email`

Runs all email module test cases.

**Syntax:**
```bash
npm run test:email
```

**Example:**
```bash
npm run test:email
```

---

### `test:controlled`

Environment-variable-driven test runner. Used in CI pipelines or when you need to select tests without editing scripts.

**Syntax:**
```bash
TEST_TYPE=<type> [TEST_SUITE=<suite> | TEST_MODULE=<module>] npm run test:controlled
```

**Environment Variables:**

| Variable | Required | Values | Description |
|----------|----------|--------|-------------|
| `TEST_TYPE` | Yes | `suite` or `module` | Selects the run mode. |
| `TEST_SUITE` | When `TEST_TYPE=suite` | `smoke`, `regression`, `e2e` | Runs all orchestrators filtered by the given tag. |
| `TEST_MODULE` | When `TEST_TYPE=module` | Any module name (e.g. `auth`, `users`) | Runs the specific module's orchestrator. |

**Examples:**
```bash
# Run all smoke tests across every module
TEST_TYPE=suite TEST_SUITE=smoke npm run test:controlled

# Run the full auth module
TEST_TYPE=module TEST_MODULE=auth npm run test:controlled

# Run the users module
TEST_TYPE=module TEST_MODULE=users npm run test:controlled
```

> On Windows PowerShell, set env vars before the command:
> ```powershell
> $env:TEST_TYPE="suite"; $env:TEST_SUITE="smoke"; npm run test:controlled
> ```

---

## Maintenance

### `validate:framework`

Checks consistency across Excel files, generated JSON, and flow files. Reports exact file, sheet, row, and test case ID for every issue found.

**Checks performed:**
- Every Excel row has a `module` and `flowCode`
- Every `flowCode` in Excel resolves to a real flow file
- No ambiguous (prefix-only) flow matches
- All modules referenced in Excel have a `flows/` folder
- Generated JSON files are valid and contain `flowCode`
- Input data validates against the registered Zod schema (if one exists)

**Syntax:**
```bash
npm run validate:framework
```

**Example:**
```bash
npm run validate:framework
```

**Run this:**
- Before pushing to a branch
- After bulk-editing Excel files
- As part of CI (included in `ci:quality`)

---

### `delete:module`

Safely removes all artifacts for a module. Use `--dry-run` first to preview what will be deleted before committing.

**What it removes:**
- `flows/<module>/` directory
- `tests/<module>/` directory
- `data/json/modules/<module>/` directory
- `data/excel/tests/<Module>_Test_Cases.xlsx`
- `core/pages/modules/<module>.page.ts`
- The module's Playwright project from `playwright.config.ts`
- `test:<module>` and `test:<module>:*` scripts from `package.json`
- `AppPage.<MODULE>` enum entry and route from `AppNavigator.ts`
- Regenerates `generatedFlowRegistry.ts`

**Syntax:**
```bash
# Preview (no files changed)
npm run delete:module -- <moduleName> --dry-run

# Execute with confirmation prompt
npm run delete:module -- <moduleName>

# Execute without prompt (CI / non-interactive)
npm run delete:module -- <moduleName> --yes
```

**Flags:**

| Flag | Description |
|------|-------------|
| `--dry-run` | Lists all actions that would be taken without making any changes. |
| `--yes` or `-y` | Skips the interactive confirmation prompt. |

**Examples:**
```bash
npm run delete:module -- billing --dry-run
npm run delete:module -- billing --yes
```

---

### `reset:framework`

Wipes all project-specific modules and resets `playwright.config.ts` and `AppNavigator.ts` to a clean baseline. Used when reusing the boilerplate for a completely new application.

**By default, the `auth` module is preserved.** Use `--drop-auth` to remove it too.

**What it removes/resets:**
- All non-auth entries under `flows/`, `tests/`, `core/pages/modules/`, `data/excel/tests/`, `data/json/modules/`
- `core/flows/generatedFlowRegistry.ts`
- `storage/auth.json`
- `playwright-report/` and `test-results/` directories
- Rewrites `playwright.config.ts` to a minimal baseline
- Rewrites `AppNavigator.ts` with only `HOME` and `LOGIN` pages

**Syntax:**
```bash
# Preview (no files changed)
npm run reset:framework -- --dry-run

# Keep auth, prompt for confirmation
npm run reset:framework

# Drop auth module too
npm run reset:framework -- --drop-auth

# Non-interactive (CI)
npm run reset:framework -- --yes

# Drop auth, no prompt
npm run reset:framework -- --drop-auth --yes
```

**Flags:**

| Flag | Description |
|------|-------------|
| `--drop-auth` | Also removes the `auth` module (flows, tests, page object, Excel, JSON). Default is to keep it. |
| `--dry-run` | Lists all actions without making any changes. |
| `--yes` or `-y` | Skips the interactive confirmation prompt. |

> This action is **irreversible**. Always run with `--dry-run` first and commit your work before proceeding.

---

### `check:docs-drift`

Fails if source code files have been modified more recently than the documentation files, signalling that docs may be out of date.

**Syntax:**
```bash
npm run check:docs-drift
```

**Example:**
```bash
npm run check:docs-drift
```

Run as part of code review or CI to enforce documentation hygiene.

---

## CI & Quality

### `ci:quality`

Full pre-merge quality gate. Runs all checks in sequence:

1. `validate:framework` — checks Excel/JSON/flow consistency
2. `tsc --noEmit` — TypeScript type check (no output files)
3. `testdata:prepare` — regenerates registry and converts Excel to JSON
4. `test:tools` — runs vitest unit tests for the generator tools

**Syntax:**
```bash
npm run ci:quality
```

**Example:**
```bash
npm run ci:quality
```

If any step fails the pipeline stops. Fix the reported issue and re-run.

---

### `test:tools`

Runs vitest unit tests for the tools in the `tools/` directory (generator, validator, etc.).

**Syntax:**
```bash
npm run test:tools
```

**Example:**
```bash
npm run test:tools
```
