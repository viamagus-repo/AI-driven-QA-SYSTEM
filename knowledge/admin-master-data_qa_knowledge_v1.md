# QA Knowledge: Admin — Master Data

## Meta

| Field | Value |
|---|---|
| Project | NeRL (NeRL Online Client Account Opening) |
| Portal | Admin Panel |
| Module | Master Data |
| Pipeline Stage | Stage 1 — QA Knowledge |
| Source inputs | `qa-inputs/nerl/portals/admin-panel/master-data/flow-master-data.md`, `screens.md`, `spec.md`, `layout.md`, `_portal.md`, `routes.md`; FE source `src/view/admin/PageMasterData.tsx`, `PageMasterDataTypes.tsx` |
| Date | 2026-05-05 |
| Version | v1 |

---

## Business Context

### Business Objective

The Master Data module is the foundational configuration layer of the NeRL platform. It maintains the system-wide reference tables — account types, document types, rejection reasons, and query categories — that all other portals consume at runtime. These tables must be seeded and correctly configured before any other module (Configuration, Client Portal, Ops Portal) can function.

### Target Users / Personas

- **Admin** — internal NeRL administrators with full system-configuration access. Single role; no sub-roles within this module. Only users authenticated as `Admin` can access `/admin/*` routes.

### Success Criteria

- Admin can create, edit, and toggle (activate/deactivate) Master Data Types and their Entries without assistance.
- Changes take effect system-wide immediately after save.
- Deactivating a type with active entries triggers a cascade warning and deactivates all entries atomically.
- Reactivating a type does NOT auto-reactivate its entries.
- Entry/type codes are immutable after first save and never collide within their scope.
- Pre-loaded seed data (4 types, 22 entries) is present on first deployment.

---

## Functional Scope

### In-Scope Features

**Page 1 — Master Data Types (`/admin/master-data-types`)**

- View all master data types in a paginated table (Name, Type Code, Entries deep-link, Status chip, Active toggle, Edit action)
- Create a new type via side sheet (Name → auto-generates Type Code; Type Code editable before first save)
- Edit an existing type's Name and Status via side sheet (Type Code is locked read-only with lock icon)
- Toggle a type ON/OFF directly from the table row
  - Toggle OFF, no active entries → simple confirmation popup ("Deactivate type?")
  - Toggle OFF, has active entries → cascade warning popup showing entry count ("Deactivate all")
  - Toggle ON → immediate, no confirmation
- Navigate to Master Data page pre-filtered to a type via "N entries →" deep-link
- Empty state when no types exist

**Page 2 — Master Data (`/admin/master-data`)**

- Tab strip showing one tab per active Master Data Type (ordered by sort order)
- Deep-link pre-selection via `?type=<slug>` query parameter
- View entries for the selected type (Label, Entry Code, Sort Order, Status chip, Active toggle, Drag handle, Edit action)
- Create a new entry via side sheet (Type pre-selected to active tab; Label → auto-generates Entry Code; Entry Code editable before first save; Sort Order defaults to end of list)
- Edit an existing entry's Label, Sort Order, and Status (Type and Entry Code locked read-only)
- Toggle an entry ON/OFF from the table row
  - Toggle OFF → confirmation popup ("Deactivate entry?")
  - Toggle ON → immediate, no confirmation
- Drag-to-reorder entries within a type tab (sort order persists immediately on drop)
- Empty state per type tab

### Out-of-Scope

- Bulk create/edit/delete of types or entries
- Search or filter within the Master Data Types or Master Data tables (not documented in specs)
- Moving an entry from one type to another (entries are bound to their type permanently)
- Deleting types or entries (only deactivation is supported)
- User Management, Configuration, and Audit Log modules (separate modules)
- Backend API implementation (FE prototype uses seed data; no real HTTP calls)
- Mobile (375px portrait) breakpoint — Admin Panel is Desktop/Tablet only (1920/1440/1024)

---

## Entities & Data Models

