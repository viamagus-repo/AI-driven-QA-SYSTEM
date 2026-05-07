# Test Case Review: Admin / Master Data

## Meta

| Field | Value |
|---|---|
| Test Cases Source File | `test-cases/admin-master-data_test_cases_v1.xlsx` |
| Requirement Analysis Source File | `analysis/admin-master-data_requirement_analysis_v1.md` |
| QA Knowledge Source File | `knowledge/admin-master-data_qa_knowledge_v2.md` |
| Screenshot Path | `../FE-Codebase/screenshots/master-data/` |
| Date | 2026-05-06 |
| Version | v1 |
| Reviewer | AI QA Review Pipeline (test-case-review skill) |
| Total Test Cases Reviewed | 91 |

---

## Executive Summary

| Metric | Value |
|---|---|
| Total Test Cases Reviewed | 91 |
| Pass | 46 |
| Needs Minor Fix | 44 |
| Needs Major Fix | 1 |
| Fail | 0 |
| Requirement Coverage Score | 57 / 58 AMD-REQs (98.3%) |
| Automation Readiness Score | 53 Auto-Ready / 36 Partial / 2 Manual-Only |
| Overall Verdict | **Needs Minor Revision** |

**Summary Statement:** The test suite is structurally sound, fully traceable, and free of duplicates. All field formats pass validation. The primary issue is a systematic screenshot reference formatting bug (backtick markdown syntax retained in XLSX cells) affecting 44 test cases, making the `SCREENSHOT_REFERENCE` field unresolvable by any downstream tooling. One requirement (AMD-REQ-048) has no direct REQUIREMENT_ID mapping. Six test cases contain placeholder `INPUT_JSON` values. These are all minor/mechanical fixes — no test cases have logic or traceability failures.

---

## XLSX Structure Validation

| Check | Status | Notes |
|---|---|---|
| Sheet: Summary present | ✅ Pass | — |
| Sheet: Feature_Catalog present | ✅ Pass | — |
| Sheet: Test_Cases present | ✅ Pass | — |
| Sheet count = exactly 3 | ✅ Pass | — |
| Test_Cases — all 18 mandatory columns present | ✅ Pass | SCREEN, FEATURE_ID, TEST_CASE_ID, TEST_TYPE, TEST_SCENARIO, STEPS_TO_EXECUTE, TEST_DATA, EXPECTED_RESULT, MODULE, FLOW_CODE, PRIORITY, SUITE, TAGS, INPUT_JSON, AUTOMATION_READINESS, SCREENSHOT_REFERENCE, REQUIREMENT_ID, NOTES |
| Test_Cases — column order correct | ✅ Pass | — |
| Feature_Catalog — all 7 columns present | ✅ Pass | Feature ID, Feature Name, Type, Description, Priority, Screenshot Reference, Notes |
| Feature IDs all follow AMD-FEAT-XXX format | ✅ Pass | AMD-FEAT-001 through AMD-FEAT-018 |
| Test Case IDs all follow TC_AMD_XXX format | ✅ Pass | TC_AMD_001 through TC_AMD_091 |
| No duplicate TEST_CASE_IDs | ✅ Pass | — |
| No duplicate FLOW_CODEs | ✅ Pass | — |
| No duplicate TEST_SCENARIOs | ✅ Pass | — |
| All FEATURE_IDs in Test_Cases exist in Feature_Catalog | ✅ Pass | — |
| MODULE = `admin-master-data` for all rows | ✅ Pass | — |
| FLOW_CODE is camelCase for all rows | ✅ Pass | — |
| FLOW_CODE blank for any Auto-Ready test | ✅ Pass | No blank FLOW_CODEs found |
| TAGS lowercase for all rows | ✅ Pass | — |
| SUITE values are valid for all rows | ✅ Pass | — |
| INPUT_JSON is valid JSON for all rows | ✅ Pass | — |
| STEPS_TO_EXECUTE non-empty for all rows | ✅ Pass | Minimum 30 characters in all steps |
| AUTOMATION_READINESS values valid | ✅ Pass | Only Auto-Ready / Partial / Manual-Only |

---

## Summary Sheet Findings

| Metric | Expected | Actual | Status | Notes |
|---|---|---|---|---|
| Total Test Cases | 91 | 91 | ✅ Pass | — |
| Total Features | 18 | 18 | ✅ Pass | — |
| Critical Features | 14 | 14 | ✅ Pass | — |
| High Features | 4 | 4 | ✅ Pass | — |
| Medium Features | 0 | 0 | ✅ Pass | — |
| Low Features | 0 | 0 | ✅ Pass | — |
| Priority: Critical | 33 | 33 | ✅ Pass | — |
| Priority: High | 34 | 34 | ✅ Pass | — |
| Priority: Medium | 19 | 19 | ✅ Pass | — |
| Priority: Low | 5 | 5 | ✅ Pass | — |
| Automation: Auto-Ready | 53 | 53 | ✅ Pass | — |
| Automation: Partial | 36 | 36 | ✅ Pass | — |
| Automation: Manual-Only | 2 | 2 | ✅ Pass | — |
| Test Type: Functional | 41 | 41 | ✅ Pass | — |
| Test Type: Negative | 4 | 4 | ✅ Pass | — |
| Test Type: Validation | 11 | 11 | ✅ Pass | — |
| Test Type: UI / UI/UX | 12 | 12 | ✅ Pass | — |
| Test Type: Edge | — | 11 | ⚠️ Missing | **Edge count (11) absent from Summary sheet** |
| Test Type: Data Integrity | — | 6 | ⚠️ Missing | **Data Integrity count (6) absent from Summary sheet** |
| Test Type: E2E | 4 | 4 | ✅ Pass | — |
| Test Type: Integration | 0 | 0 | ⚠️ Misleading | Label "Integration" present with value 0; no TC uses type "Integration" — row should be removed or renamed to "E2E / Integration" |
| Test Type: Smoke | 1 | 1 | ✅ Pass | — |
| Test Type: Regression | 1 | 1 | ✅ Pass | — |
| Open Questions Count | 19 | 19 | ✅ Pass | — |
| Requirements Blocked | 2 | 2 | ✅ Pass | AMD-REQ-004, AMD-REQ-052 |

