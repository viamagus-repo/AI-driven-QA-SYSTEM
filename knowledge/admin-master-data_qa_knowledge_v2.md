# QA Knowledge: Admin Panel — Master Data
## Version 2

---

## Meta

| Field | Value |
|---|---|
| Project | NeRL (NeRL Online Client Account Opening) |
| Portal | Admin Panel |
| Module | Master Data |
| Pipeline Stage | Stage 1 — QA Knowledge |
| Source inputs | `../Design-Framework/portals/admin-panel/master-data/spec.md`, `flow-master-data.md`, `screens.md`, `layout.md`, `research.md`, `jtbd.md` (empty), `api.md` (empty), `data-model.md` (empty), `context/transcripts.md` (empty); portal-level `layout.md`, `routes.md` |
| Date | 2026-05-06 |
| Version | v2 |
| v2 Changes Over v1 | Added SLA master type (missed in v1); incorporated DB schema from research.md; distinguished DB field names from UI names; added metadata JSON field; added created_at fields; expanded build-priority blocking; clarified type sort_order open question |

---

## 1. Module Overview

Master Data is the foundational configuration layer of the NeRL platform. It manages system-wide reference tables — master data types and their entries — that every other portal consumes at runtime. The module must be fully seeded before any dependent module (Configuration, Client Portal, Ops Portal) can function correctly.

**Two pages:**
- **Master Data Types** (`/admin/master-data-types`) — admin manages reference table definitions (e.g. Account Type, Document Type).
- **Master Data** (`/admin/master-data`) — admin manages entries under each type (e.g. Individual, PAN Card, Incomplete KYC).

**Why it matters for QA:** Deactivation, duplicate codes, cascade logic, sort-order, and server-side immutability are high-impact invariants. Errors here break downstream portals (Client Portal forms, Ops decision flows, document rules, SLA calculations) without the user necessarily seeing an error in this module itself.

**Build priority — Master Data must be seeded and working before:**
1. Configuration → Document Rules (consumes Account Type + Document Type)
2. Client Portal → Application Form (account type selection, document upload checklist)
3. Ops Portal → Reviewer decision flow (rejection reasons, query categories)
4. Case Assignment → SLA deadline calculation (SLA entries)

---

## 2. User Roles

| Role | Access | Restrictions |
|---|---|---|
| **Admin** | Full CRUD access to all Master Data Types and Entries | Single role — no sub-roles within this module |
| Unauthenticated user | No access — redirected to `/login` | All `/admin/*` routes require authentication |
| Non-Admin authenticated user | No access — 403 expected | Server must enforce role = Admin |

**Auth mechanism:** Session-based (`role = Admin`). On session expiry → auto-logout → redirect to `/login`. No sub-roles or scoped permissions within the Admin panel.

---

## 3. Screen Inventory

### Page 1: Master Data Types

| Screen / State | Route | Component | Trigger |
|---|---|---|---|
| Default — types list | `/admin/master-data-types` | `PageMasterDataTypes` | Direct nav or sidebar |
| Empty state | `/admin/master-data-types` | `PageMasterDataTypes` | No types in DB |
| Side sheet — Create Type | `/admin/master-data-types` | Overlay on page | "Add Type" button clicked |
| Side sheet — Edit Type | `/admin/master-data-types` | Overlay on page | Edit icon on row clicked |
| Popup — Deactivate Type (no entries) | `/admin/master-data-types` | Modal over page | Toggle OFF row with 0 active entries, OR Save in edit sheet with status OFF and 0 active entries |
| Popup — Deactivate Type cascade warning | `/admin/master-data-types` | Modal over page | Toggle OFF row with ≥1 active entries, OR Save in edit sheet with status OFF and ≥1 active entries |

### Page 2: Master Data

