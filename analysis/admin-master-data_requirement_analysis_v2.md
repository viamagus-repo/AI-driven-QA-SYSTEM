# Requirement Analysis: Admin Panel — Master Data

---

## Meta

| Field | Value |
|---|---|
| QA Knowledge Source File | `knowledge/admin-master-data_qa_knowledge_v2.md` |
| Date | 2026-05-06 |
| Version | v2 |
| Analyst | AI QA Pipeline — Stage 2 |
| Prior Version | `analysis/admin-master-data_requirement_analysis_v1.md` |

---

## Requirement Summary

| Metric | Count |
|---|---|
| **Total Requirements** | **75** |
| Functional | 47 |
| UI/UX | 7 |
| Data Validation | 8 |
| Business Rule | 7 |
| Integration | 3 |
| Non-Functional — Security | 3 |
| **By Risk Level** | |
| High | 22 |
| Medium | 30 |
| Low | 23 |
| **By Testability** | |
| Testable | 59 |
| Partially Testable | 11 |
| Not Testable | 5 |
| **By Coverage Priority** | |
| P1 — Must Test | 28 |
| P2 — Should Test | 31 |
| P3 — Nice to Test | 16 |

---

## Requirements Table

### Authentication & Authorization

| ID | Requirement Statement | Category | Risk | Testability | Priority | Notes |
|---|---|---|---|---|---|---|
| REQ-001 | Unauthenticated request to any `/admin/*` route must redirect to `/login` with 401 response | Functional | High | Testable | P1 | All admin routes must be protected |
| REQ-002 | Authenticated user with a non-Admin role accessing `/admin/*` must receive a 403 Forbidden response | Functional | High | Testable | P1 | Server must enforce role, not just UI |
| REQ-003 | On session expiry, the admin is auto-logged out and redirected to `/login` regardless of current page state | Functional | High | Partially Testable | P1 | Side-sheet open mid-form scenario — form values lost behavior unclear (see Gap EC-008) |

---

### Navigation & Routing

| ID | Requirement Statement | Category | Risk | Testability | Priority | Notes |
|---|---|---|---|---|---|---|
| REQ-004 | Master Data Types page loads correctly at route `/admin/master-data-types` | Functional | Medium | Testable | P1 | — |
| REQ-005 | Master Data page loads correctly at route `/admin/master-data` with first active type tab pre-selected | Functional | Medium | Testable | P1 | — |
| REQ-006 | Deep-link `/admin/master-data?type=<slug>` pre-selects the tab matching the given slug | Functional | Medium | Testable | P2 | — |
| REQ-007 | Clicking "N entries →" on the Types page navigates to `/admin/master-data?type=<typeCode>` and pre-selects the correct tab | Functional | Medium | Testable | P2 | — |
| REQ-008 | Deep-link to a deactivated type's slug renders the tab in an inactive visual state with entries displayed | Functional | High | Partially Testable | P2 | Spec/FE discrepancy confirmed — verify against API integration build (see BR-010, EC-003) |

---

### Master Data Types — Create

| ID | Requirement Statement | Category | Risk | Testability | Priority | Notes |
|---|---|---|---|---|---|---|
| REQ-009 | Clicking "Add Type" opens the Create Type side sheet as a right-side overlay | Functional | Low | Testable | P2 | — |
| REQ-010 | Name field is required; leaving it empty and clicking Save must show inline error "Name is required" and block submission | Data Validation | Medium | Testable | P1 | — |
| REQ-011 | As the admin types in the Name field, Type Code auto-generates in real time using the derivation rule: `toLowerCase → trim → spaces to underscores → strip non-[a-z0-9_] → collapse underscores → strip leading/trailing underscores` | Functional | Medium | Testable | P1 | — |
| REQ-012 | The auto-generated Type Code is editable by the admin before the first save | Functional | Medium | Testable | P2 | — |
| REQ-013 | A helper text "Auto-generated. Cannot be changed after saving." must be visible under the Type Code field on the Create sheet | UI/UX | Low | Testable | P3 | — |
| REQ-014 | Submitting a Type Code that already exists for another type must show inline error "This code is already in use" and disable Save | Data Validation | High | Testable | P1 | — |
| REQ-015 | No Status toggle is shown on the Create Type sheet — all new types are Active by default | Functional | Medium | Testable | P1 | BR-003 |
| REQ-016 | On successful save, the side sheet closes and the new type appears in the types table with toggle ON and Status = Active | Functional | Medium | Testable | P1 | — |
| REQ-017 | The newly created type is immediately available as a tab on the Master Data page without page refresh | Functional | Medium | Testable | P2 | — |

