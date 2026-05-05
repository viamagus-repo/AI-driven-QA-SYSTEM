# QA Knowledge: NeRL Client Portal — Application Module

---

## Meta

| Field | Value |
|---|---|
| Feature / Module | Application (Client Portal) |
| Project | NeRL Online Client Account Opening |
| Source inputs used | `flow.md`, `spec.md`, `screens.md`, `jtbd.md`, `research.md`, `project.md`, `portals/client-portal/_portal.md` |
| Inputs unavailable | `api.md` (empty), `data-model.md` (empty), `layout.md` (empty), `context/transcripts.md` (empty) |
| Date | 2026-05-04 |
| Version | v1 |
| Pipeline stage | Stage 1 — QA Knowledge |
| Next stage | Requirement Analysis (`requirement-analysis` skill) |

---

## Business Context

### Business Objective
Replace NeRL's fully manual client onboarding (physical forms, scanned documents) with a self-service digital application portal. Clients must be able to fill, submit, and track their account opening application without staff assistance, and fix reviewer-flagged corrections without restarting from scratch.

### Target Users / Personas

| User | Description |
|---|---|
| Individual Client | Prospective retail investor applying to open a personal NeRL repository account |
| Non-Individual / Entity Client | Company, trust, or other legal entity applying via an authorised signatory |
| Ops Agent | NeRL reviewer who reviews submitted applications and raises query rounds (out of scope for this portal, but their actions drive the Application Correction flow) |

### Success Criteria
1. A client can start and fully submit an application across multiple sessions without data loss.
2. Completion percentage on the hub accurately reflects section state at all times.
3. Review & Submit is gated and only unlocks when all three sections reach 100%.
4. A client corrects all flagged fields and re-submits via Submit Corrections in one session.
5. Auto-save fires on every field change — no form data is lost on navigation.

---

## Functional Scope

### In-Scope

**My Application Hub**
- "No Application" state with Begin Application CTA
- "In-progress" hub: three section cards (Personal Details, KYC, Documents) each showing completion percentage; Review & Submit card locked until all sections 100%
- "Under Review" state: read-only, no actions
- "Queried" state: alert banner with open query count and deadline; View Queries CTA; sections read-only
- "Approved" state: approved badge; View My Account CTA
- "Rejected" state: rejected badge; rejection reason; no further actions

**Personal Details Section**
- Individual variant: Full Name, Date of Birth, Address (Line 1, Line 2, City, State, PIN), Occupation, Annual Income, Bank Account Number, IFSC Code, Bank Name
- Non-Individual variant: Entity Name, Registration Number, GST Number, Directors/Trustees (repeatable, min 1), Authorised Signatory, Bank Account Number, IFSC Code, Bank Name
- Auto-save on every field change (no Save button)

**KYC Section**
- Three sequential sub-steps: PAN → Aadhaar → Video KYC (each unlocks only when the previous passes)
- PAN: text input + Verify PAN → Verified / Failed states
- Aadhaar: number input + Send OTP → OTP entry (6 digits, countdown, Resend OTP) → Verified / Failed states
- Video KYC: Schedule Slot → Scheduled (reschedule available) → Passed / Failed-Retry states

**Documents Section**
- Checklist driven by admin config per account type
- Per item: document type label, required/optional tag, Upload/Re-upload CTA, uploaded filename + Remove link
- States: Default, Uploading (progress indicator), All Uploaded, Re-upload Required (red-marked)

**Review & Submit**
- Read-only summary of all section data (Personal Details fields, KYC sub-step statuses, uploaded document names)
- Edit links per section navigating back to that section
- Declaration checkbox (required to enable Submit Application)
- Submit button with loading state; enabled only when declaration checked
- No Submit button without declaration

**Submission Confirmation**
- Reference number displayed (format: APP-XXXXXX)
- No back navigation; forward CTA to My Application (Under Review)

**Queries Module (supporting Application Correction)**
- Queries List: open query cards (section name, summary, round number, deadline); empty state
- Query Detail: ops instruction, Fix This CTA; response-submitted state

**Application Correction Flow**
- Queries nav badge showing open query count
- Fix This deep-links to first red-flagged field in Personal Details or Documents
- Red marking clears per field as corrected
- Submit Corrections activates when all flagged fields are cleared
- Re-submission returns application to Under Review