| Screen / State | Route | Component | Trigger |
|---|---|---|---|
| Default — first tab selected | `/admin/master-data` | `PageMasterData` | Direct nav or sidebar |
| Deep-link pre-filtered | `/admin/master-data?type=<slug>` | `PageMasterData` | "N entries →" link from types page, or direct URL |
| Tab switched | `/admin/master-data` | `PageMasterData` | Tab click |
| Empty state per tab | `/admin/master-data` (tab with no entries) | `PageMasterData` | No entries for active type |
| Side sheet — Create Entry | `/admin/master-data` | Overlay on page | "Add Entry" button clicked |
| Side sheet — Edit Entry | `/admin/master-data` | Overlay on page | Edit icon on entry row clicked |
| Popup — Deactivate Entry | `/admin/master-data` | Modal over page | Toggle OFF entry row, OR Save in edit sheet with status OFF |
| Drag-reorder active | `/admin/master-data` (single tab) | `PageMasterData` | Drag handles visible on single-tab view |

### Layout Shell (Portal-wide, inherited)

- Fixed top header (full width, logo only in Phase 1)
- Fixed left sidebar (always visible, no collapse on desktop)
- Breadcrumb: `Admin › Master Data Types` or `Admin › Master Data`
- Page title left-aligned, primary action button right-aligned
- Side sheets: slide in from right, 480px width, 32px side padding, 24px field gap, pinned footer
- Popups: centered on full viewport, max 480px, NOT dismissable by clicking outside

---

## 4. Core Flows

### Flow 1: Create Master Data Type (Happy Path)

1. Admin lands on `/admin/master-data-types` — table shows all types
2. Admin clicks **"Add Type"** → Create side sheet opens
3. Admin types a Name → Type Code auto-generates (lowercase, underscored)
4. Admin optionally edits the Type Code (only possible before save)
5. Admin clicks **Save** → side sheet closes; new type appears in table with toggle ON, Status = Active
6. The type immediately becomes available as a tab on the Master Data page

**Key assertion:** New type is Active by default. Type Code is editable in the sheet but locked once saved.

---

### Flow 2: Edit Master Data Type

1. Admin clicks **edit icon** on a type row → Edit side sheet opens pre-filled
2. Type Code field is read-only with lock icon
3. Admin edits Name and/or Status toggle
4. Admin clicks **Save**:
   - If Status ON → save proceeds immediately
   - If Status OFF and no active entries → simple deactivation popup fires
   - If Status OFF and ≥1 active entries → cascade warning popup fires
5. Popup confirm → save commits; popup cancel → sheet stays open, Status toggle restored to ON

---

### Flow 3: Deactivate Type via Row Toggle — No Active Entries

1. Admin toggles type OFF in the list row
2. Simple popup: "Deactivate type?" + body + **Deactivate** (destructive) + **Cancel**
3. Confirm → type `active = false`; Status chip → Inactive; toggle = OFF
4. Cancel → toggle reverts to ON; no change

---

### Flow 4: Deactivate Type via Row Toggle — Cascade (Has Active Entries)

1. Admin toggles type OFF in the list row
2. Cascade popup: "Deactivate type?" + "This will also deactivate **[N] entries** under this type."
3. `[N]` = live count of currently active entries under the type
4. Confirm ("**Deactivate all**") → type `active = false` + all entries under the type `active = false` — atomically
5. Cancel → toggle reverts to ON; no entries changed

**Key assertion:** Entry count `[N]` in the popup must reflect the real-time count of active entries, not a stale value.

---

### Flow 5: Deep-Link from Types to Entries

1. Admin clicks **"N entries →"** on a type row
2. Browser navigates to `/admin/master-data?type=<typeCode>`
3. Master Data page loads with that type's tab pre-selected
4. Table shows entries for that type

---

### Flow 6: Create Master Data Entry (Happy Path)

1. Admin lands on `/admin/master-data` — first active type tab is selected
2. Admin selects a tab → table shows entries for that type
3. Admin clicks **"Add Entry"** → Create side sheet opens with Type pre-selected to the active tab
4. Admin enters Label → Entry Code auto-generates (editable)
5. Admin optionally sets Sort Order (defaults to end of list)
6. Admin clicks **Save** → side sheet closes; new entry appears in list with toggle ON, Status = Active