> Note: `data-model.md` is empty. Entities are inferred from TypeScript interfaces in the FE source and seed data in `spec.md`.

### Entity: MasterDataType

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | string | Unique, system-generated | Not shown in UI |
| `name` | string | Required | Display label — e.g. "Account Type" |
| `typeCode` | string | Required · Unique globally · Lowercase + underscored · Immutable after first save | e.g. `account_type` |
| `entryCount` | number | Derived — count of all entries for this type | Shown as "N entries →" link |
| `active` | boolean | Default: `true` on create | Toggle ON/OFF |

### Entity: MasterDataEntry

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | string | Unique, system-generated | Not shown in UI |
| `typeCode` | string | Foreign key → MasterDataType.typeCode | Immutable — entries cannot be moved between types |
| `label` | string | Required | Human-readable display — e.g. "Individual" |
| `entryCode` | string | Required · Unique within the same `typeCode` · Lowercase + underscored · Immutable after first save | e.g. `individual` |
| `sortOrder` | number | Integer ≥ 1 · Defaults to last position + 1 | Determines display and tab ordering |
| `active` | boolean | Default: `true` on create | Toggle ON/OFF |

### Code Auto-Generation Rule

Both `typeCode` and `entryCode` follow the same derivation from their name/label:

```
toLowerCase → trim → spaces to underscores → strip non-[a-z0-9_] → collapse multiple underscores → strip leading/trailing underscores
```

Example: `"Account Type"` → `account_type`, `"Non-Individual"` → `non_individual`

The code is editable by the admin before the first save; it is locked (read-only with lock icon) once saved.

### Pre-Loaded Seed Data (Required for Platform Function)

| Type | Type Code | # Entries | Entries |
|---|---|---|---|
| Account Type | `account_type` | 7 | individual, non_individual, company, fpo, trust, partnership, llp |
| Document Type | `document_type` | 8 | pan_card, aadhaar, photo, moa, board_resolution, gst_certificate, bank_statement, incorporation_certificate |
| Rejection Reason | `rejection_reason` | 3 | incomplete_kyc, document_mismatch, blacklisted_entity |
| Query Category | `query_category` | 4 | document_quality_issue, field_mismatch, missing_document, kyc_failure |

---

## User Flows

### Flow 1: Create Master Data Type (Happy Path)

1. Admin navigates to Master Data Types (`/admin/master-data-types`)
2. Table lists all types — Name, Type Code, Entries deep-link, Status chip, Active toggle, Edit icon
3. Admin clicks "Add Type" → side sheet opens
4. Admin enters Name → Type Code auto-generates (editable)
5. Admin clicks Save → side sheet closes, new type appears in table with toggle ON and Status = Active

### Flow 2: Edit Master Data Type

1. Admin clicks edit icon on a type row → side sheet opens pre-filled
2. Type Code is locked (read-only, lock icon)
3. Admin edits Name and/or Status → clicks Save
4. If Status toggled OFF and type has active entries → cascade warning popup fires before save commits
5. On popup confirm → save proceeds; on cancel → sheet stays open, Status toggle restored to ON

### Flow 3: Deactivate Type — No Active Entries

1. Admin toggles type OFF → simple popup: "Deactivate type?" with body copy and "Deactivate" (destructive) + "Cancel"
2. Confirm → type toggle turns OFF; Status chip changes to Inactive
3. Cancel → toggle reverts to ON

### Flow 4: Deactivate Type — Cascade (Has Active Entries)

1. Admin toggles type OFF → cascade popup: "Deactivate type?" with "This will also deactivate N entries under this type"
2. Confirm ("Deactivate all") → type + all its entries toggled OFF atomically
3. Cancel → toggle reverts to ON; no entries are changed

### Flow 5: Deep-Link from Types to Entries

1. Admin clicks "N entries →" on a type row → navigates to `/admin/master-data?type=<typeCode>`
2. Master Data page loads with that type's tab pre-selected

### Flow 6: Create Master Data Entry (Happy Path)

