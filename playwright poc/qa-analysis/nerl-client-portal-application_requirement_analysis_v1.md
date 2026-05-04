# Requirement Analysis: NeRL Client Portal — Application Module

---

## Meta

| Field | Value |
|---|---|
| Feature / Module | Application (Client Portal) — New Application flow (primary focus) |
| Project | NeRL Online Client Account Opening |
| QA Knowledge source | `playwright poc/qa-knowledge/nerl-client-portal-application_qa_knowledge_v1.md` |
| Supporting inputs | `flow.md`, `spec.md`, `screens.md` (for gap cross-check only — not re-read as primary) |
| Date | 2026-05-04 |
| Version | v1 |
| Pipeline stage | Stage 2 — Requirement Analysis |
| Next stage | Test Case Generation (`test-case-generation` skill) |
| Analyst | AI-Driven QA Pipeline |

---

## Requirement Summary

| Metric | Count |
|---|---|
| Total requirements extracted | 90 |
| Functional | 72 |
| Non-Functional (Performance / Security / Compatibility) | 10 |
| Integration | 4 |
| Data Validation | 4 |
| **High risk** | **22** |
| **Medium risk** | **45** |
| **Low risk** | **23** |
| Testable (as-is) | 67 |
| Partially testable (blocker noted) | 18 |
| Not testable (hard blocker) | 5 |
| P1 — Must-Test | 38 |
| P2 — Should-Test | 37 |
| P3 — Nice-to-Test | 15 |

---

## Requirements Table

> **Category codes:** F = Functional | DV = Data Validation | NF-Sec = Security | NF-Perf = Performance | NF-Compat = Compatibility | INT = Integration | UI = UI/UX  
> **Testability:** ✅ Testable | ⚠️ Partially | ❌ Not testable

### Hub / My Application

| ID | Requirement Statement | Category | Risk | Testability | Priority | Notes |
|---|---|---|---|---|---|---|
| RA-001 | When no application exists, My Application shows "No Application" state: body text, "Begin Application" CTA, and no section cards | F | Medium | ✅ | P1 | Verify with a fresh client account |
| RA-002 | Tapping "Begin Application" navigates to the In-progress hub and creates the application record | F | High | ✅ | P1 | Core entry point — creation side-effect must be verified |
| RA-003 | The In-progress hub displays exactly three section cards: Personal Details, KYC, Documents — each with completion percentage | F | High | ✅ | P1 | Percentage display drives gating logic |
| RA-004 | Hub completion percentage per section accurately reflects current data state (0–100%) | F | High | ✅ | P1 | Inaccurate % could expose or block the Review & Submit gate wrongly |
| RA-005 | Returning from any section to the hub immediately updates that section's completion percentage without a page reload | F | High | ✅ | P1 | Must test across all three sections |
| RA-006 | "Review & Submit" card is locked (disabled CTA, label "Complete all sections to unlock") when any section is below 100% | F | High | ✅ | P1 | Critical business gate — partial completion must not allow submission |
| RA-007 | "Review & Submit" card transitions to enabled primary CTA exactly when all three sections reach 100% — not before | F | High | ✅ | P1 | Must test boundary: 2/3 sections at 100%, then 3/3 |
| RA-008 | The account type (Individual / NonIndividual) set at registration determines the Personal Details form variant and document checklist shown on the hub | F | High | ✅ | P1 | Prerequisite: test env must have both account types seeded |
| RA-009 | "Under Review" state displays a neutral/blue badge, read-only body text, and no action CTAs | F | Medium | ✅ | P2 | Post-submission state verification |
| RA-010 | "Queried" state displays amber "Action Required" badge, alert banner with open query count and deadline, "View Queries" CTA, and application sections read-only | F | High | ✅ | P1 | Requires Ops Portal to raise a query in test env |
| RA-011 | "View Queries" CTA in the Queried state navigates to `/client/queries` | F | Medium | ✅ | P1 | Navigation correctness |
| RA-012 | "Approved" state displays green badge, body text, and "View My Account" CTA navigating to `/client/account` | F | Medium | ⚠️ | P2 | Partially testable — My Account module not yet scaffolded; verify badge and CTA presence only |
| RA-013 | "Rejected" state displays red badge, body text, rejection reason as plain text, and no further action CTAs | F | Medium | ⚠️ | P2 | Requires Ops Portal to reject an application in test env |

---

### Personal Details — Individual Variant