---

### Flow 7: Edit Master Data Entry

1. Admin clicks **edit icon** on an entry row → Edit side sheet opens pre-filled
2. Type field is read-only (plain text — entries cannot be moved between types)
3. Entry Code field is read-only with lock icon
4. Admin edits Label, Sort Order, and/or Status toggle
5. Admin clicks **Save**:
   - If Status ON → save proceeds immediately
   - If Status OFF → confirmation popup fires: "Deactivate entry?"
6. Confirm → entry deactivated; Cancel → sheet stays open, Status toggle restored to ON

---

### Flow 8: Deactivate Entry via Row Toggle

1. Admin toggles entry OFF in the list row
2. Popup: "Deactivate entry?" + "**[Entry Label]** will no longer be available across the platform."
3. `[Entry Label]` = entry's Label value in **bold**
4. Confirm → entry `active = false`; Status chip → Inactive; row remains visible (inactive visual state)
5. Cancel → toggle reverts to ON

---

### Flow 9: Reactivate (Toggle ON)

- **Type toggle ON:** Immediate, no popup, no confirmation
- **Entry toggle ON:** Immediate, no popup, no confirmation
- **Critical:** Reactivating a cascade-deactivated type does NOT auto-reactivate its entries — each entry must be reactivated individually

---

### Flow 10: Drag-to-Reorder Entries

1. Admin views a single active type tab (drag handles visible in table rows)
2. Admin drags a row to a new position
3. Sort order persists immediately on drop — no explicit Save required
4. Sort order numbers update visually to reflect new order

---

### Error Paths

| Error | Trigger | System Response |
|---|---|---|
| E1: Duplicate Type Code | Save on Create Type sheet | Inline field error: "This code is already in use"; Save disabled until resolved |
| E2: Duplicate Entry Code | Save on Create Entry sheet | Inline field error: "This code is already in use for this type"; scoped to the active type |
| E3: Network/Save failure | API returns error on Save | Side sheet stays open; toast error: "Failed to save. Please try again."; form values preserved |

---

## 5. Field-Level Details

### Create Type Side Sheet

| Field | Type | Required | Placeholder | Validation | Behaviour |
|---|---|---|---|---|---|
| Name | Text input | Yes | `e.g. Account Type` | Non-empty | — |
| Type Code | Text input | Yes | `account_type` | Non-empty, globally unique | Auto-generates from Name (lowercase, underscored); editable before save; locked after save |

- No Status toggle on create — new types default to Active
- Helper on Type Code: "Auto-generated. Cannot be changed after saving."
- Error on empty Name: `Name is required`
- Error on duplicate Type Code: `This code is already in use`

### Edit Type Side Sheet

| Field | Type | Editable | Notes |
|---|---|---|---|
| Name | Text input | Yes | — |
| Type Code | Read-only + lock icon | No | Helper: "Cannot be changed after saving." |
| Status | Toggle: Active / Inactive | Yes (with consequences) | Toggle OFF triggers cascade check on Save |

- Subtitle present: "Changes take effect immediately across the platform."

### Create Entry Side Sheet

| Field | Type | Required | Placeholder | Validation | Behaviour |
|---|---|---|---|---|---|
| Type | Dropdown | Yes | — | Must be selected | Pre-selected to active tab's type; editable |
| Label | Text input | Yes | `e.g. Individual` | Non-empty | — |
| Entry Code | Text input | Yes | `individual` | Non-empty, unique within type | Auto-generates from Label; editable before save; locked after save |
| Sort Order | Number input | No | — | Integer | Defaults to last position + 1 |

- No Status toggle on create — new entries default to Active
- Helper on Entry Code: "Auto-generated. Cannot be changed after saving."
- Error on empty Label: `Label is required`
- Error on duplicate Entry Code: `This code is already in use for this type`

### Edit Entry Side Sheet