---

### Master Data Types — Edit

| ID | Requirement Statement | Category | Risk | Testability | Priority | Notes |
|---|---|---|---|---|---|---|
| REQ-018 | Clicking the edit icon on a type row opens the Edit Type side sheet pre-filled with current Name, Type Code, and Status | Functional | Medium | Testable | P1 | — |
| REQ-019 | Type Code in the Edit sheet is read-only and displays a lock icon | UI/UX | Medium | Testable | P1 | BR-001 |
| REQ-020 | Name is editable in the Edit sheet | Functional | Low | Testable | P2 | — |
| REQ-021 | Status toggle is editable in the Edit sheet and controls the type's `active` flag | Functional | Medium | Testable | P1 | — |
| REQ-022 | Edit sheet subtitle "Changes take effect immediately across the platform." must be visible | UI/UX | Low | Testable | P3 | — |
| REQ-023 | Saving with Status ON commits immediately without triggering any popup | Functional | Low | Testable | P2 | — |
| REQ-024 | Saving with Status OFF and 0 active entries triggers the simple deactivation popup | Functional | Medium | Testable | P1 | BR-005 |
| REQ-025 | Saving with Status OFF and ≥1 active entries triggers the cascade warning popup | Functional | High | Testable | P1 | BR-004 |

---

### Master Data Types — Deactivate (Simple)

| ID | Requirement Statement | Category | Risk | Testability | Priority | Notes |
|---|---|---|---|---|---|---|
| REQ-026 | Toggling a type's row switch OFF when it has 0 active entries must show the simple deactivation popup | Functional | Medium | Testable | P1 | — |
| REQ-027 | The simple popup must contain a "Deactivate" action (destructive style) and a "Cancel" action | UI/UX | Low | Testable | P2 | — |
| REQ-028 | Confirming the simple popup sets the type's `active = false`; Status chip changes to Inactive and toggle remains OFF | Functional | Medium | Testable | P1 | — |
| REQ-029 | Canceling the simple popup reverts the toggle to ON with no data change | Functional | Medium | Testable | P1 | — |

---

### Master Data Types — Deactivate (Cascade)

| ID | Requirement Statement | Category | Risk | Testability | Priority | Notes |
|---|---|---|---|---|---|---|
| REQ-030 | Toggling a type OFF (or saving with status OFF) when it has ≥1 active entries must show the cascade warning popup | Functional | High | Testable | P1 | BR-004 |
| REQ-031 | The cascade popup must display the real-time count of currently active entries as [N] — not total entries and not a cached value | Business Rule | High | Testable | P1 | EC-001; race condition risk — QR-002 |
| REQ-032 | Confirming cascade deactivation must set the type AND all its currently active entries to `active = false` atomically; partial deactivation is not acceptable | Business Rule | High | Testable | P1 | BR-004, QR-001 — must test all-or-nothing |
| REQ-033 | Canceling the cascade popup reverts the toggle to ON; no entry is changed | Functional | High | Testable | P1 | — |

---

### Master Data Types — Reactivate

| ID | Requirement Statement | Category | Risk | Testability | Priority | Notes |
|---|---|---|---|---|---|---|
| REQ-034 | Toggling a type's status from Inactive to Active is immediate with no popup confirmation | Functional | Low | Testable | P2 | BR-011 |
| REQ-035 | Reactivating a previously cascade-deactivated type must NOT auto-reactivate any of its entries; entries remain `active = false` | Business Rule | High | Testable | P1 | BR-006, QR-004 — critical integrity rule |

---

### Master Data — Tab Behavior

| ID | Requirement Statement | Category | Risk | Testability | Priority | Notes |
|---|---|---|---|---|---|---|
| REQ-036 | The tab strip on the Master Data page must show only types where `active = true`; inactive types must not appear as tabs (except via deep-link, see REQ-008) | Functional | High | Testable | P1 | BR-009 |
| REQ-037 | Tab order must reflect the `sort_order` value of each type | Business Rule | Medium | Partially Testable | P2 | Gap-004 — no mechanism documented for admin to set type sort_order |