| ID | Requirement Statement | Category | Risk | Testability | Priority | Notes |
|---|---|---|---|---|---|---|
| RA-014 | Personal Details (Individual) renders exactly 12 fields matching the spec: Full Name, DOB, Address L1, Address L2, City, State, PIN Code, Occupation, Annual Income, Bank Account Number, IFSC Code, Bank Name | F | Medium | ✅ | P1 | Field presence and labels must match spec exactly |
| RA-015 | Address Line 2 is the only optional field in the Individual variant; all other 11 fields are required | DV | Medium | ✅ | P1 | Required field enforcement must be tested individually |
| RA-016 | PIN Code accepts exactly 6 numeric digits; fewer than 6, non-numeric, or more than 6 characters are rejected with an appropriate error | DV | Medium | ✅ | P1 | Boundary: 5 digits (fail), 6 digits (pass), 7 digits (fail), alpha (fail) |
| RA-017 | State and Occupation fields render as dropdowns with selectable options | F | Low | ✅ | P2 | Verify options are populated from server/config |
| RA-018 | Annual Income renders as a dropdown with income range band options | F | Low | ✅ | P2 | Exact option list unknown [VALIDATE with product] |
| RA-019 | Auto-save fires on every field change (blur event) — no Save button exists on the page | F | High | ✅ | P1 | Must verify persistence: fill → navigate away → return → data intact |
| RA-020 | Returning from Personal Details to the hub via the Back button updates the Personal Details card completion percentage on the hub | F | High | ✅ | P1 | Links auto-save to hub gate logic |
| RA-021 | IFSC Code field exists and is required; valid/invalid IFSC format behavior [VALIDATE with engineering] | DV | Medium | ⚠️ | P1 | Format regex not specified in source — test presence and required state; format validation pending api.md |
| RA-022 | Bank Account Number field exists and is required; length and format constraints [VALIDATE with engineering] | DV | Medium | ⚠️ | P1 | As above — test presence and required state only until data model confirmed |

---

### Personal Details — Non-Individual Variant

| ID | Requirement Statement | Category | Risk | Testability | Priority | Notes |
|---|---|---|---|---|---|---|
| RA-023 | The correct Personal Details form variant (Individual vs Non-Individual) is shown based on the account_type set at registration | F | High | ✅ | P1 | Must test both variants independently |
| RA-024 | Personal Details (Non-Individual) renders: Entity Name, Registration Number, GST Number, Directors/Trustees, Authorised Signatory, Bank Account Number, IFSC Code, Bank Name | F | Medium | ✅ | P1 | Different field set from Individual — must be tested as a separate variant |
| RA-025 | GST Number is optional in the Non-Individual variant; all other Non-Individual fields are required | DV | Medium | ✅ | P1 | GST omission must not block section completion |
| RA-026 | Directors/Trustees is a repeatable input (add row) requiring a minimum of 1 entry; submitting with zero entries is blocked | F | High | ✅ | P1 | Min 1 is a hard business rule; boundary: 0 entries (fail), 1 entry (pass) |
| RA-027 | The Directors/Trustees field allows adding multiple rows beyond the first | F | Medium | ⚠️ | P2 | Max row count not specified — test add/remove up to at least 3; max unknown [VALIDATE] |
| RA-028 | Each Directors/Trustees row can be individually removed, and the remaining rows are preserved | F | Medium | ⚠️ | P2 | Remove UI not described in spec — [VALIDATE with designer] |

---

### KYC Section