| Field | Type | Editable | Notes |
|---|---|---|---|
| Type | Read-only (plain text) | No | Entries cannot be moved between types |
| Label | Text input | Yes | — |
| Entry Code | Read-only + lock icon | No | Helper: "Cannot be changed after saving." |
| Sort Order | Number input | Yes | — |
| Status | Toggle: Active / Inactive | Yes (with consequences) | Toggle OFF triggers confirmation popup on Save |

- Subtitle present: "Changes take effect immediately across the platform."

### Code Auto-Generation Rule

Both `typeCode` (from Name) and `entryCode` (from Label) follow the same derivation:

```
toLowerCase → trim → spaces to underscores → strip non-[a-z0-9_] characters → collapse multiple underscores → strip leading/trailing underscores
```

**Examples:**
- `"Account Type"` → `account_type`
- `"Non-Individual"` → `non_individual`
- `"PAN Card"` → `pan_card`
- `"GST Certificate"` → `gst_certificate`
- `"Board Resolution"` → `board_resolution`
- `"KYC failure"` → `kyc_failure`

**Edge cases to test:**
- All-special-character name (e.g. `"@#$"`) → expected output unknown (gap)
- Leading/trailing spaces
- Numbers in names (e.g. `"Type 2"`) → `type_2`
- Very long names (> 100 chars)
- Single character name
- Names already in lowercase snake_case

---

## 6. Data Model Understanding

> Source: `research.md`. `data-model.md` is empty — research.md is the authoritative DB-level reference. Note that DB field names differ from UI field names in some cases.

### Table: `master_types`

| DB Field | Type | Constraints | UI Name | Notes |
|---|---|---|---|---|
| `id` | UUID | PK, system-generated | — | Not exposed in UI |
| `name` | Text | Required | Name | Human-readable display label |
| `slug` | Text | Required, globally unique, immutable after first save | Type Code | Auto-generated from name; lowercase + underscored |
| `active` | Boolean | Default: `true` | Active toggle / Status chip | Drives tab visibility on Master Data page |
| `created_at` | Timestamp | System-set on insert | — | Not exposed in UI |
| `sort_order` | *(not in research.md but implied by tab ordering)* | Integer | — | Controls tab ordering on Master Data page — see Gap §10.1 |

**UI vs DB naming note:** The UI calls the field "Type Code" but the DB schema uses `slug`. The FK from `master_entries` references `master_types.id`, not `slug` — though the UI sends and receives `typeCode` (slug value).

---

### Table: `master_entries`

| DB Field | Type | Constraints | UI Name | Notes |
|---|---|---|---|---|
| `id` | UUID | PK, system-generated | — | Not exposed in UI |
| `type_id` | UUID (FK → `master_types.id`) | Required | Type (display only) | Entries cannot be moved between types |
| `key` | Text | Required, unique within `type_id`, immutable after first save | Entry Code | Auto-generated from label; lowercase + underscored |
| `label` | Text | Required | Label | Human-readable display |
| `sort_order` | Number | Integer ≥ 1, defaults to last+1 | Sort Order | Controls display order within type tab |
| `active` | Boolean | Default: `true` | Active toggle / Status chip | Cascade-deactivated when parent type is deactivated |
| `metadata` | JSON | Optional, nullable | — | Not exposed in UI in Phase 1; reserved for future type-specific extensions |
| `created_at` | Timestamp | System-set on insert | — | Not exposed in UI |

**UI vs DB naming note:** The UI calls the field "Entry Code" but the DB schema uses `key`. The UI binds to the parent via `typeCode` (slug value) but the DB stores the FK as `type_id` (UUID).

---

### Pre-Loaded Seed Data

All five types and their entries must be seeded on first deployment via migration or seed script. The platform cannot function without this seed data.

