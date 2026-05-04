---
name: test-case-review
description: Reviews generated test cases for completeness, accuracy, clarity, coverage gaps, redundancy, and traceability to requirements, then produces a scored review report with actionable improvement notes.
type: skill
---

# Test Case Review

## Name
`test-case-review`

## Description
Acts as an independent QA reviewer for the test case suite. It scores each test case against defined quality criteria, identifies coverage gaps, flags ambiguous or untestable steps, detects redundancy, and verifies full traceability back to requirements. The output is a review report with a pass/fail verdict per test case and a prioritized list of fixes.

## Purpose
Catch test case quality issues before automation or manual execution begins, ensuring the suite is accurate, complete, traceable, and efficient — not just large.

## When to Use
- After `test-case-generation` has produced a test case file.
- When an existing test suite is being audited for quality or coverage.
- Before handing off to `automation-adapter`.

## Input

| Input | Required | Description |
|-------|----------|-------------|
| Test cases file | Yes | Path to `Test cases/<feature>_test_cases_v*.md` |
| Requirement Analysis file | Yes | Path to `qa-analysis/<feature>_requirement_analysis_v*.md` |
| QA Knowledge file | Recommended | Path to `qa-knowledge/<feature>_qa_knowledge_v*.md` |

## Instructions

1. **Load all three input documents.** The Requirement Analysis is the traceability baseline; the QA Knowledge provides business context; the test cases are what is being reviewed.

2. **For each test case, evaluate against these criteria:**

   | Criterion | Check |
   |-----------|-------|
   | Traceability | Does it map to a real requirement ID? |
   | Clarity | Are steps unambiguous and executable by any QA engineer? |
   | Completeness | Are preconditions, test data, steps, and expected result all present? |
   | Accuracy | Does the expected result match the actual behavior described in the spec/knowledge doc? |
   | Atomicity | Does the test case test exactly one thing? |
   | Redundancy | Is this a duplicate or near-duplicate of another test case? |
   | Data specificity | Is test data concrete (not vague like "valid input")? |

3. **Score each test case:** Pass / Needs Minor Fix / Needs Major Fix / Fail.

4. **Perform coverage gap analysis:**
   - List every requirement ID from the Requirement Analysis.
   - Flag any requirement with no test case, insufficient scenario depth, or missing negative/boundary coverage.

5. **Check automation readiness tags** for consistency — are cases tagged `Auto-Ready` actually deterministic and automatable?

6. **Summarize overall suite quality** with a coverage score (percentage of requirements with adequate test coverage).

7. **Produce a prioritized fix list** — items that must be fixed before the suite is used vs. nice-to-have improvements.

8. **Save the file** following the File Output Requirement.

## Output

Produce a Markdown file with the following structure:

```
# Test Case Review: <Feature/Module Name>
## Meta
- Test cases source file
- Requirement Analysis source file
- Reviewer (AI / human)
- Date
- Version

## Executive Summary
- Total test cases reviewed
- Pass / Needs Fix / Fail counts
- Coverage score: X% of requirements have adequate coverage
- Overall verdict: Ready for Execution / Needs Revision / Major Rework Required

## Per-Test-Case Findings

### TC-<MODULE>-<NNN>: <Title>
- **Verdict:** Pass / Needs Minor Fix / Needs Major Fix / Fail
- **Issues found:** (list, or "None")
- **Suggested fix:** (specific correction, or "N/A")

## Coverage Gap Analysis

| Requirement ID | Coverage Status | Missing Scenarios |
|---------------|-----------------|-------------------|

## Redundant Test Cases
- List of TC IDs that duplicate coverage, with merge/remove recommendation

## Automation Readiness Discrepancies
- TC IDs whose readiness tag appears incorrect, with reasoning

## Prioritized Fix List
### Must Fix (blocks execution)
1. ...

### Should Fix (improves quality)
1. ...

### Nice to Have
1. ...

## Sign-Off Recommendation
- Recommended action before proceeding to automation-adapter
```

## File Output Requirement
- **Output folder:** `qa-review/`
- **File name:** `<feature-name>_test_case_review_v1.md`
- If `_v1` already exists, save as `_v2`, `_v3`, etc.
- Never overwrite an existing file.

## File Handling Rules
- Check if `qa-review/<feature-name>_test_case_review_v1.md` exists before writing.
- If it exists, increment the version suffix and notify the user which version was created.
- Do not delete or modify prior versions.

## Expected Outcome
A thorough review report saved in `qa-review/` that:
- Gives a clear pass/fail verdict per test case with specific, actionable fix notes.
- Quantifies requirement coverage with a coverage score.
- Produces a prioritized fix list so QA leads know exactly what to address before execution.
- Provides an explicit sign-off recommendation for the `automation-adapter` handoff.
