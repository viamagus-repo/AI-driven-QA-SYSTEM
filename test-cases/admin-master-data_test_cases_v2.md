# Test Cases: Admin / Master Data

## Meta

| Field | Value |
|---|---|
| Module Name | Admin / Master Data |
| Screen Name | Master Data |
| Base URL | http://localhost:3000 |
| Requirement Analysis Source File | `analysis/admin-master-data_requirement_analysis_v1.md` |
| QA Knowledge Source File | `knowledge/admin-master-data_qa_knowledge_v2.md` |
| Screenshot Path Used | `../FE-Codebase/screenshots/master-data/` |
| Date | 2026-05-06 |
| Version | v2 |
| Test Scope | Full |
| Total Test Cases | 91 |
| Changes Over v1 | Added Module Name / Screen Name / Base URL to Meta; full URLs in all navigation steps; URL assertion steps added; improved screenshot coverage (both naming conventions); 3 new test cases (TC-AMD-089–091) covering sort order uniqueness, entry code edge cases, and inactive entry drag visibility |

---

## Test Case Summary

### Count by Priority

| Priority | Count |
|---|---|
| P1 Must-Test | 67 |
| P2 Should-Test | 17 |
| P3 Nice-to-Test | 7 |

### Count by Test Type

| Test Type | Count |
|---|---|
| Functional | 35 |
| Negative | 14 |
| Validation | 13 |
| Edge | 10 |
| UI | 7 |
| E2E | 4 |
| Data Integrity | 4 |
| Regression | 2 |
| Smoke | 2 |

### Count by Automation Readiness

| Readiness | Count |
|---|---|
| Auto-Ready | 53 |
| Partial | 29 |
| Manual-Only | 9 |

---

## Screenshot Coverage Used

| Screenshot | Screen | UI Area Covered | Used In Test Cases |
|---|---|---|---|
| `01_master-data-types_default-list.png` | MDT | Types list — default state (older naming set) | TC-AMD-007 |
| `01_MDT_default-list.png` | MDT | Types list — all columns, active rows | TC-AMD-007, TC-AMD-088 |
| `02_MDT_sheet-create-empty.png` | MDT | Create Type side sheet — empty fields | TC-AMD-010, TC-AMD-012 |
| `03_master-data-types_sheet-create-open.png` | MDT | Create Type side sheet — open state (older naming) | TC-AMD-010, TC-AMD-016 |
| `03_MDT_sheet-create-validation-errors.png` | MDT | Create Type — required field validation errors | TC-AMD-012, TC-AMD-013 |
| `04_master-data-types_sheet-create-validation.png` | MDT | Create Type — validation state (older naming) | TC-AMD-013 |
| `04_MDT_sheet-create-filled.png` | MDT | Create Type — Name filled, code auto-generated | TC-AMD-014, TC-AMD-016, TC-AMD-017 |
| `05_MDT_sheet-edit-open.png` | MDT | Edit Type — pre-filled, code locked with icon | TC-AMD-019, TC-AMD-020, TC-AMD-021 |
| `06_MDT_sheet-edit-inactive.png` | MDT | Edit Type — Status toggled Inactive | TC-AMD-026, TC-AMD-022 |
| `07_MDT_popup-deactivate-cascade-from-sheet.png` | MDT | Cascade deactivation popup (triggered from edit sheet) | TC-AMD-027, TC-AMD-028, TC-AMD-029 |
| `08_master-data_default.png` | MD | Master Data page — default view (older naming) | TC-AMD-034 |
| `08_MDT_popup-deactivate-cascade-row-toggle.png` | MDT | Cascade deactivation popup (triggered from row toggle) | TC-AMD-027, TC-AMD-025 |
| `09_master-data_deep-link-document-type.png` | MD | Master Data — deep-link to Document Type (older naming) | TC-AMD-035 |
| `09_MDT_empty-state.png` | MDT | Master Data Types — empty state | TC-AMD-009 |
| `10_master-data_tab-account-type.png` | MD | Master Data — Account Type tab active (older naming) | TC-AMD-040 |
| `10_MD_default-first-tab.png` | MD | Master Data — first tab selected, entries visible | TC-AMD-034, TC-AMD-036, TC-AMD-040 |
| `11_MD_deeplink-document-type.png` | MD | Master Data — Document Type tab pre-selected via deep-link | TC-AMD-035, TC-AMD-033 |
| `12_MD_tab-rejection-reason.png` | MD | Master Data — Rejection Reason tab | TC-AMD-034, TC-AMD-071 |
| `13_MD_tab-query-category.png` | MD | Master Data — Query Category tab | TC-AMD-034, TC-AMD-072 |
| `14_MD_sheet-create-empty.png` | MD | Create Entry side sheet — empty fields | TC-AMD-042, TC-AMD-044 |
| `15_MD_sheet-create-validation-errors.png` | MD | Create Entry — required field validation errors | TC-AMD-044, TC-AMD-045, TC-AMD-046 |
| `16_MD_sheet-create-filled.png` | MD | Create Entry — filled, code auto-generated, before save | TC-AMD-047, TC-AMD-048 |
| `17_MD_sheet-edit-open.png` | MD | Edit Entry — pre-filled, code locked, Type read-only | TC-AMD-054, TC-AMD-055, TC-AMD-056 |
| `18_MD_sheet-edit-inactive.png` | MD | Edit Entry — Status toggled Inactive | TC-AMD-061 |
| `19_MD_popup-deactivate.png` | MD | Entry deactivation confirmation popup | TC-AMD-058, TC-AMD-059 |
| `20_MD_after-deactivate-row-inactive.png` | MD | Entry row — inactive visual state after deactivation | TC-AMD-059, TC-AMD-063 |
| `21_MD_row-reactivated.png` | MD | Entry row — reactivated, Active state restored | TC-AMD-062 |

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
- Preconditions: No active admin session (browser without session cookie)
- Test Data: URL: `http://localhost:3000/admin/master-data-types`
- Steps:
  1. Open a fresh browser with no active session cookie
  2. Navigate to `http://localhost:3000/admin/master-data-types`
  3. Observe page behavior and URL
- Expected Result: Browser redirects to `http://localhost:3000/login`; Master Data Types page content is not rendered; redirect happens before any data is displayed
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
- Test Data: URL: `http://localhost:3000/admin/master-data`
- Steps:
  1. Open a fresh browser with no active session cookie
  2. Navigate to `http://localhost:3000/admin/master-data`
  3. Observe page behavior and URL
- Expected Result: Browser redirects to `http://localhost:3000/login`; Master Data page content is not rendered
- Flow Code: AMD-F-AUTH-002
- Notes: —

---

#### TC-AMD-003: Non-admin role is denied access to Master Data Types

- Requirement ID: AMD-REQ-003
- Priority: P1 Must-Test
- Test Type: Negative
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: Authenticated session with a non-Admin role (e.g. Ops user or Client user)
- Test Data: Non-admin session token; URL: `http://localhost:3000/admin/master-data-types`
- Steps:
  1. Authenticate as a non-admin user
  2. Navigate to `http://localhost:3000/admin/master-data-types`
  3. Observe response (UI and network)
- Expected Result: Access denied; a 403 page or redirect away from the admin route; no Master Data Types content is visible
- Flow Code: AMD-F-AUTH-003
- Notes: Requires role fixtures or a separate non-admin test user. Server-side enforcement must be tested via direct API call in addition to UI routing.

---

#### TC-AMD-004: Non-admin role is denied access to Master Data page

- Requirement ID: AMD-REQ-003
- Priority: P1 Must-Test
- Test Type: Negative
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: Authenticated session with a non-Admin role
- Test Data: Non-admin session token; URL: `http://localhost:3000/admin/master-data`
- Steps:
  1. Authenticate as a non-admin user
  2. Navigate to `http://localhost:3000/admin/master-data`
  3. Observe response
- Expected Result: Access denied; no Master Data content visible; 403 or redirect
- Flow Code: AMD-F-AUTH-004
- Notes: Same dependency as TC-AMD-003.

---

#### TC-AMD-005: Session expiry auto-logs admin out and redirects to login

- Requirement ID: AMD-REQ-002
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: Active admin session on Master Data Types page
- Test Data: Force-expire mechanism (clear session cookie or backend TTL trigger)
- Steps:
  1. Log in as Admin and navigate to `http://localhost:3000/admin/master-data-types`
  2. Force-expire the session (clear session cookie or trigger backend expiry)
  3. Perform any page action (e.g. click Add Type or navigate to another route)
  4. Observe behavior and URL
- Expected Result: Admin is auto-logged out; browser redirects to `http://localhost:3000/login`; no master data content accessible post-expiry
- Flow Code: AMD-F-AUTH-005
- Notes: Mid-form expiry (session expires while side sheet is open) is tested separately in TC-AMD-082.

---

#### TC-AMD-006: Server rejects direct API PATCH to mutate a saved Type Code

- Requirement ID: AMD-REQ-004
- Priority: P1 Must-Test
- Test Type: Data Integrity
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: At least one saved master data type exists; API endpoint accessible
- Test Data: Saved type ID; PATCH payload: `{ "slug": "mutated_code" }`
- Steps:
  1. Retrieve the `id` and current `slug` of a saved type (e.g. `account_type`)
  2. Send `PATCH http://localhost:3000/api/admin/master-data/types/:id` with body `{ "slug": "mutated_code" }`
  3. Inspect API response status and body
  4. `GET` the type and verify `slug` value
- Expected Result: API returns HTTP 400 or 422 with an error message; `slug` remains unchanged after the PATCH attempt
- Flow Code: AMD-F-AUTH-006
- Notes: Blocked until `api.md` is provided. Endpoint path is inferred. Verifies QR-003.

---

### Master Data Types — List & Page Structure

#### TC-AMD-007: Master Data Types list shows all required columns with correct data

- Requirement ID: AMD-REQ-005
- Priority: P1 Must-Test
- Test Type: UI
- Automation Readiness: Auto-Ready
- Screenshot Reference: `01_MDT_default-list.png`, `01_master-data-types_default-list.png`
- Preconditions: Admin logged in; seed data deployed (at least 4 types)
- Test Data: Account Type, Document Type, Rejection Reason, Query Category
- Steps:
  1. Navigate to `http://localhost:3000/admin/master-data-types`
  2. Verify the page URL is `http://localhost:3000/admin/master-data-types`
  3. Inspect the table header row
  4. Inspect each seeded type row for all columns
