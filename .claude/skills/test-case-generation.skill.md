---
name: test-case-generation
description: Reads Requirement Analysis, QA Knowledge, and UI screenshots from reference paths and generates a 3-sheet XLSX test case file with Summary, Feature_Catalog, and Test_Cases.
type: skill
---

# Test Case Generation

## Name
`test-case-generation`

## Description
Generates structured, comprehensive, and automation-ready test cases using:
- Requirement Analysis as the primary input
- QA Knowledge as supporting context
- UI screenshots as visual/UI reference

The output must be an Excel `.xlsx` file with 3 sheets:
1. Summary
2. Feature_Catalog
3. Test_Cases

---

## Purpose
Convert QA understanding into complete test cases with:
- Feature mapping
- Priorities
- Scenario coverage
- Execution-ready steps
- Automation-ready fields
- Playwright-friendly `FLOW_CODE`
- Valid `INPUT_JSON`

---

## Core Principle

- Requirement Analysis is the primary source of logic
- QA Knowledge provides module context
- Screenshots provide UI confirmation
- Do NOT re-read design repo
- Do NOT copy screenshots into QA repo
- Use screenshot path only as reference
- Generate final output as `.xlsx`

---

## When to Use
- After `requirement-analysis`
- After UI screenshots are captured
- Before `test-case-review`
- Before automation mapping

---

## When NOT to Use
- Before Requirement Analysis
- For Playwright script generation
- For defect reporting
- For requirement analysis

---

## Input

Provide:

Requirement Analysis File: analysis/<module-name>_requirement_analysis_v*.md  
QA Knowledge File: knowledge/<module-name>_qa_knowledge_v*.md  
Screenshot Path: ../FE-Codebase/screenshots/master-data  
Module Name: Admin / Master Data  
Screen Name: Master Data  
URL: <local or environment URL>

Example:

Requirement Analysis File: analysis/admin-master-data_requirement_analysis_v1.md  
QA Knowledge File: knowledge/admin-master-data_qa_knowledge_v2.md  
Screenshot Path: ../FE-Codebase/screenshots/master-data  
Module Name: Admin / Master Data  
Screen Name: Master Data  
URL: http://localhost:3000

Optional:

Test Scope Override: Smoke / Regression / Full

---

## Execution Rules

1. Validate Requirement Analysis file exists
   - If missing, STOP

2. Validate QA Knowledge file exists
   - If missing, continue with warning

3. Validate Screenshot Path exists
   - If missing, continue with non-UI test cases only

4. Do NOT read design repo directly

5. Do NOT copy screenshots into QA repo

6. Do NOT assume backend/API behavior if not defined
   - Mark as dependency or open question

7. Generate deterministic and non-duplicate test cases

8. Final output must be `.xlsx`, not Markdown

9. If `test-cases/` folder does not exist, create it

10. Never overwrite an existing file
   - If v1 exists, create v2, v3, etc.

---

## Instructions

You are a Senior QA Analyst.

Generate test cases based on:
- Requirement Analysis output as PRIMARY source
- QA Knowledge as supporting context
- Screenshots as UI behavior reference

Focus on:
- Feature behavior
- User flows
- Validations
- Edge cases
- Negative scenarios
- System states
- State transitions
- Integration points
- UI/UX behavior
- Automation readiness

---

## Screenshot Usage Rules

Read screenshot names from the Screenshot Path and infer UI coverage from available screenshots, such as:
- Default/list page
- Tab switching
- Create sheet/form
- Edit sheet/form
- Validation errors
- Deactivate confirmation popup
- Inactive state
- Reactivation flow
- Empty state
- Deep-link state

Use screenshots only to improve:
- Screen names
- UI steps
- Field visibility
- Button names
- Modal/sheet behavior
- Validation visibility

Do NOT treat screenshots as the only requirement source.

---

## Coverage Rules

Generate test coverage by priority:

Critical features:
- 5 to 10 test cases

High features:
- 3 to 5 test cases

Medium features:
- 2 to 3 test cases

Low features:
- 1 to 2 test cases

Cover these test types wherever applicable:
- Smoke
- Functional
- Negative
- Validation
- UI/UX
- Edge
- Integration
- Regression
- E2E

Rules:
- One scenario per test case
- Avoid duplicate scenarios
- Steps must be numbered
- Expected result must be specific and observable
- Each test case must map to one Feature ID
- Each test case must include automation fields

---

## Feature Catalog Rules

Create a consolidated feature catalog.

Rules:
- Max 15–20 features
- Focus on testable/interactive features
- Avoid duplicates
- Consolidate related UI elements
- Every test case must reference a valid Feature ID

Feature Types:
- Button
- Link
- Input
- Dropdown
- Toggle
- Table
- Form
- Icon
- Tab Group
- Display
- Modal
- Sheet
- Navigation

Priority Guide:
- Critical → core business flow
- High → important user flow
- Medium → standard behavior
- Low → optional or secondary behavior

---

## Automation Field Rules

### TEST_CASE_ID
Format:

TC_AMD_001  
TC_AMD_002  
TC_AMD_003

Where:
- AMD = Admin Master Data

---

