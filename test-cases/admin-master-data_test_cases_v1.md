# Test Cases: Admin / Master Data

## Meta

| Field | Value |
|---|---|
| Requirement Analysis Source File | `analysis/admin-master-data_requirement_analysis_v1.md` |
| QA Knowledge Source File | `knowledge/admin-master-data_qa_knowledge_v2.md` |
| Screenshot Path Used | `../FE-Codebase/screenshots/master-data/` |
| Date | 2026-05-06 |
| Version | v1 |
| Test Scope | Full |
| Total Test Cases | 88 |

---

## Test Case Summary

### Count by Priority

| Priority | Count |
|---|---|
| P1 Must-Test | 66 |
| P2 Should-Test | 16 |
| P3 Nice-to-Test | 6 |

### Count by Test Type

| Test Type | Count |
|---|---|
| Functional | 34 |
| Negative | 14 |
| Validation | 12 |
| Edge | 9 |
| UI | 7 |
| E2E | 4 |
| Data Integrity | 4 |
| Regression | 2 |
| Smoke | 2 |

### Count by Automation Readiness

| Readiness | Count |
|---|---|
| Auto-Ready | 52 |
| Partial | 28 |
| Manual-Only | 8 |

---

## Screenshot Coverage Used

| Screenshot | UI Area Covered | Used In Test Cases |
|---|---|---|
| `01_MDT_default-list.png` | Master Data Types — list view, all columns | TC-AMD-007, TC-AMD-020 |
| `02_MDT_sheet-create-empty.png` | Create Type side sheet — empty state | TC-AMD-010, TC-AMD-011 |
| `03_MDT_sheet-create-validation-errors.png` | Create Type — required field errors | TC-AMD-012, TC-AMD-013 |
| `04_MDT_sheet-create-filled.png` | Create Type — filled, before save | TC-AMD-014, TC-AMD-016 |
| `05_MDT_sheet-edit-open.png` | Edit Type side sheet — pre-filled, code locked | TC-AMD-020, TC-AMD-021, TC-AMD-022 |
| `06_MDT_sheet-edit-inactive.png` | Edit Type — status toggled to Inactive | TC-AMD-023, TC-AMD-026 |
| `07_MDT_popup-deactivate-cascade-from-sheet.png` | Cascade deactivation popup (from edit sheet) | TC-AMD-027, TC-AMD-028, TC-AMD-029 |
| `08_MDT_popup-deactivate-cascade-row-toggle.png` | Cascade deactivation popup (from row toggle) | TC-AMD-027, TC-AMD-031 |
| `09_MDT_empty-state.png` | Master Data Types — empty state | TC-AMD-009 |
| `10_MD_default-first-tab.png` | Master Data — default, first tab selected | TC-AMD-035, TC-AMD-037, TC-AMD-041 |
| `11_MD_deeplink-document-type.png` | Master Data — deep-link to Document Type tab | TC-AMD-036, TC-AMD-034 |
| `12_MD_tab-rejection-reason.png` | Master Data — Rejection Reason tab | TC-AMD-035, TC-AMD-070 |
| `13_MD_tab-query-category.png` | Master Data — Query Category tab | TC-AMD-035, TC-AMD-073 |
| `14_MD_sheet-create-empty.png` | Create Entry side sheet — empty state | TC-AMD-043 |
| `15_MD_sheet-create-validation-errors.png` | Create Entry — required field errors | TC-AMD-045, TC-AMD-046, TC-AMD-047 |
| `16_MD_sheet-create-filled.png` | Create Entry — filled, before save | TC-AMD-048, TC-AMD-049 |
| `17_MD_sheet-edit-open.png` | Edit Entry side sheet — pre-filled, code locked | TC-AMD-055, TC-AMD-056, TC-AMD-057 |
| `18_MD_sheet-edit-inactive.png` | Edit Entry — status toggled to Inactive | TC-AMD-064 |
| `19_MD_popup-deactivate.png` | Entry deactivation popup | TC-AMD-059, TC-AMD-060 |
| `20_MD_after-deactivate-row-inactive.png` | Entry row — inactive visual state | TC-AMD-060, TC-AMD-063 |
| `21_MD_row-reactivated.png` | Entry row — reactivated state | TC-AMD-062 |

---

## Test Suite

---

### Authentication & Authorization

#### TC-AMD-001: Unauthenticated access to Master Data Types redirects to login

- Requirement ID: AMD-REQ-001
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: —
- Preconditions: No active admin session
- Test Data: URL: `/admin/master-data-types`
- Steps:
  1. Open browser with no active session cookie
  2. Navigate to `/admin/master-data-types`
  3. Observe redirect behavior
- Expected Result: Browser redirects to `/login`; Master Data Types page content is not displayed
- Flow Code: AMD-F-AUTH-001
- Notes: —

---

#### TC-AMD-002: Unauthenticated access to Master Data page redirects to login

- Requirement ID: AMD-REQ-001
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: —
- Preconditions: No active admin session
- Test Data: URL: `/admin/master-data`
- Steps:
  1. Open browser with no active session cookie
  2. Navigate to `/admin/master-data`
  3. Observe redirect behavior
- Expected Result: Browser redirects to `/login`; Master Data page content is not displayed
- Flow Code: AMD-F-AUTH-002
- Notes: —

---

#### TC-AMD-003: Non-admin role cannot access Master Data Types

- Requirement ID: AMD-REQ-003
- Priority: P1 Must-Test
- Test Type: Negative
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: Authenticated session with a non-Admin role (e.g. Ops user or Client)
- Test Data: Non-admin session token; URL: `/admin/master-data-types`
- Steps:
  1. Authenticate as a non-admin user
  2. Navigate to `/admin/master-data-types`
  3. Observe response
- Expected Result: Access denied; either a 403 page or redirect away from the admin route; no Master Data content visible
- Flow Code: AMD-F-AUTH-003
- Notes: Requires role fixtures or separate non-admin test user. Server-side enforcement must be tested via direct API call if available.

---

#### TC-AMD-004: Non-admin role cannot access Master Data page

- Requirement ID: AMD-REQ-003
- Priority: P1 Must-Test
- Test Type: Negative
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: Authenticated session with a non-Admin role
- Test Data: Non-admin session token; URL: `/admin/master-data`
- Steps:
  1. Authenticate as a non-admin user
  2. Navigate to `/admin/master-data`
  3. Observe response
- Expected Result: Access denied; no Master Data content visible
- Flow Code: AMD-F-AUTH-004
- Notes: Same dependency as TC-AMD-003.

---

#### TC-AMD-005: Session expiry auto-logs admin out and redirects to login

- Requirement ID: AMD-REQ-002
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: Active admin session
- Test Data: Session expiry mechanism (force-expire via API or wait for configured TTL)
- Steps:
  1. Log in as Admin and navigate to `/admin/master-data-types`
  2. Force-expire the session (clear session cookie or trigger backend expiry)
  3. Perform any page action (e.g. click Add Type or reload page)
  4. Observe behavior
- Expected Result: Admin is auto-logged out and redirected to `/login`
- Flow Code: AMD-F-AUTH-005
- Notes: Mid-form expiry behavior (step 3 with side sheet open) is an open question — see AMD-REQ-002 notes and EC-008.

---

#### TC-AMD-006: Server rejects direct API PATCH to mutate saved Type Code

- Requirement ID: AMD-REQ-004
- Priority: P1 Must-Test
- Test Type: Data Integrity
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: At least one saved master data type exists; API endpoint available
- Test Data: Saved type ID, PATCH payload with modified `slug` field
- Steps:
  1. Note the `id` and current `slug` of a saved type (e.g. `account_type`)
  2. Send PATCH request: `PATCH /api/admin/master-data/types/:id` with body `{ "slug": "changed_code" }`
  3. Observe API response
- Expected Result: API returns 400 or 422; `slug` value is unchanged in subsequent GET
- Flow Code: AMD-F-AUTH-006
- Notes: Blocked until `api.md` is provided. Inferred endpoint path only.

---

### Master Data Types — List & Page Structure

#### TC-AMD-007: Master Data Types list shows all required columns

- Requirement ID: AMD-REQ-005
- Priority: P1 Must-Test
- Test Type: UI
- Automation Readiness: Auto-Ready
- Screenshot Reference: `01_MDT_default-list.png`
- Preconditions: Admin logged in; at least one master data type exists (seed data deployed)
- Test Data: Seeded types (Account Type, Document Type, Rejection Reason, Query Category)
- Steps:
  1. Navigate to `/admin/master-data-types`
  2. Inspect the table header and each row
- Expected Result: Table displays columns: Name, Type Code, Entries (link), Status chip, Active toggle, Edit action icon; all seeded types appear as rows
- Flow Code: AMD-F-MDT-LIST-001
- Notes: —

---

#### TC-AMD-008: Master Data Types table pagination controls present and functional

- Requirement ID: AMD-REQ-006
- Priority: P2 Should-Test
- Test Type: UI
- Automation Readiness: Partial
- Screenshot Reference: `01_MDT_default-list.png`
- Preconditions: Admin logged in; sufficient types to trigger pagination (>10)
- Test Data: Create enough types to exceed one page (10 rows default)
- Steps:
  1. Navigate to `/admin/master-data-types` with >10 types present
  2. Verify pagination control is visible
  3. Change rows per page to 25
  4. Navigate to page 2