- Expected Result: Table renders the columns — Name, Type Code, Entries (count + link), Status chip, Active toggle, Edit action icon; all seeded types appear as rows with correct data
- Flow Code: AMD-F-MDT-LIST-001
- Notes: —

---

#### TC-AMD-008: Master Data Types table pagination controls present and functional

- Requirement ID: AMD-REQ-006
- Priority: P2 Should-Test
- Test Type: UI
- Automation Readiness: Partial
- Screenshot Reference: `01_MDT_default-list.png`
- Preconditions: Admin logged in; more than 10 types exist (create extra beyond seed)
- Test Data: 11+ master data types in the system
- Steps:
  1. Navigate to `http://localhost:3000/admin/master-data-types`
  2. Verify pagination control is visible at table bottom
  3. Change rows-per-page to 25
  4. Navigate to page 2
- Expected Result: Pagination shows options [10, 25, 50]; rows-per-page change refreshes displayed rows; page navigation works without error
- Flow Code: AMD-F-MDT-LIST-002
- Notes: Production dataset size unknown. Requires creating >10 types beyond the 4–5 seeded.

---

#### TC-AMD-009: Empty state shows correct heading, body, and Add Type CTA

- Requirement ID: AMD-REQ-007
- Priority: P2 Should-Test
- Test Type: UI
- Automation Readiness: Partial
- Screenshot Reference: `09_MDT_empty-state.png`
- Preconditions: Admin logged in; no master data types exist in the database
- Test Data: Clean environment with no seeded types
- Steps:
  1. Navigate to `http://localhost:3000/admin/master-data-types` with no types in DB
  2. Inspect the table body area
- Expected Result: Empty state renders inside the table body; documented heading text, body copy, and "Add Type" CTA button are all visible; the CTA opens the Create side sheet when clicked
- Flow Code: AMD-F-MDT-LIST-003
- Notes: Requires environment without seed data.

---

### Master Data Types — Create

#### TC-AMD-010: Add Type button opens Create side sheet

- Requirement ID: AMD-REQ-008
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: `02_MDT_sheet-create-empty.png`, `03_master-data-types_sheet-create-open.png`
- Preconditions: Admin logged in on Master Data Types page
- Test Data: —
- Steps:
  1. Navigate to `http://localhost:3000/admin/master-data-types`
  2. Click the "Add Type" button in the page header (top-right)
  3. Observe the side sheet behavior
- Expected Result: Create New Master Data Type side sheet slides in from the right; sheet shows Name field, Type Code field with helper text "Auto-generated. Cannot be changed after saving.", and Save + Cancel in a pinned footer; all fields are empty; URL does not change
- Flow Code: AMD-F-MDT-CREATE-001
- Notes: —

---

#### TC-AMD-011: Create master data type — happy path end-to-end

- Requirement ID: AMD-REQ-008, AMD-REQ-013
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: `04_MDT_sheet-create-filled.png`
- Preconditions: Admin logged in; unique type name available
- Test Data: Name: `Test Category Alpha`, expected Type Code: `test_category_alpha`
- Steps:
  1. Navigate to `http://localhost:3000/admin/master-data-types`
  2. Click "Add Type"
  3. Enter `Test Category Alpha` in the Name field
  4. Verify Type Code auto-fills to `test_category_alpha`
  5. Click Save
  6. Observe side sheet and types table
- Expected Result: Side sheet closes; `Test Category Alpha` row appears in the table with Status chip = Active, toggle = ON; new type is immediately usable as a tab on the Master Data page
- Flow Code: AMD-F-MDT-CREATE-002
- Notes: —

---

#### TC-AMD-012: Create type — Name field is required

- Requirement ID: AMD-REQ-009
- Priority: P1 Must-Test
- Test Type: Validation
- Automation Readiness: Auto-Ready
- Screenshot Reference: `02_MDT_sheet-create-empty.png`, `03_MDT_sheet-create-validation-errors.png`
- Preconditions: Admin logged in; Create side sheet open
- Test Data: Name: (empty)
- Steps:
  1. Open Create side sheet via Add Type
  2. Leave Name field blank (do not type anything)
  3. Click Save
  4. Inspect field error
- Expected Result: Inline error message "Name is required" appears below the Name field; Save does not proceed; side sheet remains open
- Flow Code: AMD-F-MDT-CREATE-003
- Notes: —

---

#### TC-AMD-013: Create type — Type Code field is required

- Requirement ID: AMD-REQ-009
- Priority: P1 Must-Test
- Test Type: Validation
- Automation Readiness: Auto-Ready
- Screenshot Reference: `03_MDT_sheet-create-validation-errors.png`, `04_master-data-types_sheet-create-validation.png`
- Preconditions: Admin logged in; Create side sheet open
- Test Data: Name: `Temp Name`, Type Code: manually cleared after auto-generation
- Steps:
  1. Open Create side sheet
  2. Enter `Temp Name` so Type Code auto-generates to `temp_name`
  3. Manually clear the Type Code field
  4. Click Save
  5. Inspect field error
- Expected Result: Inline validation error appears on the Type Code field indicating it is required; Save does not proceed; sheet remains open
- Flow Code: AMD-F-MDT-CREATE-004
- Notes: Error string for empty Type Code is undocumented — assert that an error is shown, not a specific message string.

---

#### TC-AMD-014: Type Code auto-generates from Name using the documented transformation rule

- Requirement ID: AMD-REQ-010
- Priority: P1 Must-Test
- Test Type: Validation
- Automation Readiness: Auto-Ready
- Screenshot Reference: `04_MDT_sheet-create-filled.png`
- Preconditions: Admin logged in; Create side sheet open
- Test Data:
  | Name Input | Expected Type Code |
  |---|---|
  | `Account Type` | `account_type` |
  | `Non-Individual` | `non_individual` |
  | `PAN Card` | `pan_card` |
  | `KYC failure` | `kyc_failure` |
  | `  Board Resolution  ` (leading/trailing spaces) | `board_resolution` |
  | `Type 2` | `type_2` |
  | `GST Certificate` | `gst_certificate` |
- Steps:
  1. Open Create side sheet
  2. For each Name input, type the value in the Name field
  3. Read the auto-generated Type Code value before Save
  4. Verify against expected code
- Expected Result: Each Name produces the documented code — `toLowerCase → trim → spaces to underscores → strip non-[a-z0-9_] → collapse underscores → strip leading/trailing underscores`
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
  | Name Input | Expected / Observed Behavior |
  |---|---|
  | `@#$` (all special chars) | Empty string → save should be blocked |
  | `   ` (spaces only) | Empty string → save should be blocked |
  | `A` (single char) | `a` |
  | `account_type` (already snake_case) | `account_type` unchanged |
  | 110-character name | No crash; code generated within limits |
  | `Aadhāār` (non-ASCII) | Behavior unspecified — assert no crash, record output |
- Steps:
  1. Open Create side sheet
  2. For each test input, enter as Name
  3. Read auto-generated Type Code
  4. Attempt Save and observe
- Expected Result: All-special-character and spaces-only inputs result in inline validation error (no crash); single char and pre-snake_case inputs work correctly; non-ASCII and long inputs do not crash the page
- Flow Code: AMD-F-MDT-CREATE-006
- Notes: Assertions for unspecified cases are marked as "record actual behavior" (Gap-011). Results feed into spec clarification.

---

#### TC-AMD-016: Type Code is editable before the first save

- Requirement ID: AMD-REQ-011
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: `03_master-data-types_sheet-create-open.png`, `04_MDT_sheet-create-filled.png`
- Preconditions: Admin logged in; Create side sheet open with a Name entered
- Test Data: Name: `Sample Type`, auto-code: `sample_type`, override: `custom_code_01`
- Steps:
  1. Open Create side sheet
  2. Enter `Sample Type` as Name
  3. Click into the Type Code field and clear `sample_type`
  4. Type `custom_code_01`
  5. Click Save
  6. Verify the row in the types table
- Expected Result: Type is created with Type Code `custom_code_01`; table row shows this custom code; the override is respected
- Flow Code: AMD-F-MDT-CREATE-007
- Notes: —

---

#### TC-AMD-017: Duplicate Type Code shows inline error and blocks Save

- Requirement ID: AMD-REQ-012
- Priority: P1 Must-Test
- Test Type: Validation
- Automation Readiness: Auto-Ready
- Screenshot Reference: `04_MDT_sheet-create-filled.png`
- Preconditions: A type with code `account_type` already exists (seeded)
- Test Data: Name: `Account Types`, Type Code: `account_type` (duplicate)
- Steps:
  1. Open Create side sheet
  2. Enter a Name that generates or manually enter `account_type` in Type Code field
  3. Click Save
  4. Inspect Type Code field
- Expected Result: Inline error "This code is already in use" appears on the Type Code field; Save button is disabled or blocked; sheet stays open
- Flow Code: AMD-F-MDT-CREATE-008
- Notes: This is client-side validation only. Server-side concurrent race condition is tested in TC-AMD-087.

---

#### TC-AMD-018: Cancel type creation closes sheet without saving

- Requirement ID: AMD-REQ-014
- Priority: P2 Should-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: —
- Preconditions: Admin logged in; Create side sheet open with partially filled data
- Test Data: Name: `Unsaved Type`, Type Code: `unsaved_type`
- Steps:
  1. Open Create side sheet
  2. Enter `Unsaved Type` and observe Type Code auto-fill
  3. Click Cancel in the sheet footer
  4. Inspect the types table
- Expected Result: Side sheet closes; no new type row appears in the table; original table state is unchanged
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
- Preconditions: Admin logged in; at least one type exists (e.g. Account Type)
- Test Data: Account Type (code: `account_type`, Status: Active)
- Steps:
  1. Navigate to `http://localhost:3000/admin/master-data-types`
  2. Click the edit icon on the Account Type row
  3. Inspect all fields in the side sheet