1. Admin navigates to Master Data (`/admin/master-data`) — first active tab selected by default
2. Admin selects a type tab → table shows entries for that type
3. Admin clicks "Add Entry" → side sheet opens with Type pre-selected to active tab
4. Admin enters Label → Entry Code auto-generates (editable)
5. Admin optionally adjusts Sort Order
6. Admin clicks Save → side sheet closes, new entry appears in list with toggle ON and Status = Active

### Flow 7: Edit Master Data Entry

1. Admin clicks edit icon on an entry row → side sheet opens pre-filled
2. Type is read-only (plain text); Entry Code is locked (read-only, lock icon)
3. Admin edits Label, Sort Order, and/or Status
4. If Status toggled OFF → on Save, confirmation popup fires: "Deactivate entry?"
5. Confirm → entry deactivated; Cancel → sheet stays open, Status restored to ON

### Flow 8: Deactivate Entry from Row Toggle

1. Admin toggles entry OFF → popup: "Deactivate entry?" + entry label in bold
2. Confirm → entry toggle turns OFF, Status chip → Inactive, row opacity reduced (inactive visual)
3. Cancel → toggle reverts to ON

### Flow 9: Reactivate (Toggle ON)

- For types: toggle ON → immediate, no popup, no confirmation
- For entries: toggle ON → immediate, no popup, no confirmation
- Reactivating a type does NOT auto-reactivate its cascade-deactivated entries

### Flow 10: Drag-to-Reorder Entries

1. Admin views a single type tab (drag handles visible)
2. Admin drags an entry row to a new position → sort order numbers update immediately on drop
3. No explicit Save required — reorder persists on drop

---

## API Surface

> **BLOCKER:** `api.md` is empty. No API contract has been documented. The FE implementation uses hardcoded seed data (React `useState`) with no HTTP calls. The following is the expected API surface inferred from UI behavior and entity model only.

### Expected Endpoints (Inferred — NOT Confirmed)

| Method | Path (inferred) | Description | Auth |
|---|---|---|---|
| GET | `/api/admin/master-data/types` | List all types | Admin token |
| POST | `/api/admin/master-data/types` | Create new type | Admin token |
| PATCH | `/api/admin/master-data/types/:id` | Edit type name / status | Admin token |
| GET | `/api/admin/master-data/entries` | List entries (filtered by `typeCode`) | Admin token |
| POST | `/api/admin/master-data/entries` | Create new entry | Admin token |
| PATCH | `/api/admin/master-data/entries/:id` | Edit entry label / sortOrder / status | Admin token |
| POST | `/api/admin/master-data/types/:id/deactivate` | Cascade deactivate type + entries | Admin token |
| PATCH | `/api/admin/master-data/entries/reorder` | Batch-update sort orders after drag | Admin token |

**No confirmed HTTP method, path, request/response schema, or error codes.** These endpoints must be provided before API-layer test cases can be written.

---

## Non-Functional Requirements

### Security / Auth

- All `/admin/*` routes require authenticated session with `role = Admin`
- On session expiry → auto-logout → redirect to `/login`
- No sub-roles within Admin Panel (full access or no access)
- Type Code and Entry Code are server-enforced immutable after first save (locking must be validated at the API level, not just UI)

### Browser / Device Targets

- **Desktop:** 1920px, 1440px
- **Tablet:** 1024px
- **Mobile (375px):** Out of scope for Admin Panel

### Performance

- No explicit thresholds documented. Expected: table load < 2s, side sheet open < 300ms, drag-reorder response immediate (optimistic UI).

### Accessibility

- Toggle buttons use `role="switch"` and `aria-checked` (confirmed in FE source)
- Breadcrumb uses `<nav aria-label="Breadcrumb">` (confirmed in FE source)
- No explicit WCAG level documented; standard AA expected

### Data Integrity

- Type Code unique constraint: global (across all types)
- Entry Code unique constraint: scoped per `typeCode`
- Sort order: positive integers, auto-assigned, reassigned on drag-reorder