- Expected Result: Pagination controls appear with options [10, 25, 50]; rows per page change updates the table; page navigation works correctly
- Flow Code: AMD-F-MDT-LIST-002
- Notes: Production dataset size unknown. This test requires creating test types beyond the default 4–5.

---

#### TC-AMD-009: Empty state shows correct heading, body, and Add Type CTA

- Requirement ID: AMD-REQ-007
- Priority: P2 Should-Test
- Test Type: UI
- Automation Readiness: Partial
- Screenshot Reference: `09_MDT_empty-state.png`
- Preconditions: Admin logged in; no master data types exist in the database
- Test Data: Clean/empty environment (no seeded types)
- Steps:
  1. Navigate to `/admin/master-data-types` with no types present
  2. Inspect the table body area
- Expected Result: Empty state renders inside the table body with documented heading text, body copy, and a visible "Add Type" CTA button
- Flow Code: AMD-F-MDT-LIST-003
- Notes: Requires environment without seed data or the ability to deactivate/delete all types.

---

### Master Data Types — Create

#### TC-AMD-010: Add Type button opens Create side sheet

- Requirement ID: AMD-REQ-008
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: `02_MDT_sheet-create-empty.png`
- Preconditions: Admin logged in on `/admin/master-data-types`
- Test Data: —
- Steps:
  1. Navigate to `/admin/master-data-types`
  2. Click the "Add Type" button in the page header
  3. Observe the result
- Expected Result: Create New Master Data Type side sheet slides in from right; sheet displays Name field, Type Code field, Save and Cancel buttons in pinned footer; all fields are empty
- Flow Code: AMD-F-MDT-CREATE-001
- Notes: —

---

#### TC-AMD-011: Create master data type — happy path

- Requirement ID: AMD-REQ-008, AMD-REQ-013
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: `04_MDT_sheet-create-filled.png`
- Preconditions: Admin logged in; unique type name to use
- Test Data: Name: `Test Category Alpha`, expected Type Code: `test_category_alpha`
- Steps:
  1. Open Create side sheet
  2. Enter `Test Category Alpha` in the Name field
  3. Verify Type Code auto-fills to `test_category_alpha`
  4. Click Save
  5. Observe table and side sheet
- Expected Result: Side sheet closes; new type `Test Category Alpha` appears in the types table with Status chip = Active, toggle = ON
- Flow Code: AMD-F-MDT-CREATE-002
- Notes: —

---

#### TC-AMD-012: Create type — Name is required

- Requirement ID: AMD-REQ-009
- Priority: P1 Must-Test
- Test Type: Validation
- Automation Readiness: Auto-Ready
- Screenshot Reference: `03_MDT_sheet-create-validation-errors.png`
- Preconditions: Admin logged in; Create side sheet open
- Test Data: Name: (empty), Type Code: (empty or auto)
- Steps:
  1. Open Create side sheet
  2. Leave Name field blank
  3. Click Save
  4. Observe validation
- Expected Result: Inline error "Name is required" appears below the Name field; save does not proceed; sheet remains open
- Flow Code: AMD-F-MDT-CREATE-003
- Notes: —

---

#### TC-AMD-013: Create type — Type Code is required

- Requirement ID: AMD-REQ-009
- Priority: P1 Must-Test
- Test Type: Validation
- Automation Readiness: Auto-Ready
- Screenshot Reference: `03_MDT_sheet-create-validation-errors.png`
- Preconditions: Admin logged in; Create side sheet open
- Test Data: Name: `Temp Name`, Type Code: manually cleared
- Steps:
  1. Open Create side sheet
  2. Enter a Name so Type Code auto-generates
  3. Manually clear the Type Code field
  4. Click Save
  5. Observe validation
- Expected Result: Inline error on Type Code field indicating it is required; save does not proceed; sheet remains open
- Flow Code: AMD-F-MDT-CREATE-004
- Notes: Error text for empty code is undocumented — assert that an error is shown, not a specific string.

---

#### TC-AMD-014: Type Code auto-generates from Name using documented rule

- Requirement ID: AMD-REQ-010
- Priority: P1 Must-Test
- Test Type: Validation
- Automation Readiness: Auto-Ready
- Screenshot Reference: `04_MDT_sheet-create-filled.png`
- Preconditions: Admin logged in; Create side sheet open
- Test Data:
  - `Account Type` → `account_type`
  - `Non-Individual` → `non_individual`
  - `PAN Card` → `pan_card`
  - `KYC failure` → `kyc_failure`
  - `  Board Resolution  ` (leading/trailing spaces) → `board_resolution`
  - `Type 2` → `type_2`
- Steps:
  1. Open Create side sheet
  2. For each test input, enter the Name value
  3. Read the auto-generated Type Code value after each entry
- Expected Result: Each Name produces the expected Type Code per the rule: toLowerCase → trim → spaces to underscores → strip non-[a-z0-9_] → collapse underscores → strip leading/trailing underscores
- Flow Code: AMD-F-MDT-CREATE-005
- Notes: —

---

#### TC-AMD-015: Type Code auto-generation — edge case inputs

- Requirement ID: AMD-REQ-010
- Priority: P1 Must-Test
- Test Type: Edge
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: Admin logged in; Create side sheet open
- Test Data:
  - `@#$` (all special characters) → output unknown; expected: empty string or blocked save
  - `   ` (spaces only) → expected: empty string → validation error
  - `A` (single character) → expected: `a`
  - `account_type` (already snake_case) → expected: `account_type`
  - Very long name (>100 chars) → expected: truncated or mapped without error
  - `Aadhāār` (non-ASCII) → expected: behavior unspecified — assert no crash
- Steps:
  1. Open Create side sheet
  2. For each test input, enter as Name
  3. Record auto-generated Type Code
  4. Attempt to Save
- Expected Result:
  - All-special-character and spaces-only inputs: inline validation error before or on Save; no crash
  - Single char: `a` generated
  - Pre-snake_case: unchanged
  - Long name: no crash; code generated up to system limits
  - Non-ASCII: no crash; behavior recorded as open question result
- Flow Code: AMD-F-MDT-CREATE-006
- Notes: Assertions marked open where spec is silent (Gap-011). Record actual behavior for spec alignment.

---

#### TC-AMD-016: Type Code is editable before first save

- Requirement ID: AMD-REQ-011
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: `04_MDT_sheet-create-filled.png`
- Preconditions: Admin logged in; Create side sheet open with a Name entered
- Test Data: Name: `Sample Type`, auto-generated code: `sample_type`, override code: `custom_code`
- Steps:
  1. Open Create side sheet
  2. Enter `Sample Type` as Name
  3. Clear the auto-generated Type Code
  4. Type `custom_code` in the Type Code field
  5. Click Save
- Expected Result: Type is saved with Type Code `custom_code` (not `sample_type`); side sheet closes; new row shows Type Code `custom_code`
- Flow Code: AMD-F-MDT-CREATE-007
- Notes: —

---

#### TC-AMD-017: Duplicate Type Code shows inline error

- Requirement ID: AMD-REQ-012
- Priority: P1 Must-Test
- Test Type: Validation
- Automation Readiness: Auto-Ready
- Screenshot Reference: —
- Preconditions: Admin logged in; type with code `account_type` already exists
- Test Data: Name: `Account Types`, Type Code: `account_type` (duplicate)
- Steps:
  1. Open Create side sheet
  2. Enter a Name that generates or manually enter `account_type` in Type Code field
  3. Click Save
- Expected Result: Inline field error "This code is already in use" appears on the Type Code field; Save is disabled or blocked; sheet stays open
- Flow Code: AMD-F-MDT-CREATE-008
- Notes: Client-side duplicate check only; concurrent session race condition is tested in TC-AMD-082.

---

#### TC-AMD-018: Cancel type creation closes sheet without saving

- Requirement ID: AMD-REQ-014
- Priority: P2 Should-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: —
- Preconditions: Admin logged in; Create side sheet open with data entered
- Test Data: Name: `Unsaved Type`, Type Code: `unsaved_type`
- Steps:
  1. Open Create side sheet
  2. Enter `Unsaved Type` and observe Type Code auto-fill
  3. Click Cancel in the sheet footer
  4. Observe side sheet and types table
- Expected Result: Side sheet closes; no new type appears in the table; types table is unchanged
- Flow Code: AMD-F-MDT-CREATE-009
- Notes: —

---

### Master Data Types — Edit

#### TC-AMD-019: Edit icon opens pre-filled Edit side sheet

- Requirement ID: AMD-REQ-015
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: `05_MDT_sheet-edit-open.png`
- Preconditions: Admin logged in; at least one type exists
- Test Data: Existing type: Account Type (code: `account_type`, Status: Active)
- Steps:
  1. Navigate to `/admin/master-data-types`
  2. Click the edit icon on the Account Type row
  3. Inspect the side sheet fields
- Expected Result: Edit side sheet opens pre-filled with: Name = "Account Type", Type Code field (read-only, lock icon), Status toggle = ON (Active); subtitle "Changes take effect immediately across the platform." is visible
- Flow Code: AMD-F-MDT-EDIT-001
- Notes: —

---

#### TC-AMD-020: Saved Type Code is read-only with lock icon and helper text