- Expected Result: Edit side sheet slides in pre-filled — Name = "Account Type", Type Code = `account_type` (read-only, lock icon), Status toggle = ON; subtitle "Changes take effect immediately across the platform." is visible; URL does not change
- Flow Code: AMD-F-MDT-EDIT-001
- Notes: —

---

#### TC-AMD-020: Saved Type Code is read-only with lock icon and helper text in Edit sheet

- Requirement ID: AMD-REQ-016
- Priority: P1 Must-Test
- Test Type: UI
- Automation Readiness: Auto-Ready
- Screenshot Reference: `05_MDT_sheet-edit-open.png`
- Preconditions: Edit side sheet open for any saved type
- Test Data: Any existing type
- Steps:
  1. Open Edit side sheet for any type
  2. Attempt to click or focus the Type Code field
  3. Inspect for lock icon and helper text
  4. Attempt keyboard input into the field
- Expected Result: Type Code field is non-interactive (cannot be focused or edited); lock icon is displayed; helper text reads "Cannot be changed after saving."; any keyboard input has no effect
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
- Test Data: Existing type Name → new Name: `Account Types Updated`
- Steps:
  1. Navigate to `http://localhost:3000/admin/master-data-types`
  2. Open Edit side sheet for Account Type
  3. Clear the Name field and enter `Account Types Updated`
  4. Click Save
  5. Inspect the table row
- Expected Result: Side sheet closes; the Account Type row now shows `Account Types Updated` as Name; Type Code (`account_type`) is unchanged; Status is unchanged
- Flow Code: AMD-F-MDT-EDIT-003
- Notes: Restore original name after test to keep test data clean.

---

### Master Data Types — Deactivation (No Active Entries)

#### TC-AMD-022: Row toggle OFF with no active entries shows simple deactivation popup

- Requirement ID: AMD-REQ-018
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: `06_MDT_sheet-edit-inactive.png`
- Preconditions: A type with zero active entries exists (create a type with no entries, or deactivate all entries under a type)
- Test Data: Type with 0 active entries
- Steps:
  1. Navigate to `http://localhost:3000/admin/master-data-types`
  2. Toggle OFF the Active switch for the type with no active entries
  3. Observe popup appearance
- Expected Result: A non-dismissible confirmation popup appears centered on the viewport — title "Deactivate type?", body copy, two buttons: "Deactivate" (destructive/red) and "Cancel"; no entry count mentioned in popup body
- Flow Code: AMD-F-MDT-DEACT-001
- Notes: —

---

#### TC-AMD-023: Confirm simple deactivation makes type inactive

- Requirement ID: AMD-REQ-018
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: —
- Preconditions: Simple deactivation popup is open (TC-AMD-022 state)
- Test Data: Same type as TC-AMD-022
- Steps:
  1. From the deactivation popup, click the "Deactivate" button
  2. Inspect the type row in the table
- Expected Result: Popup closes; type row shows Status chip = Inactive, toggle = OFF; no entries are affected; change is reflected immediately
- Flow Code: AMD-F-MDT-DEACT-002
- Notes: —

---

#### TC-AMD-024: Cancel simple deactivation reverts toggle to ON with no changes

- Requirement ID: AMD-REQ-019
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: —
- Preconditions: Simple deactivation popup is open
- Test Data: Same type as TC-AMD-022
- Steps:
  1. From the deactivation popup, click "Cancel"
  2. Inspect the type row
- Expected Result: Popup closes; toggle reverts to ON (Active); Status chip remains Active; no data changes occurred
- Flow Code: AMD-F-MDT-DEACT-003
- Notes: —

---

#### TC-AMD-025: Deactivation popup is not dismissible by clicking the overlay

- Requirement ID: AMD-REQ-018 (BR-012)
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: `08_MDT_popup-deactivate-cascade-row-toggle.png`
- Preconditions: Any deactivation popup (simple or cascade) is visible
- Test Data: —
- Steps:
  1. Trigger any deactivation popup (type or entry)
  2. Click the overlay/backdrop area directly outside the popup boundaries
  3. Observe popup state and data
- Expected Result: Popup remains open; no dismiss action occurs; no data changes
- Flow Code: AMD-F-MDT-DEACT-004
- Notes: Also applies to the entry deactivation popup — verify both.

---

#### TC-AMD-026: Edit sheet Save with Status OFF and no active entries shows simple popup

- Requirement ID: AMD-REQ-018
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: `06_MDT_sheet-edit-inactive.png`
- Preconditions: Type with zero active entries; Edit side sheet open
- Test Data: Same type (0 active entries)
- Steps:
  1. Open Edit side sheet for the type with no active entries
  2. Toggle the Status switch to OFF (Inactive)
  3. Click Save
  4. Observe popup
- Expected Result: Simple deactivation popup appears; confirming deactivates the type; canceling restores Status toggle to ON inside the sheet; sheet stays open on Cancel
- Flow Code: AMD-F-MDT-DEACT-005
- Notes: —

---

### Master Data Types — Cascade Deactivation

#### TC-AMD-027: Row toggle OFF with active entries shows cascade warning popup

- Requirement ID: AMD-REQ-020
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: `07_MDT_popup-deactivate-cascade-from-sheet.png`, `08_MDT_popup-deactivate-cascade-row-toggle.png`
- Preconditions: Admin logged in; a type with at least one active entry (e.g. Account Type with 7 active entries)
- Test Data: Account Type (7 active entries)
- Steps:
  1. Navigate to `http://localhost:3000/admin/master-data-types`
  2. Toggle OFF the Active switch for Account Type
  3. Inspect the popup
- Expected Result: Cascade warning popup appears — title "Deactivate type?", body includes "This will also deactivate **7 entries** under this type."; two buttons: "Deactivate all" (destructive) and "Cancel"; popup is centered and non-dismissible
- Flow Code: AMD-F-MDT-DEACT-006
- Notes: —

---

#### TC-AMD-028: Cascade popup entry count reflects only currently active entries

- Requirement ID: AMD-REQ-020 (EC-001)
- Priority: P1 Must-Test
- Test Type: Data Integrity
- Automation Readiness: Auto-Ready
- Screenshot Reference: `07_MDT_popup-deactivate-cascade-from-sheet.png`
- Preconditions: A type has 5 total entries — 2 already inactive, 3 active
- Test Data: Type with 5 entries: 2 pre-deactivated, 3 active
- Steps:
  1. Pre-deactivate 2 entries under the target type
  2. Navigate to `http://localhost:3000/admin/master-data-types`
  3. Toggle OFF the type
  4. Read the entry count `[N]` in the cascade popup
- Expected Result: Popup shows N = 3 (active entries only, not total 5)
- Flow Code: AMD-F-MDT-DEACT-007
- Notes: Tests EC-001 specifically. The live count must not be stale.

---

#### TC-AMD-029: Confirming cascade deactivation atomically deactivates type and all active entries

- Requirement ID: AMD-REQ-021
- Priority: P1 Must-Test
- Test Type: Data Integrity
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: Type with multiple active entries; cascade popup open
- Test Data: A type with 3 active entries
- Steps:
  1. Trigger cascade popup for a type with 3 active entries
  2. Click "Deactivate all"
  3. Navigate to `http://localhost:3000/admin/master-data?type=<typeCode>`
  4. Inspect all entries under the now-inactive type
- Expected Result: Type Status = Inactive; all 3 previously active entries show Status = Inactive; no entries remain Active; operation is all-or-nothing (atomicity)
- Flow Code: AMD-F-MDT-DEACT-008
- Notes: Full atomicity verification requires API-level or DB-level check. Partially testable via UI state post-action.

---

#### TC-AMD-030: Cancel cascade deactivation reverts toggle and leaves all data unchanged

- Requirement ID: AMD-REQ-019
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: —
- Preconditions: Cascade deactivation popup is open
- Test Data: Any type with active entries
- Steps:
  1. Trigger cascade popup for a type with active entries
  2. Click "Cancel"
  3. Inspect the type row and entries
- Expected Result: Popup closes; type toggle reverts to ON; Status = Active; all entries retain their previous state; no data changes
- Flow Code: AMD-F-MDT-DEACT-009
- Notes: —

---

### Master Data Types — Reactivation

#### TC-AMD-031: Reactivating a type is immediate with no popup required

- Requirement ID: AMD-REQ-022
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: —
- Preconditions: At least one inactive type exists
- Test Data: Any inactive master data type
- Steps:
  1. Navigate to `http://localhost:3000/admin/master-data-types`
  2. Toggle ON the Active switch for an inactive type
  3. Observe behavior
- Expected Result: No popup or confirmation dialog appears; type Status changes immediately to Active; toggle remains ON; the type becomes visible as a tab on the Master Data page
- Flow Code: AMD-F-MDT-REACT-001
- Notes: —

---

#### TC-AMD-032: Reactivating a cascade-deactivated type does not auto-reactivate its entries

- Requirement ID: AMD-REQ-023 (EC-002)
- Priority: P1 Must-Test
- Test Type: Data Integrity
- Automation Readiness: Auto-Ready
- Screenshot Reference: —
- Preconditions: A type was cascade-deactivated (type + all entries are inactive)
- Test Data: Type with 4 entries, all cascade-deactivated
- Steps:
  1. Confirm the type and all 4 entries are Inactive
  2. Navigate to `http://localhost:3000/admin/master-data-types`
  3. Toggle ON the type
  4. Navigate to `http://localhost:3000/admin/master-data` and select the now-active type tab
  5. Inspect each entry's Status
- Expected Result: Type Status = Active; all 4 entries remain Inactive; no entries auto-reactivated; admin must reactivate each entry individually
- Flow Code: AMD-F-MDT-REACT-002
- Notes: Critical regression risk (BR-006). Must be run after every cascade-deactivation-related code change.

---

### Master Data Types — Entries Deep-Link

#### TC-AMD-033: Entries link navigates to correct Master Data URL with type pre-selected

- Requirement ID: AMD-REQ-024
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: `11_MD_deeplink-document-type.png`
- Preconditions: Admin logged in; Document Type exists with entries
- Test Data: Document Type (code: `document_type`, 8 entries)
- Steps:
  1. Navigate to `http://localhost:3000/admin/master-data-types`
  2. Locate Document Type row
  3. Click the "N entries →" link
  4. Observe URL and active tab
