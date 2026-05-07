---
name: test-case-review
description: Reviews generated XLSX test cases for completeness, accuracy, coverage, redundancy, traceability, automation readiness, and readiness for Playwright mapping.
type: skill
---

# Test Case Review

## Name
`test-case-review`

## Description
Acts as an independent QA reviewer for the generated Excel test case suite.

It reviews the XLSX test case file containing:
1. Summary
2. Feature_Catalog
3. Test_Cases

The review checks:
- Requirement coverage
- Feature mapping
- Test case quality
- Traceability
- Redundancy
- Automation readiness
- Screenshot usage
- Playwright readiness

---

## Purpose
Ensure the generated test cases are accurate, complete, non-duplicative, traceable, executable, and automation-ready before they are used for manual execution or Playwright automation mapping.

---

## Core Principle

- Test cases file is the primary review target
- Requirement Analysis is the traceability baseline
- QA Knowledge provides business/module context
- Screenshots provide UI validation reference
- Do NOT re-read design repo
- Do NOT modify the original test case XLSX
- Produce a separate review report only

---

## When to Use
- After `test-case-generation` has produced the XLSX test case file
- Before automation mapping
- Before test execution handoff
- When test cases are regenerated and need quality validation

---

## When NOT to Use
- Before test cases are generated
- For generating new test cases
- For writing Playwright scripts
- For defect reporting

---

## Input

Provide:

Test Cases File: test-cases/<module-name>_test_cases_v*.xlsx  
Requirement Analysis File: analysis/<module-name>_requirement_analysis_v*.md  
QA Knowledge File: knowledge/<module-name>_qa_knowledge_v*.md  
Screenshot Path: ../FE-Codebase/screenshots/master-data

Example:

Test Cases File: test-cases/admin-master-data_test_cases_v1.xlsx  
Requirement Analysis File: analysis/admin-master-data_requirement_analysis_v1.md  
QA Knowledge File: knowledge/admin-master-data_qa_knowledge_v2.md  
Screenshot Path: ../FE-Codebase/screenshots/master-data

---

## Execution Rules

1. Validate Test Cases XLSX file exists
   - If missing, STOP

2. Validate XLSX contains exactly these sheets:
   - Summary
   - Feature_Catalog
   - Test_Cases

3. Validate Requirement Analysis file exists
   - If missing, STOP

4. Validate QA Knowledge file exists
   - If missing, continue with warning

5. Validate Screenshot Path exists
   - If missing, continue but flag screenshot review as unavailable

6. Do NOT modify the original XLSX

7. Do NOT re-read design repo

8. Generate a separate Markdown review report under `review/`

---

## Review Instructions

You are a Senior QA Reviewer.

Review the test case suite against the Requirement Analysis and QA Knowledge.

Check the following:

### 1. Sheet Structure Validation
Verify the XLSX has:
- Summary sheet
- Feature_Catalog sheet
- Test_Cases sheet

Flag if:
- Any sheet is missing
- Sheet names are incorrect
- Mandatory columns are missing

---

### 2. Summary Sheet Review
Validate:
- Total feature count matches Feature_Catalog
- Total test case count matches Test_Cases
- Priority counts are accurate
- Test type counts are accurate
- Automation readiness counts are accurate
- Coverage Ratio is reasonable and supported

---

### 3. Feature_Catalog Review
Validate each feature for:
- Unique Feature ID
- Clear Feature Name
- Correct Feature Type
- Useful Description
- Correct Priority
- Screenshot reference if applicable
- No duplicate or overlapping features

Feature ID format must be:

AMD-FEAT-001  
AMD-FEAT-002  
AMD-FEAT-003

---

### 4. Test_Cases Sheet Review
Validate each test case for:

| Criterion | Check |
|----------|-------|
| Traceability | Maps to valid Requirement ID |
| Feature Mapping | FEATURE_ID exists in Feature_Catalog |
| Clarity | Steps are clear and executable |
| Completeness | Required columns are filled |
| Accuracy | Expected result matches requirement/knowledge |
| Atomicity | One scenario per test case |
| Redundancy | No duplicate or near-duplicate cases |
| Data Specificity | TEST_DATA and INPUT_JSON are concrete |
| Automation Readiness | Tag matches actual automatable nature |
| Flow Code Quality | FLOW_CODE is camelCase and meaningful |
| Screenshot Alignment | Screenshot reference supports the UI scenario |

---

### 5. Mandatory Column Validation

The Test_Cases sheet must contain:

| SCREEN | FEATURE_ID | TEST_CASE_ID | TEST_TYPE | TEST_SCENARIO | STEPS_TO_EXECUTE | TEST_DATA | EXPECTED_RESULT | MODULE | FLOW_CODE | PRIORITY | SUITE | TAGS | INPUT_JSON | AUTOMATION_READINESS | SCREENSHOT_REFERENCE | REQUIREMENT_ID | NOTES |