---

### Master Data — Create Entry

| ID | Requirement Statement | Category | Risk | Testability | Priority | Notes |
|---|---|---|---|---|---|---|
| REQ-038 | Clicking "Add Entry" opens the Create Entry side sheet with the Type dropdown pre-selected to the currently active tab | Functional | Low | Testable | P2 | — |
| REQ-039 | Label field is required; empty Label blocks Save with inline error "Label is required" | Data Validation | Medium | Testable | P1 | — |
| REQ-040 | Entry Code auto-generates from Label using the same derivation rule as Type Code | Functional | Medium | Testable | P1 | — |
| REQ-041 | Entry Code is editable before the first save | Functional | Low | Testable | P2 | — |
| REQ-042 | Submitting an Entry Code already used for another entry within the same type must show inline error "This code is already in use for this type" | Data Validation | High | Testable | P1 | BR-002; error is scoped to type |
| REQ-043 | The same Entry Code is allowed to exist under different types (uniqueness is type-scoped, not global) | Business Rule | Medium | Testable | P2 | BR-002, EC-010 |
| REQ-044 | Sort Order defaults to last position + 1 when left blank on Create | Data Validation | Medium | Testable | P2 | EC-005 |
| REQ-045 | No Status toggle is shown on the Create Entry sheet — all new entries are Active by default | Functional | Low | Testable | P1 | BR-003 |
| REQ-046 | On successful save, the side sheet closes and the new entry appears in the list with toggle ON and Status = Active | Functional | Low | Testable | P1 | — |

---

### Master Data — Edit Entry

| ID | Requirement Statement | Category | Risk | Testability | Priority | Notes |
|---|---|---|---|---|---|---|
| REQ-047 | Clicking the edit icon on an entry row opens the Edit Entry side sheet pre-filled with Type (read-only), Label, Entry Code (read-only), Sort Order, and Status | Functional | Medium | Testable | P1 | — |
| REQ-048 | Type field in Edit Entry sheet is read-only (plain text); entries cannot be moved between types | Business Rule | High | Testable | P1 | BR-007 |
| REQ-049 | Entry Code in Edit Entry sheet is read-only with lock icon | UI/UX | Medium | Testable | P1 | BR-002 |
| REQ-050 | Label and Sort Order are editable in the Edit Entry sheet | Functional | Low | Testable | P2 | — |
| REQ-051 | Saving Edit Entry with Status OFF triggers a deactivation popup showing the entry's Label | Functional | Medium | Testable | P1 | — |

---

### Master Data — Deactivate Entry

| ID | Requirement Statement | Category | Risk | Testability | Priority | Notes |
|---|---|---|---|---|---|---|
| REQ-052 | Toggling an entry's row switch OFF shows popup: "Deactivate entry?" with the entry Label in bold | UI/UX | Medium | Testable | P1 | Flow 8 |
| REQ-053 | The popup text must read "**[Entry Label]** will no longer be available across the platform." | UI/UX | Low | Testable | P3 | — |
| REQ-054 | Confirming entry deactivation sets `active = false`; row remains visible with inactive visual state | Functional | Medium | Testable | P1 | — |
| REQ-055 | Canceling entry deactivation popup reverts toggle to ON; no data change | Functional | Medium | Testable | P1 | — |
| REQ-056 | Toggling entry status from Inactive to Active is immediate with no popup confirmation | Functional | Low | Testable | P2 | BR-011 |

---

### Drag-to-Reorder

| ID | Requirement Statement | Category | Risk | Testability | Priority | Notes |
|---|---|---|---|---|---|---|
| REQ-057 | Drag handles on entry rows must be visible when viewing a single type's tab on the Master Data page | Functional | Medium | Testable | P2 | BR-008 |
| REQ-058 | Drag handles must NOT be visible when viewing a state other than a single active tab (e.g., all-types view or no-tab state) | Functional | Medium | Partially Testable | P2 | BR-008 — exact multi-tab visibility not fully documented |
| REQ-059 | Dragging an entry row to a new position must update the sort order immediately on drop — no explicit Save required | Functional | High | Testable | P1 | QR-006 — risk of sort order not persisting to API |
| REQ-060 | Sort order must persist after page refresh (server-persisted, not just client-side state) | Functional | High | Testable | P1 | QR-006 |
| REQ-061 | Sort order numbers must update visually to reflect the new order after a drag | UI/UX | Low | Testable | P3 | — |