---

## Integrations & Dependencies

### Cross-Portal Dependencies (Downstream Consumers)

| Data Provided | Consumed By | Impact of Deactivation |
|---|---|---|
| Account Types (`account_type`) | Client Portal — application form account type selection; Configuration — document rules per account type | Deactivated account types disappear from Client Portal dropdowns; existing document rules may break |
| Document Types (`document_type`) | Client Portal — document upload checklist; Configuration — document rules per document type | Deactivated document types removed from upload checklists |
| Rejection Reasons (`rejection_reason`) | Ops Portal — rejection decision dropdown | Deactivated reasons removed from Ops dropdown |
| Query Categories (`query_category`) | Ops Portal — query creation category dropdown | Deactivated categories removed from Ops dropdown |

### Internal Module Dependencies

| Dependency | Direction | Notes |
|---|---|---|
| Authentication / Session | Master Data depends on Auth | Admin session required; no session = redirect to login |
| User Management | Independent | No dependency between modules |
| Configuration (Document Rules) | Configuration depends on Master Data | Document Rules screen requires Account Types and Document Types to be seeded first |
| Audit Log | Audit Log depends on all modules | Every Master Data action should generate an audit log entry (not confirmed in spec) |

### FE Component Dependencies

| Component | Used In | Purpose |
|---|---|---|
| `PageShell` | Both pages | Page chrome — title, breadcrumb, primary action |
| `SideSheet` | Both pages | Create/Edit overlay (full-viewport scrim) |
| `ConfirmPopover` | Both pages | Deactivate confirmation dialogs |
| `DataTable` | PageMasterDataTypes | Sortable/paginated type list |
| `InputBox` | Both sheets | Text fields |
| `InputNumber` | PageMasterData sheet | Sort Order field |
| `SimpleDropDown` | PageMasterData create sheet | Type selector |
| `ButtonBox` | Both pages | All CTAs |
| `Icon` | Both pages | Edit icon, Lock icon, Drag handle, Breadcrumb caret |

---

## Known Ambiguities & Open Questions

1. **No API contract.** `api.md` is empty. Endpoint paths, HTTP methods, request/response schemas, error codes, and rate limits are all unknown. API-layer testing is blocked until this is provided.

2. **No data model spec.** `data-model.md` is empty. Server-side field constraints, database schema, index definitions, and uniqueness enforcement at the DB level are unknown.

3. **Cascade deactivation downstream impact.** When a type is cascade-deactivated, the spec states entries are toggled OFF. It is not documented whether this triggers cascading effects in downstream portals immediately (e.g., removes type from Client Portal dropdowns in real time) or on next request. Test coverage cannot be determined without this answer.

4. **Reactivation of cascade-deactivated entries.** The spec confirms reactivating a type does NOT auto-reactivate entries — admin must do so individually. But: is there a bulk-reactivate action? If admin reactivates 100 entries one by one, is there a supported alternative? Not mentioned.

5. **Type Code and Entry Code server-side immutability.** The UI locks codes after first save. Is this enforced server-side (rejected on PATCH)? Or is it purely a UI constraint? If server-side: what error code/message is returned on an attempted update to the code?

6. **Duplicate code validation — server vs. client.** The FE validates uniqueness client-side against the loaded dataset. If two admins create types simultaneously, can duplicate codes be committed to the backend? Server-side uniqueness enforcement is unconfirmed.

7. **Pagination behavior.** The `DataTable` in PageMasterDataTypes shows rows=10 with options [10, 25, 50]. How many types/entries are expected in production? Any performance or pagination spec for large datasets (100+ types, 1000+ entries)?

8. **Search / filter.** Neither the types table nor the entries table has a search or filter capability documented. Is this intentional (small dataset assumption) or a gap?

9. **Sort order on Master Data Types.** The tab strip on Master Data is ordered by type `sort_order`. But the Types table has no sort order field and no drag-to-reorder. How are types ordered? Alphabetically? By creation date? By `id`? This directly affects tab ordering on the Master Data page.