- Expected Result: URL changes to `http://localhost:3000/admin/master-data?type=document_type`; Document Type tab is pre-selected and highlighted; entries table shows Document Type entries
- Flow Code: AMD-F-MDT-NAV-001
- Notes: —

---

### Master Data — Page Structure & Tab Behavior

#### TC-AMD-034: Master Data page shows one tab per active type only

- Requirement ID: AMD-REQ-025
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: `10_MD_default-first-tab.png`, `12_MD_tab-rejection-reason.png`, `13_MD_tab-query-category.png`
- Preconditions: Admin logged in; 4 active seeded types deployed
- Test Data: Account Type, Document Type, Rejection Reason, Query Category (all active)
- Steps:
  1. Navigate to `http://localhost:3000/admin/master-data`
  2. Verify URL is `http://localhost:3000/admin/master-data`
  3. Count the tabs and inspect their labels
- Expected Result: Exactly 4 tabs visible — one per active type; no inactive type tabs shown; tab labels match the type Names
- Flow Code: AMD-F-MD-TABS-001
- Notes: —

---

#### TC-AMD-035: Deep-link pre-selects the matching type tab

- Requirement ID: AMD-REQ-026
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: `09_master-data_deep-link-document-type.png`, `11_MD_deeplink-document-type.png`
- Preconditions: Admin logged in; Document Type is active
- Test Data: URL: `http://localhost:3000/admin/master-data?type=document_type`
- Steps:
  1. Navigate directly to `http://localhost:3000/admin/master-data?type=document_type`
  2. Verify URL in browser address bar
  3. Inspect active tab
  4. Inspect entries table content
- Expected Result: URL is `http://localhost:3000/admin/master-data?type=document_type`; Document Type tab is highlighted and active; entries table shows Document Type entries (8 items)
- Flow Code: AMD-F-MD-TABS-002
- Notes: —

---

#### TC-AMD-036: No query param defaults to the first active type tab

- Requirement ID: AMD-REQ-027
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: `10_MD_default-first-tab.png`, `08_master-data_default.png`
- Preconditions: Admin logged in; multiple active types exist
- Test Data: URL: `http://localhost:3000/admin/master-data` (no query param)
- Steps:
  1. Navigate to `http://localhost:3000/admin/master-data` with no `?type=` parameter
  2. Observe which tab is selected
  3. Inspect the entries table
- Expected Result: First active type tab (by sort order) is selected; entries for that type are shown; URL may or may not update with `?type=` (record actual behavior)
- Flow Code: AMD-F-MD-TABS-003
- Notes: "First" is defined by type sort order — which is ambiguous (Gap-004). Record observed default.

---

#### TC-AMD-037: Deep-link to an inactive type — spec vs FE behavior verification

- Requirement ID: AMD-REQ-026 (BR-010, EC-003)
- Priority: P1 Must-Test
- Test Type: Edge
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: A type is deactivated (e.g. Rejection Reason)
- Test Data: URL: `http://localhost:3000/admin/master-data?type=rejection_reason` where `rejection_reason` is inactive
- Steps:
  1. Deactivate the Rejection Reason type
  2. Navigate to `http://localhost:3000/admin/master-data?type=rejection_reason`
  3. Inspect the tab strip and content area
- Expected Result (per spec — BR-010): Tab for Rejection Reason still renders but is visually marked inactive; entries listed with inactive visual state. Note: FE prototype may only tab active types — the tab may not appear at all. Record actual behavior.
- Flow Code: AMD-F-MD-TABS-004
- Notes: Confirmed spec/FE discrepancy. Result must be raised for resolution with dev team.

---

#### TC-AMD-038: Deep-link to a nonexistent type slug

- Requirement ID: AMD-REQ-026
- Priority: P1 Must-Test
- Test Type: Edge
- Automation Readiness: Auto-Ready
- Screenshot Reference: —
- Preconditions: Admin logged in
- Test Data: URL: `http://localhost:3000/admin/master-data?type=nonexistent_xyz_slug`
- Steps:
  1. Navigate to `http://localhost:3000/admin/master-data?type=nonexistent_xyz_slug`
  2. Observe tab selection, page state, and console errors
- Expected Result: Page does not crash or show an error screen; either defaults to the first active tab or shows an appropriate empty/error state; behavior recorded for spec alignment
- Flow Code: AMD-F-MD-TABS-005
- Notes: Expected behavior is undocumented. Record actual result.

---

#### TC-AMD-039: Tab ordering reflects type sort order

- Requirement ID: AMD-REQ-028
- Priority: P2 Should-Test
- Test Type: Functional
- Automation Readiness: Partial
- Screenshot Reference: `10_MD_default-first-tab.png`
- Preconditions: Multiple active types with known creation order
- Test Data: Seeded types in documented seed order
- Steps:
  1. Navigate to `http://localhost:3000/admin/master-data`
  2. Record the order of tabs left-to-right
  3. Compare against expected type sort order
  4. Refresh page and confirm order is stable
- Expected Result: Tabs appear in the order defined by `type sort_order`; order is consistent across page refreshes
- Flow Code: AMD-F-MD-TABS-006
- Notes: Type `sort_order` assignment mechanism is undocumented (Gap-004). Record observed order as baseline.

---

### Master Data — Entries List

#### TC-AMD-040: Entries table shows all required columns for the selected type

- Requirement ID: AMD-REQ-029
- Priority: P1 Must-Test
- Test Type: UI
- Automation Readiness: Auto-Ready
- Screenshot Reference: `10_MD_default-first-tab.png`, `10_master-data_tab-account-type.png`
- Preconditions: Admin logged in; Account Type tab selected
- Test Data: Account Type (7 entries)
- Steps:
  1. Navigate to `http://localhost:3000/admin/master-data`
  2. Select the Account Type tab (or confirm it is selected by default)
  3. Inspect the table header and entry rows
- Expected Result: Table renders columns — Label, Entry Code, Sort Order, Status chip, Active toggle, Drag handle, Edit action icon; all 7 Account Type entries appear as rows
- Flow Code: AMD-F-MD-LIST-001
- Notes: —

---

#### TC-AMD-041: Empty state per tab shows correct heading, body, and Add Entry CTA

- Requirement ID: AMD-REQ-030
- Priority: P2 Should-Test
- Test Type: UI
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: An active type exists with no entries
- Test Data: A newly created type with no entries
- Steps:
  1. Create a new master data type (no entries added)
  2. Navigate to `http://localhost:3000/admin/master-data`
  3. Select the new type's tab
  4. Inspect the table body
- Expected Result: Empty state renders inside the table body — documented heading, body copy, and "Add Entry" CTA button; CTA button opens Create Entry side sheet when clicked
- Flow Code: AMD-F-MD-LIST-002
- Notes: —

---

### Master Data — Create Entry

#### TC-AMD-042: Add Entry opens Create side sheet with type pre-selected from active tab

- Requirement ID: AMD-REQ-031
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: `14_MD_sheet-create-empty.png`
- Preconditions: Admin logged in; Account Type tab is active
- Test Data: —
- Steps:
  1. Navigate to `http://localhost:3000/admin/master-data` with Account Type tab active
  2. Click "Add Entry" button
  3. Inspect the side sheet
- Expected Result: Create New Master Data Entry side sheet opens; Type dropdown is pre-selected to "Account Type"; Label, Entry Code (with helper text), Sort Order fields are empty; Save + Cancel in pinned footer; URL does not change
- Flow Code: AMD-F-MD-CREATE-001
- Notes: —

---

#### TC-AMD-043: Create entry — happy path end-to-end

- Requirement ID: AMD-REQ-031, AMD-REQ-037
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: `16_MD_sheet-create-filled.png`
- Preconditions: Admin logged in; Account Type tab active
- Test Data: Type: Account Type, Label: `Test Entity`, Entry Code: `test_entity` (auto-generated)
- Steps:
  1. Navigate to `http://localhost:3000/admin/master-data`; select Account Type tab
  2. Click "Add Entry"
  3. Enter `Test Entity` in the Label field
  4. Verify Entry Code auto-fills to `test_entity`
  5. Click Save
  6. Inspect the entries table
- Expected Result: Side sheet closes; `Test Entity` row appears in the Account Type list with Status = Active, toggle = ON; Sort Order defaults to end of list
- Flow Code: AMD-F-MD-CREATE-002
- Notes: —

---

#### TC-AMD-044: Create entry — Label is required

- Requirement ID: AMD-REQ-032
- Priority: P1 Must-Test
- Test Type: Validation
- Automation Readiness: Auto-Ready
- Screenshot Reference: `14_MD_sheet-create-empty.png`, `15_MD_sheet-create-validation-errors.png`
- Preconditions: Create Entry side sheet open
- Test Data: Label: (empty)
- Steps:
  1. Open Create Entry side sheet
  2. Leave Label blank
  3. Click Save
  4. Inspect field error
- Expected Result: Inline error "Label is required" below the Label field; Save does not proceed; sheet remains open
- Flow Code: AMD-F-MD-CREATE-003
- Notes: —

---

#### TC-AMD-045: Create entry — Entry Code is required

- Requirement ID: AMD-REQ-032
- Priority: P1 Must-Test
- Test Type: Validation
- Automation Readiness: Auto-Ready
- Screenshot Reference: `15_MD_sheet-create-validation-errors.png`
- Preconditions: Create Entry side sheet open
- Test Data: Label: `Some Label`, Entry Code: manually cleared
- Steps:
  1. Open Create Entry side sheet
  2. Enter a Label so Entry Code auto-generates
  3. Manually clear the Entry Code field
  4. Click Save
  5. Inspect field error
- Expected Result: Inline validation error on Entry Code field; Save blocked; sheet remains open
- Flow Code: AMD-F-MD-CREATE-004
- Notes: —

---

#### TC-AMD-046: Create entry — Type is required

- Requirement ID: AMD-REQ-032
- Priority: P1 Must-Test
- Test Type: Validation
- Automation Readiness: Partial
- Screenshot Reference: `15_MD_sheet-create-validation-errors.png`
- Preconditions: Create Entry side sheet open
- Test Data: Type dropdown cleared; Label and Entry Code filled
- Steps:
  1. Open Create Entry side sheet
  2. Clear the pre-selected Type dropdown (if the UI allows it)
  3. Enter a Label and Entry Code
  4. Click Save