---

### Server-Side Immutability

| ID | Requirement Statement | Category | Risk | Testability | Priority | Notes |
|---|---|---|---|---|---|---|
| REQ-062 | A direct API PATCH that attempts to change a type's `slug` field must be rejected by the server (400 or 422) | Non-Functional — Security | High | Testable | P1 | QR-003; UI read-only is not a security control |
| REQ-063 | A direct API PATCH that attempts to change an entry's `key` field must be rejected by the server (400 or 422) | Non-Functional — Security | High | Testable | P1 | QR-003 |
| REQ-064 | A direct API PATCH that attempts to change an entry's `type_id` field must be rejected by the server | Non-Functional — Security | High | Testable | P1 | BR-007; server must enforce, not just UI |

---

### Code Auto-Generation

| ID | Requirement Statement | Category | Risk | Testability | Priority | Notes |
|---|---|---|---|---|---|---|
| REQ-065 | Code derivation: "Account Type" → `account_type` | Data Validation | Medium | Testable | P1 | Canonical example |
| REQ-066 | Code derivation: "Non-Individual" → `non_individual` | Data Validation | Medium | Testable | P2 | Hyphen handling |
| REQ-067 | Code derivation: "PAN Card" → `pan_card` | Data Validation | Medium | Testable | P2 | — |
| REQ-068 | Code derivation: names with leading/trailing spaces must be trimmed before generating the code | Data Validation | Medium | Testable | P2 | EC-006 |
| REQ-069 | Code derivation: "Type 2" → `type_2` (numbers are preserved) | Data Validation | Low | Testable | P3 | EC-006 |
| REQ-070 | Code derivation: a name containing only special characters (e.g., "@#$") must not produce an empty code silently — expected behavior is unspecified (Gap-011); result must at minimum not bypass the required-field validation | Data Validation | Medium | Partially Testable | P2 | Gap-011 — exact output unknown; test for graceful failure |

---

### Error Handling

| ID | Requirement Statement | Category | Risk | Testability | Priority | Notes |
|---|---|---|---|---|---|---|
| REQ-071 | A network or API failure on Save must keep the side sheet open with form values intact and display toast error "Failed to save. Please try again." | Functional | Medium | Testable | P1 | E3, QR-015 |
| REQ-072 | Popups (all deactivation and cascade popups) must not be dismissable by clicking the overlay background outside the modal | UI/UX | Medium | Testable | P1 | BR-012 |

---

### Seed Data & Deployment

| ID | Requirement Statement | Category | Risk | Testability | Priority | Notes |
|---|---|---|---|---|---|---|
| REQ-073 | On first deployment, all 5 master types (`account_type`, `document_type`, `rejection_reason`, `query_category`, `sla`) must be present and active | Integration | High | Testable | P1 | QR-008; deployment smoke test |
| REQ-074 | All specified seed entries for each type must be present, active, and have correct `key` values after first deployment | Integration | High | Testable | P1 | QR-008; 7 + 8 + 3 + 4 + 2 = 24 entries |
| REQ-075 | Empty state on the Master Data Types page is a deployment blocker signal — absence of seed data must be detectable in QA sign-off | Integration | High | Partially Testable | P1 | EC-012 |

---

## High-Risk Requirements