| ID | Requirement Statement | Category | Risk | Testability | Priority | Notes |
|---|---|---|---|---|---|---|
| RA-029 | KYC sub-steps execute sequentially: PAN must pass before Aadhaar is accessible; Aadhaar must pass before Video KYC is accessible | F | High | ⚠️ | P1 | **BLOCKED by Ambiguity #1** — spec.md says sequential, flow.md says any order; test sequential (spec) until clarified |
| RA-030 | PAN Pending state renders: PAN number text input and "Verify PAN" button | F | Low | ✅ | P2 | UI state verification |
| RA-031 | Successful PAN verification transitions to PAN Verified state: green checkmark, "PAN Verified" label, Aadhaar step unlocks | F | High | ✅ | P1 | Must verify unlock side-effect |
| RA-032 | Failed PAN verification shows error: "PAN verification failed. Check your details and try again." with a Retry button; PAN step remains active | F | High | ✅ | P1 | Error message exact text must match spec |
| RA-033 | Aadhaar Pending state renders: Aadhaar number text input and "Send OTP" button | F | Low | ✅ | P2 | UI state verification |
| RA-034 | Tapping "Send OTP" transitions to OTP Sent state: 6-digit OTP input field, countdown timer, Resend OTP link, Verify button | F | High | ✅ | P1 | OTP sent state must show all four elements |
| RA-035 | Successful Aadhaar OTP verification transitions to Aadhaar Verified state: green checkmark, label, Video KYC step unlocks | F | High | ✅ | P1 | Must verify Video KYC unlock side-effect |
| RA-036 | Incorrect Aadhaar OTP shows error: "Incorrect OTP. Please try again." and allows retry without resending OTP | F | High | ✅ | P1 | Error message exact text must match spec |
| RA-037 | Resend OTP link is active only after the countdown timer expires; tapping it resends OTP and resets timer | F | Medium | ⚠️ | P2 | Timer duration not specified [VALIDATE]; behavior can be tested once known |
| RA-038 | Video KYC Pending state renders: scheduling description text and "Schedule Slot" button | F | Low | ✅ | P3 | Static UI state |
| RA-039 | After scheduling a slot, Video KYC transitions to Scheduled state: slot date/time displayed, "Reschedule" link shown | F | Medium | ⚠️ | P2 | Depends on third-party slot API — mock required in test env |
| RA-040 | "Reschedule" link in Video KYC Scheduled state opens slot rescheduling and updates the displayed date/time | F | Medium | ⚠️ | P2 | Third-party dependency — mock in test env |
| RA-041 | Successful Video KYC session transitions to Passed state: green checkmark, "Video KYC Complete" label | F | High | ⚠️ | P1 | Third-party session cannot run in test env — must stub/mock the status transition |
| RA-042 | Failed Video KYC session shows error message, remaining retry count, and "Schedule New Slot" button | F | High | ⚠️ | P1 | Retry count display is P1; exact max retries unknown [VALIDATE] |
| RA-043 | KYC section completion percentage on the hub updates correctly after any sub-step state change | F | High | ✅ | P1 | Ties to gate logic (RA-006/RA-007) |

---

### Documents Section

| ID | Requirement Statement | Category | Risk | Testability | Priority | Notes |
|---|---|---|---|---|---|---|
| RA-044 | The Documents checklist is populated based on admin-configured document rules for the client's account type | INT | High | ⚠️ | P1 | Testable only after Admin Panel configures checklist — prerequisite dependency |
| RA-045 | Each document item shows: document type label, required/optional tag, Upload CTA | F | Medium | ✅ | P1 | Verify rendering for both required and optional items |
| RA-046 | After upload, each document item shows the uploaded filename and a Remove link instead of Upload CTA | F | Medium | ✅ | P1 | State transition on upload success |
| RA-047 | The Uploading state shows a progress indicator on the active document item | UI | Low | ✅ | P2 | Visible during upload — may require slow-network simulation |
| RA-048 | The All Uploaded state shows green checkmarks on all required document slots | F | Medium | ✅ | P2 | Terminal upload state verification |
| RA-049 | The Re-upload Required state shows red border and "Re-upload required" label on flagged document items | F | High | ✅ | P1 | Used in Application Correction flow — critical visual signal |
| RA-050 | Document upload accepts only PDF, JPG, and PNG file types; other formats (e.g., DOCX, MP4) are rejected with an error | DV | High | ✅ | P1 | Both client-side and server-side enforcement must be tested |
| RA-051 | Document upload enforces a maximum file size of 5 MB; files exceeding 5 MB are rejected | DV | High | ✅ | P1 | Boundary: 4.9 MB (pass), 5.0 MB (pass), 5.1 MB (fail) |
| RA-052 | Server-side file type and size enforcement is applied independently of client-side validation | NF-Sec | High | ⚠️ | P1 | Requires direct API test bypassing UI validation; testable once api.md is available |
| RA-053 | A failed document upload shows an item-level error and retry option without affecting other document upload slots | F | High | ✅ | P1 | Item isolation is a core business rule |
| RA-054 | The Remove link resets that document slot to pending and reduces the section completion percentage accordingly | F | Medium | ✅ | P2 | Remove → completion % regression |
| RA-055 | Documents section completion percentage on the hub updates when returning from the Documents screen | F | High | ✅ | P1 | Ties to gate logic |

---

### Review & Submit