- Expected Result: Inline validation error on Type field; Save blocked; sheet remains open
- Flow Code: AMD-F-MD-CREATE-005
- Notes: If the dropdown cannot be cleared by the UI, skip and note implementation as "Type always pre-selected."

---

#### TC-AMD-047: Entry Code auto-generates from Label using the same rule as Type Code

- Requirement ID: AMD-REQ-033
- Priority: P1 Must-Test
- Test Type: Validation
- Automation Readiness: Auto-Ready
- Screenshot Reference: `16_MD_sheet-create-filled.png`
- Preconditions: Create Entry side sheet open
- Test Data:
  | Label Input | Expected Entry Code |
  |---|---|
  | `Individual` | `individual` |
  | `Non-Individual` | `non_individual` |
  | `PAN Card` | `pan_card` |
  | `KYC failure` | `kyc_failure` |
  | `Board Resolution` | `board_resolution` |
  | `Incomplete KYC` | `incomplete_kyc` |
- Steps:
  1. Open Create Entry side sheet
  2. For each Label, enter the value and read the auto-generated Entry Code
- Expected Result: Each Label produces the correct Entry Code per the documented transformation rule
- Flow Code: AMD-F-MD-CREATE-006
- Notes: —

---

#### TC-AMD-048: Entry Code is editable before the first save

- Requirement ID: AMD-REQ-034
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: `16_MD_sheet-create-filled.png`
- Preconditions: Create Entry side sheet open
- Test Data: Label: `Custom Entry`, auto code: `custom_entry`, override: `my_custom_entry_code`
- Steps:
  1. Open Create Entry side sheet for Account Type
  2. Enter `Custom Entry` as Label
  3. Override Entry Code with `my_custom_entry_code`
  4. Click Save
  5. Inspect the entry row in the table
- Expected Result: Entry is saved with Entry Code `my_custom_entry_code`; table row shows this override code; Label = "Custom Entry"
- Flow Code: AMD-F-MD-CREATE-007
- Notes: —

---

#### TC-AMD-049: Duplicate Entry Code within the same type shows inline error

- Requirement ID: AMD-REQ-035
- Priority: P1 Must-Test
- Test Type: Validation
- Automation Readiness: Auto-Ready
- Screenshot Reference: —
- Preconditions: Entry with code `individual` exists under Account Type
- Test Data: Type: Account Type, Label: `Individual Alt`, Entry Code: `individual` (duplicate within Account Type)
- Steps:
  1. Open Create Entry side sheet for Account Type
  2. Enter or override Entry Code to `individual`
  3. Click Save
  4. Inspect field error
- Expected Result: Inline error "This code is already in use for this type" on Entry Code field; Save blocked; sheet stays open
- Flow Code: AMD-F-MD-CREATE-008
- Notes: Scope is per-type only. Cross-type same code is tested in TC-AMD-050.

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
  2. Enter Label `Individual` → verify code auto-generates to `individual`
  3. Click Save
- Expected Result: Entry is created successfully under Document Type with code `individual`; no duplicate error raised (uniqueness is scoped per type, not global)
- Flow Code: AMD-F-MD-CREATE-009
- Notes: —

---

#### TC-AMD-051: Sort Order defaults to end of list when left blank

- Requirement ID: AMD-REQ-036
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: —
- Preconditions: Account Type has 7 entries with Sort Orders 1–7
- Test Data: New entry with Sort Order field left blank
- Steps:
  1. Open Create Entry side sheet for Account Type
  2. Enter a unique Label; leave Sort Order blank
  3. Click Save
  4. Inspect the new entry's position and Sort Order value
- Expected Result: New entry appears at the end of the list with Sort Order = 8 (max existing + 1)
- Flow Code: AMD-F-MD-CREATE-010
- Notes: —

---

#### TC-AMD-052: Sort Order validation — boundary and invalid inputs

- Requirement ID: AMD-REQ-036 (EC-005)
- Priority: P1 Must-Test
- Test Type: Validation
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: Create Entry side sheet open
- Test Data:
  | Sort Order Input | Expected Behavior |
  |---|---|
  | `0` | Rejected (not a positive integer) or behavior documented |
  | `-1` | Rejected — negative not allowed |
  | `3.5` | Rejected — non-integer |
  | `abc` | Rejected — non-numeric |
  | `1` (duplicate of existing) | Behavior unspecified — record actual (shift or reject) |
  | `999999` | Accepted — no crash |
- Steps:
  1. Open Create Entry side sheet
  2. For each Sort Order value, enter and attempt Save
  3. Record validation message or actual behavior
- Expected Result: `0`, `-1`, `3.5`, `abc` → validation error or rejection; `999999` → accepted; duplicate sort order → behavior documented
- Flow Code: AMD-F-MD-CREATE-011
- Notes: Exact validation behavior for boundary values is unspecified (EC-005). Record actual behavior for spec alignment.

---

#### TC-AMD-053: Cancel entry creation closes sheet without saving

- Requirement ID: AMD-REQ-031
- Priority: P2 Should-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: —
- Preconditions: Create Entry side sheet open with data entered
- Test Data: Label: `Unsaved Entry`
- Steps:
  1. Open Create Entry side sheet for any type
  2. Enter `Unsaved Entry` in the Label field
  3. Click Cancel
  4. Inspect the entries table
- Expected Result: Side sheet closes; no new entry row appears; entries table is unchanged
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
- Preconditions: Admin logged in; Account Type tab active; "Individual" entry exists
- Test Data: Individual entry (Label: Individual, code: `individual`, Sort Order: 1)
- Steps:
  1. Navigate to `http://localhost:3000/admin/master-data`; select Account Type tab
  2. Click the edit icon on the "Individual" row
  3. Inspect all side sheet fields
- Expected Result: Edit Entry side sheet opens pre-filled — Type = "Account Type" (plain text, read-only), Label = "Individual", Entry Code = `individual` (read-only, lock icon), Sort Order = 1, Status = Active; subtitle "Changes take effect immediately across the platform." is visible
- Flow Code: AMD-F-MD-EDIT-001
- Notes: —

---

#### TC-AMD-055: Saved Entry Code is read-only with lock icon and helper text in Edit sheet

- Requirement ID: AMD-REQ-039
- Priority: P1 Must-Test
- Test Type: UI
- Automation Readiness: Auto-Ready
- Screenshot Reference: `17_MD_sheet-edit-open.png`
- Preconditions: Edit Entry side sheet open for any saved entry
- Test Data: Any existing entry
- Steps:
  1. Open Edit Entry side sheet for any entry
  2. Attempt to click or focus the Entry Code field
  3. Inspect for lock icon and helper text
  4. Try keyboard input into the field
- Expected Result: Entry Code is non-interactive; lock icon displayed; helper text "Cannot be changed after saving."; value cannot be changed by any keyboard or click input
- Flow Code: AMD-F-MD-EDIT-002
- Notes: —

---

#### TC-AMD-056: Entry Type is read-only plain text in Edit side sheet

- Requirement ID: AMD-REQ-040
- Priority: P1 Must-Test
- Test Type: UI
- Automation Readiness: Auto-Ready
- Screenshot Reference: `17_MD_sheet-edit-open.png`
- Preconditions: Edit Entry side sheet open
- Test Data: Any existing entry
- Steps:
  1. Open Edit Entry side sheet for any entry
  2. Inspect the Type field rendering
  3. Attempt to click or change the Type
- Expected Result: Type renders as plain read-only text (not a dropdown in edit mode); no interaction possible; entry cannot be moved to another type through the UI
- Flow Code: AMD-F-MD-EDIT-003
- Notes: —

---

#### TC-AMD-057: Admin can edit entry Label and Sort Order and save successfully

- Requirement ID: AMD-REQ-038
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: —
- Preconditions: An entry exists with known Label and Sort Order
- Test Data: Label: `Individual Updated`, Sort Order: `5`
- Steps:
  1. Navigate to `http://localhost:3000/admin/master-data`; select Account Type tab
  2. Open Edit Entry side sheet for "Individual"
  3. Change Label to `Individual Updated`
  4. Change Sort Order to `5`
  5. Click Save
  6. Inspect entry row
- Expected Result: Side sheet closes; row shows Label = `Individual Updated`, Sort Order = `5`; Entry Code and Type remain unchanged
- Flow Code: AMD-F-MD-EDIT-004
- Notes: Restore original values after test.

---

### Master Data — Deactivate Entry

#### TC-AMD-058: Row toggle OFF shows entry deactivation popup with bold entry label

- Requirement ID: AMD-REQ-041
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: `19_MD_popup-deactivate.png`
- Preconditions: Admin logged in; an active entry exists (e.g. "Individual" under Account Type)
- Test Data: Entry: "Individual"
- Steps:
  1. Navigate to `http://localhost:3000/admin/master-data`; select Account Type tab
  2. Toggle OFF the Active switch for "Individual"
  3. Inspect the popup
- Expected Result: Confirmation popup appears — title "Deactivate entry?", body includes **Individual** in bold and message "will no longer be available across the platform."; "Deactivate" (destructive) and "Cancel" buttons; popup is non-dismissible
- Flow Code: AMD-F-MD-DEACT-001
- Notes: —

---

#### TC-AMD-059: Confirm entry deactivation — entry shows inactive state in list

- Requirement ID: AMD-REQ-041, AMD-REQ-044
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: `20_MD_after-deactivate-row-inactive.png`
- Preconditions: Entry deactivation popup is open
- Test Data: "Individual" entry
- Steps:
  1. From the entry deactivation popup, click "Deactivate"
  2. Inspect the "Individual" row in the entries table
- Expected Result: Popup closes; "Individual" remains visible in the list with Status chip = Inactive, toggle = OFF, and reduced-opacity row styling; entry is not hidden
- Flow Code: AMD-F-MD-DEACT-002
- Notes: —

---

#### TC-AMD-060: Cancel entry deactivation reverts toggle to ON with no changes

