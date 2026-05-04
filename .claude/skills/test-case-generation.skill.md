---
name: test-case-generation
description: Reads the Requirement Analysis document and generates comprehensive, structured test cases covering positive, negative, edge, and boundary scenarios for each requirement.
type: skill
---

# Test Case Generation

## Name
`test-case-generation`

## Description
Converts the Requirement Analysis into a full suite of structured test cases. Each test case maps to one or more requirements, includes clearly defined preconditions, steps, and expected results, and is tagged for test type, priority, and automation readiness.

## Purpose
Produce a complete, review-ready test case suite that covers all P1/P2/P3 requirements with appropriate scenario depth — positive paths, negative paths, boundary conditions, and edge cases — so QA engineers and automation scripts have unambiguous instructions.

## When to Use
- After `requirement-analysis` has produced a Requirement Analysis document.
- When the requirement analysis is updated and test cases need to be regenerated or extended.
- Before running `test-case-review`.

## Input

| Input | Required | Description |
|-------|----------|-------------|
| Requirement Analysis file | Yes | Path to `qa-analysis/<feature>_requirement_analysis_v*.md` |
| QA Knowledge file | Recommended | Path to `qa-knowledge/<feature>_qa_knowledge_v*.md` for additional context |
| Test scope override | Optional | Restrict or expand which requirements to cover |

## Instructions

1. **Read the Requirement Analysis document** and the QA Knowledge document (if provided).

2. **For each requirement (P1 first, then P2, then P3),** generate the following scenario types as applicable:
   - **Happy path** — valid input, expected success
   - **Negative path** — invalid input, error conditions, missing required fields
   - **Boundary / Edge** — min/max values, empty states, large datasets, special characters
   - **Authorization** — access with correct role, access with wrong role, unauthenticated access
   - **Integration** — cross-system data flows, third-party service behavior

3. **Write each test case** using the schema defined in the Output section.

4. **Tag automation readiness:**
   - `Auto-Ready` — clear, deterministic, UI or API automatable
   - `Partial` — automatable with some manual setup/teardown
   - `Manual-Only` — subjective, exploratory, or requires human judgment

5. **Tag test type:** Smoke / Regression / Functional / Negative / Boundary / Security / Performance / Accessibility / Integration / E2E.

6. **Assign unique IDs** in the format `TC-<MODULE>-<NNN>` (e.g., `TC-AUTH-001`).

7. **Group test cases by feature area or user flow.**

8. **Save the file** following the File Output Requirement.

## Output

Produce a Markdown file with the following structure:

```
# Test Cases: <Feature/Module Name>
## Meta
- Requirement Analysis source file
- Date
- Version
- Total test cases
- Breakdown: by type, by priority, by automation readiness

## Test Suite

### <Feature Area / Flow Name>

#### TC-<MODULE>-<NNN>: <Short Title>
- **Requirement ID:** REQ-NNN
- **Priority:** P1 / P2 / P3
- **Test Type:** Functional / Negative / Boundary / etc.
- **Automation Readiness:** Auto-Ready / Partial / Manual-Only
- **Preconditions:** (what must be true before test starts)
- **Test Data:** (specific values, credentials, payloads)
- **Steps:**
  1. Step one
  2. Step two
  ...
- **Expected Result:** (exact observable outcome)
- **Notes:** (any caveats or dependencies)
```

## File Output Requirement
- **Output folder:** `Test cases/`
- **File name:** `<feature-name>_test_cases_v1.md`
- If `_v1` already exists, save as `_v2`, `_v3`, etc.
- Never overwrite an existing file.

## File Handling Rules
- Check if `Test cases/<feature-name>_test_cases_v1.md` exists before writing.
- If it exists, increment the version suffix and notify the user which version was created.
- Do not delete or modify prior versions.

## Expected Outcome
A complete test case suite saved in `Test cases/` that:
- Covers every P1 requirement exhaustively and P2/P3 requirements proportionally.
- Has unambiguous steps and expected results that any QA engineer can execute.
- Is tagged for automation readiness so `automation-adapter` can prioritize which cases to automate.
- Is directly consumable by `test-case-review` for quality assessment.