- Requirement ID: AMD-REQ-016
- Priority: P1 Must-Test
- Test Type: UI
- Automation Readiness: Auto-Ready
- Screenshot Reference: `05_MDT_sheet-edit-open.png`
- Preconditions: Admin logged in; Edit side sheet open for any saved type
- Test Data: Any existing type
- Steps:
  1. Open Edit side sheet for any type
  2. Inspect the Type Code field
  3. Attempt to click or focus the Type Code field
  4. Inspect for lock icon and helper text
- Expected Result: Type Code field is non-interactive (read-only); lock icon is displayed adjacent to the field; helper text reads "Cannot be changed after saving."; field value cannot be changed
- Flow Code: AMD-F-MDT-EDIT-002
- Notes: —

---

#### TC-AMD-021: Admin can edit type Name and save successfully

- Requirement ID: AMD-REQ-017
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: `05_MDT_sheet-edit-open.png`
- Preconditions: Admin logged in; at least one type exists
- Test Data: Existing type, new Name: `Account Types Updated`
- Steps:
  1. Open Edit side sheet for the target type
  2. Clear the Name field and enter `Account Types Updated`
  3. Click Save
  4. Observe the types table
- Expected Result: Side sheet closes; the type row in the table now shows `Account Types Updated` as the Name; Type Code is unchanged
- Flow Code: AMD-F-MDT-EDIT-003
- Notes: Restore original name after test.

---

### Master Data Types — Deactivation (No Active Entries)

#### TC-AMD-022: Row toggle OFF with no active entries shows simple deactivation popup

- Requirement ID: AMD-REQ-018
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: `06_MDT_sheet-edit-inactive.png`
- Preconditions: Admin logged in; type with zero active entries exists
- Test Data: A type that has no active entries (create one with no entries, or use a type where all entries are deactivated)
- Steps:
  1. Navigate to `/admin/master-data-types`
  2. Toggle OFF the Active switch for the type with no active entries
  3. Observe the popup
- Expected Result: Non-dismissible confirmation popup appears: title "Deactivate type?", body copy, two buttons — "Deactivate" (destructive) and "Cancel"; popup is centered on viewport
- Flow Code: AMD-F-MDT-DEACT-001
- Notes: —

---

#### TC-AMD-023: Confirm simple deactivation — type becomes inactive

- Requirement ID: AMD-REQ-018
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: —
- Preconditions: Simple deactivation popup is visible (TC-AMD-022 prerequisite)
- Test Data: Same type as TC-AMD-022
- Steps:
  1. From the deactivation popup, click the "Deactivate" button
  2. Observe the types table row
- Expected Result: Popup closes; type row shows Status chip = Inactive; toggle = OFF; no entries are affected
- Flow Code: AMD-F-MDT-DEACT-002
- Notes: —

---

#### TC-AMD-024: Cancel simple deactivation — toggle reverts to ON

- Requirement ID: AMD-REQ-019
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: —
- Preconditions: Simple deactivation popup is visible
- Test Data: Same type as TC-AMD-022
- Steps:
  1. From the deactivation popup, click the "Cancel" button
  2. Observe the types table row
- Expected Result: Popup closes; toggle reverts to ON (Active); type Status chip remains Active; no data changes occurred
- Flow Code: AMD-F-MDT-DEACT-003
- Notes: —

---

#### TC-AMD-025: Deactivation popup is not dismissible by clicking outside

- Requirement ID: AMD-REQ-018 (BR-012)
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: `08_MDT_popup-deactivate-cascade-row-toggle.png`
- Preconditions: Any deactivation popup (simple or cascade) is visible
- Test Data: —
- Steps:
  1. Trigger any deactivation popup
  2. Click the overlay/backdrop area outside the popup boundaries
  3. Observe popup state
- Expected Result: Popup remains open; no dismiss action occurs; no data changes
- Flow Code: AMD-F-MDT-DEACT-004
- Notes: Also applies to entry deactivation popup. Test both for completeness.

---

#### TC-AMD-026: Edit sheet save with Status OFF and no active entries shows deactivation popup

- Requirement ID: AMD-REQ-018
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: `06_MDT_sheet-edit-inactive.png`
- Preconditions: Admin logged in; type with zero active entries exists
- Test Data: Same type (zero active entries)
- Steps:
  1. Open Edit side sheet for the type with no active entries
  2. Toggle the Status switch to OFF (Inactive)
  3. Click Save
  4. Observe popup
- Expected Result: Simple deactivation popup appears (same as TC-AMD-022 outcome); confirm deactivates the type; cancel restores Status toggle to ON in the sheet
- Flow Code: AMD-F-MDT-DEACT-005
- Notes: —

---

### Master Data Types — Cascade Deactivation

#### TC-AMD-027: Row toggle OFF with active entries shows cascade warning

- Requirement ID: AMD-REQ-020
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: `08_MDT_popup-deactivate-cascade-row-toggle.png`
- Preconditions: Admin logged in; type with at least one active entry (e.g. Account Type with 7 active entries)
- Test Data: Account Type (7 active entries)
- Steps:
  1. Navigate to `/admin/master-data-types`
  2. Toggle OFF the Active switch for Account Type
  3. Observe the popup
- Expected Result: Cascade warning popup appears with title "Deactivate type?", body including "This will also deactivate **[N] entries** under this type." where N = 7; two buttons: "Deactivate all" (destructive) and "Cancel"
- Flow Code: AMD-F-MDT-DEACT-006
- Notes: —

---

#### TC-AMD-028: Cascade popup entry count matches actual active entry count

- Requirement ID: AMD-REQ-020 (EC-001)
- Priority: P1 Must-Test
- Test Type: Data Integrity
- Automation Readiness: Auto-Ready
- Screenshot Reference: `07_MDT_popup-deactivate-cascade-from-sheet.png`
- Preconditions: Type exists with 5 total entries (2 already inactive, 3 active)
- Test Data: Type with 5 entries where 2 are pre-deactivated (3 active)
- Steps:
  1. Confirm 2 entries are inactive under the target type
  2. Toggle OFF the type in the row
  3. Read the entry count `[N]` displayed in the cascade popup
- Expected Result: Popup shows N = 3 (active entries only, not total entries)
- Flow Code: AMD-F-MDT-DEACT-007
- Notes: This tests EC-001 specifically. The cascade count must reflect currently active entries.

---

#### TC-AMD-029: Confirming cascade deactivation atomically deactivates type and all active entries

- Requirement ID: AMD-REQ-021
- Priority: P1 Must-Test
- Test Type: Data Integrity
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: Type with multiple active entries exists; cascade popup is visible
- Test Data: Type with 3 active entries
- Steps:
  1. Trigger cascade popup for a type with 3 active entries
  2. Click "Deactivate all"
  3. Navigate to `/admin/master-data` and select the now-inactive type's tab (if visible via deep-link)
  4. Inspect all entries
- Expected Result: Type status = Inactive; all 3 previously active entries now have Status = Inactive; no entries remain in Active state; the operation is atomic (all or none)
- Flow Code: AMD-F-MDT-DEACT-008
- Notes: Atomicity verification requires API-level check or page refresh to confirm no partial state. Blocked for full atomicity assertion until API contract is available.

---

#### TC-AMD-030: Cancel cascade deactivation reverts toggle and leaves all data unchanged

- Requirement ID: AMD-REQ-019
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: —
- Preconditions: Cascade deactivation popup is visible
- Test Data: Type with active entries
- Steps:
  1. Trigger cascade popup
  2. Click "Cancel"
  3. Observe type row and entries
- Expected Result: Popup closes; type toggle reverts to ON; type Status = Active; all entries remain in their prior state; no data changes
- Flow Code: AMD-F-MDT-DEACT-009
- Notes: —

---

### Master Data Types — Reactivation

#### TC-AMD-031: Reactivating a type is immediate with no confirmation popup

- Requirement ID: AMD-REQ-022
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: —
- Preconditions: Admin logged in; at least one inactive type exists
- Test Data: Any inactive master data type
- Steps:
  1. Navigate to `/admin/master-data-types`
  2. Toggle ON the Active switch for an inactive type
  3. Observe behavior
- Expected Result: No popup or confirmation dialog appears; type Status immediately changes to Active; toggle stays ON
- Flow Code: AMD-F-MDT-REACT-001
- Notes: —

---

#### TC-AMD-032: Reactivating a cascade-deactivated type does NOT auto-reactivate its entries

- Requirement ID: AMD-REQ-023 (EC-002)
- Priority: P1 Must-Test
- Test Type: Data Integrity
- Automation Readiness: Auto-Ready
- Screenshot Reference: —
- Preconditions: Type has been cascade-deactivated (type + all entries are inactive)
- Test Data: Type with 4 entries, all cascade-deactivated
- Steps:
  1. Confirm type and all 4 entries are Inactive
  2. Toggle ON the type in the row
  3. Navigate to `/admin/master-data` and select the now-active type's tab
  4. Inspect each entry's status
- Expected Result: Type Status = Active; all 4 entries remain Inactive; no entries are auto-reactivated; entries must be reactivated individually
- Flow Code: AMD-F-MDT-REACT-002
- Notes: This is a critical regression-prone behavior (BR-006). High risk of regressing.

---

### Master Data Types — Entries Deep-Link

#### TC-AMD-033: Entries link navigates to correct Master Data URL