- Requirement ID: AMD-REQ-042
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: —
- Preconditions: Entry deactivation popup is open for any active entry
- Test Data: Any active entry
- Steps:
  1. Toggle OFF an active entry to trigger the deactivation popup
  2. Click "Cancel"
  3. Inspect the entry row
- Expected Result: Popup closes; toggle reverts to ON; Status = Active; no data changes occurred
- Flow Code: AMD-F-MD-DEACT-003
- Notes: —

---

#### TC-AMD-061: Edit sheet Save with Status OFF shows entry deactivation popup

- Requirement ID: AMD-REQ-041
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: `18_MD_sheet-edit-inactive.png`
- Preconditions: Edit Entry side sheet open for an active entry
- Test Data: Any active entry
- Steps:
  1. Open Edit Entry side sheet for an active entry
  2. Toggle the Status switch to OFF (Inactive)
  3. Click Save
  4. Inspect popup
- Expected Result: Entry deactivation popup appears (same as TC-AMD-058); confirming deactivates; canceling restores Status toggle to ON inside the sheet; sheet stays open on Cancel
- Flow Code: AMD-F-MD-DEACT-004
- Notes: —

---

#### TC-AMD-062: Reactivating an entry is immediate with no popup

- Requirement ID: AMD-REQ-043
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: `21_MD_row-reactivated.png`
- Preconditions: An inactive entry exists in the current type tab
- Test Data: Any inactive entry
- Steps:
  1. Navigate to `http://localhost:3000/admin/master-data`; select the type tab containing the inactive entry
  2. Toggle ON the Active switch for the inactive entry
  3. Observe behavior
- Expected Result: No popup appears; entry Status immediately changes to Active; toggle stays ON; inactive visual treatment is removed from the row
- Flow Code: AMD-F-MD-DEACT-005
- Notes: —

---

#### TC-AMD-063: Inactive entries remain visible in list with reduced-opacity styling

- Requirement ID: AMD-REQ-044
- Priority: P2 Should-Test
- Test Type: UI
- Automation Readiness: Auto-Ready
- Screenshot Reference: `20_MD_after-deactivate-row-inactive.png`
- Preconditions: At least one inactive entry exists in any type tab
- Test Data: Any type with mixed active and inactive entries
- Steps:
  1. Navigate to `http://localhost:3000/admin/master-data`; select the type tab
  2. Inspect rows of inactive entries vs active entries
- Expected Result: Inactive entries are visible with Status chip = Inactive, toggle = OFF, reduced-opacity row styling; they are not hidden or removed
- Flow Code: AMD-F-MD-DEACT-006
- Notes: —

---

### Master Data — Drag-to-Reorder

#### TC-AMD-064: Drag-to-reorder persists immediately on drop without a Save action

- Requirement ID: AMD-REQ-045
- Priority: P1 Must-Test
- Test Type: Functional
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: Account Type tab active; at least 3 entries present
- Test Data: Account Type entries at Sort Orders 1–7
- Steps:
  1. Navigate to `http://localhost:3000/admin/master-data`; select Account Type tab
  2. Drag the entry at position 3 to position 1
  3. Release (drop) the entry
  4. Observe Sort Order values immediately after drop
  5. Refresh the page (`http://localhost:3000/admin/master-data`)
  6. Observe Sort Order after refresh
- Expected Result: Sort Order updates visually on drop without a Save; after page refresh the new order persists; no explicit Save button required
- Flow Code: AMD-F-MD-REORDER-001
- Notes: Persistence requires an API call on drop. Partially testable until API is confirmed.

---

#### TC-AMD-065: Drag handles visible only on single type tab, hidden otherwise

- Requirement ID: AMD-REQ-046
- Priority: P3 Nice-to-Test
- Test Type: UI
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: Multiple active types exist
- Test Data: Standard seeded types
- Steps:
  1. Navigate to `http://localhost:3000/admin/master-data`; single tab selected — inspect row drag handles
  2. Switch to a second tab; inspect drag handles again
  3. If a multi-type combined view exists, navigate to it and inspect
- Expected Result: Drag handles visible when exactly one type tab is active; hidden when no tab is active or a multi-tab/combined view is shown
- Flow Code: AMD-F-MD-REORDER-002
- Notes: Multi-type view is referenced but not fully specified (AMD-REQ-046). Record observations.

---

#### TC-AMD-066: Drag-reorder with a single entry does not error or break sort order

- Requirement ID: AMD-REQ-045
- Priority: P2 Should-Test
- Test Type: Edge
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: A type tab with exactly one entry
- Test Data: A type with one entry only
- Steps:
  1. Navigate to `http://localhost:3000/admin/master-data`; select the single-entry type tab
  2. Attempt to drag the single entry row
- Expected Result: No error or crash; drag handle is present; dragging has no visible effect (nowhere to move); no network error triggered
- Flow Code: AMD-F-MD-REORDER-003
- Notes: —

---

#### TC-AMD-067: Newly created entry after drag-reorder appends to end of sorted list

- Requirement ID: AMD-REQ-036, AMD-REQ-045
- Priority: P2 Should-Test
- Test Type: Regression
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: Entries have been drag-reordered; sort orders are non-sequential from original numbering
- Test Data: Post-reorder Account Type entries; new entry with no Sort Order specified
- Steps:
  1. Drag-reorder entries so positions are shuffled
  2. Open Create Entry side sheet for Account Type
  3. Enter a unique Label; leave Sort Order blank
  4. Save and observe new entry position
- Expected Result: New entry appears at the end of the list with Sort Order = max existing + 1, not at a stale default position
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
- Preconditions: Fresh deployment; seed migration has run
- Test Data: Expected seed — 4 documented types + 22 entries; SLA type per research.md (to be verified separately)
- Steps:
  1. Navigate to `http://localhost:3000/admin/master-data-types`
  2. Count types and verify Name and Type Code for each seeded type
  3. For each type, navigate to its tab on `http://localhost:3000/admin/master-data` and count/verify entries
- Expected Result:
  - Account Type (`account_type`): 7 entries — `individual`, `non_individual`, `company`, `fpo`, `trust`, `partnership`, `llp`
  - Document Type (`document_type`): 8 entries — `pan_card`, `aadhaar`, `photo`, `moa`, `board_resolution`, `gst_certificate`, `bank_statement`, `incorporation_certificate`
  - Rejection Reason (`rejection_reason`): 3 entries — `incomplete_kyc`, `document_mismatch`, `blacklisted_entity`
  - Query Category (`query_category`): 4 entries — `document_quality_issue`, `field_mismatch`, `missing_document`, `kyc_failure`
  - SLA (`sla`): verify if tab exists; entry codes unspecified (Gap-002)
- Flow Code: AMD-F-INT-001
- Notes: Empty state on Master Data Types after a fresh deployment is a critical blocker signal (EC-012).

---

#### TC-AMD-069: Deactivated Account Type entry disappears from Client Portal account type selection

- Requirement ID: AMD-REQ-049
- Priority: P1 Must-Test
- Test Type: E2E
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: Integrated environment with Client Portal; `individual` entry is active
- Test Data: Deactivate `individual` entry under Account Type
- Steps:
  1. Navigate to `http://localhost:3000/admin/master-data`; select Account Type tab
  2. Deactivate the "Individual" entry
  3. Open Client Portal → application form → account type selection dropdown
- Expected Result: "Individual" is no longer available in the Client Portal account type dropdown; all other account types remain
- Flow Code: AMD-F-INT-002
- Notes: Requires integrated environment. Partially testable in isolation.

---

#### TC-AMD-070: Deactivated Document Type entry disappears from document upload checklists

- Requirement ID: AMD-REQ-050
- Priority: P1 Must-Test
- Test Type: E2E
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: Integrated environment; `pan_card` entry is active
- Test Data: Deactivate `pan_card` entry under Document Type
- Steps:
  1. Navigate to `http://localhost:3000/admin/master-data`; select Document Type tab
  2. Deactivate "PAN Card" entry
  3. Open Client Portal → document upload section; check for PAN Card in checklist
  4. Open Configuration → Document Rules; check for PAN Card in document type options
- Expected Result: "PAN Card" is no longer available in either the Client Portal document upload checklist or the Configuration document rules surface
- Flow Code: AMD-F-INT-003
- Notes: —

---

#### TC-AMD-071: Deactivated Rejection Reason removed from Ops Portal decision dropdown

- Requirement ID: AMD-REQ-051
- Priority: P1 Must-Test
- Test Type: E2E
- Automation Readiness: Partial
- Screenshot Reference: `12_MD_tab-rejection-reason.png`
- Preconditions: Integrated Ops Portal; `incomplete_kyc` entry is active
- Test Data: Deactivate `incomplete_kyc` under Rejection Reason
- Steps:
  1. Navigate to `http://localhost:3000/admin/master-data`; select Rejection Reason tab
  2. Deactivate "Incomplete KYC" entry
  3. Open Ops Portal → reviewer decision flow → rejection reason dropdown
- Expected Result: "Incomplete KYC" is absent from the Ops Portal rejection reason dropdown
- Flow Code: AMD-F-INT-004
- Notes: —

---

#### TC-AMD-072: Deactivated Query Category removed from Ops Portal query creation dropdown

- Requirement ID: AMD-REQ-051
- Priority: P1 Must-Test
- Test Type: E2E
- Automation Readiness: Partial
- Screenshot Reference: `13_MD_tab-query-category.png`
- Preconditions: Integrated Ops Portal; `field_mismatch` entry is active
- Test Data: Deactivate `field_mismatch` under Query Category
- Steps:
  1. Navigate to `http://localhost:3000/admin/master-data`; select Query Category tab
  2. Deactivate "Field mismatch" entry
  3. Open Ops Portal → query creation → query category dropdown
- Expected Result: "Field mismatch" is absent from the Ops Portal query category dropdown
- Flow Code: AMD-F-INT-005
- Notes: —

---

#### TC-AMD-073: Audit log entries generated for Master Data create/edit/toggle actions

- Requirement ID: AMD-REQ-052
- Priority: P2 Should-Test
- Test Type: Functional
- Automation Readiness: Manual-Only
- Screenshot Reference: —
- Preconditions: Audit Log module confirmed enabled for Master Data; Admin logged in
- Test Data: Perform: create type, edit type name, deactivate type, reactivate type, create entry, deactivate entry
- Steps:
  1. Perform all six actions listed above
  2. Navigate to `http://localhost:3000/admin/audit-log` (or equivalent)
  3. Filter by actor = current Admin and resource = Master Data