Flag missing or incorrectly named columns.

---

### 6. Automation Field Validation

Validate:

MODULE:
- Must be `admin-master-data`

FLOW_CODE:
- Must be camelCase
- Must be meaningful
- Must map to the test flow
- Must not be blank for Auto-Ready tests

INPUT_JSON:
- Must be valid JSON
- Use `{}` when no input is required

TAGS:
- Must be lowercase
- Must be comma-separated

SUITE:
- Must be meaningful, such as:
  - smoke,regression
  - regression
  - integration
  - e2e

AUTOMATION_READINESS:
Allowed values:
- Auto-Ready
- Partial
- Manual-Only

---

### 7. Coverage Gap Analysis

From Requirement Analysis:
- List all requirement IDs
- Verify each has test coverage
- Check if P1/Critical requirements have sufficient depth
- Check if negative, validation, edge, and UI/UX scenarios are present where applicable

Flag:
- Missing requirements
- Under-tested requirements
- Requirements with only happy path coverage
- Requirements blocked by backend/API/design ambiguity

---

### 8. Screenshot Coverage Review

Read screenshot file names from Screenshot Path.

Validate:
- Important UI states are represented in test cases
- Screenshot references are valid
- UI validation test cases reference relevant screenshots

Flag:
- Screenshots not used
- Test cases referencing missing screenshots
- UI states visible in screenshots but not covered by test cases

---

### 9. Redundancy Review

Identify:
- Duplicate test cases
- Near-duplicate scenarios
- Overlapping feature coverage
- Test cases that can be merged

Provide recommendation:
- Keep
- Merge
- Remove
- Rewrite

---

### 10. Scoring

Score each test case:

Allowed verdicts:
- Pass
- Needs Minor Fix
- Needs Major Fix
- Fail

Use this guide:

Pass:
- Complete, clear, traceable, executable, and automation-ready where applicable

Needs Minor Fix:
- Small wording, data, tag, or formatting issue

Needs Major Fix:
- Missing key data, weak expected result, unclear steps, poor traceability

Fail:
- Invalid, duplicate, not testable, wrong requirement mapping, or misleading expected result

---

## Output Format

Generate a Markdown review report in this structure:

# Test Case Review: Admin / Master Data

## Meta
- Test Cases Source File
- Requirement Analysis Source File
- QA Knowledge Source File
- Screenshot Path
- Date
- Version
- Reviewer

## Executive Summary
- Total Test Cases Reviewed
- Pass Count
- Needs Minor Fix Count
- Needs Major Fix Count
- Fail Count
- Requirement Coverage Score
- Automation Readiness Score
- Overall Verdict

Overall Verdict allowed values:
- Ready for Execution
- Needs Minor Revision
- Needs Major Revision
- Not Ready

## XLSX Structure Validation
| Check | Status | Notes |

## Summary Sheet Findings
| Metric | Expected | Actual | Status | Notes |

## Feature Catalog Findings
| Feature ID | Verdict | Issues Found | Suggested Fix |

## Per-Test-Case Findings
| TEST_CASE_ID | Requirement ID | Feature ID | Verdict | Issues Found | Suggested Fix |

## Coverage Gap Analysis
| Requirement ID | Coverage Status | Missing Scenarios | Recommendation |

## Redundant / Overlapping Test Cases
| Test Case IDs | Issue | Recommendation |

## Automation Readiness Findings
| TEST_CASE_ID | Current Readiness | Recommended Readiness | Reason |

## Screenshot Coverage Findings
| Screenshot | Used? | Related Test Cases | Notes |

## Invalid / Missing Data Issues
| TEST_CASE_ID | Field | Issue | Suggested Fix |

## Prioritized Fix List

### Must Fix
1.

### Should Fix
1.

### Nice to Have
1.

## Sign-Off Recommendation
- Proceed to automation mapping: Yes / No / Conditional
- Reason
- Conditions before proceeding

---

## File Output Requirement

- Output folder: `review/`
- File name: `admin-master-data_test_case_review_v1.md`
- If file exists, create:
  - `admin-master-data_test_case_review_v2.md`
  - `admin-master-data_test_case_review_v3.md`
- Never overwrite existing files

---

## File Handling Rules

- Check if output file exists before writing
- Auto-increment version
- Do NOT delete or modify previous review files
- Notify user which review version was created

---

## Expected Outcome

A structured review report saved under `review/` that:

- Reviews the 3-sheet XLSX test case suite
- Validates traceability to Requirement Analysis
- Checks feature mapping correctness
- Identifies missing and weak coverage
- Flags duplicate or low-quality test cases
- Validates automation-readiness fields
- Reviews screenshot usage
- Gives a clear sign-off recommendation for automation mapping