### Out of Scope
- Authentication portal (separate module — prerequisite)
- Ops Portal (raises queries — reviewed by client only)
- Admin Panel (seeds document checklists, system parameters, roles — tested separately)
- My Account module (post-approval — not yet scaffolded)
- AI/Python backend (OCR, Face Match, Liveness Detection) — Viamagus integrates only; AI backend developed by separate team
- eRepository integration
- iOS mobile (Phase 1 — Android only)
- Multilingual support (English only, Phase 1)
- Email / push notification delivery (badge shown in portal; notification mechanism out of scope)

---

## Entities & Data Models

> Note: `data-model.md` is unpopulated. The following is derived from `spec.md` and `flow.md`. Mark all fields **[VALIDATE]** with engineering before test data design.

### Application

| Field | Type | Notes |
|---|---|---|
| application_id | String | System-generated |
| client_id | FK | Linked to authenticated user |
| account_type | Enum (`Individual`, `NonIndividual`) | Set at registration; drives form variant + document checklist |
| status | Enum | `NoApplication`, `InProgress`, `UnderReview`, `Queried`, `Approved`, `Rejected` |
| completion_personal_details | Integer (0–100) | % complete |
| completion_kyc | Integer (0–100) | % complete |
| completion_documents | Integer (0–100) | % complete |
| reference_number | String | Format: `APP-XXXXXX`; assigned on submission |
| rejection_reason | String | Present only in Rejected state |
| draft_expires_at | Timestamp | 1 month from creation; configurable by Admin |
| submitted_at | Timestamp | Set on Submit Application |

### Personal Details — Individual

| Field | Constraint |
|---|---|
| full_name | Text, required |
| date_of_birth | Date, required |
| address_line_1 | Text, required |
| address_line_2 | Text, optional |
| city | Text, required |
| state | Dropdown, required |
| pin_code | 6-digit numeric, required |
| occupation | Dropdown, required |
| annual_income | Dropdown (range bands), required |
| bank_account_number | Text, required |
| ifsc_code | Text, required |
| bank_name | Text, required |

### Personal Details — Non-Individual

| Field | Constraint |
|---|---|
| entity_name | Text, required |
| registration_number | Text, required |
| gst_number | Text, optional |
| directors_trustees | Repeatable text, min 1 entry, required |
| authorised_signatory | Text, required |
| bank_account_number | Text, required |
| ifsc_code | Text, required |
| bank_name | Text, required |

### KYC

| Sub-step | Field | Constraint |
|---|---|---|
| PAN | pan_number | Text, standard PAN format [VALIDATE] |
| PAN | pan_status | Enum: `Pending`, `Verified`, `Failed` |
| Aadhaar | aadhaar_number | 12-digit numeric [VALIDATE] |
| Aadhaar | otp | 6-digit numeric |
| Aadhaar | aadhaar_status | Enum: `Pending`, `OTPSent`, `Verified`, `Failed` |
| Video KYC | slot_datetime | DateTime |
| Video KYC | video_kyc_status | Enum: `Pending`, `Scheduled`, `Passed`, `FailedRetry` |
| Video KYC | retries_remaining | Integer [VALIDATE max — spec shows retries count, no max specified] |

### Document Item

| Field | Constraint |
|---|---|
| document_type | String (admin-configured label) |
| is_required | Boolean |
| upload_status | Enum: `Pending`, `Uploading`, `Uploaded`, `ReuploadRequired` |
| file_name | String (shown after upload) |
| max_file_size | 5 MB |
| allowed_types | PDF, JPG, PNG |

### Query

| Field | Constraint |
|---|---|
| query_id | String |
| section | Enum: `PersonalDetails`, `Documents` [VALIDATE — KYC queries possible?] |
| summary | String |
| round_number | Integer (1–10, configurable max) |
| deadline | Date |
| ops_instruction | String |
| flagged_fields | Array of field references |
| status | Enum: `Open`, `ResponseSubmitted` |

---

## User Flows

### Flow 1: New Application (Happy Path)