- Expected Result: Six audit log entries exist, one per action; each entry includes action type, actor, timestamp, and affected resource identifier
- Flow Code: AMD-F-INT-006
- Notes: Blocked — AMD-REQ-052 is "Not Testable" per analysis. Run only after audit logging for Master Data is confirmed enabled.

---

### Non-Functional — Performance

#### TC-AMD-074: Master Data Types table loads in under 2 seconds

- Requirement ID: AMD-REQ-053
- Priority: P2 Should-Test
- Test Type: Functional
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: Admin logged in; seed data deployed (4+ types)
- Test Data: Standard seeded environment
- Steps:
  1. Open browser DevTools → Network tab
  2. Navigate to `http://localhost:3000/admin/master-data-types`
  3. Measure time from navigation start to table data visible (DOMContentLoaded or last data XHR)
- Expected Result: Table content visible within 2 seconds; no loading skeleton persists beyond that threshold
- Flow Code: AMD-F-NFR-001
- Notes: Threshold is expected, not committed (AMD-REQ-053). Record actual time as performance baseline.

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
  1. Open browser DevTools → Performance tab
  2. Start recording; click "Add Type"; stop recording after sheet is fully visible
  3. Measure time from click event to side sheet fully rendered
  4. Repeat for edit icon click
- Expected Result: Side sheet animation + content renders within 300ms
- Flow Code: AMD-F-NFR-002
- Notes: Threshold not formally committed. Record as baseline.

---

#### TC-AMD-076: Drag-reorder visual response is immediate on drop

- Requirement ID: AMD-REQ-055
- Priority: P2 Should-Test
- Test Type: Functional
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: Account Type tab active; entries present
- Test Data: —
- Steps:
  1. Navigate to `http://localhost:3000/admin/master-data`; select Account Type tab
  2. Drag an entry to a new position
  3. Observe drag feedback during drag and list update on drop
- Expected Result: Drag placeholder is visible during drag; list reorders visually on drop with no perceptible delay (optimistic UI); no loading spinner required before visual update
- Flow Code: AMD-F-NFR-003
- Notes: Network rollback behavior on 500 response is untested — record separately.

---

### Non-Functional — Accessibility

#### TC-AMD-077: Toggle controls expose correct ARIA role and aria-checked attribute

- Requirement ID: AMD-REQ-056
- Priority: P1 Must-Test
- Test Type: UI
- Automation Readiness: Auto-Ready
- Screenshot Reference: —
- Preconditions: Admin logged in; type rows and entry rows visible
- Test Data: —
- Steps:
  1. Navigate to `http://localhost:3000/admin/master-data-types`
  2. Open DevTools → Inspect each Active toggle element
  3. Verify ARIA attributes on active and inactive toggles
  4. Repeat on `http://localhost:3000/admin/master-data` entry toggles
- Expected Result: Each toggle has `role="switch"`; active toggles have `aria-checked="true"`; inactive toggles have `aria-checked="false"`; attribute updates after toggle action
- Flow Code: AMD-F-NFR-004
- Notes: Confirmed present in FE source (AMD-REQ-056).

---

#### TC-AMD-078: Breadcrumb uses nav element with aria-label="Breadcrumb"

- Requirement ID: AMD-REQ-057
- Priority: P2 Should-Test
- Test Type: UI
- Automation Readiness: Auto-Ready
- Screenshot Reference: —
- Preconditions: Admin logged in
- Test Data: —
- Steps:
  1. Navigate to `http://localhost:3000/admin/master-data-types`
  2. Open DevTools → Inspect breadcrumb DOM element
  3. Repeat on `http://localhost:3000/admin/master-data`
- Expected Result: Breadcrumb is wrapped in `<nav aria-label="Breadcrumb">` on both pages; breadcrumb text shows `Admin › Master Data Types` and `Admin › Master Data` respectively
- Flow Code: AMD-F-NFR-005
- Notes: —

---

#### TC-AMD-079: Side sheets and non-dismissible popups handle focus predictably for keyboard users

- Requirement ID: AMD-REQ-058
- Priority: P2 Should-Test
- Test Type: Functional
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: Admin logged in; keyboard-only navigation
- Test Data: Create Type side sheet; deactivation popup
- Steps:
  1. Navigate to `http://localhost:3000/admin/master-data-types` using keyboard only
  2. Tab to "Add Type" and press Enter — verify focus moves inside the sheet
  3. Tab through all sheet fields; verify logical order
  4. Press Escape — observe if sheet dismisses (record behavior)
  5. Tab to Cancel button; press Enter — verify sheet closes and focus returns to Add Type button
  6. Trigger deactivation popup; verify focus is trapped inside popup
  7. Tab between popup buttons; press Enter to Cancel — verify focus returns to triggering toggle
- Expected Result: Focus enters sheet on open; Tab order is logical; focus trapped in non-dismissible popup; focus returns to trigger on close; no focus lost to page background
- Flow Code: AMD-F-NFR-006
- Notes: Escape behavior on non-dismissible popups is an open question — record actual behavior.

---

### Error Handling & Edge Cases

#### TC-AMD-080: Network error during Save shows toast and preserves form values

- Requirement ID: AMD-REQ-013 (QR-015)
- Priority: P1 Must-Test
- Test Type: Negative
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: Create Type side sheet open; DevTools network interception available (simulate 500 response)
- Test Data: Valid Name and Type Code; intercepted 500 API response on Save
- Steps:
  1. Navigate to `http://localhost:3000/admin/master-data-types`
  2. Open Create side sheet; enter valid Name and Type Code
  3. Intercept the Save API request to return HTTP 500
  4. Click Save
  5. Observe toast message and form state
- Expected Result: Toast error "Failed to save. Please try again." appears; side sheet stays open with all field values intact; no partial record created
- Flow Code: AMD-F-ERR-001
- Notes: Same behavior expected for Create Entry, Edit Type, and Edit Entry saves.

---

#### TC-AMD-081: Network error during toggle returns toggle to prior state

- Requirement ID: QR-015
- Priority: P2 Should-Test
- Test Type: Negative
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: Admin logged in; simulated 500 API response on toggle endpoint
- Test Data: Any active entry/type
- Steps:
  1. Intercept the toggle/deactivate API call to return HTTP 500
  2. Toggle an active entry OFF → confirm deactivation
  3. Observe toast and row state
- Expected Result: Error toast appears; entry/type toggle reverts to its prior state; no data change committed
- Flow Code: AMD-F-ERR-002
- Notes: —

---

#### TC-AMD-082: Session expiry while side sheet open redirects to login

- Requirement ID: AMD-REQ-002 (EC-008)
- Priority: P1 Must-Test
- Test Type: Edge
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: Admin is mid-form in a Create/Edit side sheet; session can be force-expired
- Test Data: Partially filled form; force-expired session
- Steps:
  1. Navigate to `http://localhost:3000/admin/master-data-types`
  2. Open Create Type side sheet; enter Name but do not Save
  3. Force-expire session (clear cookie or backend expire)
  4. Click Save or any page action
  5. Observe URL and behavior
- Expected Result: Browser redirects to `http://localhost:3000/login`; no partial save occurs; unsaved form data is lost (expected and acceptable)
- Flow Code: AMD-F-ERR-003
- Notes: Grace period behavior is undocumented. Record actual behavior.

---

#### TC-AMD-083: Drag-to-reorder on tablet (1024px touch viewport) — support check

- Requirement ID: AMD-REQ-045 (EC-009)
- Priority: P3 Nice-to-Test
- Test Type: Edge
- Automation Readiness: Manual-Only
- Screenshot Reference: —
- Preconditions: Tablet device or browser DevTools emulation at 1024px with touch enabled; Admin logged in
- Test Data: Account Type tab with multiple entries
- Steps:
  1. Open `http://localhost:3000/admin/master-data` on a 1024px touch device or emulated tablet
  2. Select Account Type tab
  3. Attempt to drag-reorder an entry row via touch input
- Expected Result: Document actual behavior — either touch drag works at 1024px, or handles are not shown / drag is unsupported on touch. Result feeds Gap-009 (touch drag spec gap).
- Flow Code: AMD-F-ERR-004
- Notes: HTML5 drag API may not fire on touch events.

---

#### TC-AMD-084: No active types on Master Data page — Add Entry and tab strip state

- Requirement ID: EC-004
- Priority: P3 Nice-to-Test
- Test Type: Edge
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: All master data types are deactivated
- Test Data: All types inactive
- Steps:
  1. Deactivate all types
  2. Navigate to `http://localhost:3000/admin/master-data`
  3. Observe tab strip and Add Entry button state
- Expected Result: Tab strip shows no active tabs; Add Entry is either hidden or disabled; no crash; page shows an appropriate empty or blocked state
- Flow Code: AMD-F-ERR-005
- Notes: Behavior is undocumented. Record actual result for spec alignment.

---

#### TC-AMD-085: Code auto-generation from all-special-character name shows validation error

- Requirement ID: AMD-REQ-010 (EC-006, Gap-011)
- Priority: P2 Should-Test
- Test Type: Validation
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: Create Type side sheet open
- Test Data: Name: `@#$`, Name: `   ` (spaces only)
- Steps:
  1. Open Create Type side sheet
  2. Enter `@#$` in the Name field
  3. Observe Type Code field value after auto-generation
  4. Attempt to Save; observe validation
  5. Repeat with `   ` (spaces only)
- Expected Result: Type Code auto-generates to empty string; Save is blocked with inline validation error before or on Save; no crash
- Flow Code: AMD-F-ERR-006
- Notes: Exact error text unspecified. Record actual behavior.

---

#### TC-AMD-086: Server-side Entry Code immutability via direct API PATCH

- Requirement ID: AMD-REQ-004 (EC-013, QR-003)
- Priority: P1 Must-Test
- Test Type: Data Integrity
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: A saved entry exists; API endpoint accessible
- Test Data: Saved entry ID; PATCH payload: `{ "key": "mutated_code" }`
- Steps:
  1. Retrieve entry `id` and current `key` value (e.g. `individual`)
  2. Send `PATCH http://localhost:3000/api/admin/master-data/entries/:id` with body `{ "key": "mutated_code" }`
  3. Inspect API response status and body
  4. GET the entry; verify `key` is unchanged