| Req ID | Statement | Why High Risk |
|---|---|---|
| REQ-001 | Unauthenticated access redirected to login | All admin data exposed if auth enforcement is missing |
| REQ-002 | Non-Admin role gets 403 | Role bypass would allow non-admin users to modify platform reference data |
| REQ-008 | Deep-link to deactivated type | Confirmed spec/FE discrepancy — undefined behavior at integration |
| REQ-014 | Duplicate Type Code blocked | Duplicate codes corrupt downstream portals that resolve types by slug |
| REQ-025 | Cascade popup shows real-time active entry count | Stale count misleads admin; race condition could cause unintended mass deactivation |
| REQ-030 | Cascade popup triggered when ≥1 active entries exist | Missing cascade check allows silent entry state corruption |
| REQ-031 | Cascade popup count = active entries only (not total) | Wrong count shown → admin may not understand the deactivation scope |
| REQ-032 | Cascade deactivation is atomic (all or nothing) | Partial deactivation leaves data in inconsistent state; downstream portals may get broken reference data silently |
| REQ-033 | Cascade cancel reverts type toggle with no entry change | If entries are changed on cancel, data integrity is violated |
| REQ-035 | Reactivating type does NOT auto-reactivate entries | Auto-reactivation would violate BR-006 and could unexpectedly surface deactivated entries across downstream portals |
| REQ-036 | Inactive types not shown as tabs | Inactive type tab visible would expose entries that should be hidden |
| REQ-042 | Duplicate Entry Code within type is blocked | Duplicate entry codes can break downstream lookups (document rules, decision flows) |
| REQ-048 | Type field is read-only in Edit Entry | Allowing type change would corrupt the FK relationship and associated data |
| REQ-059 | Drag-reorder persists on drop (no Save needed) | Sorting must hit the API — client-only persistence is lost on refresh |
| REQ-060 | Sort order server-persisted after drag | Failure to persist sort order causes inconsistent display across sessions |
| REQ-062 | Server rejects PATCH that changes type slug | UI read-only is cosmetic; API-direct slug changes destroy uniqueness invariants |
| REQ-063 | Server rejects PATCH that changes entry key | Same as above for entry codes |
| REQ-064 | Server rejects PATCH that changes entry type_id | Allows bypassing the type-lock constraint; corrupts FK integrity |
| REQ-071 | Save failure — form preserved + toast shown | Silent failure or lost form data creates frustrating user experience and risk of duplicate submits |
| REQ-072 | Popup not dismissable by outside click | Accidental dismiss could cause unintended non-action or confusion on critical deactivation |
| REQ-073 | 5 seed types present on first deployment | All downstream portals (Client Portal, Ops Portal, Configuration, Case Assignment) are broken without seed data |
| REQ-074 | 24 seed entries present on first deployment | Document upload, decision flows, SLA calculations all depend on specific entry codes |

---

## Non-Testable Items

| Req ID / Gap | Item | Reason Not Testable | What Is Needed |
|---|---|---|---|
| Gap-001 | API endpoint contracts (paths, methods, request/response schemas, error codes) | `api.md` is empty — no API contract exists | API spec or Swagger/OpenAPI documentation must be provided |
| Gap-002 | SLA master type UI management | `spec.md` and `screens.md` make no mention of SLA; entry labels, codes, and UI behavior are undefined | Spec must be updated to document SLA type behavior in the Admin UI |
| Gap-004 | Mechanism for setting/changing type sort_order | No UI control for type reordering is documented; how `sort_order` is assigned on type creation is unspecified | Spec must clarify type ordering mechanism |
| Gap-009 | Audit log entries for Master Data actions | Audit Log module behavior for this module is completely undocumented | Confirm which actions generate audit log entries and what fields are captured |
| EC-007 | Race condition behavior (concurrent admin sessions creating same code) | Server conflict resolution (optimistic lock, 409 Conflict, last-write-wins) is not documented | Backend team must specify and implement conflict resolution strategy |

---

## Missing Requirements / Gaps

### Carried from QA Knowledge v2

| Gap ID | Description | Impact on Testing |
|---|---|---|
| Gap-001 | `api.md` is empty — no API contract | All API-layer test cases blocked; only UI-layer tests can proceed |
| Gap-002 | SLA master type not in spec.md | SLA-related entries cannot be verified; seed data assertions for SLA are incomplete |
| Gap-003 | "N entries →" count: total vs. active-only undefined | Cannot write definitive assertion for the entries count display in the Types table |
| Gap-004 | Type sort_order assignment mechanism undocumented | Tab ordering on Master Data page cannot be deterministically tested |
| Gap-005 | `jtbd.md` is empty | UX acceptance criteria cannot be written from user-goal framing |
| Gap-006 | `data-model.md` is empty | DB-level constraint enforcement (unique index, FK constraints) cannot be verified without schema |
| Gap-007 | Concurrent duplicate code — server uniqueness enforcement undocumented | Race condition test cases cannot have expected results defined |
| Gap-008 | Pagination for entries table not specified | Cannot verify correct page behavior for types with many entries |
| Gap-009 | Audit logging behavior undocumented | Compliance-related test coverage is blocked |
| Gap-010 | No bulk-reactivate option after cascade deactivation | Cannot test bulk-reactivate; needs spec clarification on whether this is intentional |
| Gap-011 | Code auto-generation for edge-case inputs (all-special-char, unicode, empty result) not specified | Edge-case assertions for the code generation algorithm cannot be written definitively |