| ID | Requirement Statement | Category | Risk | Testability | Priority | Notes |
|---|---|---|---|---|---|---|
| RA-056 | Review & Submit is accessible only when all three section cards show 100% completion; direct URL access with incomplete sections must be blocked or redirect | F | High | ⚠️ | P1 | Server-side guard not confirmed — [VALIDATE if URL guard exists] |
| RA-057 | Review & Submit displays a read-only summary of all Personal Details field values (both Individual and Non-Individual variants) | F | Medium | ✅ | P1 | Data fidelity — displayed values must match entered values |
| RA-058 | Review & Submit displays KYC sub-step status per step (Verified / Pending) | F | Medium | ✅ | P1 | Must reflect actual KYC state |
| RA-059 | Review & Submit displays uploaded document names per document slot | F | Medium | ✅ | P1 | Must match what was uploaded |
| RA-060 | "Edit" links per section on Review & Submit navigate back to the corresponding section screen | F | Medium | ✅ | P2 | Navigation correctness; destination post-edit not specified [VALIDATE: returns to R&S or to hub?] |
| RA-061 | The declaration checkbox text reads exactly: "I confirm that the information provided is accurate and complete." | UI | Low | ✅ | P3 | Exact copy verification |
| RA-062 | "Submit Application" is disabled when the declaration checkbox is unchecked; it enables only after the checkbox is checked | F | High | ✅ | P1 | Legal compliance gate — must test disabled and enabled states |
| RA-063 | Tapping "Submit Application" with the declaration checked shows a loading spinner on the button and disables it | F | High | ✅ | P1 | Must verify button state during submission |
| RA-064 | Double-tapping "Submit Application" does not result in duplicate application submissions | F | High | ⚠️ | P1 | Idempotency — requires API-level verification; partially testable via rapid double-click in UI |

---

### Submission Confirmation

| ID | Requirement Statement | Category | Risk | Testability | Priority | Notes |
|---|---|---|---|---|---|---|
| RA-065 | Submission Confirmation displays: "Your application has been submitted successfully." | UI | Low | ✅ | P2 | Static text verification |
| RA-066 | The reference number is displayed prominently in the format APP-XXXXXX | F | Medium | ✅ | P1 | Format must be validated via regex |
| RA-067 | Submission Confirmation displays: "We will review your application and get back to you within 3 working days." | UI | Low | ✅ | P3 | Static text |
| RA-068 | "Back to My Application" CTA navigates to `/client/application` in the Under Review state | F | High | ✅ | P1 | State transition correctness post-submission |
| RA-069 | Browser back button navigation is blocked on the Submission Confirmation screen | F | Medium | ✅ | P2 | Must test browser back button behavior explicitly |
| RA-070 | No in-app back navigation exists on the Submission Confirmation screen | UI | Low | ✅ | P2 | Verify absence of Back link/button |

---

### Queries Module

| ID | Requirement Statement | Category | Risk | Testability | Priority | Notes |
|---|---|---|---|---|---|---|
| RA-071 | The Queries nav item displays a badge with the count of open queries when any queries exist | F | High | ⚠️ | P1 | Requires Ops Portal to raise a query; badge count must match actual open count |
| RA-072 | The Queries list shows query cards with: section name, query summary, round number (e.g. "Round 1 of 10"), deadline | F | Medium | ✅ | P1 | Card content verification per field |
| RA-073 | The Queries list empty state shows "No open queries." when no queries are open | F | Low | ✅ | P2 | Empty state verification |
| RA-074 | Query Detail shows the ops reviewer instruction text and "Fix This" CTA | F | High | ✅ | P1 | Core correction entry point |
| RA-075 | Tapping "Fix This" navigates via deep-link to the first red-flagged field in Personal Details or Documents | F | High | ✅ | P1 | Deep-link precision — scroll-to-field and red marking must both be visible |
| RA-076 | Query Detail transitions to "Response Submitted" state text after corrections are submitted | F | Medium | ✅ | P2 | Terminal state for Query Detail |

---

### Application Correction Flow

| ID | Requirement Statement | Category | Risk | Testability | Priority | Notes |
|---|---|---|---|---|---|---|
| RA-077 | Fields flagged by the ops reviewer are shown with red border and red "Re-upload required" or equivalent red label in the application sections | F | High | ✅ | P1 | Visual correctness of flagged state |
| RA-078 | Correcting a flagged field clears the red border and label on that specific field without affecting other flagged fields | F | High | ✅ | P1 | Field-level isolation of red marking removal |
| RA-079 | "Submit Corrections" button remains inactive/disabled until every flagged field has been corrected (red marking cleared) | F | High | ✅ | P1 | Critical gate — partial correction must not allow re-submission |
| RA-080 | Tapping "Submit Corrections" re-submits the application to the Ops queue | F | High | ✅ | P1 | Core correction completion |
| RA-081 | After Submit Corrections, the application status on My Application hub transitions to Under Review | F | High | ✅ | P1 | State transition correctness |
| RA-082 | After Submit Corrections, the Queries nav badge count decrements or clears if no other queries remain open | F | High | ✅ | P1 | Badge accuracy post-correction |
| RA-083 | If the query deadline passes before corrections are submitted, the application lapses and the client sees an expiry message | F | High | ⚠️ | P1 | Time-dependent — requires date manipulation or test env config to simulate; lapsed state UI not fully specified [VALIDATE] |
| RA-084 | Navigating away mid-correction (before Submit Corrections) auto-saves completed field corrections and resumes on return | F | High | ✅ | P1 | Auto-save applies during correction, not just initial submission |
| RA-085 | A failed document re-upload during correction shows an item-level error and retry option without blocking other corrections | F | High | ✅ | P1 | Item isolation rule applies equally in correction flow |