| Step | Screen / State | Actor | Action | System Response |
|---|---|---|---|---|
| 1 | My Application — No Application | Client | Tap Begin Application | Navigate to My Application (In-progress Hub) |
| 2 | My Application — In-progress | Client | View section cards | Hub shows Personal Details, KYC, Documents cards at 0%; account type reflected from registration |
| 3 | Personal Details | Client | Fill form fields (Individual or Non-Individual variant) | Auto-save on each field change; no Save button |
| 4 | My Application — In-progress | Client | Navigate back (Back button) | Personal Details card updates completion % |
| 5 | KYC — PAN Pending | Client | Enter PAN number + Verify PAN | PAN verified → Aadhaar step unlocks |
| 6 | KYC — Aadhaar Pending | Client | Enter Aadhaar + Send OTP → Enter OTP + Verify | Aadhaar verified → Video KYC step unlocks |
| 7 | KYC — Video KYC Pending | Client | Tap Schedule Slot → select slot | Slot confirmed; state → Scheduled |
| 8 | My Application — In-progress | Client | Return to hub | KYC card updates completion % |
| 9 | Documents | Client | Upload each required document | Auto-save; progress indicator per upload; all-uploaded state reached |
| 10 | My Application — In-progress | Client | Return to hub | Documents card updates completion %; Review & Submit unlocks (all 100%) |
| 11 | Review & Submit | Client | Review read-only summary | All section data shown; Edit links per section available |
| 12 | Review & Submit | Client | Check declaration checkbox | Submit Application button activates |
| 13 | Review & Submit | Client | Tap Submit Application | Loading spinner; system submits |
| 14 | Submission Confirmation | System | — | Reference number shown (APP-XXXXXX); application moves to Ops queue |
| 15 | My Application — Under Review | Client | Tap Back to My Application | Status: Under Review; no actions |

**Decision Points:**
- D1: Any section can be entered first (hub-and-spoke, not linear wizard)
- D2: Review & Submit card locked until all three section cards show 100%
- D3: Submit Application enabled only after declaration checkbox is checked

**Error Paths:**
- E1 — Video KYC Failed: Retry prompt shown with remaining retry count; client reschedules slot
- E2 — Document upload failed: Item-level retry only; other uploads unaffected
- E3 — Draft expired (1 month): Draft cleared; system pre-fills known profile data from user record; banner shown: `"Your previous draft has expired. We've pre-filled your details."`

---

### Flow 2: Application Correction (Happy Path)

| Step | Screen / State | Actor | Action | System Response |
|---|---|---|---|---|
| 1 | Client Portal Nav | Client | Notices Queries badge | Badge shows count of open queries |
| 2 | Queries — Queries Pending | Client | Tap Queries nav item | List of open query cards (section, summary, round, deadline) |
| 3 | Query Detail — Default | Client | Open a query | Ops instruction shown; Fix This CTA displayed |
| 4 | Query Detail | Client | Tap Fix This | Deep-link to first red-marked flagged field in Personal Details or Documents |
| 5 | Application (flagged field) | Client | Fix field or re-upload document | Red marking clears on that field |
| 6 | Application — All flags cleared | Client | All flagged fields fixed | Submit Corrections button activates |
| 7 | Application | Client | Tap Submit Corrections | System re-submits to Ops |
| 8 | My Application — Under Review | System | — | Status returns to Under Review; Queries badge clears |

**Decision Points:**
- D1: Submit Corrections only activates when all red-flagged fields are cleared

**Error Paths:**
- E1 — Query deadline passes: Application lapses; client shown expiry message
- E2 — Document re-upload fails: Item-level retry; other corrections unaffected

**Edge Cases:**
- Client leaves mid-correction: auto-save fires; can return and resume
- Multiple queries open: client works through them one at a time from Queries list

---

## API Surface

> `api.md` is unpopulated at this time. The following endpoints are inferred from functional behaviour described in `spec.md` and `flow.md`. All must be **[VALIDATE]** with the backend engineering team before API-level test design.