### Newly Identified Gaps

| Gap ID | Description | Impact |
|---|---|---|
| Gap-012 | Sort Order validation bounds undefined — negative numbers, zero, duplicate values, and non-integer values have no documented behavior | Sort Order edge-case test assertions cannot be finalized |
| Gap-013 | "Add Entry" button state when all types are inactive — spec does not document whether the button is disabled or if the Type dropdown shows an empty state | EC-004 cannot be tested without this |
| Gap-014 | Session expiry mid-form behavior — whether form values are preserved or lost on redirect to `/login` is undefined | Cannot assert expected behavior on REQ-003 |
| Gap-015 | Drag-to-reorder touch support on 1024px tablet viewports — HTML5 drag API does not work on touch; whether a touch-compatible drag library is used is undocumented | Tablet drag-reorder testing blocked |
| Gap-016 | `metadata` JSON field exposure — Phase 1 spec states it is not exposed in UI, but whether the API response includes it is unspecified | Data privacy assertion cannot be written without API spec |

---

## Coverage Recommendation

### Areas Requiring Deep Testing (E2E + API)

| Area | Justification | Suggested Test Types |
|---|---|---|
| Cascade deactivation (atomicity + count accuracy) | Critical data integrity invariant; partial failure corrupts downstream portals | E2E (UI flow), API (verify all entries deactivated in single transaction), concurrency test |
| Server-side immutability (slug, key, type_id) | UI read-only is not a security control; direct API calls must be rejected | API negative tests (PATCH with disallowed fields) |
| Auth & role enforcement | Role bypass exposes all admin reference data to unauthorized users | API tests with missing/invalid session, wrong-role session |
| Seed data verification | Downstream portals break completely without seed data | Deployment smoke test (all 5 types, 24 entries present and active) |
| Sort order persistence after drag-reorder | Server must persist sort — client-only persistence is lost on refresh | E2E + API (verify sort_order values in DB/API after drag) |
| Reactivation does NOT cascade-reactivate entries | Silently surfacing deactivated entries in downstream portals | E2E regression after cascade deactivation cycle |

### Areas Suitable for Smoke Testing

| Area | Justification |
|---|---|
| Create Type and Create Entry happy paths | Core admin workflow; covered by seed data assertion on deployment |
| Edit Type name and Edit Entry label | Low-risk field changes; quick regression coverage sufficient |
| Toggle ON (reactivation) — no popup | Simple immediate action; single positive test sufficient |
| Breadcrumb and layout rendering | Visual correctness; low business impact |
| Deep-link navigation (active type) | Standard routing; smoke-level coverage sufficient |

### Suggested Test Types by Coverage Area

| Coverage Area | Recommended Test Types |
|---|---|
| Full CRUD flows for Types and Entries | E2E (Playwright) |
| Cascade deactivation & reactivation invariants | E2E + Integration |
| Server-side immutability (slug/key/type_id lock) | API tests (REST) |
| Auth — 401/403 enforcement | API tests |
| Sort order persistence | E2E + API |
| Code auto-generation derivation | Unit tests + E2E |
| Popup non-dismissability | E2E |
| Error state (network failure, duplicate code) | E2E with network stubbing |
| Seed data on deployment | Smoke / Deployment gate test |
| Concurrent duplicate code submission | Load / concurrency test |
| Drag-to-reorder (desktop) | E2E (desktop viewport) |
| Drag-to-reorder (tablet / touch) | **Blocked** — Gap-015 |
| API contract validation | **Blocked** — Gap-001 |
| SLA type management | **Blocked** — Gap-002 |
| Audit log entries | **Blocked** — Gap-009 |