| Type | DB slug / UI Type Code | # Entries | Entry Labels | Entry Codes | Consumed By |
|---|---|---|---|---|---|
| Account Type | `account_type` | 7 | Individual, Non-Individual, Company, FPO, Trust, Partnership, LLP | `individual`, `non_individual`, `company`, `fpo`, `trust`, `partnership`, `llp` | Application form, Document Rules |
| Document Type | `document_type` | 8 | PAN Card, Aadhaar, Photo, MOA, Board Resolution, GST Certificate, Bank Statement, Incorporation Certificate | `pan_card`, `aadhaar`, `photo`, `moa`, `board_resolution`, `gst_certificate`, `bank_statement`, `incorporation_certificate` | Document upload, Document Rules |
| Rejection Reason | `rejection_reason` | 3 | Incomplete KYC, Document mismatch, Blacklisted entity | `incomplete_kyc`, `document_mismatch`, `blacklisted_entity` | Ops Portal — rejection decision |
| Query Category | `query_category` | 4 | Document quality issue, Field mismatch, Missing document, KYC failure | `document_quality_issue`, `field_mismatch`, `missing_document`, `kyc_failure` | Ops Portal — query creation |
| SLA *(new in v2 — was missing from v1)* | `sla` | 2 | Review SLA: 3 days, Query Response SLA: 5 days | *(not specified in research.md)* | Case Assignment — SLA deadline calculation |

> **v2 note:** The SLA type was documented in `research.md` but absent from `spec.md` and `screens.md`. This is a gap — the spec does not define the SLA type's entry labels, entry codes, or how it is managed in the UI. See Gap §10.2.

---

## 7. Business Rules

### BR-001: Type Code is globally unique and immutable after first save

A `slug` (Type Code) must be unique across all rows in `master_types`. Once the type is saved for the first time, the code is locked — the UI renders it as a read-only field with a lock icon. Server-side enforcement must reject any PATCH that attempts to change the code.

### BR-002: Entry Code is unique within its type and immutable after first save

A `key` (Entry Code) must be unique within the scope of its parent `type_id`. The same code can exist under different types (e.g., `active` under two different types is allowed). Once saved, the code is locked. Server-side enforcement must reject PATCH attempts.

### BR-003: New types and entries are Active by default

Neither the Create Type nor the Create Entry side sheet exposes a Status toggle. Every newly created type and entry starts with `active = true`.

### BR-004: Deactivating a type with active entries triggers a cascade

When a type is toggled OFF (or saved with status OFF) and it has ≥1 active entries, a cascade confirmation popup is shown. On confirmation, the type AND all its active entries are deactivated atomically. Partially completed deactivation is not acceptable — either all succeed or none change.

### BR-005: Deactivating a type with no active entries requires simple confirmation only

If a type has 0 active entries, the simpler popup is shown ("Deactivate type?" with no entry count). Only the type's `active` flag is changed.

### BR-006: Reactivating a type does NOT auto-reactivate its entries

After a cascade deactivation, if the admin reactivates the type (toggle ON), the entries remain deactivated. Each entry must be individually reactivated. There is no bulk-reactivate.

### BR-007: Entries cannot be moved between types

`type_id` is fixed at creation. The Type field in the Edit Entry sheet is read-only (plain text). No API endpoint should accept a `type_id` change.

### BR-008: Drag-to-reorder is only available on a single type tab

Drag handles are visible only when a single type tab is active on the Master Data page. When navigating away or viewing a combined view (if that exists), handles are hidden. Sort order persists immediately on drop — no separate Save.

### BR-009: Inactive types do not appear as tabs on the Master Data page

The tab strip on Master Data only shows tabs for types where `active = true`. Deactivated types are not tabs. (Exception: deep-link edge case — see BR-010.)

### BR-010: Deep-link to a deactivated type's tab shows the tab in inactive state

If `?type=<slug>` refers to a deactivated type, the tab is still rendered but visually marked as inactive. Entries are shown with inactive visual state. This behaviour is documented in the spec but contradicts the FE implementation which only tabs over `activeTypes` — this is a confirmed spec/code discrepancy that must be verified against the real API integration.

### BR-011: Toggle ON is always immediate — no confirmation required

Both for types and entries, toggling the switch to ON does not require a popup confirmation. The change takes effect immediately.