| Method | Inferred Path | Purpose | Auth Required |
|---|---|---|---|
| GET | `/client/application` | Fetch application status + section completion % | Yes |
| POST | `/client/application` | Create new application | Yes |
| PATCH | `/client/application/personal-details` | Auto-save personal details fields | Yes |
| POST | `/client/application/kyc/pan/verify` | Verify PAN number | Yes |
| POST | `/client/application/kyc/aadhaar/send-otp` | Send Aadhaar OTP | Yes |
| POST | `/client/application/kyc/aadhaar/verify` | Verify Aadhaar OTP | Yes |
| POST | `/client/application/kyc/video-kyc/schedule` | Schedule Video KYC slot | Yes |
| PATCH | `/client/application/kyc/video-kyc/reschedule` | Reschedule Video KYC slot | Yes |
| POST | `/client/application/documents/upload` | Upload a document item | Yes |
| DELETE | `/client/application/documents/:id` | Remove an uploaded document | Yes |
| POST | `/client/application/submit` | Final submit — moves to Ops queue | Yes |
| POST | `/client/application/corrections/submit` | Submit corrections after query resolution | Yes |
| GET | `/client/queries` | List open queries | Yes |
| GET | `/client/queries/:id` | Get query detail | Yes |

---

## Non-Functional Requirements

### Performance
- Concurrent users in production: 10–15 (low load)
- Monthly application volume: ~300; Annual: ~3,000
- Auto-save must not block UI interaction (fire-and-forget or debounced)
- Document upload: must show progress indicator for files up to 5 MB

### Security / Auth
- All pages require authenticated session; unauthenticated requests redirect to auth portal
- Auto-save endpoints must be scoped to the authenticated client's own application (no cross-client write)
- Document upload: enforce file type (PDF/JPG/PNG) and size (≤ 5 MB) server-side, not only client-side
- Application reference numbers must not be guessable (not sequential integers)

### Accessibility
- Standard required [VALIDATE] — no explicit accessibility standard referenced in source material

### Browser / Device Targets
- Web (responsive): Desktop 1920 × 1080, 1440 × 900; Tablet 1024; Mobile 375px portrait
- Android mobile: React Native (Phase 1)
- iOS: out of scope (Phase 1)
- English only (Phase 1)

### Reliability
- DR RTO: max 1 hour (AWS Mumbai — single-tenant)
- Data retention: Active + 3 years post-deactivation
- Draft expiry: 1 month (configurable by Admin)

---

## Integrations & Dependencies

| Dependency | Type | Impact on Testing |
|---|---|---|
| Authentication Portal | Internal — prerequisite | All client portal tests require a valid authenticated session; auth setup must precede Application tests |
| Admin Panel | Internal — prerequisite | Document checklists, draft expiry period, max query rounds must be admin-configured before Application testing |
| Ops Portal | Internal — external actor | Ops raises queries (Application Correction trigger); test environment needs an Ops user to raise queries for correction flow testing |
| Third-party Video KYC | External | Actual session is third-party; portal only schedules slot — mock or stub in test environment |
| AI/Python Backend (OCR, Face Match, Liveness) | External — integration only | Not in scope for this portal's test; integration tests owned by AI team |
| eRepository | External | Out of scope Phase 1 |

---

## Known Ambiguities & Open Questions

1. **KYC sub-step navigation order contradiction.** `spec.md` states: "PAN → Aadhaar → Video KYC (sequential — next step unlocks when previous passes)." But `flow.md` Step 5 says: "Complete PAN, Aadhaar, Video KYC in any order." **Must clarify**: is KYC sequential or free-order? Test case design depends on this.

2. **Video KYC retry maximum.** `spec.md` shows "remaining retries count" in the UI but does not specify the maximum number of Video KYC retries. The max query rounds (10) is a separate config — does a similar cap apply to Video KYC retries? **[VALIDATE with product/ops]**

3. **Document checklist contents.** The admin-configured checklist is referenced throughout but no example documents are listed. Test case design needs at least two document types (one required, one optional) for each account type. **[Seed admin config before testing]**

4. **`api.md` is empty.** No confirmed API contract exists yet. All inferred endpoints in the API Surface section require engineering sign-off. HTTP status codes, error response shapes, and field-level validation error formats are unknown.

5. **`data-model.md` is empty.** Field-level constraints (PAN format regex, Aadhaar format, IFSC format, PIN code validation, bank account number length) are not confirmed. Current field types derived from UI labels only.

6. **Submission Confirmation — browser back button.** Spec states "no back navigation" on the Confirmation screen. It is unclear whether the app programmatically blocks the browser back button or relies on redirect logic. Browser back button behaviour needs a dedicated test case.