### MODULE
Must be lowercase and framework-friendly.

Use:

admin-master-data

---

### FLOW_CODE
Must be camelCase and meaningful.

Examples:
- masterDataDefaultLoad
- masterDataTypeTabSwitch
- masterDataCreateTypeSuccess
- masterDataCreateTypeValidationError
- masterDataEditTypeSuccess
- masterDataDeactivateTypePopup
- masterDataDeactivateCascadeConfirmation
- masterDataReactivateEntrySuccess

---

### PRIORITY
Allowed values:
- Critical
- High
- Medium
- Low

---

### SUITE
Comma-separated values.

Examples:
- smoke,regression
- regression
- integration
- e2e

---

### TAGS
Lowercase, comma-separated.

Examples:
- master-data,smoke
- master-data,negative
- master-data,validation
- master-data,ui
- master-data,integration

---

### INPUT_JSON
Must always be valid JSON.

Examples:

{}

{"name": ""}

{"typeCode": "DOC_TYPE"}

{"entryCode": "PASSPORT"}

{"action": "deactivate"}

If no input is needed, use:

{}

---

## XLSX Output Requirement

Generate an Excel `.xlsx` file with exactly 3 sheets:

1. Summary
2. Feature_Catalog
3. Test_Cases

---

# Sheet 1: Summary

Columns:

| Metric | Value |

Rows must include:

| Metric | Value |
|---|---|
| Screen Name | |
| Module Name | |
| Requirement Analysis Source | |
| QA Knowledge Source | |
| Screenshot Path | |
| Total Features Count | |
| Critical Features | |
| High Features | |
| Medium Features | |
| Low Features | |
| Total Test Cases | |
| Smoke Tests | |
| Functional Tests | |
| Negative Tests | |
| Validation Tests | |
| UI/UX Tests | |
| Integration Tests | |
| Regression Tests | |
| E2E Tests | |
| Auto-Ready Tests | |
| Partial Automation Tests | |
| Manual-Only Tests | |
| Coverage Ratio | |
| Open Questions Count | |

---

# Sheet 2: Feature_Catalog

Columns:

| Feature ID | Feature Name | Type | Description | Priority | Screenshot Reference | Notes |

Feature ID format:

AMD-FEAT-001  
AMD-FEAT-002  
AMD-FEAT-003

---

# Sheet 3: Test_Cases

Columns:

| SCREEN | FEATURE_ID | TEST_CASE_ID | TEST_TYPE | TEST_SCENARIO | STEPS_TO_EXECUTE | TEST_DATA | EXPECTED_RESULT | MODULE | FLOW_CODE | PRIORITY | SUITE | TAGS | INPUT_JSON | AUTOMATION_READINESS | SCREENSHOT_REFERENCE | REQUIREMENT_ID | NOTES |

Column rules:

SCREEN:
- Use actual screen/sheet/modal name

FEATURE_ID:
- Must match Feature_Catalog

TEST_CASE_ID:
- TC_AMD_001 format

TEST_TYPE:
- Smoke / Functional / Negative / Validation / UI/UX / Edge / Integration / Regression / E2E

TEST_SCENARIO:
- One clear scenario

STEPS_TO_EXECUTE:
- Numbered steps in one cell

TEST_DATA:
- Human-readable test data

EXPECTED_RESULT:
- Specific expected behavior

MODULE:
- admin-master-data

FLOW_CODE:
- camelCase

PRIORITY:
- Critical / High / Medium / Low

SUITE:
- smoke,regression / regression / integration / e2e

TAGS:
- lowercase, comma-separated

INPUT_JSON:
- Valid JSON only

AUTOMATION_READINESS:
- Auto-Ready / Partial / Manual-Only

SCREENSHOT_REFERENCE:
- Screenshot filename if used, else blank

REQUIREMENT_ID:
- Requirement ID from Requirement Analysis

NOTES:
- Assumptions, blockers, dependencies

---

## Output Quality Rules

- Ensure full P1/Critical coverage
- Include positive, negative, validation, edge, and UI/UX cases
- Avoid duplication
- Keep steps executable
- Expected results must be observable
- Maintain traceability from requirement → feature → test case
- Keep test cases Playwright-friendly
- Highlight assumptions and blockers in NOTES
- Do not generate vague test cases like “verify page works”

---

## File Output Requirement

- Output folder: `test-cases/`
- Create `test-cases/` if it does not exist
- File name: `admin-master-data_test_cases_v1.xlsx`
- If file exists, create:
  - `admin-master-data_test_cases_v2.xlsx`
  - `admin-master-data_test_cases_v3.xlsx`
- Never overwrite existing files

---

## File Handling Rules

- Check if output file exists before writing
- Auto-increment version
- Do NOT delete or modify previous versions
- Notify user which XLSX version was created

---

## Expected Outcome

A complete Excel test case suite saved under `test-cases/` that includes:

- Summary sheet
- Feature_Catalog sheet
- Test_Cases sheet
- Complete feature mapping
- Comprehensive scenario coverage
- Automation-ready structure
- Playwright-friendly flow codes
- Valid JSON input data
- Screenshot-aware UI test coverage