- Requirement ID: AMD-REQ-024
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: `11_MD_deeplink-document-type.png`
- Preconditions: Admin logged in; at least one type with entries exists
- Test Data: Document Type (type code: `document_type`, has 8 entries)
- Steps:
  1. Navigate to `/admin/master-data-types`
  2. Locate the Document Type row
  3. Click the "N entries →" link
  4. Observe URL and page
- Expected Result: Browser navigates to `/admin/master-data?type=document_type`; Master Data page loads with the Document Type tab pre-selected; entries for Document Type are displayed
- Flow Code: AMD-F-MDT-NAV-001
- Notes: —

---

### Master Data — Page Structure & Tab Behavior

#### TC-AMD-034: Master Data page shows one tab per active Master Data Type

- Requirement ID: AMD-REQ-025
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: `10_MD_default-first-tab.png`, `12_MD_tab-rejection-reason.png`, `13_MD_tab-query-category.png`
- Preconditions: Admin logged in; seed data deployed (4 active types)
- Test Data: Account Type, Document Type, Rejection Reason, Query Category (all active)
- Steps:
  1. Navigate to `/admin/master-data`
  2. Count and inspect the tabs displayed
- Expected Result: Exactly 4 tabs visible, one per active type; no inactive type tabs shown; tab labels match type Names
- Flow Code: AMD-F-MD-TABS-001
- Notes: —

---

#### TC-AMD-035: Deep-link pre-selects the matching type tab

- Requirement ID: AMD-REQ-026
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: `11_MD_deeplink-document-type.png`
- Preconditions: Admin logged in; Document Type is active
- Test Data: URL: `/admin/master-data?type=document_type`
- Steps:
  1. Navigate directly to `/admin/master-data?type=document_type`
  2. Observe the active tab
- Expected Result: Document Type tab is pre-selected and highlighted; entries for Document Type are displayed in the table
- Flow Code: AMD-F-MD-TABS-002
- Notes: —

---

#### TC-AMD-036: No deep-link selects the first active type tab by default

- Requirement ID: AMD-REQ-027
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: `10_MD_default-first-tab.png`
- Preconditions: Admin logged in; multiple active types exist
- Test Data: URL: `/admin/master-data` (no query param)
- Steps:
  1. Navigate to `/admin/master-data` without any `?type=` query parameter
  2. Observe which tab is selected
- Expected Result: First active type tab (by sort order) is selected by default; entries for that type are displayed
- Flow Code: AMD-F-MD-TABS-003
- Notes: "First" is determined by type sort order (Gap-004 — ordering source is ambiguous; record observed behavior).

---

#### TC-AMD-037: Deep-link to inactive type tab — behavior per spec/FE discrepancy

- Requirement ID: AMD-REQ-026 (BR-010, EC-003)
- Priority: P1 Must-Test
- Test Type: Edge
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: Admin logged in; one type is deactivated (e.g. Rejection Reason)
- Test Data: URL: `/admin/master-data?type=rejection_reason` where `rejection_reason` is inactive
- Steps:
  1. Deactivate the Rejection Reason type
  2. Navigate to `/admin/master-data?type=rejection_reason`
  3. Observe tab strip and content area
- Expected Result (per spec — BR-010): Tab for Rejection Reason is still rendered but visually marked as inactive; entries listed with inactive state
- Notes: FE prototype only tabs over `activeTypes` — the tab may not appear. Record actual behavior. This is a confirmed spec/code discrepancy. Mark result as open question verification.
- Flow Code: AMD-F-MD-TABS-004

---

#### TC-AMD-038: Deep-link to invalid/nonexistent type slug

- Requirement ID: AMD-REQ-026
- Priority: P1 Must-Test
- Test Type: Edge
- Automation Readiness: Auto-Ready
- Screenshot Reference: —
- Preconditions: Admin logged in
- Test Data: URL: `/admin/master-data?type=nonexistent_slug`
- Steps:
  1. Navigate to `/admin/master-data?type=nonexistent_slug`
  2. Observe tab selection and page state
- Expected Result: Page does not crash; either defaults to first active tab or shows an appropriate error/empty state; behavior recorded (resolution pending — see open questions)
- Flow Code: AMD-F-MD-TABS-005
- Notes: Expected resolution not documented. Record actual behavior.

---

#### TC-AMD-039: Tab ordering reflects type sort order

- Requirement ID: AMD-REQ-028
- Priority: P2 Should-Test
- Test Type: Functional
- Automation Readiness: Partial
- Screenshot Reference: `10_MD_default-first-tab.png`
- Preconditions: Multiple active types exist with known sort order
- Test Data: Seeded types in documented seed order
- Steps:
  1. Navigate to `/admin/master-data`
  2. Record the order of tabs left-to-right
  3. Compare against expected type sort order
- Expected Result: Tabs appear in the order defined by `type sort_order`; does not change on page refresh
- Flow Code: AMD-F-MD-TABS-006
- Notes: Type `sort_order` assignment mechanism is undocumented (Gap-004). Record observed order.

---

### Master Data — Entries List

#### TC-AMD-040: Entries table shows all required columns

- Requirement ID: AMD-REQ-029
- Priority: P1 Must-Test
- Test Type: UI
- Automation Readiness: Auto-Ready
- Screenshot Reference: `10_MD_default-first-tab.png`
- Preconditions: Admin logged in; a type tab with entries is selected
- Test Data: Account Type tab (7 entries)
- Steps:
  1. Navigate to `/admin/master-data`
  2. Select the Account Type tab
  3. Inspect the table columns
- Expected Result: Table displays: Label, Entry Code, Sort Order, Status chip, Active toggle, Drag handle, Edit action icon for each entry
- Flow Code: AMD-F-MD-LIST-001
- Notes: —

---

#### TC-AMD-041: Empty state per tab shows correct content

- Requirement ID: AMD-REQ-030
- Priority: P2 Should-Test
- Test Type: UI
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: An active type exists with no entries
- Test Data: A newly created type with no entries added
- Steps:
  1. Create a new master data type (no entries)
  2. Navigate to `/admin/master-data` and select the new type's tab
  3. Inspect the table body area
- Expected Result: Empty state renders inside the table body with documented heading, body copy, and "Add Entry" CTA button
- Flow Code: AMD-F-MD-LIST-002
- Notes: —

---

### Master Data — Create Entry

#### TC-AMD-042: Add Entry opens Create side sheet with type pre-selected

- Requirement ID: AMD-REQ-031
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: `14_MD_sheet-create-empty.png`
- Preconditions: Admin logged in on Master Data page; Account Type tab selected
- Test Data: —
- Steps:
  1. Navigate to `/admin/master-data` with Account Type tab active
  2. Click "Add Entry" button
  3. Inspect the side sheet
- Expected Result: Create New Master Data Entry side sheet opens; Type dropdown is pre-selected to "Account Type"; Label, Entry Code, Sort Order fields are empty; Save and Cancel in pinned footer
- Flow Code: AMD-F-MD-CREATE-001
- Notes: —

---

#### TC-AMD-043: Create entry — happy path

- Requirement ID: AMD-REQ-031, AMD-REQ-037
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: `16_MD_sheet-create-filled.png`
- Preconditions: Admin logged in; an active type exists
- Test Data: Type: Account Type, Label: `Test Entity`, Entry Code: `test_entity` (auto-generated)
- Steps:
  1. Open Create Entry side sheet for Account Type
  2. Enter `Test Entity` in the Label field
  3. Verify Entry Code auto-fills to `test_entity`
  4. Click Save
- Expected Result: Side sheet closes; new entry "Test Entity" appears in the Account Type tab with Status = Active, toggle = ON; Sort Order defaults to last position
- Flow Code: AMD-F-MD-CREATE-002
- Notes: —

---

#### TC-AMD-044: Create entry — Label is required

- Requirement ID: AMD-REQ-032
- Priority: P1 Must-Test
- Test Type: Validation
- Automation Readiness: Auto-Ready
- Screenshot Reference: `15_MD_sheet-create-validation-errors.png`
- Preconditions: Admin logged in; Create Entry side sheet open
- Test Data: Label: (empty)
- Steps:
  1. Open Create Entry side sheet
  2. Leave Label blank
  3. Click Save
- Expected Result: Inline error "Label is required" below Label field; save blocked; sheet stays open
- Flow Code: AMD-F-MD-CREATE-003
- Notes: —

---

#### TC-AMD-045: Create entry — Entry Code is required

- Requirement ID: AMD-REQ-032
- Priority: P1 Must-Test
- Test Type: Validation
- Automation Readiness: Auto-Ready
- Screenshot Reference: `15_MD_sheet-create-validation-errors.png`
- Preconditions: Admin logged in; Create Entry side sheet open
- Test Data: Label: `Some Label`, Entry Code: manually cleared
- Steps:
  1. Open Create Entry side sheet
  2. Enter a Label so Entry Code auto-generates
  3. Manually clear Entry Code
  4. Click Save
- Expected Result: Inline validation error on Entry Code field; save blocked; sheet stays open
- Flow Code: AMD-F-MD-CREATE-004
- Notes: —

---

#### TC-AMD-046: Create entry — Type is required

