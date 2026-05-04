---
name: automation-adapter
description: Reads reviewed test cases and produces automation-ready specifications — structured metadata, locator hints, data fixtures, and step mappings — that bridge the gap between manual test cases and Playwright automation scripts. Does NOT write automation code.
type: skill
---

# Automation Adapter

## Name
`automation-adapter`

## Description
Translates reviewed, approved test cases into automation-ready specifications. For each `Auto-Ready` or `Partial` test case, it produces a structured adapter document containing: test metadata, Page Object Method hints, locator strategy notes, test data fixtures, API payload templates, precondition setup requirements, and assertion mappings. This output is the direct input for automation engineers or AI code-generation workflows — but this skill does not write Playwright scripts itself.

## Purpose
Remove the interpretation gap between a written test case and its automation implementation. An automation engineer reading an adapter document should be able to implement the Playwright test without re-reading the original spec or asking clarifying questions.

## When to Use
- After `test-case-review` has produced a review report with a "Ready for Execution" or "Needs Minor Fix" sign-off.
- When onboarding automation for an existing manually-executed test suite.
- When the test case suite is updated and automation specs need to be re-derived.
- **Do not run** on test cases with a "Major Rework Required" verdict — resolve the review findings first.

## Input

| Input | Required | Description |
|-------|----------|-------------|
| Test case review file | Yes | Path to `qa-review/<feature>_test_case_review_v*.md` |
| Test cases file | Yes | Path to `Test cases/<feature>_test_cases_v*.md` |
| QA Knowledge file | Recommended | Path to `qa-knowledge/<feature>_qa_knowledge_v*.md` for URL/env details |
| App URL / environment info | Optional | Base URL, environment name, auth credentials pattern |

## Instructions

1. **Read all provided inputs.** Only process test cases tagged `Auto-Ready` or `Partial` and with a review verdict of Pass, Needs Minor Fix, or better. Skip `Manual-Only` cases — note them in the output but do not produce an adapter entry.

2. **For each eligible test case, produce an Automation Adapter Entry** (see Output schema below) covering:
   - **Metadata:** TC ID, title, priority, test type, suite grouping.
   - **Page / Component mapping:** Which page, modal, or API endpoint each step touches. Map to existing Page Object files in `pages/` if known.
   - **Locator hints:** For each UI interaction step, suggest a locator strategy (role, label, test-id, placeholder, etc.) based on the step description. Do not invent selectors — note what to look for.
   - **Action mapping:** Express each step as a Playwright action type (`click`, `fill`, `selectOption`, `waitForResponse`, `expect(...).toBeVisible()`, etc.).
   - **Test data fixtures:** Extract all test data values into a structured fixture block (JSON-compatible). Flag sensitive fields (passwords, tokens) for environment variable injection.
   - **API payload templates:** For API-touching steps, provide the expected request shape and response assertion structure.
   - **Precondition setup:** Describe what API calls, database seeds, or login flows are needed before the test starts. Note if an existing fixture or helper in `fixtures/` or `utils/` can handle this.
   - **Assertion mapping:** For each expected result, specify the Playwright assertion pattern to use and the selector/value to assert against.

3. **For `Partial` cases,** document which steps require manual intervention or additional setup and why.

4. **Produce a summary table** listing all test cases, their automation eligibility, and any blockers.

5. **Save the file** following the File Output Requirement.

## Output

Produce a Markdown file with the following structure:

```
# Automation Adapter: <Feature/Module Name>
## Meta
- Test cases source file
- Review source file
- Date
- Version
- Automation framework: Playwright (TypeScript)
- Total cases processed
- Auto-Ready count / Partial count / Manual-Only (skipped) count

## Automation Eligibility Summary

| TC ID | Title | Auto Eligibility | Blocker (if any) |
|-------|-------|-----------------|------------------|

## Adapter Entries

### TC-<MODULE>-<NNN>: <Short Title>
- **Eligibility:** Auto-Ready / Partial
- **Suite file suggestion:** `tests/<area>/<feature>.spec.ts`
- **Page Object(s):** `pages/<PageName>.ts` (existing or needs creation)

#### Locator Hints
| Step | Element Description | Suggested Locator Strategy |
|------|--------------------|-----------------------------|

#### Action Mapping
| Step | Playwright Action |
|------|------------------|

#### Test Data Fixture
```json
{
  "fieldName": "value",
  "sensitiveField": "process.env.VAR_NAME"
}
```

#### API Payload Template (if applicable)
- Request: method, endpoint, body shape
- Response assertion: status code, key fields to assert

#### Precondition Setup
- Steps or helpers needed before test body
- Existing fixture/helper reference if applicable

#### Assertion Mapping
| Expected Result | Playwright Assertion Pattern |
|----------------|------------------------------|

#### Partial Automation Notes (Partial cases only)
- Which steps need manual handling and why

---

## Manual-Only Cases (Skipped)
| TC ID | Title | Reason Not Automatable |

## Implementation Notes
- Shared helpers or fixtures that should be created/reused
- Data isolation considerations (test data cleanup)
- Environment variable requirements
```

## File Output Requirement
- **Output folder:** `qa-automation/`
- **File name:** `<feature-name>_automation_adapter_v1.md`
- If `_v1` already exists, save as `_v2`, `_v3`, etc.
- Never overwrite an existing file.
- **This skill does NOT create `.spec.ts` or any other code files.** It produces specification documents only.

## File Handling Rules
- Check if `qa-automation/<feature-name>_automation_adapter_v1.md` exists before writing.
- If it exists, increment the version suffix and notify the user which version was created.
- Do not delete or modify prior versions.

## Expected Outcome
A complete Automation Adapter specification saved in `qa-automation/` that:
- Covers every Auto-Ready and Partial test case with actionable locator hints, action mappings, fixture data, and assertion patterns.
- Enables an automation engineer to implement Playwright tests without re-reading the original spec.
- Explicitly lists Manual-Only cases so nothing is silently dropped.
- Does not contain any actual Playwright code — only the specification for it.