- Expected Result: API returns HTTP 400 or 422; entry code `key` remains `individual` unchanged
- Flow Code: AMD-F-AUTH-007
- Notes: Blocked until `api.md` is provided. Verifies QR-003.

---

#### TC-AMD-087: Concurrent duplicate Type Code — race condition server enforcement

- Requirement ID: AMD-REQ-012 (EC-007, QR-010)
- Priority: P1 Must-Test
- Test Type: Data Integrity
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: Two Admin sessions active; API endpoint accessible
- Test Data: Two simultaneous Create Type POST requests with identical Type Code `race_test_code`
- Steps:
  1. Open two separate Admin browser sessions
  2. In both sessions, fill Create Type sheet with a Name that generates `race_test_code`
  3. Submit both simultaneously (or via two parallel API calls)
  4. Observe both responses
- Expected Result: Exactly one create succeeds (HTTP 201); the other returns an error (HTTP 409 or 422); only one type with code `race_test_code` exists in the database after both requests complete
- Flow Code: AMD-F-AUTH-008
- Notes: Requires DB-level unique constraint enforcement. Partially testable without confirmed API contract.

---

#### TC-AMD-088: Entries count in Types table — verify active-only vs total count

- Requirement ID: BR-013 (Gap-003)
- Priority: P2 Should-Test
- Test Type: Functional
- Automation Readiness: Auto-Ready
- Screenshot Reference: `01_MDT_default-list.png`
- Preconditions: A type has both active and inactive entries; e.g. Account Type with 5 active + 2 inactive = 7 total
- Test Data: Account Type with 2 pre-deactivated entries (5 active, 7 total)
- Steps:
  1. Pre-deactivate 2 entries under Account Type
  2. Navigate to `http://localhost:3000/admin/master-data-types`
  3. Read the "N entries →" value on the Account Type row
  4. Compare N against total (7) and active-only (5)
- Expected Result: Record whether N = 7 (total) or N = 5 (active only); assert consistency with cascade popup count (which should show active-only)
- Flow Code: AMD-F-MD-LIST-003
- Notes: Resolves Gap-003. The result feeds into cascading deactivation assertions.

---

#### TC-AMD-089: Sort Order is unique per type — duplicate sort order behavior

- Requirement ID: AMD-REQ-036 (EC-005)
- Priority: P2 Should-Test
- Test Type: Edge
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: Account Type has an entry at Sort Order = 1
- Test Data: New entry with Sort Order = 1 (duplicate of existing)
- Steps:
  1. Navigate to `http://localhost:3000/admin/master-data`; select Account Type tab
  2. Note an existing entry at Sort Order 1
  3. Open Create Entry side sheet for Account Type
  4. Enter unique Label; manually set Sort Order = 1
  5. Click Save
  6. Observe list ordering and Sort Order values after save
- Expected Result: Either Save is blocked with "Sort Order already in use" error, or the system auto-shifts existing entries to accommodate; no silent data corruption; behavior documented for spec alignment
- Flow Code: AMD-F-MD-CREATE-013
- Notes: Behavior is undocumented. Record actual result (Gap regarding duplicate sort order handling).

---

#### TC-AMD-090: Entry Code auto-generation from numeric-only label

- Requirement ID: AMD-REQ-033 (EC-006)
- Priority: P2 Should-Test
- Test Type: Edge
- Automation Readiness: Partial
- Screenshot Reference: —
- Preconditions: Create Entry side sheet open
- Test Data:
  | Label Input | Expected Entry Code |
  |---|---|
  | `123` | `123` |
  | `Type 2` | `type_2` |
  | `99 Problems` | `99_problems` |
  | `42` | `42` |
- Steps:
  1. Open Create Entry side sheet
  2. For each numeric/mixed Label, enter the value and read auto-generated Entry Code
  3. Attempt to Save each
- Expected Result: Numeric and mixed inputs produce valid entry codes without errors; `123` → `123`, `Type 2` → `type_2`; save succeeds
- Flow Code: AMD-F-MD-CREATE-014
- Notes: Edge case for code generation with numbers (partially covered in TC-AMD-015 for types).

---

#### TC-AMD-091: Inactive entries do not appear as drag targets during reorder

- Requirement ID: AMD-REQ-045, AMD-REQ-044
- Priority: P3 Nice-to-Test
- Test Type: Edge
- Automation Readiness: Partial
- Screenshot Reference: `20_MD_after-deactivate-row-inactive.png`
- Preconditions: A type tab has a mix of active and inactive entries
- Test Data: Account Type with 2 inactive entries and 5 active entries
- Steps:
  1. Navigate to `http://localhost:3000/admin/master-data`; select Account Type tab
  2. Observe drag handles on inactive entry rows
  3. Attempt to drag an inactive entry to a new position
- Expected Result: Behavior documented — either inactive entries have no drag handle (preferred), or dragging inactive entries has no effect; active entries can still be reordered; no crash
- Flow Code: AMD-F-MD-REORDER-005
- Notes: Not specified in requirements. Record actual behavior for spec review.

---

## Coverage Notes

### Requirements Fully Covered (Deep Coverage — All P1 Paths)
- AMD-REQ-001, 002, 003, 004 — Auth/Authorization (UI fully; server-side partial on API contract)
- AMD-REQ-005, 007, 008, 009, 010, 011, 012, 013, 014 — Create Type (full path coverage)
- AMD-REQ-015, 016, 017 — Edit Type
- AMD-REQ-018, 019, 020, 021, 022, 023 — Deactivation + Cascade + Reactivation
- AMD-REQ-024 — Deep-link Types → Entries
- AMD-REQ-025, 026, 027 — Tab behavior + deep-link
- AMD-REQ-029, 031, 032, 033, 034, 035, 036, 037 — Create Entry (all fields + validation)
- AMD-REQ-038, 039, 040 — Edit Entry
- AMD-REQ-041, 042, 043, 044 — Entry deactivation/reactivation
- AMD-REQ-045 — Drag-reorder (core + persistence)
- AMD-REQ-047 — Seed data smoke
- AMD-REQ-049, 050, 051 — Downstream integration (partial testability noted)
- AMD-REQ-056, 057, 058 — Accessibility (all testable items)

### Requirements Partially Covered
- AMD-REQ-006 — Pagination (requires >10 types dataset)
- AMD-REQ-028 — Tab ordering (depends on undocumented sort_order source — Gap-004)
- AMD-REQ-046 — Drag handle visibility (multi-type view not specified)
- AMD-REQ-048 — Immediate system-wide propagation (mechanism undocumented; exercised via E2E integration tests)
- AMD-REQ-053, 054, 055 — Performance (thresholds not committed; baselines only)

### Requirements Blocked / Not Fully Testable
- AMD-REQ-004 — Server-side code immutability: TC-AMD-006 and TC-AMD-086 are draft tests pending `api.md`
- AMD-REQ-052 — Audit logging: module-level confirmation required before execution

---

## Open Questions / Dependencies

| # | Question | Affects | Source |
|---|---|---|---|
| OQ-001 | Confirmed API endpoints, HTTP methods, request/response schemas, error codes? | TC-AMD-006, TC-AMD-086, TC-AMD-087, TC-AMD-080, TC-AMD-081 | Gap-001 |
| OQ-002 | Is Type Code / Entry Code immutability enforced server-side, and what HTTP error is returned? | TC-AMD-006, TC-AMD-086 | AMD-REQ-004, QR-003 |
| OQ-003 | Is duplicate code validation enforced server-side for concurrent sessions? | TC-AMD-087 | AMD-REQ-012, AMD-REQ-035, QR-010 |
| OQ-004 | What does the system do when a Name/Label produces an empty auto-generated code? | TC-AMD-015, TC-AMD-085 | Gap-011 |
| OQ-005 | How are non-ASCII characters in Name/Label handled during code auto-generation? | TC-AMD-015 | EC-006, Gap-011 |
| OQ-006 | Is the SLA type present in the admin UI? What are its entry codes and UI labels? | TC-AMD-068 | Gap-002 |
| OQ-007 | Does "N entries →" in the Types table count all entries or only active entries? | TC-AMD-088 | Gap-003, BR-013 |
| OQ-008 | How is `sort_order` assigned to types at creation? Can types be manually reordered? | TC-AMD-039 | Gap-004 |
| OQ-009 | Deep-link to an inactive type — spec says tab shown, FE only tabs active types. Which is correct? | TC-AMD-037 | AMD-REQ-026, BR-010, EC-003 |
| OQ-010 | What happens when deep-linking to an invalid/nonexistent slug? | TC-AMD-038 | AMD-REQ-026 |
| OQ-011 | What is shown on the Master Data page when all types are inactive? | TC-AMD-084 | EC-004 |
| OQ-012 | Can deactivation confirmation popups be dismissed via Escape key? | TC-AMD-025, TC-AMD-060, TC-AMD-079 | AMD-REQ-058 |
| OQ-013 | Does cascade deactivation trigger downstream cache invalidation? Is propagation immediate? | TC-AMD-069 – TC-AMD-072 | AMD-REQ-048 |
| OQ-014 | Are Audit Log entries generated for Master Data CRUD and toggle operations? | TC-AMD-073 | AMD-REQ-052 |
| OQ-015 | Is drag-to-reorder supported on touch at 1024px tablet viewport? | TC-AMD-083 | EC-009 |
| OQ-016 | Maximum field lengths for Name, Label, Type Code, Entry Code? | TC-AMD-015, TC-AMD-052 | New — raised during analysis |
| OQ-017 | What happens to Sort Order input of 0, negative, decimal, or duplicate value? | TC-AMD-052, TC-AMD-089 | AMD-REQ-036, EC-005 |
| OQ-018 | Expected error toast message for toggle/reorder network failures? | TC-AMD-081 | QR-015 |
| OQ-019 | Do inactive entries participate in drag-reorder? Do they show drag handles? | TC-AMD-091 | AMD-REQ-044, AMD-REQ-045 |