---

## Feature Catalog Findings

| Feature ID | Verdict | Issues Found | Suggested Fix |
|---|---|---|---|
| AMD-FEAT-001 | ✅ Pass | — | — |
| AMD-FEAT-002 | ✅ Pass | — | — |
| AMD-FEAT-003 | ✅ Pass | — | — |
| AMD-FEAT-004 | ✅ Pass | — | — |
| AMD-FEAT-005 | ✅ Pass | — | — |
| AMD-FEAT-006 | ✅ Pass | — | — |
| AMD-FEAT-007 | ✅ Pass | — | — |
| AMD-FEAT-008 | ✅ Pass | — | — |
| AMD-FEAT-009 | ⚠️ Needs Minor Fix | Priority set to "High"; can argue "Medium" since deep-link is navigation convenience, not core CRUD | Acceptable as-is; re-evaluate if automation prioritization is needed |
| AMD-FEAT-010 | ✅ Pass | — | — |
| AMD-FEAT-011 | ✅ Pass | — | — |
| AMD-FEAT-012 | ✅ Pass | — | — |
| AMD-FEAT-013 | ✅ Pass | — | — |
| AMD-FEAT-014 | ✅ Pass | — | — |
| AMD-FEAT-015 | ✅ Pass | — | — |
| AMD-FEAT-016 | ✅ Pass | — | — |
| AMD-FEAT-017 | ⚠️ Needs Minor Fix | Priority set to "High"; drag-to-reorder is documented as partially testable and touch support is unconfirmed — could argue "Medium" | Acceptable as-is given its impact on sort order integrity |
| AMD-FEAT-018 | ✅ Pass | — | — |

**Feature Catalog Summary:** 18 features are unique, well-named, correctly typed, and cover all major testable surfaces. No duplicate or overlapping features. Screenshot references are present on all UI-bearing features. No Medium or Low priority features exist — this is intentional given the module's criticality but worth noting for triaging during partial test runs.

---

## Per-Test-Case Findings

### Pass (46 test cases — no issues found)

The following test cases are complete, traceable, executable, automation-ready where tagged, and have no formatting or content issues:

TC_AMD_001, TC_AMD_002, TC_AMD_003, TC_AMD_004, TC_AMD_005, TC_AMD_006, TC_AMD_015, TC_AMD_018, TC_AMD_023, TC_AMD_024, TC_AMD_029, TC_AMD_030, TC_AMD_031, TC_AMD_032, TC_AMD_037, TC_AMD_038, TC_AMD_049, TC_AMD_050, TC_AMD_051, TC_AMD_052, TC_AMD_053, TC_AMD_057, TC_AMD_060, TC_AMD_064, TC_AMD_065, TC_AMD_066, TC_AMD_067, TC_AMD_069, TC_AMD_070, TC_AMD_073, TC_AMD_074, TC_AMD_075, TC_AMD_076, TC_AMD_077, TC_AMD_078, TC_AMD_079, TC_AMD_080, TC_AMD_081, TC_AMD_082, TC_AMD_083, TC_AMD_084, TC_AMD_085, TC_AMD_086, TC_AMD_087, TC_AMD_089, TC_AMD_090

---

### Needs Minor Fix — Screenshot Reference Backtick Formatting (44 test cases)

**Root Cause:** The XLSX generator parsed screenshot references from the Markdown source file where filenames were wrapped in backticks (e.g., `` `01_MDT_default-list.png` ``). These backticks were preserved in the XLSX cell values, making every screenshot reference unresolvable by filename matching.

**Impact:** All 27 screenshots appear unused. Any automation framework or review tool that resolves `SCREENSHOT_REFERENCE` by filename will fail to locate the file.