10. **Audit logging.** It is not stated whether create/edit/toggle/reorder actions in Master Data generate Audit Log entries. The Audit Log module exists in the Admin Panel, but its relationship to Master Data actions is not documented in this module's spec.

11. **Session state during side sheet open.** If the admin's session expires while a side sheet is open (mid-form fill), what happens? Is the user redirected immediately? Are form values lost?

12. **Drag-reorder on non-desktop viewports.** Drag handles are documented as visible on single-tab-active view. Drag-and-drop via HTML5 drag API may not work on touch/tablet (1024px). Is drag-reorder supported on tablet? No documentation.

13. **Empty `jtbd.md` and `data-model.md`.** Both files exist but are empty (1 line). These may not yet have been authored. Any JTBD nuances or data model details in those files remain unknown.

14. **`?type=<slug>` deep-link with deactivated type.** The spec notes that if the slug in the URL refers to a deactivated type, "tab still appears but is visually marked inactive." However, the FE implementation only tabs over `activeTypes` (types where `active === true`). This is a spec vs. implementation discrepancy — behavior for deactivated type deep-links is not consistent between spec and code.

15. **Network error handling.** The flow doc defines error path E3: toast error on save failure and form values preserved. The FE prototype has no network calls, so this is unimplemented. Error recovery behavior (retry, form persistence) needs to be verified against real API integration.

---

## Testable Surface Summary

### UI / Functional

- **Master Data Types page:** Default state, empty state, pagination
- **Create Type sheet:** Field rendering, Name → code auto-generation, code editability, required field validation, duplicate code validation, save success (list update), cancel behavior
- **Edit Type sheet:** Pre-filled fields, Type Code read-only lock, Status toggle, save success, cascade deactivation popup (simple + cascade variant), popup cancel restores toggle
- **Row toggle — Types:** Toggle ON (immediate), Toggle OFF no-entries (simple popup), Toggle OFF with-entries (cascade popup), popup confirm/cancel
- **Master Data page:** Default state (first tab selected), deep-link `?type=` pre-selection, tab switching, empty state per tab
- **Create Entry sheet:** Pre-selected type, Label → code auto-generation, code editability, Sort Order default, required validation, duplicate code per type validation, save success, cancel
- **Edit Entry sheet:** Type read-only, Entry Code locked, Label/Sort Order editable, Status toggle, deactivation popup on save
- **Row toggle — Entries:** Toggle ON (immediate), Toggle OFF (confirmation popup), popup confirm/cancel
- **Drag-to-reorder:** Drag handle visibility, reorder within tab, sort order persistence, drag between different states
- **Navigation:** "N entries →" deep-link, breadcrumb, sidebar active state
- **Responsive:** Desktop 1920, 1440, Tablet 1024

### State & Edge Cases

- Seed data present on load (4 types, 22 entries)
- Deactivated type: entries remain visible in their tab with inactive visual state (opacity reduced)
- Deep-link to deactivated type's tab (spec says tab shown marked inactive — FE discrepancy, see OQ-14)
- Reactivating a cascade-deactivated type — entries remain deactivated
- Empty sort order field behavior
- Code auto-generation edge cases (special characters, numbers, very long names, all-special-char name)
- Simultaneous actions on same type/entry (race condition)

### API Layer (Blocked — pending api.md)

- CRUD endpoints for types and entries
- Server-side uniqueness enforcement for codes
- Server-side immutability of codes after first save
- Cascade deactivation atomicity
- Reorder batch update
- Auth: unauthenticated access returns 401; wrong role returns 403
- Network error: 500 response — form preserved, toast shown

### Non-Functional

- Session expiry redirect during active operation
- Audit log entries generated for each admin action
- Performance: table load, side sheet open, drag-reorder response time
- Accessibility: keyboard navigation, screen reader announcements for toggle state changes, focus management on sheet open/close