### BR-012: Popups are not dismissable by clicking outside

All confirmation/warning popups (deactivate type — simple, deactivate type — cascade, deactivate entry) are modal and require an explicit action (confirm or cancel). Clicking the overlay/outside the popup has no effect.

### BR-013: "N entries →" count reflects all entries, not just active ones

The Entries column on the Master Data Types table shows a count and deep-link. The count should reflect all entries under the type (active + inactive combined), as this is a navigation aid, not a status indicator. *Clarification needed — see Gap §10.3.*

### BR-014: Sort order on Master Data Types drives tab ordering on Master Data page

The tab strip on Master Data is ordered by `type sort_order`. However, the Master Data Types table has no visible sort order column and no drag-to-reorder. How types are ordered is undocumented. *See Gap §10.4.*

---

## 8. Edge Cases

### EC-001: Cascade deactivation — N count accuracy

When the cascade popup shows "This will also deactivate **[N] entries**", the count must reflect only currently **active** entries (not total entries). Test: type with 5 entries, 2 already inactive → popup should say "3 entries."

### EC-002: Reactivating a type that was cascade-deactivated

1. Type has 4 active entries → Admin deactivates (cascade) → type + 4 entries all inactive
2. Admin reactivates type (toggle ON) → type `active = true`, but all 4 entries remain `active = false`
3. Master Data page shows the tab again (type is active), but entries table shows 4 inactive entries
4. Admin must reactivate each entry individually

### EC-003: Deep-link to a deactivated type (`?type=<slug>`)

URL: `/admin/master-data?type=rejection_reason` where `rejection_reason` is currently inactive.

- Spec says: tab still shown, visually marked inactive; entries listed with inactive state
- FE prototype: only shows tabs for active types → this tab may not appear at all
- Resolution: must be verified against API integration build

### EC-004: Create entry when no types exist (or all types inactive)

If the Type dropdown in the Create Entry sheet has no options (no active types), can the admin still open the sheet? What state does the dropdown show? The Add Entry button should arguably be disabled. Not documented.

### EC-005: Sort Order field — empty or zero value

What happens if Sort Order is left blank on create? The spec says it defaults to last position. What if `0` is entered — is that valid? Negative numbers? What if two entries have the same sort order — how is tie-breaking handled?

### EC-006: Code auto-generation with special characters

- Input: `"Account @Type!"` → expected: `account_type`
- Input: `"123"` → expected: `123` or an error?
- Input: `"   "` (spaces only) → expected: empty string → validation error?
- Input: `"Aadhaar"` → expected: `aadhaar` (single word, no transform needed)
- Input with unicode/non-ASCII characters (e.g. `"Aadhāār"`) → behavior unspecified

### EC-007: Simultaneous admin actions (race condition)

Two admins (different sessions) simultaneously:
- Both create a type with the same Name → Type Code collision
- One deactivates a type while another is editing it

Server-side conflict resolution must be specified (last-write-wins, optimistic lock, 409 Conflict).

### EC-008: Session expiry while side sheet is open

Admin has a Create/Edit side sheet open and mid-form. Session expires. Expected behavior: redirect to `/login`. But: are form values lost? Is there a grace period? Does the page refresh lose unsaved changes? Behavior must be confirmed.

### EC-009: Drag-to-reorder on tablet (1024px touch input)

Drag handles documented as visible on single-tab-active view. HTML5 drag API may not work on touch devices at 1024px. Whether drag-to-reorder is touch-supported on tablet is undocumented.

### EC-010: Entry Code uniqueness scope

Entry codes are unique within a type. The same code can exist across different types. Test: create entry code `active` under Account Type; then create entry code `active` under Document Type → both should be allowed.

### EC-011: Deactivated entry visibility after type deactivation + reactivation cycle

Flow: Type has entries A (active), B (inactive). Admin cascade-deactivates type. Now: Type inactive, A inactive, B inactive. Admin reactivates type. Now: Type active, A inactive, B inactive. On the Master Data page, the tab reappears. Entries A and B are both shown with inactive state.