**Fix:** Strip the backtick characters from all `SCREENSHOT_REFERENCE` cell values (global find-replace `` ` `` → empty string in the column).

| TEST_CASE_ID | Requirement ID | Feature ID | Verdict | Issues Found | Suggested Fix |
|---|---|---|---|---|---|
| TC_AMD_007 | AMD-REQ-005 | AMD-FEAT-001 | ⚠️ Minor Fix | SCREENSHOT_REFERENCE contains backticks: `` `01_MDT_default-list.png` `` | Strip backticks → `01_MDT_default-list.png` |
| TC_AMD_008 | AMD-REQ-006 | AMD-FEAT-001 | ⚠️ Minor Fix | SCREENSHOT_REFERENCE backtick: `` `01_MDT_default-list.png` `` | Strip backticks |
| TC_AMD_009 | AMD-REQ-007 | AMD-FEAT-001 | ⚠️ Minor Fix | SCREENSHOT_REFERENCE backtick: `` `09_MDT_empty-state.png` `` | Strip backticks |
| TC_AMD_010 | AMD-REQ-008 | AMD-FEAT-002 | ⚠️ Minor Fix | SCREENSHOT_REFERENCE backticks on 2 filenames | Strip backticks from both references |
| TC_AMD_011 | AMD-REQ-008, AMD-REQ-013 | AMD-FEAT-003 | ⚠️ Minor Fix | SCREENSHOT_REFERENCE backtick | Strip backticks |
| TC_AMD_012 | AMD-REQ-009 | AMD-FEAT-003 | ⚠️ Minor Fix | SCREENSHOT_REFERENCE backticks on 2 filenames | Strip backticks |
| TC_AMD_013 | AMD-REQ-009 | AMD-FEAT-003 | ⚠️ Minor Fix | SCREENSHOT_REFERENCE backticks on 2 filenames | Strip backticks |
| TC_AMD_014 | AMD-REQ-010 | AMD-FEAT-004 | ⚠️ Minor Fix | SCREENSHOT_REFERENCE backtick | Strip backticks |
| TC_AMD_016 | AMD-REQ-011 | AMD-FEAT-004 | ⚠️ Minor Fix | SCREENSHOT_REFERENCE backticks on 2 filenames | Strip backticks |
| TC_AMD_017 | AMD-REQ-012 | AMD-FEAT-003 | ⚠️ Minor Fix | SCREENSHOT_REFERENCE backtick | Strip backticks |
| TC_AMD_019 | AMD-REQ-015 | AMD-FEAT-005 | ⚠️ Minor Fix | (1) SCREENSHOT_REFERENCE backtick; (2) INPUT_JSON uses placeholder `<existing-type-id>` | Strip backtick; replace `<existing-type-id>` with seeded type ID e.g. `{"typeId": "account_type"}` |
| TC_AMD_020 | AMD-REQ-016 | AMD-FEAT-005 | ⚠️ Minor Fix | (1) SCREENSHOT_REFERENCE backtick; (2) INPUT_JSON uses placeholder `<existing-type-id>` | Strip backtick; replace with concrete value |
| TC_AMD_021 | AMD-REQ-017 | AMD-FEAT-005 | ⚠️ Minor Fix | SCREENSHOT_REFERENCE backtick | Strip backticks |
| TC_AMD_022 | AMD-REQ-018 | AMD-FEAT-006 | ⚠️ Minor Fix | SCREENSHOT_REFERENCE backtick | Strip backticks |
| TC_AMD_025 | AMD-REQ-018 | AMD-FEAT-007 | ⚠️ Minor Fix | SCREENSHOT_REFERENCE backtick | Strip backticks |
| TC_AMD_026 | AMD-REQ-018 | AMD-FEAT-007 | ⚠️ Minor Fix | SCREENSHOT_REFERENCE backtick | Strip backticks |
| TC_AMD_027 | AMD-REQ-020 | AMD-FEAT-008 | ⚠️ Minor Fix | SCREENSHOT_REFERENCE backticks on 2 filenames | Strip backticks |
| TC_AMD_028 | AMD-REQ-020 | AMD-FEAT-008 | ⚠️ Minor Fix | SCREENSHOT_REFERENCE backtick | Strip backticks |
| TC_AMD_033 | AMD-REQ-024 | AMD-FEAT-009 | ⚠️ Minor Fix | SCREENSHOT_REFERENCE backtick | Strip backticks |
| TC_AMD_034 | AMD-REQ-025 | AMD-FEAT-010 | ⚠️ Minor Fix | SCREENSHOT_REFERENCE backticks on 3 filenames | Strip backticks |
| TC_AMD_035 | AMD-REQ-026 | AMD-FEAT-010 | ⚠️ Minor Fix | SCREENSHOT_REFERENCE backticks on 2 filenames | Strip backticks |
| TC_AMD_036 | AMD-REQ-027 | AMD-FEAT-010 | ⚠️ Minor Fix | SCREENSHOT_REFERENCE backticks on 2 filenames | Strip backticks |
| TC_AMD_039 | AMD-REQ-028 | AMD-FEAT-010 | ⚠️ Minor Fix | SCREENSHOT_REFERENCE backtick | Strip backticks |
| TC_AMD_040 | AMD-REQ-029 | AMD-FEAT-011 | ⚠️ Minor Fix | SCREENSHOT_REFERENCE backticks on 2 filenames | Strip backticks |
| TC_AMD_041 | AMD-REQ-030 | AMD-FEAT-011 | ⚠️ Minor Fix | INPUT_JSON uses placeholder `{"typeCode": "<new-empty-type>"}` | Replace with `{"typeCode": "test_empty_type"}` (a newly created type for this test) |
| TC_AMD_042 | AMD-REQ-031 | AMD-FEAT-012 | ⚠️ Minor Fix | SCREENSHOT_REFERENCE backtick | Strip backticks |
| TC_AMD_043 | AMD-REQ-031, AMD-REQ-037 | AMD-FEAT-013 | ⚠️ Minor Fix | SCREENSHOT_REFERENCE backtick | Strip backticks |
| TC_AMD_044 | AMD-REQ-032 | AMD-FEAT-013 | ⚠️ Minor Fix | SCREENSHOT_REFERENCE backticks on 2 filenames | Strip backticks |
| TC_AMD_045 | AMD-REQ-032 | AMD-FEAT-013 | ⚠️ Minor Fix | SCREENSHOT_REFERENCE backtick | Strip backticks |
| TC_AMD_046 | AMD-REQ-032 | AMD-FEAT-013 | ⚠️ Minor Fix | SCREENSHOT_REFERENCE backtick | Strip backticks |
| TC_AMD_047 | AMD-REQ-033 | AMD-FEAT-013 | ⚠️ Minor Fix | SCREENSHOT_REFERENCE backtick | Strip backticks |
| TC_AMD_048 | AMD-REQ-034 | AMD-FEAT-013 | ⚠️ Minor Fix | SCREENSHOT_REFERENCE backtick | Strip backticks |
| TC_AMD_054 | AMD-REQ-038 | AMD-FEAT-014 | ⚠️ Minor Fix | (1) SCREENSHOT_REFERENCE backtick; (2) INPUT_JSON uses placeholder `<individual-entry-id>` | Strip backtick; replace with `{"entryId": "individual_account_type"}` or environment-specific ID |
| TC_AMD_055 | AMD-REQ-039 | AMD-FEAT-014 | ⚠️ Minor Fix | (1) SCREENSHOT_REFERENCE backtick; (2) INPUT_JSON uses placeholder `<existing-entry-id>` | Strip backtick; replace placeholder |
| TC_AMD_056 | AMD-REQ-040 | AMD-FEAT-014 | ⚠️ Minor Fix | (1) SCREENSHOT_REFERENCE backtick; (2) INPUT_JSON uses placeholder `<existing-entry-id>` | Strip backtick; replace placeholder |
| TC_AMD_058 | AMD-REQ-041 | AMD-FEAT-015 | ⚠️ Minor Fix | SCREENSHOT_REFERENCE backtick | Strip backticks |
| TC_AMD_059 | AMD-REQ-041, AMD-REQ-044 | AMD-FEAT-016 | ⚠️ Minor Fix | SCREENSHOT_REFERENCE backtick | Strip backticks |
| TC_AMD_061 | AMD-REQ-041 | AMD-FEAT-016 | ⚠️ Minor Fix | SCREENSHOT_REFERENCE backtick | Strip backticks |
| TC_AMD_062 | AMD-REQ-043 | AMD-FEAT-015 | ⚠️ Minor Fix | SCREENSHOT_REFERENCE backtick | Strip backticks |
| TC_AMD_063 | AMD-REQ-044 | AMD-FEAT-015 | ⚠️ Minor Fix | SCREENSHOT_REFERENCE backtick | Strip backticks |
| TC_AMD_068 | AMD-REQ-047 | AMD-FEAT-001 | ⚠️ Minor Fix | SCREENSHOT_REFERENCE backticks on 3 filenames | Strip backticks |
| TC_AMD_071 | AMD-REQ-051 | AMD-FEAT-011 | ⚠️ Minor Fix | SCREENSHOT_REFERENCE backtick | Strip backticks |
| TC_AMD_072 | AMD-REQ-051 | AMD-FEAT-011 | ⚠️ Minor Fix | SCREENSHOT_REFERENCE backtick | Strip backticks |
| TC_AMD_088 | BR-013 (Gap-003) | AMD-FEAT-001 | ⚠️ Minor Fix | (1) SCREENSHOT_REFERENCE backtick; (2) REQUIREMENT_ID uses non-standard "BR-013 (Gap-003)" format — no AMD-REQ-XXX mapping | Change REQUIREMENT_ID to `AMD-REQ-005` (entry count column in types list); add note "Verifies BR-013 / Gap-003" |
| TC_AMD_091 | AMD-REQ-045, AMD-REQ-044 | AMD-FEAT-017 | ⚠️ Minor Fix | SCREENSHOT_REFERENCE backtick | Strip backticks |

---

### Needs Major Fix (1 test case)

| TEST_CASE_ID | Requirement ID | Feature ID | Verdict | Issues Found | Suggested Fix |
|---|---|---|---|---|---|
| — | AMD-REQ-048 | AMD-FEAT-011 | 🔴 Major Fix | **AMD-REQ-048 ("Master Data changes must take effect system-wide immediately after save") has zero test cases with this REQUIREMENT_ID.** TC_AMD_069–TC_AMD_072 test downstream propagation functionally but do not reference AMD-REQ-048. | Add `AMD-REQ-048` to the REQUIREMENT_ID of TC_AMD_069, TC_AMD_070, TC_AMD_071, and TC_AMD_072 as a secondary mapping (append with comma) |

---

## Coverage Gap Analysis

| Requirement ID | Coverage Status | Missing Scenarios | Recommendation |
|---|---|---|---|
| AMD-REQ-001 | ✅ Covered | — | TC_AMD_001, TC_AMD_002 |
| AMD-REQ-002 | ✅ Covered | — | TC_AMD_005, TC_AMD_082 |
| AMD-REQ-003 | ✅ Covered | — | TC_AMD_003, TC_AMD_004 |
| AMD-REQ-004 | ✅ Covered (Partial) | API contract required | TC_AMD_006, TC_AMD_086 — blocked by missing api.md |
| AMD-REQ-005 | ✅ Covered | — | TC_AMD_007 |
| AMD-REQ-006 | ✅ Covered | — | TC_AMD_008 |
| AMD-REQ-007 | ✅ Covered | — | TC_AMD_009 |
| AMD-REQ-008 | ✅ Covered | — | TC_AMD_010, TC_AMD_011 |
| AMD-REQ-009 | ✅ Covered | — | TC_AMD_012, TC_AMD_013 |
| AMD-REQ-010 | ✅ Covered | Edge cases included | TC_AMD_014, TC_AMD_015 |
| AMD-REQ-011 | ✅ Covered | — | TC_AMD_016 |
| AMD-REQ-012 | ✅ Covered | — | TC_AMD_017, TC_AMD_087 |
| AMD-REQ-013 | ✅ Covered | — | TC_AMD_011, TC_AMD_080 |
| AMD-REQ-014 | ✅ Covered | — | TC_AMD_018 |
| AMD-REQ-015 | ✅ Covered | — | TC_AMD_019 |
| AMD-REQ-016 | ✅ Covered | — | TC_AMD_020 |
| AMD-REQ-017 | ✅ Covered | — | TC_AMD_021 |
| AMD-REQ-018 | ✅ Covered | Both popup paths covered | TC_AMD_022, TC_AMD_023, TC_AMD_025, TC_AMD_026 |
| AMD-REQ-019 | ✅ Covered | — | TC_AMD_024, TC_AMD_030, TC_AMD_060 |
| AMD-REQ-020 | ✅ Covered | — | TC_AMD_027, TC_AMD_028 |
| AMD-REQ-021 | ✅ Covered | — | TC_AMD_029 |
| AMD-REQ-022 | ✅ Covered | — | TC_AMD_031 |
| AMD-REQ-023 | ✅ Covered | — | TC_AMD_032 |
| AMD-REQ-024 | ✅ Covered | — | TC_AMD_033 |
| AMD-REQ-025 | ✅ Covered | — | TC_AMD_034 |
| AMD-REQ-026 | ✅ Covered | Valid / inactive / invalid paths | TC_AMD_035, TC_AMD_037, TC_AMD_038 |
| AMD-REQ-027 | ✅ Covered | — | TC_AMD_036 |
| AMD-REQ-028 | ✅ Covered | — | TC_AMD_039 |
| AMD-REQ-029 | ✅ Covered | — | TC_AMD_040 |
| AMD-REQ-030 | ✅ Covered | — | TC_AMD_041 |
| AMD-REQ-031 | ✅ Covered | — | TC_AMD_042, TC_AMD_043, TC_AMD_053 |
| AMD-REQ-032 | ✅ Covered | All 3 required fields | TC_AMD_044, TC_AMD_045, TC_AMD_046 |
| AMD-REQ-033 | ✅ Covered | — | TC_AMD_047, TC_AMD_090 |
| AMD-REQ-034 | ✅ Covered | — | TC_AMD_048 |
| AMD-REQ-035 | ✅ Covered | Same-type + cross-type | TC_AMD_049, TC_AMD_050 |
| AMD-REQ-036 | ✅ Covered | Default + boundary + duplicate | TC_AMD_051, TC_AMD_052, TC_AMD_089 |
| AMD-REQ-037 | ✅ Covered | — | TC_AMD_043 |
| AMD-REQ-038 | ✅ Covered | — | TC_AMD_054, TC_AMD_057 |
| AMD-REQ-039 | ✅ Covered | — | TC_AMD_055 |
| AMD-REQ-040 | ✅ Covered | — | TC_AMD_056 |
| AMD-REQ-041 | ✅ Covered | Row toggle + edit sheet paths | TC_AMD_058, TC_AMD_061 |
| AMD-REQ-042 | ✅ Covered | — | TC_AMD_060 |
| AMD-REQ-043 | ✅ Covered | — | TC_AMD_062 |
| AMD-REQ-044 | ✅ Covered | — | TC_AMD_063, TC_AMD_059 |
| AMD-REQ-045 | ✅ Covered | — | TC_AMD_064, TC_AMD_067 |
| AMD-REQ-046 | ✅ Covered | — | TC_AMD_065 |
| AMD-REQ-047 | ✅ Covered | — | TC_AMD_068 |
| AMD-REQ-048 | ❌ **NOT COVERED** | No TC explicitly maps AMD-REQ-048 | Add AMD-REQ-048 to REQUIREMENT_ID of TC_AMD_069–TC_AMD_072; these TCs test downstream propagation which is the observable proxy for this requirement |
| AMD-REQ-049 | ✅ Covered | — | TC_AMD_069 |
| AMD-REQ-050 | ✅ Covered | — | TC_AMD_070 |
| AMD-REQ-051 | ✅ Covered | — | TC_AMD_071, TC_AMD_072 |
| AMD-REQ-052 | ✅ Covered (Blocked) | Audit log unconfirmed | TC_AMD_073 — correctly blocked |
| AMD-REQ-053 | ✅ Covered | — | TC_AMD_074 |
| AMD-REQ-054 | ✅ Covered | — | TC_AMD_075 |
| AMD-REQ-055 | ✅ Covered | — | TC_AMD_076 |
| AMD-REQ-056 | ✅ Covered | — | TC_AMD_077 |
| AMD-REQ-057 | ✅ Covered | — | TC_AMD_078 |
| AMD-REQ-058 | ✅ Covered | — | TC_AMD_079 |

**Coverage Summary:** 57 of 58 AMD-REQs are covered (98.3%). The single uncovered requirement (AMD-REQ-048) is tested functionally by TC_AMD_069–072 but lacks explicit REQUIREMENT_ID mapping. This is a mapping omission, not a missing test.

---

## Redundant / Overlapping Test Cases

| Test Case IDs | Potential Overlap | Recommendation |
|---|---|---|
| TC_AMD_001, TC_AMD_002 | Both test unauthenticated access — different routes (`/admin/master-data-types` vs `/admin/master-data`) | **Keep** — both routes must be independently verified as they are separate entry points |
| TC_AMD_003, TC_AMD_004 | Both test non-admin access — different routes | **Keep** — same rationale as above |
| TC_AMD_022, TC_AMD_026 | Both trigger the simple deactivation popup — row toggle vs edit sheet Save | **Keep** — two distinct trigger paths for the same popup; both must be tested per AMD-REQ-018 |
| TC_AMD_027, TC_AMD_028 | TC_AMD_027 tests popup appearance; TC_AMD_028 tests entry count accuracy | **Keep** — different assertions on the same popup; TC_AMD_028 tests a specific data integrity invariant (EC-001) |
| TC_AMD_023, TC_AMD_024 | Confirm vs Cancel on same popup | **Keep** — standard positive/negative pair; atomically distinct outcomes |
| TC_AMD_059, TC_AMD_063 | TC_AMD_059 tests post-deactivation inactive state; TC_AMD_063 tests general inactive entry visibility | **Merge** — TC_AMD_059 Expected Result already asserts inactive visual treatment; TC_AMD_063 only adds the "list them all" assertion. Consider folding TC_AMD_063 assertion into TC_AMD_059 to reduce count by 1 |
| TC_AMD_014, TC_AMD_047 | TC_AMD_014 tests Type Code auto-generation; TC_AMD_047 tests Entry Code auto-generation | **Keep** — both use the same rule but operate on different objects (type vs entry); each must be independently verified |

**Verdict:** No true duplicates. One merge candidate (TC_AMD_059 + TC_AMD_063) identified. Merging is optional — current separation aids clarity for parallel execution.

---

## Automation Readiness Findings

| TEST_CASE_ID | Current Readiness | Recommended Readiness | Reason |
|---|---|---|---|
| TC_AMD_025 | Auto-Ready | Auto-Ready | ✅ Correct — clicking overlay is a deterministic DOM action |
| TC_AMD_037 | Partial | Partial | ✅ Correct — FE vs spec discrepancy requires API integration build |
| TC_AMD_045 | Auto-Ready | Partial | Entry Code can only be cleared if the field allows it; some implementations prevent clear; add note to verify interactability before automating |
| TC_AMD_046 | Partial | Partial | ✅ Correct — Type dropdown clear behavior is implementation-dependent |
| TC_AMD_064 | Partial | Partial | ✅ Correct — drag-to-reorder persistence requires API confirmation |
| TC_AMD_073 | Manual-Only | Manual-Only | ✅ Correct — audit log relationship unconfirmed |
| TC_AMD_083 | Manual-Only | Manual-Only | ✅ Correct — touch drag requires real device |
| TC_AMD_087 | Partial | Partial | ✅ Correct — race condition test requires parallel session coordination |
| TC_AMD_077 | Auto-Ready | Auto-Ready | ✅ Correct — ARIA attribute check is deterministic DOM inspection |
| TC_AMD_078 | Auto-Ready | Auto-Ready | ✅ Correct — `<nav aria-label>` is deterministic DOM inspection |

**Auto-Ready count review:** 53 Auto-Ready TCs out of 91 (58%) is appropriate for this module. The Partial split (36) is driven by legitimate API contract gaps and environment dependencies, not test quality issues.

**One concern:** TC_AMD_045 is marked Auto-Ready but clears the Entry Code field which may not be user-interactive on all implementations. Recommend changing to **Partial** and adding a precondition check.

---

## Screenshot Coverage Findings

| Screenshot | Used? | Related Test Cases | Notes |
|---|---|---|---|
| `01_MDT_default-list.png` | ⚠️ Formatting | TC_AMD_007, TC_AMD_008, TC_AMD_088 | References exist but with backticks — strip backticks to resolve |
| `01_master-data-types_default-list.png` | ⚠️ Formatting | TC_AMD_007 | Older naming convention; valid file exists |
| `02_MDT_sheet-create-empty.png` | ⚠️ Formatting | TC_AMD_010, TC_AMD_012 | References exist with backticks |
| `03_master-data-types_sheet-create-open.png` | ⚠️ Formatting | TC_AMD_010, TC_AMD_016 | Older naming convention; valid |
| `03_MDT_sheet-create-validation-errors.png` | ⚠️ Formatting | TC_AMD_012, TC_AMD_013 | References exist with backticks |
| `04_master-data-types_sheet-create-validation.png` | ⚠️ Formatting | TC_AMD_013 | Older naming convention; valid |
| `04_MDT_sheet-create-filled.png` | ⚠️ Formatting | TC_AMD_011, TC_AMD_014, TC_AMD_016, TC_AMD_017 | References exist with backticks |
| `05_MDT_sheet-edit-open.png` | ⚠️ Formatting | TC_AMD_019, TC_AMD_020, TC_AMD_021 | References exist with backticks |
| `06_MDT_sheet-edit-inactive.png` | ⚠️ Formatting | TC_AMD_022, TC_AMD_026 | References exist with backticks |
| `07_MDT_popup-deactivate-cascade-from-sheet.png` | ⚠️ Formatting | TC_AMD_027, TC_AMD_028 | References exist with backticks |
| `08_master-data_default.png` | ⚠️ Formatting | TC_AMD_036 | Older naming; valid |
| `08_MDT_popup-deactivate-cascade-row-toggle.png` | ⚠️ Formatting | TC_AMD_025, TC_AMD_027 | References exist with backticks |
| `09_master-data_deep-link-document-type.png` | ⚠️ Formatting | TC_AMD_035 | Older naming; valid |
| `09_MDT_empty-state.png` | ⚠️ Formatting | TC_AMD_009 | References exist with backticks |
| `10_master-data_tab-account-type.png` | ⚠️ Formatting | TC_AMD_040 | Older naming; valid |
| `10_MD_default-first-tab.png` | ⚠️ Formatting | TC_AMD_034, TC_AMD_036, TC_AMD_039, TC_AMD_040, TC_AMD_068 | References exist with backticks |
| `11_MD_deeplink-document-type.png` | ⚠️ Formatting | TC_AMD_033, TC_AMD_035 | References exist with backticks |
| `12_MD_tab-rejection-reason.png` | ⚠️ Formatting | TC_AMD_034, TC_AMD_068, TC_AMD_071 | References exist with backticks |
| `13_MD_tab-query-category.png` | ⚠️ Formatting | TC_AMD_034, TC_AMD_068, TC_AMD_072 | References exist with backticks |
| `14_MD_sheet-create-empty.png` | ⚠️ Formatting | TC_AMD_042, TC_AMD_044 | References exist with backticks |
| `15_MD_sheet-create-validation-errors.png` | ⚠️ Formatting | TC_AMD_044, TC_AMD_045, TC_AMD_046 | References exist with backticks |
| `16_MD_sheet-create-filled.png` | ⚠️ Formatting | TC_AMD_043, TC_AMD_047, TC_AMD_048 | References exist with backticks |
| `17_MD_sheet-edit-open.png` | ⚠️ Formatting | TC_AMD_054, TC_AMD_055, TC_AMD_056 | References exist with backticks |
| `18_MD_sheet-edit-inactive.png` | ⚠️ Formatting | TC_AMD_061 | References exist with backticks |
| `19_MD_popup-deactivate.png` | ⚠️ Formatting | TC_AMD_058 | References exist with backticks |
| `20_MD_after-deactivate-row-inactive.png` | ⚠️ Formatting | TC_AMD_059, TC_AMD_063, TC_AMD_091 | References exist with backticks |
| `21_MD_row-reactivated.png` | ⚠️ Formatting | TC_AMD_062 | References exist with backticks |

**Summary:** All 27 available screenshots are referenced in the test suite — 100% screenshot utilization. No screenshot is truly unused. The "unused" status is entirely caused by backtick formatting in the cell values. No test case references a screenshot that does not exist in the screenshot path. No important UI state (creation, edit, validation, deactivation, reactivation, deep-link, empty state, cascade popup) is missing coverage.

**Observation:** Two naming conventions are present in the screenshot folder (`01_master-data-types_*` older set and `01_MDT_*` / `10_MD_*` newer set). Both are referenced in the test cases. The newer convention is preferred; the older set should be kept for backward compatibility but is redundant in the test references where both name the same UI state.

---

## Invalid / Missing Data Issues

| TEST_CASE_ID | Field | Issue | Suggested Fix |
|---|---|---|---|
| TC_AMD_019 | INPUT_JSON | `{"typeId": "<existing-type-id>"}` — placeholder not resolvable | Replace with `{"typeId": "account_type"}` or use the seeded Account Type identifier |
| TC_AMD_020 | INPUT_JSON | `{"typeId": "<existing-type-id>"}` — placeholder | Same fix as TC_AMD_019 |
| TC_AMD_041 | INPUT_JSON | `{"typeCode": "<new-empty-type>"}` — placeholder | Replace with `{"typeCode": "test_empty_category"}` — a type created specifically for this test |
| TC_AMD_054 | INPUT_JSON | `{"entryId": "<individual-entry-id>"}` — placeholder | Replace with `{"entryId": "individual", "typeCode": "account_type"}` |
| TC_AMD_055 | INPUT_JSON | `{"entryId": "<existing-entry-id>"}` — placeholder | Replace with `{"entryId": "individual", "typeCode": "account_type"}` |
| TC_AMD_056 | INPUT_JSON | `{"entryId": "<existing-entry-id>"}` — placeholder | Replace with `{"entryId": "individual", "typeCode": "account_type"}` |
| TC_AMD_088 | REQUIREMENT_ID | `BR-013 (Gap-003)` — not AMD-REQ-XXX format; breaks traceability | Replace with `AMD-REQ-005`; add BR-013/Gap-003 reference to the NOTES column |
| TC_AMD_045 | AUTOMATION_READINESS | Marked Auto-Ready but clearing Entry Code field may not be possible on all FE implementations | Change to `Partial`; add note: "Verify Entry Code field is user-clearable before automating" |
| TC_AMD_069 – TC_AMD_072 | REQUIREMENT_ID | AMD-REQ-048 not listed in any REQUIREMENT_ID | Append `, AMD-REQ-048` to REQUIREMENT_ID of TC_AMD_069, TC_AMD_070, TC_AMD_071, TC_AMD_072 |
| All 44 screenshot TCs | SCREENSHOT_REFERENCE | Backtick characters surrounding filenames in cell values | Global find-replace: remove all `` ` `` characters from the SCREENSHOT_REFERENCE column |

---

## Prioritized Fix List

### Must Fix
1. **Strip backtick characters from all `SCREENSHOT_REFERENCE` cell values** (44 TCs affected) — causes all screenshot references to be unresolvable. Fix: global find-replace `` ` `` → `` (empty) `` in the SCREENSHOT_REFERENCE column of the Test_Cases sheet.
2. **Add AMD-REQ-048 to REQUIREMENT_ID of TC_AMD_069, TC_AMD_070, TC_AMD_071, TC_AMD_072** — the only uncovered requirement; these TCs are the correct proxy tests.
3. **Replace placeholder INPUT_JSON values** in TC_AMD_019, TC_AMD_020, TC_AMD_041, TC_AMD_054, TC_AMD_055, TC_AMD_056 with concrete test identifiers.

### Should Fix
4. **Fix TC_AMD_088 REQUIREMENT_ID** — change from `BR-013 (Gap-003)` to `AMD-REQ-005`; move BR-013 reference to NOTES.
5. **Add Edge (11) and Data Integrity (6) test type counts** to the Summary sheet; remove or relabel the misleading "Integration: 0" row.
6. **Change TC_AMD_045 AUTOMATION_READINESS** from `Auto-Ready` to `Partial` — Entry Code field clearability is implementation-dependent.

### Nice to Have
7. **Merge TC_AMD_059 and TC_AMD_063** — TC_AMD_063 assertion (inactive entries visible in list) is a subset of TC_AMD_059's expected result; merging would reduce total count to 90 without losing coverage.
8. **Update v2.md source document summary counts** — the source file's summary table shows Partial: 29 / Manual-Only: 9 / Negative: 14, which do not match the XLSX actual values (36 / 2 / 4). The XLSX is correct; the v2.md summary needs correction for traceability.
9. **Add screenshot reference for TC_AMD_077 and TC_AMD_078** — these are UI/accessibility tests and benefit from a DOM screenshot reference showing the toggle's ARIA state or the breadcrumb `<nav>` element, even if a specific file doesn't exist yet.

---

## Sign-Off Recommendation

| Field | Value |
|---|---|
| Proceed to automation mapping | **Conditional — Yes** |
| Overall Test Suite Quality | High |
| Critical Defects | 0 |
| Blocking Issues | 1 (screenshot backtick formatting — trivially fixable) |

**Conditions before proceeding to automation mapping:**

1. Fix `SCREENSHOT_REFERENCE` backtick issue (Must Fix #1) — a global find-replace taking under 2 minutes.
2. Add AMD-REQ-048 to REQUIREMENT_ID of TC_AMD_069–072 (Must Fix #2) — 4 cell edits.
3. Replace placeholder `INPUT_JSON` values (Must Fix #3) — 6 cell edits with environment-specific IDs.

**Once these 3 fixes are applied**, the test suite is ready for automation mapping. The Should Fix and Nice to Have items do not block automation mapping and can be addressed in a v2 review cycle.

**Strengths of this test suite:**
- 98.3% requirement traceability (57/58 AMD-REQs)
- Zero duplicate test cases or scenarios
- All FLOW_CODEs valid camelCase — directly usable by the automation adapter
- All INPUT_JSON values are valid JSON
- All 27 screenshots referenced — 100% screenshot coverage
- Complete feature mapping — every TC maps to a valid Feature_Catalog entry
- All suite, tags, module, and automation readiness fields are correctly formatted
- Both deactivation trigger paths (row toggle + edit sheet) are covered independently
- Critical edge cases covered: cascade atomicity, reactivation without entry restore, deep-link to inactive type, concurrent duplicate code, code auto-generation edge inputs