- Requirement ID: AMD-REQ-032
- Priority: P1 Must-Test
- Test Type: Validation
- Automation Readiness: Auto-Ready
- Screenshot Reference: `15_MD_sheet-create-validation-errors.png`
- Preconditions: Admin logged in; Create Entry side sheet open
- Test Data: Type: cleared/not selected
- Steps:
  1. Open Create Entry side sheet
  2. Clear the pre-selected Type dropdown
  3. Enter a Label and Entry Code
  4. Click Save
- Expected Result: Inline validation error on Type field; save blocked; sheet stays open
- Flow Code: AMD-F-MD-CREATE-005
- Notes: Whether the dropdown can be cleared depends on implementation. If it cannot be cleared, note and skip.

---

#### TC-AMD-047: Entry Code auto-generates from Label using the same rule as Type Code

- Requirement ID: AMD-REQ-033
- Priority: P1 Must-Test
- Test Type: Validation
- Automation Readiness: Auto-Ready
- Screenshot Reference: `16_MD_sheet-create-filled.png`
- Preconditions: Admin logged in; Create Entry side sheet open
- Test Data:
  - `Individual` → `individual`
  - `Non-Individual` → `non_individual`
  - `PAN Card` → `pan_card`
  - `KYC failure` → `kyc_failure`
  - `Board Resolution` → `board_resolution`
- Steps:
  1. Open Create Entry side sheet
  2. For each Label value, enter and verify auto-generated Entry Code
- Expected Result: Each Label produces the correct Entry Code per the documented rule
- Flow Code: AMD-F-MD-CREATE-006
- Notes: —

---

#### TC-AMD-048: Entry Code is editable before first save

- Requirement ID: AMD-REQ-034
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: `16_MD_sheet-create-filled.png`
- Preconditions: Admin logged in; Create Entry side sheet open
- Test Data: Label: `Custom Entry`, auto code: `custom_entry`, override: `my_custom_code`
- Steps:
  1. Open Create Entry side sheet
  2. Enter `Custom Entry` as Label
  3. Override Entry Code with `my_custom_code`
  4. Click Save
- Expected Result: Entry is saved with Entry Code `my_custom_code`; row in table shows this code
- Flow Code: AMD-F-MD-CREATE-007
- Notes: —

---

#### TC-AMD-049: Duplicate Entry Code within the same type shows inline error

- Requirement ID: AMD-REQ-035
- Priority: P1 Must-Test
- Test Type: Validation
- Automation Readiness: Auto-Ready
- Screenshot Reference: —
- Preconditions: Entry with code `individual` already exists under Account Type
- Test Data: Type: Account Type, Label: `Individual Alt`, Entry Code: `individual` (duplicate)
- Steps:
  1. Open Create Entry side sheet for Account Type
  2. Enter or override Entry Code to `individual`
  3. Click Save
- Expected Result: Inline error "This code is already in use for this type" on Entry Code field; save blocked
- Flow Code: AMD-F-MD-CREATE-008
- Notes: —

---

#### TC-AMD-050: Same Entry Code is allowed under a different type

- Requirement ID: AMD-REQ-035 (EC-010)
- Priority: P1 Must-Test
- Test Type: Edge
- Automation Readiness: Auto-Ready
- Screenshot Reference: —
- Preconditions: Entry code `individual` exists under Account Type; Document Type exists
- Test Data: Type: Document Type, Label: `Individual`, Entry Code: `individual`
- Steps:
  1. Open Create Entry side sheet for Document Type
  2. Enter Label `Individual` → code auto-generates to `individual`
  3. Click Save
- Expected Result: Entry is created successfully under Document Type with code `individual`; no duplicate error since scope is per-type
- Flow Code: AMD-F-MD-CREATE-009
- Notes: —

---

#### TC-AMD-051: Sort Order defaults to end of list on new entry creation

- Requirement ID: AMD-REQ-036
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: —
- Preconditions: Admin logged in; Account Type has 7 entries with known sort orders
- Test Data: New entry with no Sort Order specified
- Steps:
  1. Open Create Entry side sheet for Account Type
  2. Enter Label and leave Sort Order blank
  3. Click Save
  4. Observe new entry position in the list
- Expected Result: New entry appears at the end of the Account Type list with Sort Order = 8 (or max existing + 1)
- Flow Code: AMD-F-MD-CREATE-010
- Notes: —

---

#### TC-AMD-052: Sort Order validation — invalid inputs

- Requirement ID: AMD-REQ-036 (EC-005)
- Priority: P1 Must-Test
- Test Type: Validation
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: Admin logged in; Create Entry side sheet open
- Test Data:
  - `0` → behavior unknown (document actual)
  - `-1` → likely rejected as invalid
  - `3.5` → likely rejected (non-integer)
  - `abc` → rejected (non-numeric)
  - Duplicate sort order (e.g. `1` when another entry already has sort order 1) → behavior unknown
  - Very large value (e.g. `999999`) → should accept without crash
- Steps:
  1. Open Create Entry side sheet
  2. For each Sort Order test value, enter value and attempt Save
  3. Record validation behavior
- Expected Result:
  - `0`, `-1`, `3.5`, `abc`: validation error or rejection
  - Duplicate: behavior to be documented (shift or reject — not specified)
  - Large value: accepted without error
- Flow Code: AMD-F-MD-CREATE-011
- Notes: Exact behavior for these cases is not specified. Record actual behavior as test evidence for spec alignment.

---

#### TC-AMD-053: Cancel entry creation closes sheet without saving

- Requirement ID: AMD-REQ-031
- Priority: P2 Should-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: —
- Preconditions: Admin logged in; Create Entry side sheet open with data entered
- Test Data: Label: `Unsaved Entry`
- Steps:
  1. Open Create Entry side sheet
  2. Enter `Unsaved Entry` in the Label field
  3. Click Cancel
- Expected Result: Side sheet closes; no new entry appears in the table; entry list unchanged
- Flow Code: AMD-F-MD-CREATE-012
- Notes: —

---

### Master Data — Edit Entry

#### TC-AMD-054: Edit icon opens pre-filled Edit Entry side sheet

- Requirement ID: AMD-REQ-038
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: `17_MD_sheet-edit-open.png`
- Preconditions: Admin logged in; an entry exists under an active type
- Test Data: Individual entry (code: `individual`, under Account Type)
- Steps:
  1. Navigate to `/admin/master-data`, select Account Type tab
  2. Click edit icon on the "Individual" entry row
  3. Inspect the side sheet fields
- Expected Result: Edit Entry side sheet opens pre-filled: Type = "Account Type" (read-only, plain text), Label = "Individual", Entry Code (read-only, lock icon), Sort Order = current value, Status = Active; subtitle "Changes take effect immediately across the platform."
- Flow Code: AMD-F-MD-EDIT-001
- Notes: —

---

#### TC-AMD-055: Saved Entry Code is read-only with lock icon and helper text

- Requirement ID: AMD-REQ-039
- Priority: P1 Must-Test
- Test Type: UI
- Automation Readiness: Auto-Ready
- Screenshot Reference: `17_MD_sheet-edit-open.png`
- Preconditions: Edit Entry side sheet open for any saved entry
- Test Data: Any existing entry
- Steps:
  1. Open Edit Entry side sheet for any entry
  2. Inspect the Entry Code field
  3. Attempt to click or focus the Entry Code field
- Expected Result: Entry Code is non-interactive; lock icon visible; helper text "Cannot be changed after saving." displayed; value cannot be changed
- Flow Code: AMD-F-MD-EDIT-002
- Notes: —

---

#### TC-AMD-056: Entry Type is read-only in Edit side sheet

- Requirement ID: AMD-REQ-040
- Priority: P1 Must-Test
- Test Type: UI
- Automation Readiness: Auto-Ready
- Screenshot Reference: `17_MD_sheet-edit-open.png`
- Preconditions: Edit Entry side sheet open
- Test Data: Any existing entry
- Steps:
  1. Open Edit Entry side sheet for any entry
  2. Inspect the Type field
  3. Attempt to click or change the Type
- Expected Result: Type field is displayed as plain read-only text; not a dropdown in edit mode; cannot be changed
- Flow Code: AMD-F-MD-EDIT-003
- Notes: —

---

#### TC-AMD-057: Admin can edit entry Label and Sort Order

- Requirement ID: AMD-REQ-038
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: —
- Preconditions: Admin logged in; an entry exists
- Test Data: Label: `Individual Updated`, Sort Order: `5`
- Steps:
  1. Open Edit Entry side sheet for "Individual"
  2. Change Label to `Individual Updated`
  3. Change Sort Order to `5`
  4. Click Save
  5. Observe the entry row in the table
- Expected Result: Side sheet closes; row shows `Individual Updated` as Label; Sort Order reflects `5`; Entry Code and Type are unchanged
- Flow Code: AMD-F-MD-EDIT-004
- Notes: Restore original values after test.

---

### Master Data — Deactivate Entry

#### TC-AMD-058: Row toggle OFF shows entry deactivation popup with entry label in bold

- Requirement ID: AMD-REQ-041
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: `19_MD_popup-deactivate.png`
- Preconditions: Admin logged in; an active entry exists
- Test Data: Entry: "Individual" (Account Type)
- Steps:
  1. Navigate to Account Type tab in Master Data
  2. Toggle OFF the Active switch for "Individual"
  3. Observe popup
- Expected Result: Confirmation popup appears: title "Deactivate entry?", body includes entry label **Individual** in bold, message "will no longer be available across the platform."; two buttons: "Deactivate" (destructive) and "Cancel"
- Flow Code: AMD-F-MD-DEACT-001
- Notes: —