---

### Auto-save & Draft

| ID | Requirement Statement | Category | Risk | Testability | Priority | Notes |
|---|---|---|---|---|---|---|
| RA-086 | Auto-save fires on every field blur in Personal Details — verified by navigating away and returning to confirm data persistence | F | High | ✅ | P1 | Must test each field individually or with representative sampling |
| RA-087 | Auto-save operations do not block or delay user interaction with the form | NF-Perf | Medium | ✅ | P2 | Observe no UI freeze or spinner that blocks input |
| RA-088 | Draft data persists across browser sessions (close browser → reopen → navigate to application → data intact) | F | High | ✅ | P1 | Critical for cross-session use case from JTBD |
| RA-089 | Navigating back from a section to the hub mid-form does not show an "unsaved changes" warning; auto-save handles persistence silently | F | Medium | ✅ | P2 | Absence of warning is the expected behavior |
| RA-090 | A draft older than 1 month is cleared on next visit: the banner "Your previous draft has expired. We've pre-filled your details." is shown, and known profile fields are pre-filled from the user record | F | High | ⚠️ | P1 | Time-dependent; pre-fill scope not confirmed [VALIDATE: which exact fields are pre-filled?]; test by manipulating draft_expires_at in test DB |

---

### Non-Functional & Security

| ID | Requirement Statement | Category | Risk | Testability | Priority | Notes |
|---|---|---|---|---|---|---|
| RA-091 (prev RA-081) | All application routes require an authenticated session; unauthenticated requests redirect to the auth portal or receive 401 | NF-Sec | High | ✅ | P1 | Test each route with no auth token |
| RA-092 | Auto-save API endpoints are scoped to the authenticated client's own application; a client cannot write to another client's application via PATCH | NF-Sec | High | ⚠️ | P1 | Requires API test with cross-client token; testable once api.md confirmed |
| RA-093 | Application reference numbers are non-guessable (not sequential, not derivable from public data) | NF-Sec | High | ⚠️ | P2 | Testable by sampling 10+ reference numbers and verifying no sequence; full statistical test impractical |
| RA-094 | The application UI renders correctly and is fully functional at all four breakpoints: 1920px, 1440px, 1024px, 375px | NF-Compat | Medium | ✅ | P2 | Visual regression per breakpoint; all CTAs and form fields must be reachable |
| RA-095 | Document upload shows accurate upload progress for files up to 5 MB | NF-Perf | Medium | ✅ | P3 | Use network throttling to observe progress indicator |

---

### Integration

| ID | Requirement Statement | Category | Risk | Testability | Priority | Notes |
|---|---|---|---|---|---|---|
| RA-096 | The Application module is inaccessible without a valid authenticated session established via the Authentication Portal | INT | High | ✅ | P1 | Must be first in test setup |
| RA-097 | The Documents section handles gracefully the case where the admin-configured checklist is absent or empty (no crash; descriptive empty state) | INT | Medium | ⚠️ | P2 | Requires test env without admin config seeded — empty state behavior not specified [VALIDATE] |
| RA-098 | The Video KYC slot scheduling interaction completes without requiring the actual third-party session in a test environment | INT | High | ⚠️ | P1 | Requires mock/stub of third-party Video KYC; test approach to be determined with engineering |
| RA-099 | Completing the Admin Panel prerequisite (seeding document rules) before testing the Documents section does not require any code change | INT | Medium | ⚠️ | P2 | Operational dependency — define test data seeding procedure |

---

## High-Risk Requirements — Detailed Narrative

The following 22 requirements are rated **High** risk due to business impact, compliance implications, architectural complexity, or dependency on external systems. Each requires deep test coverage including boundary, negative, and state-transition cases.

---

### RA-002 — Begin Application creates application record
**Why high risk:** This is the creation side-effect that initialises the entire application. A failure here (e.g., duplicate creation on double-tap, incorrect account_type association) corrupts downstream flow. Must verify: application record created once, account_type correctly inherited, hub initialised at 0% for all sections.

### RA-003 / RA-004 / RA-005 — Hub completion % accuracy
**Why high risk:** The completion percentage is the single control that drives the Review & Submit gate. If it under-counts (field fills not reflected), the client is incorrectly blocked. If it over-counts (partial fills counted as complete), the gate is bypassed. Test with: partially filled sections, required-vs-optional field distinctions, and KYC sub-step partial completion.