### EC-012: Empty state while seed data is missing

If seed data migration fails on deployment, Master Data Types page shows the empty state. Downstream portals (Client Portal, Ops Portal, Configuration) will be broken. Detection: empty state on Master Data Types is a deployment blocker signal.

### EC-013: Type Code / Entry Code — server-side immutability enforcement

If the API is called directly (bypassing UI) with a PATCH that changes the `slug` or `key` field, the server must reject it. Expected response: 400 or 422 with a clear error. The UI's read-only rendering is a convenience, not a security control.

---

## 9. QA Risks

| Risk ID | Description | Severity | Affected Areas | Mitigation |
|---|---|---|---|---|
| QR-001 | Cascade deactivation not atomic — type deactivates but some entries don't | Critical | Data integrity, downstream portals | Test with types having many entries; verify all-or-nothing behavior |
| QR-002 | Entry count in cascade popup is stale (race condition with another admin) | High | Popup UX accuracy | Test with concurrent admin sessions |
| QR-003 | Type Code / Entry Code not enforced server-side — only UI-locked | High | Data integrity, code uniqueness | API-level test required: PATCH code field directly and expect rejection |
| QR-004 | Reactivating type silently auto-reactivates entries (violates BR-006) | High | Data integrity | Test cascade deactivation → type reactivation → confirm entries remain inactive |
| QR-005 | Deep-link to deactivated type shows wrong UI state (spec vs FE discrepancy) | Medium | Navigation, UX | Requires API integration build to verify |
| QR-006 | Drag-to-reorder sort order not persisted on API side | High | Sort order integrity | Test: reorder, refresh, verify order persists |
| QR-007 | SLA type missing from spec.md — UI behavior for SLA entries undefined | High | SLA module, Case Assignment | Spec gap; needs spec clarification before SLA-related tests can be written |
| QR-008 | Seed data not seeded on deployment — all downstream portals broken | Critical | Platform-level dependency | Deployment smoke test: verify all 5 types and their entries on first launch |
| QR-009 | Code auto-generation produces empty string on edge-case names | Medium | Create forms | Test with special character and whitespace-only inputs |
| QR-010 | Concurrent duplicate code submission — server-side uniqueness not enforced | High | Data integrity | Test two simultaneous create requests with same code |
| QR-011 | Popup dismissable by outside click (should NOT be) | Medium | Accidental deactivation | Test clicking overlay background |
| QR-012 | Entries column count includes only active entries (not all entries) — misleading | Medium | UX accuracy | Verify whether count is total or active-only |
| QR-013 | Drag handles visible on multi-tab or no-tab view | Medium | UX correctness | Test visibility of drag handles with 0, 1, and multiple tabs |
| QR-014 | Sort Order default value not last-position when entries are reordered | Low | Sort order accuracy | Test: create entry after drag-reorder; verify it appends to end |
| QR-015 | Network error toast not shown / form values lost on save failure | Medium | Error recovery | Simulate 500 response; verify toast and form state |
| QR-016 | Unauthenticated or non-Admin access to `/admin/*` routes returns wrong status | High | Security / Auth | Test 401 (no session) and 403 (wrong role) on all endpoints |
| QR-017 | `metadata` JSON field populated unintentionally or exposed in API response | Low | Data integrity | Verify metadata is null/empty in Phase 1 responses |

---

## 10. Gaps / Missing Requirements

### Gap-001: `api.md` is empty — no API contract defined

**Impact:** API-layer test cases cannot be written. Endpoint paths, HTTP methods, request/response schemas, error codes, and rate limits are all unknown. The expected API surface inferred from UI behavior is:

| Method | Inferred Path | Description |
|---|---|---|
| GET | `/api/admin/master-data/types` | List all types |
| POST | `/api/admin/master-data/types` | Create new type |
| PATCH | `/api/admin/master-data/types/:id` | Edit type name / status |
| POST | `/api/admin/master-data/types/:id/deactivate` | Cascade deactivate type + entries |
| GET | `/api/admin/master-data/entries?typeCode=<slug>` | List entries by type |
| POST | `/api/admin/master-data/entries` | Create new entry |
| PATCH | `/api/admin/master-data/entries/:id` | Edit entry label / sortOrder / status |
| PATCH | `/api/admin/master-data/entries/reorder` | Batch sort order update after drag |

These are inferred only. API testing is **blocked** until `api.md` is populated.

---

### Gap-002: SLA master type — spec.md is silent

`research.md` documents a fifth master type: **SLA** (`sla` slug) with entries "Review SLA: 3 days" and "Query Response SLA: 5 days", consumed by Case Assignment for deadline calculation. `spec.md`, `screens.md`, and `flow-master-data.md` make no mention of SLA.

**Open questions:**
- Is SLA managed in the same Master Data UI (tabs on Master Data page)?
- Are SLA entry values plain labels, or does the system parse them as durations?
- How does Case Assignment consume SLA entries — by entry code or by label?
- If SLA entries are deactivated, does case assignment break?
- Should SLA be part of the seed data assertion in deployment smoke tests?

**QA cannot cover SLA entries** until the spec gap is resolved.

---

### Gap-003: "N entries →" count — active-only or total?

The Entries column on the Master Data Types page shows "N entries →". It is not documented whether N counts:
- All entries (active + inactive combined), OR
- Active entries only

This affects the cascade popup count alignment and test assertions.

---

### Gap-004: Type sort_order field — how types are ordered

The tab strip on Master Data is ordered by type `sort_order`. The Master Data Types list has no sort order column and no drag-to-reorder feature. There is no documented mechanism for an admin to set or change the order of types. This means:

- How is `sort_order` assigned on type creation? (auto-increment? alphabetical?)
- Can the admin reorder types? If not, is creation order the only control?
- This directly affects tab ordering on Master Data — a UI correctness risk.

---

### Gap-005: `jtbd.md` is empty

Jobs-To-Be-Done have not been documented. The module purpose can be inferred from other files, but specific user motivation/outcome framing is missing for UX-focused test cases.

---

### Gap-006: `data-model.md` is empty

DB-level schema details (index definitions, unique constraints at DB level, FK constraints, nullable fields) are only derivable from `research.md` which uses a simplified format. The full DB schema (migrations, constraints) is not available. Server-side constraint behavior (error codes on violation) cannot be verified without this.

---

### Gap-007: Duplicate Type Code validation — server vs. client timing

The Create Type side sheet validates duplicate codes against the loaded dataset client-side. If two admins create types simultaneously with the same code, a race condition can result in a duplicate commitment. Whether the server enforces uniqueness with a DB-level unique constraint and what error response it returns is not documented.

---

### Gap-008: Pagination — types table and entries table

The `DataTable` component in `PageMasterDataTypes` shows rows=10 with options [10, 25, 50] (from v1 FE source analysis). The entries table on Master Data page has no pagination spec. For production datasets:
- How many types are expected? (Research suggests 5 at launch, but admin can add more)
- How many entries per type are expected?
- Is pagination present on the entries table?

---

### Gap-009: Audit logging behavior

The Admin Panel includes an Audit Log module. It is undocumented whether Master Data create / edit / toggle / reorder actions generate Audit Log entries. If they do: what fields are captured? Who is the actor? This affects both QA scope and compliance test cases.

---

### Gap-010: Bulk reactivation of cascade-deactivated entries

After a cascade deactivation, admin must reactivate 100+ entries one by one. There is no documented bulk-reactivate option. Whether this is intentional (small datasets) or a missing feature needs clarification.

---

### Gap-011: Code auto-generation — edge case outputs not specified

The auto-generation rule is described in prose but not all edge cases are specified:
- All-special-character name → output unknown
- Unicode/non-ASCII characters → output unknown
- Result is empty string → should it block save or generate an error?

Without a complete spec for the transformation, test assertions for edge cases cannot be written definitively.