---

#### TC-AMD-059: Confirm entry deactivation — entry shows inactive state in list

- Requirement ID: AMD-REQ-041, AMD-REQ-044
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: `20_MD_after-deactivate-row-inactive.png`
- Preconditions: Entry deactivation popup is visible
- Test Data: "Individual" entry
- Steps:
  1. From the entry deactivation popup, click "Deactivate"
  2. Observe the entry row
- Expected Result: Popup closes; entry remains visible in the list with Status chip = Inactive, toggle = OFF, and reduced-opacity visual treatment; entry is not removed from the list
- Flow Code: AMD-F-MD-DEACT-002
- Notes: —

---

#### TC-AMD-060: Cancel entry deactivation reverts toggle to ON

- Requirement ID: AMD-REQ-042
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: —
- Preconditions: Entry deactivation popup is visible
- Test Data: Any active entry
- Steps:
  1. Toggle OFF an active entry to trigger deactivation popup
  2. Click "Cancel"
  3. Observe the entry row
- Expected Result: Popup closes; toggle reverts to ON; entry Status = Active; no data changes
- Flow Code: AMD-F-MD-DEACT-003
- Notes: —

---

#### TC-AMD-061: Edit sheet Save with Status OFF shows entry deactivation popup

- Requirement ID: AMD-REQ-041
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: `18_MD_sheet-edit-inactive.png`
- Preconditions: Admin logged in; an active entry exists
- Test Data: Any active entry
- Steps:
  1. Open Edit Entry side sheet for an active entry
  2. Toggle Status to OFF (Inactive)
  3. Click Save
- Expected Result: Entry deactivation popup appears (same as TC-AMD-058); confirm deactivates; cancel restores Status toggle to ON in the sheet
- Flow Code: AMD-F-MD-DEACT-004
- Notes: —

---

#### TC-AMD-062: Reactivating an entry is immediate with no popup

- Requirement ID: AMD-REQ-043
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: `21_MD_row-reactivated.png`
- Preconditions: Admin logged in; an inactive entry exists
- Test Data: Any inactive entry
- Steps:
  1. Locate an inactive entry in the list
  2. Toggle ON the Active switch
  3. Observe behavior
- Expected Result: No popup appears; entry Status immediately changes to Active; toggle stays ON; visual inactive treatment removed
- Flow Code: AMD-F-MD-DEACT-005
- Notes: —

---

#### TC-AMD-063: Inactive entries remain visible in list with inactive visual treatment

- Requirement ID: AMD-REQ-044
- Priority: P2 Should-Test
- Test Type: UI
- Automation Readiness: Auto-Ready
- Screenshot Reference: `20_MD_after-deactivate-row-inactive.png`
- Preconditions: Admin logged in; at least one inactive entry exists in a type tab
- Test Data: Any type with mixed active and inactive entries
- Steps:
  1. Navigate to a type tab with both active and inactive entries
  2. Inspect the list
- Expected Result: Inactive entries are visible with Status chip = Inactive, reduced-opacity row styling, toggle = OFF; they are not hidden or removed from the list
- Flow Code: AMD-F-MD-DEACT-006
- Notes: —

---

### Master Data — Drag-to-Reorder

#### TC-AMD-064: Drag-to-reorder persists immediately on drop

- Requirement ID: AMD-REQ-045
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: Admin logged in; single type tab active; at least 3 entries in the selected type
- Test Data: Account Type with entries at Sort Orders 1, 2, 3, 4, 5, 6, 7
- Steps:
  1. Navigate to Account Type tab
  2. Drag the entry at position 3 to position 1
  3. Release (drop)
  4. Observe Sort Order values in the list
  5. Refresh the page
  6. Observe Sort Order again
- Expected Result: After drop, Sort Order updates visually immediately; after page refresh, new order persists; no separate Save action is required
- Flow Code: AMD-F-MD-REORDER-001
- Notes: Persistence requires backend API call on drop. Partially testable until API is confirmed.

---

#### TC-AMD-065: Drag handles are visible only on single type tab, hidden otherwise

- Requirement ID: AMD-REQ-046
- Priority: P3 Nice-to-Test
- Test Type: UI
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: Admin logged in; multiple active types exist
- Test Data: Standard seeded types
- Steps:
  1. Navigate to `/admin/master-data` — first tab selected; inspect entry rows for drag handles
  2. Switch to a second tab; inspect drag handles
  3. If a multi-type combined view exists, navigate to it and inspect
- Expected Result: Drag handles are visible when exactly one type tab is active; hidden if no tab is active or a multi-type/combined view is active
- Flow Code: AMD-F-MD-REORDER-002
- Notes: Multi-type view is referenced but not fully specified (AMD-REQ-046 notes).

---

#### TC-AMD-066: Drag-reorder with single entry does not break sort order

- Requirement ID: AMD-REQ-045
- Priority: P2 Should-Test
- Test Type: Edge
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: A type tab with exactly one entry
- Test Data: A type with one entry
- Steps:
  1. Navigate to the type tab with one entry
  2. Attempt to drag the single entry row
- Expected Result: No error or crash; drag handle is present; dragging has no effect on sort order (nowhere to move); no network error triggered
- Flow Code: AMD-F-MD-REORDER-003
- Notes: —

---

#### TC-AMD-067: Newly created entry after drag-reorder appends to end of list

- Requirement ID: AMD-REQ-036, AMD-REQ-045
- Priority: P2 Should-Test
- Test Type: Regression
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: Account Type tab with entries that have been drag-reordered
- Test Data: Post-reorder list; new entry with no Sort Order specified
- Steps:
  1. Drag-reorder entries so positions are shuffled
  2. Create a new entry with no Sort Order
  3. Observe where the new entry appears
- Expected Result: New entry appears at the end of the list (sort order = max existing + 1), not inserted at a stale default position
- Flow Code: AMD-F-MD-REORDER-004
- Notes: Verifies QR-014.

---

### Integration & Seed Data

#### TC-AMD-068: All seeded types and entries present on first deployment

- Requirement ID: AMD-REQ-047
- Priority: P1 Must-Test
- Test Type: Smoke
- Automation Readiness: Partial
- Screenshot Reference: `10_MD_default-first-tab.png`, `12_MD_tab-rejection-reason.png`, `13_MD_tab-query-category.png`
- Preconditions: Fresh deployment environment; seed migration has run
- Test Data: Expected seed: 4 types (Account Type, Document Type, Rejection Reason, Query Category) + 22 entries per documented list; SLA type/entries per research.md (to be verified)
- Steps:
  1. Navigate to `/admin/master-data-types`
  2. Count and verify all types (minimum 4 documented types, check for SLA type)
  3. Navigate to each type tab and count entries
  4. Verify entry labels and entry codes match seed data spec
- Expected Result:
  - Account Type: 7 entries (`individual`, `non_individual`, `company`, `fpo`, `trust`, `partnership`, `llp`)
  - Document Type: 8 entries (`pan_card`, `aadhaar`, `photo`, `moa`, `board_resolution`, `gst_certificate`, `bank_statement`, `incorporation_certificate`)
  - Rejection Reason: 3 entries (`incomplete_kyc`, `document_mismatch`, `blacklisted_entity`)
  - Query Category: 4 entries (`document_quality_issue`, `field_mismatch`, `missing_document`, `kyc_failure`)
  - SLA: 2 entries (codes unspecified — Gap-002; verify if tab exists)
- Flow Code: AMD-F-INT-001
- Notes: v1 spec says 4 types + 22 entries; research.md adds SLA as type 5 with 2 entries (total 24 if SLA included). Assert at minimum the 4 documented types.

---

#### TC-AMD-069: Deactivated Account Type disappears from Client Portal account type selection

- Requirement ID: AMD-REQ-049
- Priority: P1 Must-Test
- Test Type: E2E
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: Integrated environment with Client Portal; Account Type entries are active
- Test Data: Deactivate `individual` entry under Account Type
- Steps:
  1. In Admin Panel: deactivate the "Individual" entry under Account Type
  2. Navigate to Client Portal — account opening form
  3. Open the account type selection dropdown
- Expected Result: "Individual" is no longer available as a selectable option in the Client Portal account type dropdown; all other account types remain available
- Flow Code: AMD-F-INT-002
- Notes: Requires integrated environment. Partially testable in isolation.

---

#### TC-AMD-070: Deactivated Document Type disappears from document upload checklists

- Requirement ID: AMD-REQ-050
- Priority: P1 Must-Test
- Test Type: E2E
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: Integrated environment; PAN Card document type is active
- Test Data: Deactivate `pan_card` entry under Document Type
- Steps:
  1. In Admin Panel: deactivate "PAN Card" entry
  2. Navigate to Client Portal — document upload section or configuration document rules
  3. Check for PAN Card in document checklist
- Expected Result: PAN Card is no longer available in document upload checklist and document rule configuration; other document types remain available
- Flow Code: AMD-F-INT-003
- Notes: Requires integrated environment.

---

#### TC-AMD-071: Deactivated Rejection Reason removed from Ops Portal decision dropdown