### RA-006 / RA-007 — Review & Submit gate
**Why high risk:** Core business rule. A breach allows submitting an incomplete application to Ops, creating operational overhead and compliance risk. Must test: 0/3 complete (locked), 1/3 complete (locked), 2/3 complete (locked), 3/3 complete (unlocked), and then one section regressing below 100% after being complete (re-locks).

### RA-008 — Account type drives form variant and document checklist
**Why high risk:** Wrong form variant or checklist for account type means the client fills the wrong data or missing documents, and the Ops reviewer receives invalid information. Must test both account types end-to-end in isolated test runs.

### RA-010 — Queried state
**Why high risk:** If the Queried state does not render correctly (wrong badge count, missing deadline, sections not read-only), the client may miss or misunderstand the correction needed. Requires Ops Portal integration in test environment.

### RA-019 / RA-086 — Auto-save on field change
**Why high risk:** The JTBD core promise is "fill at your own pace across sessions." If auto-save fails silently, data loss occurs with no warning. Must test: fill field → navigate away → return → data present; also test network failure during save (what is displayed?).

### RA-026 — Directors/Trustees minimum 1 entry
**Why high risk:** Legal requirement for Non-Individual entities. Zero entries must be rejected at the form-completion gate and cannot contribute to 100% completion. Test boundary: 0 (blocked), 1 (allowed).

### RA-029 — KYC sequential order (Ambiguity #1 BLOCKER)
**Why high risk:** Sequential vs any-order KYC changes the entire test matrix for KYC. Currently testing as sequential (spec.md interpretation) but this assumption must be confirmed before P1 test cases are written. If any-order is correct, 3! = 6 orderings must be tested.

### RA-031 / RA-035 / RA-041 — KYC step unlock side-effects
**Why high risk:** Each KYC step's success must programmatically unlock the next step. Failure to unlock blocks the entire KYC section from reaching 100%, which in turn blocks the Review & Submit gate. Chained dependency failure.

### RA-032 / RA-036 / RA-042 — KYC error states
**Why high risk:** The exact error messages and retry mechanisms are specified. Incorrect error text or missing retry paths force clients to abandon the application. Video KYC retry max is unknown — must be validated before writing boundary tests.

### RA-044 — Document checklist admin dependency
**Why high risk:** If the admin checklist is not seeded, the Documents section may render incorrectly or be empty, making it impossible to reach 100% completion. This is a blocking dependency for all Documents tests.

### RA-050 / RA-051 / RA-052 — Document type and size enforcement
**Why high risk:** Security and data integrity. Client-side-only enforcement is a known bypass vector. Server-side enforcement must be independently verified at the API layer.

### RA-053 — Failed upload item isolation
**Why high risk:** If one upload failure blocks the entire checklist, the client cannot complete the Documents section. Item-level isolation is an explicit design decision — must be proven under both partial and complete failure scenarios.

### RA-062 / RA-063 — Declaration checkbox + Submit gate
**Why high risk:** Legal compliance. The declaration is the client's formal consent. Submit must be impossible without it. Also: the loading/disabled state during submission must prevent double-submit.

### RA-064 — Double-submit idempotency
**Why high risk:** A duplicate submission creates a second record in the Ops queue, causing operational confusion and potential regulatory issues. Must test both at UI level (rapid click) and API level (duplicate POST).

### RA-079 — Submit Corrections gate
**Why high risk:** Same as the Review & Submit gate but for the correction flow. Partial correction leading to re-submission means unfixed flagged fields go back to Ops, causing another query round.