7. **Draft expiry pre-fill scope.** Spec says "pre-fill known profile fields from user record." The exact set of fields pre-filled is not defined. Do KYC statuses reset? Are uploaded documents retained? **[VALIDATE with product]**

8. **Queried state — section editability.** In the "Queried" state, spec says "Application sections shown as read-only." Yet the Application Correction flow edits flagged fields. Is the distinction that sections are read-only except for red-flagged fields? Or does Fix This temporarily unlock the section?

9. **Query lapse state.** `flow.md` E1 (Correction) states: "Application lapses; client shown expiry message." It is unclear whether this results in a new My Application state (e.g., "Lapsed") or remains in "Queried" with an inline error message. **[VALIDATE — affects state inventory]**

10. **Repeatable Directors/Trustees field.** The Non-Individual form has a repeatable input with "add row" behaviour. Maximum number of rows is unspecified, as is the UI for removing a row. **[VALIDATE with designer/engineering]**

11. **Multiple simultaneous query rounds.** The query list shows `Round 1 of 10`. If multiple rounds have open queries simultaneously, the correction flow behaviour (submit corrections for one round vs all rounds) is unclear.

12. **Aadhaar OTP countdown timer duration.** The OTP step shows a countdown timer and Resend OTP link. The timer duration is not specified. **[VALIDATE]**

13. **Mobile parity.** The spec and flow docs are written for web. React Native (Android) parity requirements are not documented for this module. **[VALIDATE — are all states and flows available on Android Phase 1?]**

---

## Testable Surface Summary

### Pages & States (UI)

| Page | States | Variants |
|---|---|---|
| My Application | No Application, In-progress, Under Review, Queried, Approved, Rejected | — |
| Personal Details | Form (auto-save) | Individual, Non-Individual |
| KYC | PAN: Pending / Verified / Failed; Aadhaar: Pending / OTP Sent / Verified / Failed; Video KYC: Pending / Scheduled / Passed / Failed-Retry | — |
| Documents | Default, Uploading, All Uploaded, Re-upload Required | Per account type checklist |
| Review & Submit | Default (locked Submit), All Sections Complete (Submit enabled) | — |
| Submission Confirmation | Default | — |
| Queries List | Queries Pending, No Queries | — |
| Query Detail | Default, Response Submitted | — |

### User Flows

- **New Application — Happy path** (full submission, 15 steps)
- **Application Correction — Happy path** (fix + re-submit, 8 steps)
- **New Application — Resume across sessions** (draft persistence)
- **New Application — Draft expired + pre-fill** (1-month expiry)

### Error & Edge Paths

- Video KYC fails → retry prompt → reschedule slot
- Document upload fails → item-level retry (other items unaffected)
- PAN verification fails → retry
- Aadhaar OTP incorrect → retry
- Aadhaar OTP countdown expires → Resend OTP
- Query deadline passes → application lapses
- Document re-upload fails during correction → item-level retry
- Back navigation mid-section → auto-save (no unsaved warning)
- Mid-correction exit → auto-save → resume

### Validation & Constraints

- PIN Code: 6 digits
- OTP: 6 digits
- Required vs optional field enforcement per section
- Non-Individual: minimum 1 Director/Trustee entry
- Document upload: file type restriction (PDF/JPG/PNG), size limit (≤ 5 MB)
- Declaration checkbox required before Submit Application
- All-sections-100% gate before Review & Submit unlocks
- All-flagged-fields-cleared gate before Submit Corrections activates
- Query round limit (max 10, configurable)

### API-Level (pending `api.md`)

- Auto-save endpoint: called on every field blur; verify payload and response
- Submit Application: idempotency (double-tap prevention)
- Document upload: server-side type + size validation
- KYC verification endpoints: success + failure response handling
- Authentication: unauthenticated access to all routes returns redirect/401
- Cross-client access: client A cannot read/write client B's application

### Non-Functional

- Responsive layout at 4 breakpoints (1920, 1440, 1024, 375px)
- Auto-save does not block UI
- Document upload progress indicator accuracy
- Draft persistence across browser sessions (not just in-tab)
- Submission Confirmation: no browser back navigation