- Requirement ID: AMD-REQ-051
- Priority: P1 Must-Test
- Test Type: E2E
- Automation Readiness: Partial
- Screenshot Reference: `12_MD_tab-rejection-reason.png`
- Preconditions: Integrated Ops Portal; "Incomplete KYC" rejection reason is active
- Test Data: Deactivate `incomplete_kyc` entry under Rejection Reason
- Steps:
  1. In Admin Panel: deactivate "Incomplete KYC" rejection reason entry
  2. Navigate to Ops Portal — reviewer decision flow
  3. Check rejection reason dropdown
- Expected Result: "Incomplete KYC" is not present in the Ops Portal rejection reason dropdown
- Flow Code: AMD-F-INT-004
- Notes: —

---

#### TC-AMD-072: Deactivated Query Category removed from Ops Portal query creation

- Requirement ID: AMD-REQ-051
- Priority: P1 Must-Test
- Test Type: E2E
- Automation Readiness: Partial
- Screenshot Reference: `13_MD_tab-query-category.png`
- Preconditions: Integrated Ops Portal; Query Category entries are active
- Test Data: Deactivate `field_mismatch` entry under Query Category
- Steps:
  1. In Admin Panel: deactivate "Field mismatch" entry
  2. Navigate to Ops Portal — query creation
  3. Check query category dropdown
- Expected Result: "Field mismatch" is not present in the Ops Portal query category dropdown
- Flow Code: AMD-F-INT-005
- Notes: —

---

#### TC-AMD-073: Audit log entries generated for Master Data actions

- Requirement ID: AMD-REQ-052
- Priority: P2 Should-Test
- Test Type: Functional
- Automation Readiness: Manual-Only
- Screenshot Reference: —
- Preconditions: Audit Log module exists and is accessible; audit logging for Master Data is confirmed enabled
- Test Data: Create, Edit, Deactivate, Reactivate operations on a type and entry
- Steps:
  1. Perform: create type, edit type name, deactivate type, reactivate type
  2. Navigate to Audit Log module
  3. Filter by actor = current Admin and resource = Master Data
- Expected Result: Audit entries exist for each action performed; each entry includes: action type, actor, timestamp, affected resource
- Flow Code: AMD-F-INT-006
- Notes: Blocked — AMD-REQ-052 is "Not Testable" per analysis. Depends on audit logging being confirmed for this module.

---

### Non-Functional — Performance

#### TC-AMD-074: Master Data Types table load completes in under 2 seconds

- Requirement ID: AMD-REQ-053
- Priority: P2 Should-Test
- Test Type: Functional
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: Admin logged in; seed data (4+ types) deployed
- Test Data: Standard seeded environment
- Steps:
  1. Open browser DevTools — Network tab
  2. Navigate to `/admin/master-data-types`
  3. Measure time from navigation start to table data visible
- Expected Result: Table content renders within 2 seconds of navigation
- Flow Code: AMD-F-NFR-001
- Notes: Threshold is "expected, not committed" (AMD-REQ-053). Record actual time as baseline.

---

#### TC-AMD-075: Side sheet open interaction completes in under 300ms

- Requirement ID: AMD-REQ-054
- Priority: P3 Nice-to-Test
- Test Type: Functional
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: Admin logged in on Master Data Types page
- Test Data: —
- Steps:
  1. Open browser DevTools — Performance tab
  2. Click "Add Type" and record time to side sheet fully visible
  3. Repeat for Edit icon click
- Expected Result: Side sheet animation and content display complete within 300ms
- Flow Code: AMD-F-NFR-002
- Notes: Threshold not formally committed. Baseline measurement only.

---

#### TC-AMD-076: Drag-reorder response is visually immediate

- Requirement ID: AMD-REQ-055
- Priority: P2 Should-Test
- Test Type: Functional
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: Admin logged in; Account Type tab active; entries present
- Test Data: —
- Steps:
  1. Drag an entry row to a new position
  2. Observe visual feedback during drag (placeholder, indicator)
  3. Observe list update on drop
- Expected Result: List reorders visually on drop without perceptible delay; drag feedback is present during drag; no loading state required before visual update (optimistic UI expected)
- Flow Code: AMD-F-NFR-003
- Notes: Rollback behavior on API failure is undocumented — test and record.

---

### Non-Functional — Accessibility

#### TC-AMD-077: Toggle controls expose correct ARIA roles and attributes

- Requirement ID: AMD-REQ-056
- Priority: P1 Must-Test
- Test Type: UI
- Automation Readiness: Auto-Ready
- Screenshot Reference: —
- Preconditions: Admin logged in; at least one type and one entry visible in respective tables
- Test Data: Any type row toggle; any entry row toggle
- Steps:
  1. Navigate to `/admin/master-data-types`
  2. Inspect each Active toggle element in the DOM
  3. Navigate to `/admin/master-data` and inspect entry toggles
- Expected Result: Each toggle element has `role="switch"` and `aria-checked="true"` (active) or `aria-checked="false"` (inactive); ARIA attribute updates correctly after toggle change
- Flow Code: AMD-F-NFR-004
- Notes: Confirmed in FE source code (AMD-REQ-056 notes).

---

#### TC-AMD-078: Breadcrumb uses nav with aria-label="Breadcrumb"

- Requirement ID: AMD-REQ-057
- Priority: P2 Should-Test
- Test Type: UI
- Automation Readiness: Auto-Ready
- Screenshot Reference: —
- Preconditions: Admin logged in
- Test Data: —
- Steps:
  1. Navigate to `/admin/master-data-types`
  2. Inspect the breadcrumb DOM element
  3. Repeat on `/admin/master-data`
- Expected Result: Breadcrumb is wrapped in a `<nav>` element with `aria-label="Breadcrumb"` on both pages
- Flow Code: AMD-F-NFR-005
- Notes: —

---

#### TC-AMD-079: Side sheets and popups handle keyboard focus predictably

- Requirement ID: AMD-REQ-058
- Priority: P2 Should-Test
- Test Type: Functional
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: Admin logged in; keyboard-only navigation
- Test Data: Create side sheet; deactivation popup
- Steps:
  1. Open Create Type side sheet using keyboard only (Tab to Add Type, Enter to open)
  2. Verify focus moves into the sheet on open
  3. Tab through sheet fields
  4. Press Escape — observe if sheet dismisses (should not dismiss a non-dismissible popup)
  5. Close sheet via Cancel button using keyboard
  6. Verify focus returns to the triggering element
  7. Trigger deactivation popup; verify focus is trapped inside popup until action is taken
- Expected Result: Focus moves to sheet/popup on open; Tab order is logical within the sheet; focus is trapped inside non-dismissible popup; focus returns to trigger element on close
- Flow Code: AMD-F-NFR-006
- Notes: Non-dismissible popups should not be closeable via Escape (open question — record actual behavior). WCAG level not formally documented.

---

### Error Handling & Edge Cases

#### TC-AMD-080: Network error during Save shows toast and preserves form values

- Requirement ID: AMD-REQ-013 (QR-015)
- Priority: P1 Must-Test
- Test Type: Negative
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: Admin logged in; Create Type side sheet open; ability to simulate network failure (DevTools network throttle or API mock returning 500)
- Test Data: Valid Name and Type Code; simulated 500 response on Save
- Steps:
  1. Open Create Type side sheet
  2. Enter valid Name and Type Code
  3. Intercept or simulate 500 API response on Save
  4. Click Save
  5. Observe toast and form state
- Expected Result: Toast error "Failed to save. Please try again." appears; side sheet remains open with all form values intact; no partial save occurs
- Flow Code: AMD-F-ERR-001
- Notes: Same behavior expected for Create Entry, Edit Type, and Edit Entry save operations.

---

#### TC-AMD-081: Network error during toggle (deactivate/reactivate) shows error

- Requirement ID: QR-015
- Priority: P2 Should-Test
- Test Type: Negative
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: Admin logged in; simulated API failure on toggle
- Test Data: Any active entry/type
- Steps:
  1. Simulate 500 response on the toggle API call
  2. Toggle an active entry OFF → confirm deactivation → API returns 500
  3. Observe toast and row state
- Expected Result: Error toast appears; row toggle reverts to its prior state; no data change committed
- Flow Code: AMD-F-ERR-002
- Notes: —

---

#### TC-AMD-082: Session expiry while side sheet is open

- Requirement ID: AMD-REQ-002 (EC-008)
- Priority: P1 Must-Test
- Test Type: Edge
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: Admin is mid-form in a Create/Edit side sheet
- Test Data: Partially filled form; force-expired session
- Steps:
  1. Open Create Type side sheet; enter Name but do not Save
  2. Force-expire session (clear cookie or backend expire)
  3. Click Save or any page action
  4. Observe behavior
- Expected Result: Admin is redirected to `/login`; unsaved form values are lost (acceptable); no crash; no partial save
- Flow Code: AMD-F-ERR-003
- Notes: Grace period behavior is undocumented — record actual behavior.

---

#### TC-AMD-083: Drag-to-reorder on tablet viewport (1024px touch) — support check

- Requirement ID: AMD-REQ-045 (EC-009)
- Priority: P3 Nice-to-Test
- Test Type: Edge
- Automation Readiness: Manual-Only
- Screenshot Reference: —
- Preconditions: Tablet device or browser emulation at 1024px width; Admin logged in; touch input available
- Test Data: Account Type tab with multiple entries
- Steps:
  1. Open Master Data page on a 1024px touch device or emulated tablet
  2. Attempt to drag-reorder an entry row via touch