### RA-083 — Query deadline expiry
**Why high risk:** Application lapse is an irreversible terminal state (per current spec). If the lapse logic is incorrect (fires too early, doesn't fire, or shows the wrong state), clients lose their application unfairly.

### RA-090 — Draft expiry and pre-fill
**Why high risk:** Pre-filling the wrong fields or failing to clear stale data on expiry creates a data integrity issue that may not be caught until Ops review. Exact pre-fill scope is unknown — an ambiguity that blocks precise test data design.

### RA-091 — Authentication on all routes
**Why high risk:** Unauthenticated access to application data is a security breach. Every route must be tested without a valid session.

### RA-092 — Cross-client data isolation
**Why high risk:** Client A reading or writing Client B's application is a critical security and privacy breach. Must be verified at API level.

---

## Non-Testable Items

| ID | Item | Reason | What is Needed to Unblock |
|---|---|---|---|
| NT-01 | API endpoint contracts (RA-052, RA-092, RA-064 API-layer) | `api.md` is empty — HTTP status codes, error payloads, and request schemas are unknown | Engineering team must deliver `api.md` before API-level test design |
| NT-02 | Field-level format validation for PAN, Aadhaar, IFSC, Bank Account (RA-021, RA-022) | `data-model.md` is empty — regex patterns and length limits not confirmed | Engineering team must deliver `data-model.md` |
| NT-03 | Video KYC actual session outcome (RA-041) | Third-party system; cannot be triggered in test environment | Engineering to provide a mock/stub endpoint that simulates Passed / Failed-Retry outcomes |
| NT-04 | Query deadline expiry (RA-083) | Time-dependent; requires either time manipulation in test DB or a dedicated test environment parameter | Engineering to expose a `deadline_override` mechanism or allow `draft_expires_at` / `query.deadline` to be set to past dates in test seeding |
| NT-05 | Android mobile parity (Ambiguity #13) | No React Native (Android) test spec exists; mobile parity requirements are undocumented | Product to confirm which states/flows are in scope for Android Phase 1; separate mobile QA plan required |

---

## Open Questions

### Carried Over from QA Knowledge (13 items)

| # | Question | Blocking? |
|---|---|---|
| OQ-01 | **KYC order (CRITICAL):** `spec.md` says sequential (PAN→Aadhaar→Video KYC); `flow.md` Step 5 says any order. Which is correct? | YES — blocks KYC test matrix |
| OQ-02 | **Video KYC retry max:** Remaining retries count is shown but max is not specified. | YES — blocks retry boundary tests |
| OQ-03 | **Document checklist contents:** No example documents listed for Individual or Non-Individual types. | YES — blocks Documents test data seeding |
| OQ-04 | **`api.md` empty:** All endpoint contracts inferred; HTTP errors, payloads unknown. | YES — blocks API test design |
| OQ-05 | **`data-model.md` empty:** PAN format, Aadhaar format, IFSC, bank account constraints unconfirmed. | YES — blocks format validation tests |
| OQ-06 | **Browser back button on Confirmation:** Is it programmatically blocked or relies on redirect? | No — testable either way |
| OQ-07 | **Draft expiry pre-fill scope:** Which fields are pre-filled from user record? KYC statuses reset? Documents retained? | YES — blocks draft expiry test design |
| OQ-08 | **Queried state section editability:** Read-only except for red-flagged fields, or does Fix This unlock the whole section? | YES — blocks Application Correction field-edit tests |
| OQ-09 | **Query lapse state:** New My Application state ("Lapsed") or inline error in "Queried" state? | YES — missing state from screen inventory |
| OQ-10 | **Directors/Trustees max rows and remove UI.** | Partial — can test add without knowing max |
| OQ-11 | **Multiple simultaneous query rounds:** Can Round 1 and Round 2 queries be open at the same time? How is Submit Corrections scoped? | YES — blocks multi-round correction test |
| OQ-12 | **Aadhaar OTP countdown timer duration.** | No — testable once duration confirmed |
| OQ-13 | **Android Phase 1 mobile parity:** Which states/flows apply to the Android app? | YES — blocks mobile test scope |

### New Questions Raised During Analysis

| # | Question | Blocking? |
|---|---|---|
| OQ-14 | **Direct URL access to Review & Submit with incomplete sections:** Does the server redirect, or is this client-side guard only? If client-side only, it's a security/integrity gap. | YES — test approach depends on answer |
| OQ-15 | **Post-rejection re-application:** Can a rejected client start a new application, or is rejection permanent per client record? | YES — affects state machine completeness |
| OQ-16 | **Edit from Review & Submit — return destination:** After tapping Edit on a section and making changes, does Back return to Review & Submit or to the hub? | Yes — affects navigation test cases |
| OQ-17 | **Session expiry mid-form:** If the client's auth session expires while filling a form, does auto-save still fire before the session expires, or is in-flight data lost? | YES — data loss risk |
| OQ-18 | **Aadhaar OTP retry limit:** Is there a lockout after N consecutive failed OTP attempts? What is N? | YES — blocks negative test boundary |
| OQ-19 | **Document removal in Under Review state:** Can a client remove an uploaded document after submission (while Under Review)? | No — out of scope if not possible, but must confirm |
| OQ-20 | **Page reload during document upload:** What is the UI state when the client reloads the browser mid-upload? Is the upload retried automatically or shown as failed? | No — edge case; nice-to-have |
| OQ-21 | **Completion % calculation location:** Is completion % calculated server-side (returned via API) or client-side (computed from local state)? This affects reliability under concurrent edits. | YES — affects auto-save integration design |
| OQ-22 | **Duplicate application prevention:** Can a client tap "Begin Application" while an application already exists (e.g., via browser history)? Is there a server-side guard? | YES — data integrity risk |
| OQ-23 | **Query section scope:** Can Ops raise a query against the KYC section, or only Personal Details and Documents? (QA Knowledge flagged this.) | YES — affects Query Detail deep-link target and correction flow scope |

---

## Coverage Recommendation

### Deep Coverage Required (P1 — Every path tested)

| Area | Recommended Test Types | Reason |
|---|---|---|
| Hub completion % and Review & Submit gate | E2E, boundary | Core business gate; wrong % causes incorrect blocking or bypassing |
| Auto-save and draft persistence | E2E, session-simulation | Data loss directly breaks the core JTBD promise |
| Submit Application (gate, idempotency) | E2E + API | Legal submission — duplicate or unchecked submit is a compliance issue |
| KYC flow (all sub-steps, all error states) | E2E, state-transition | Sequential lock, retry logic, and unlock side-effects are all high risk |
| Document upload (type, size, item isolation) | E2E + API (server-side) | Security: file type bypass; business: item isolation prevents correction cascade |
| Application Correction (Fix This, Submit Corrections gate) | E2E | Correction gate has the same criticality as submission gate |
| Authentication enforcement on all routes | Security | Every unauthenticated route access must be verified |
| Cross-client data isolation | Security + API | Privacy and compliance requirement |
| Non-Individual form variant (min 1 Director) | E2E, boundary | Business rule for legal entities |

### Standard Coverage (P2 — Happy path + 1 negative each)

| Area | Recommended Test Types | Reason |
|---|---|---|
| Hub state rendering (Under Review, Approved, Rejected, Queried) | E2E | State correctness; requires Ops Portal in test env |
| Personal Details field rendering and optional/required distinctions | E2E | Field presence and labelling |
| Queries list and Query Detail rendering | E2E | Supporting the correction flow |
| Review & Submit read-only summary accuracy | E2E | Data fidelity check |
| Declaration checkbox enabling Submit | E2E | Functional gate |
| Submission Confirmation reference number format | E2E | Format validation (APP-XXXXXX regex) |
| Responsive layout at 4 breakpoints | Compatibility | All CTAs and fields reachable on all screens |
| Draft expiry banner and pre-fill | E2E (time-manipulated) | Important user experience; testable with DB manipulation |

### Light / Smoke Coverage (P3 — Presence check only)

| Area | Recommended Test Types | Reason |
|---|---|---|
| Static text on all screens | Smoke | Copy errors, while visible, are low impact |
| Document upload progress indicator | Manual / visual | Hard to automate accurately; low business risk |
| Video KYC third-party slot scheduling | Smoke with mock | Actual scheduling is third-party; UI state only |
| Aadhaar OTP countdown timer rendering | Smoke | Duration config-dependent; exact timer not confirmed |
| Android mobile parity | Manual (post-OQ-13 answer) | Mobile test scope undefined — P3 until scoped |

### Test Types Summary

| Layer | Tests Recommended | When |
|---|---|---|
| E2E (Playwright) | New Application happy path, partial fill scenarios, all error states, Application Correction flow | After api.md and admin checklist are available |
| API | Auto-save payload, submit idempotency, server-side file validation, cross-client auth | After api.md is delivered |
| Security | Unauthenticated route access, cross-client write attempt | After api.md; run in every regression cycle |
| Boundary / Data Validation | PIN code (5/6/7 digits), file size (4.9/5.0/5.1 MB), file types, Directors min count | After data-model.md confirmed |
| Visual / Compatibility | Responsive breakpoints, state badge colours | Per sprint; can run in parallel to E2E |
| Time-simulation | Draft expiry, query deadline | Requires test DB date override capability |

---

## Test Readiness Assessment

| Area | Status | Blocker |
|---|---|---|
| Hub states and gate logic | Ready | None |
| Personal Details — Individual | Ready | IFSC/Bank format details pending data-model.md |
| Personal Details — Non-Individual | Ready | Same as above; Director max rows unknown (OQ-10) |
| KYC — PAN and Aadhaar | Ready (conditionally) | OQ-01 (KYC order) must be resolved first |
| KYC — Video KYC | Blocked | Third-party mock required (NT-03) |
| Documents | Blocked | Admin checklist must be seeded (RA-044, OQ-03) |
| Review & Submit | Ready | Minor: OQ-16 (edit return destination) |
| Submission Confirmation | Ready | None |
| Application Correction | Partially ready | OQ-08 (section editability during queried state), OQ-09 (lapse state), Ops Portal needed |
| Auto-save and draft | Ready | Draft expiry needs DB date manipulation (NT-04) |
| API-level tests | Blocked | api.md empty (NT-01) |
| Security tests | Partially blocked | api.md needed for cross-client tests; route auth tests ready now |
| Android mobile | Blocked | OQ-13 (scope undefined) |