- Expected Result: Either drag-to-reorder works via touch at 1024px, or handles are not shown and touch reorder is not supported (both are acceptable outcomes — result should be documented for spec gap resolution)
- Flow Code: AMD-F-ERR-004
- Notes: EC-009 — HTML5 drag API may not work on touch. Record actual behavior.

---

#### TC-AMD-084: No active types on Master Data page — Add Entry state

- Requirement ID: EC-004
- Priority: P3 Nice-to-Test
- Test Type: Edge
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: All master data types are deactivated
- Test Data: All types inactive
- Steps:
  1. Deactivate all types
  2. Navigate to `/admin/master-data`
  3. Observe tab strip and Add Entry button state
- Expected Result: Tab strip shows no tabs (or only inactive indicators); Add Entry button is either hidden or disabled; no crash; appropriate empty/blocked state shown
- Flow Code: AMD-F-ERR-005
- Notes: Behavior is not documented. Record actual result for spec alignment.

---

#### TC-AMD-085: Code auto-generation from empty-result name shows validation error

- Requirement ID: AMD-REQ-010 (EC-006, Gap-011)
- Priority: P2 Should-Test
- Test Type: Validation
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: Admin logged in; Create Type side sheet open
- Test Data:
  - Name: `@#$` (all special characters → auto-generated code should be empty string)
  - Name: `   ` (spaces only → auto-generated code empty string)
- Steps:
  1. Open Create Type side sheet
  2. Enter `@#$` in Name field
  3. Observe Type Code field value
  4. Attempt to Save
- Expected Result: Type Code field is empty after auto-generation; inline validation error fires on Save (or as soon as code becomes empty); save is blocked; no crash
- Flow Code: AMD-F-ERR-006
- Notes: Exact behavior is unspecified (Gap-011). Record actual behavior.

---

#### TC-AMD-086: Admin server-side Entry Code immutability via direct API PATCH

- Requirement ID: AMD-REQ-004 (EC-013, QR-003)
- Priority: P1 Must-Test
- Test Type: Data Integrity
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: Saved entry exists; API endpoint available
- Test Data: Saved entry ID and current `key` value (e.g. `individual`)
- Steps:
  1. Identify entry ID and current entry code `key`
  2. Send PATCH: `PATCH /api/admin/master-data/entries/:id` with payload `{ "key": "mutated_code" }`
  3. Observe API response
  4. GET the entry and verify `key` is unchanged
- Expected Result: API returns 400 or 422; entry code `key` is unchanged after the PATCH attempt
- Flow Code: AMD-F-AUTH-007
- Notes: Blocked until `api.md` is provided. Inferred endpoint path. Verifies QR-003.

---

#### TC-AMD-087: Concurrent duplicate Type Code submission — race condition handling

- Requirement ID: AMD-REQ-012 (EC-007, QR-010)
- Priority: P1 Must-Test
- Test Type: Data Integrity
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: Two Admin sessions active simultaneously; API endpoint available
- Test Data: Two simultaneous Create Type requests with identical Type Code (e.g. `conflict_code`)
- Steps:
  1. Open two separate Admin sessions
  2. In both sessions, open Create Type side sheet and fill in Name that generates `conflict_code`
  3. Submit both simultaneously (using API calls or coordinated UI actions)
  4. Observe both responses
- Expected Result: Exactly one create succeeds; the other returns an error (409 Conflict or 422 Unprocessable); only one type with code `conflict_code` exists in the database
- Flow Code: AMD-F-AUTH-008
- Notes: Server-side unique constraint (DB-level) required. Partially testable without confirmed API contract.

---

#### TC-AMD-088: Entries count in Types table — active-only vs total count verification

- Requirement ID: BR-013 (Gap-003)
- Priority: P2 Should-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: `01_MDT_default-list.png`
- Preconditions: A type with both active and inactive entries exists; e.g. Account Type with 7 entries, 2 deactivated
- Test Data: Account Type with 5 active + 2 inactive = 7 total entries
- Steps:
  1. Deactivate 2 entries under Account Type
  2. Navigate to `/admin/master-data-types`
  3. Read the "N entries →" count on the Account Type row
- Expected Result: Record whether N = 7 (total) or N = 5 (active only); this determines which interpretation the system uses; assert consistency with cascade popup count (which should be active-only)
- Flow Code: AMD-F-MD-LIST-003
- Notes: Gap-003 — not specified. Result of this test resolves the open question.

---

## Coverage Notes

### Requirements Covered (Full or Deep Coverage)
- AMD-REQ-001, 002, 003, 004 (Auth/Authorization — UI fully covered; server-side partial)
- AMD-REQ-005, 007, 008, 009, 010, 011, 012, 013, 014 (Create Type flow — fully covered)
- AMD-REQ-015, 016, 017 (Edit Type — fully covered)
- AMD-REQ-018, 019, 020, 021, 022, 023 (Deactivation/Reactivation — fully covered)
- AMD-REQ-024 (Entries deep-link — fully covered)
- AMD-REQ-025, 026, 027 (Tab behavior — fully covered)
- AMD-REQ-029, 031, 032, 033, 034, 035, 036, 037 (Create Entry — fully covered)
- AMD-REQ-038, 039, 040 (Edit Entry — fully covered)
- AMD-REQ-041, 042, 043, 044 (Entry deactivation/reactivation — fully covered)
- AMD-REQ-045 (Drag-reorder — core coverage)
- AMD-REQ-047 (Seed data — smoke coverage)
- AMD-REQ-049, 050, 051 (Downstream integration — covered with partial testability)
- AMD-REQ-056, 057, 058 (Accessibility — fully covered for testable items)

### Requirements Partially Covered (Light or Conditional Coverage)
- AMD-REQ-006 (Pagination — requires large dataset environment)
- AMD-REQ-028 (Tab ordering — open on sort_order source; recorded as observation)
- AMD-REQ-046 (Drag handle visibility — multi-type view not specified)
- AMD-REQ-048 (Immediate system-wide propagation — mechanism undocumented; tested via integration tests TC-AMD-069 to TC-AMD-072)
- AMD-REQ-053, 054, 055 (Performance — thresholds not committed; baselines only)

### Requirements Blocked / Not Fully Testable
- AMD-REQ-004 (Server-side code immutability — API contract required; TC-AMD-006 and TC-AMD-086 are draft tests pending `api.md`)
- AMD-REQ-052 (Audit logging — module-level confirmation required before test execution)

---

## Open Questions / Dependencies

| # | Question | Affects | Source |
|---|---|---|---|
| OQ-001 | What are the confirmed API endpoints, HTTP methods, request/response schemas, and error codes? | TC-AMD-006, TC-AMD-086, TC-AMD-087, TC-AMD-080, TC-AMD-081 | Gap-001 |
| OQ-002 | Is Type Code / Entry Code immutability enforced server-side, and what error response is returned? | TC-AMD-006, TC-AMD-086 | AMD-REQ-004, QR-003 |
| OQ-003 | Is duplicate code validation enforced server-side for concurrent sessions? | TC-AMD-087 | AMD-REQ-012, AMD-REQ-035, QR-010 |
| OQ-004 | What does the system do with a Name/Label that produces an empty auto-generated code? | TC-AMD-015, TC-AMD-085 | Gap-011 |
| OQ-005 | How does the system handle non-ASCII characters in Name/Label during code auto-generation? | TC-AMD-015 | EC-006, Gap-011 |
| OQ-006 | Is the SLA type present in the admin UI? What are its entry codes? | TC-AMD-068 | Gap-002 |
| OQ-007 | Does "N entries →" in the Types table count all entries or only active entries? | TC-AMD-088 | Gap-003, BR-013 |
| OQ-008 | How is `sort_order` assigned to types at creation? Can types be reordered? | TC-AMD-039 | Gap-004 |
| OQ-009 | What happens when deep-linking to an inactive type — spec says tab shown, FE only tabs active types? | TC-AMD-037 | AMD-REQ-026, BR-010, EC-003 |
| OQ-010 | What happens when deep-linking to an invalid/nonexistent slug? | TC-AMD-038 | AMD-REQ-026 |
| OQ-011 | What is the behavior when all types are inactive and admin visits Master Data page? | TC-AMD-084 | EC-004 |
| OQ-012 | Can confirmation popups be dismissed via the Escape key? | TC-AMD-025, TC-AMD-060, TC-AMD-079 | AMD-REQ-058 |
| OQ-013 | Does cascade deactivation trigger downstream cache invalidation? Is propagation immediate? | TC-AMD-069 – TC-AMD-072 | AMD-REQ-048 |
| OQ-014 | Are Audit Log entries generated for Master Data CRUD and toggle operations? | TC-AMD-073 | AMD-REQ-052 |
| OQ-015 | Is drag-to-reorder supported on touch at 1024px tablet viewport? | TC-AMD-083 | EC-009 |
| OQ-016 | What are maximum field lengths for Name, Label, Type Code, Entry Code? | TC-AMD-015, TC-AMD-052 | New — from analysis |
| OQ-017 | What happens to Sort Order input of 0, negative, decimal, or duplicate? | TC-AMD-052 | AMD-REQ-036, EC-005 |
| OQ-018 | What is the expected network error toast message for toggle/reorder failures (not just Save)? | TC-AMD-081 | QR-015 |
