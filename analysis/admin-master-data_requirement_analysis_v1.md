# Requirement Analysis: Admin / Master Data

## Meta

- QA Knowledge source file: `playwright poc/qa-knowledge/admin-master-data_qa_knowledge_v1.md`
- Supporting design inputs reviewed: `qa-inputs/nerl/portals/admin-panel/master-data/spec.md`, `flow-master-data.md`, `screens.md`, `layout.md`, `routes.md`
- FE context sampled: `qa-inputs/nerl-code/src/view/admin/PageMasterDataTypes.tsx`, `qa-inputs/nerl-code/src/view/admin/PageMasterData.tsx`
- Date: 2026-05-05
- Version: v1
- Scope: Requirement analysis only. Test cases are intentionally not generated in this artifact.

## Feature Understanding

Admin / Master Data is the system configuration surface for reference data consumed across NeRL. It has two primary screens:

- Master Data Types at `/admin/master-data-types`, where Admin users manage reference table definitions such as Account Type and Document Type.
- Master Data at `/admin/master-data`, where Admin users manage entries under the selected type, such as Individual, PAN Card, or KYC Failure.

The module is high-impact because downstream portals rely on these records at runtime. Deactivation, duplicate codes, reorder behavior, and server-side immutability need strong coverage before this module can be considered stable.

## Requirement Summary

- Total requirements extracted: 58
- Functional: 28
- UI/UX: 7
- Data Validation: 7
- Authorization & Authentication: 4
- Integration: 6
- Non-Functional: 6

Risk breakdown:

- High: 28
- Medium: 25
- Low: 5

Testability breakdown:

- Testable: 37
- Partially Testable: 19
- Not Testable: 2

## Requirements Table

| ID | Requirement Statement | Category | Risk | Testability | Priority | Notes |
|---|---|---|---|---|---|---|
| AMD-REQ-001 | The system must restrict all `/admin/*` Master Data routes to authenticated users with `role = Admin`. | Authorization & Authentication | High | Partially Testable | P1 Must-Test | UI route behavior can be tested; server enforcement needs API contract. |
| AMD-REQ-002 | On session expiry, the system must auto-logout and redirect the admin to `/login`. | Authorization & Authentication | High | Partially Testable | P1 Must-Test | Mid-form expiry behavior is ambiguous. |
| AMD-REQ-003 | The system must deny non-admin roles access to Master Data routes. | Authorization & Authentication | High | Partially Testable | P1 Must-Test | Requires role fixtures or API/backend auth behavior. |
| AMD-REQ-004 | Code immutability for saved types and entries must be enforced beyond the UI. | Authorization & Authentication | High | Not Testable | P1 Must-Test | API and server-side behavior are undocumented. |
| AMD-REQ-005 | The Master Data Types page must list all master data types with Name, Type Code, Entries link, Status, Active toggle, and Edit action. | Functional | High | Testable | P1 Must-Test | Core page behavior. |
| AMD-REQ-006 | The Master Data Types table must support documented pagination behavior. | UI/UX | Medium | Testable | P2 Should-Test | FE references table pagination; production dataset size is unknown. |
| AMD-REQ-007 | The Master Data Types empty state must show the documented heading, body, and Add Type CTA inside the table body area. | UI/UX | Low | Testable | P2 Should-Test | Applies when no types exist. |
| AMD-REQ-008 | Admin must be able to open the Create New Master Data Type side sheet from Add Type. | Functional | Medium | Testable | P1 Must-Test | Entry point for type creation. |
| AMD-REQ-009 | Creating a type must require Name and Type Code. | Data Validation | High | Testable | P1 Must-Test | Name error: `Name is required`; code required error text is not documented. |
| AMD-REQ-010 | Type Code must auto-generate from Name using lowercase, trim, underscore conversion, special-character stripping, underscore collapse, and edge underscore stripping. | Data Validation | Medium | Testable | P1 Must-Test | Needs edge values such as punctuation-only, multiple spaces, and mixed case. |
| AMD-REQ-011 | Type Code must remain editable before the first save. | Functional | Medium | Testable | P1 Must-Test | Admin can override generated code. |
| AMD-REQ-012 | Type Code must be globally unique across all master data types. | Data Validation | High | Partially Testable | P1 Must-Test | Client-side can be tested; race condition/server uniqueness is unconfirmed. |
| AMD-REQ-013 | A newly created type must be active by default and appear in the types table after save. | Functional | High | Testable | P1 Must-Test | Changes are expected to take effect immediately. |
| AMD-REQ-014 | Admin must be able to cancel type creation without saving changes. | Functional | Medium | Testable | P2 Should-Test | Cancel behavior is implied by sheet footer. |
| AMD-REQ-015 | Editing an existing type must open a pre-filled side sheet. | Functional | Medium | Testable | P1 Must-Test | Includes Name, Type Code, and Status. |
| AMD-REQ-016 | Saved Type Code must display as read-only with a lock icon and helper text. | UI/UX | Medium | Testable | P1 Must-Test | Important because code references are live dependencies. |
| AMD-REQ-017 | Admin must be able to edit a type's Name and Status. | Functional | High | Testable | P1 Must-Test | Status OFF may trigger confirmation/cascade. |
| AMD-REQ-018 | Deactivating a type with no active entries must show a non-dismissible confirmation popup. | Functional | High | Testable | P1 Must-Test | Triggered from row toggle or edit sheet save. |
| AMD-REQ-019 | Cancelling type deactivation must restore the type status/toggle to Active and make no data changes. | Functional | High | Testable | P1 Must-Test | Applies to row and sheet paths. |
| AMD-REQ-020 | Deactivating a type with active entries must show a cascade warning with live active-entry count. | Functional | High | Testable | P1 Must-Test | High risk due platform-wide impact. |
| AMD-REQ-021 | Confirming cascade deactivation must atomically deactivate the type and all active entries under it. | Functional | High | Partially Testable | P1 Must-Test | Atomicity requires API/backend validation. |
| AMD-REQ-022 | Reactivating a type must happen immediately with no confirmation. | Functional | Medium | Testable | P1 Must-Test | No popup expected. |
| AMD-REQ-023 | Reactivating a cascade-deactivated type must not auto-reactivate its entries. | Functional | High | Testable | P1 Must-Test | Explicit business rule. |
| AMD-REQ-024 | The Entries link must navigate to `/admin/master-data?type=<typeCode>`. | Functional | Medium | Testable | P1 Must-Test | Cross-link between the two pages. |
| AMD-REQ-025 | The Master Data page must show one tab per active Master Data Type. | Functional | High | Testable | P1 Must-Test | Spec conflict exists for deep-link to inactive type. |
| AMD-REQ-026 | The Master Data page must pre-select the tab matching `?type=<typeCode>` when present. | Functional | Medium | Testable | P1 Must-Test | Invalid and inactive slugs need requirement clarification. |
| AMD-REQ-027 | If no deep-link is present, the Master Data page must select the first active type by default. | Functional | Medium | Testable | P1 Must-Test | Ordering source is ambiguous. |
| AMD-REQ-028 | Master Data tabs must be ordered by type sort order. | Functional | Medium | Partially Testable | P2 Should-Test | Type sort order is not defined in data model or UI. |
| AMD-REQ-029 | The entries table must list Label, Entry Code, Sort Order, Status, Active toggle, Drag handle, and Edit action for the selected type. | Functional | High | Testable | P1 Must-Test | Core entry management surface. |
| AMD-REQ-030 | The per-tab empty state must show the documented heading, body, and Add Entry CTA inside the table body area. | UI/UX | Low | Testable | P2 Should-Test | Applies when selected type has no entries. |
| AMD-REQ-031 | Admin must be able to open the Create New Master Data Entry side sheet from Add Entry. | Functional | Medium | Testable | P1 Must-Test | Type should be pre-selected from active tab. |
| AMD-REQ-032 | Creating an entry must require Type, Label, and Entry Code. | Data Validation | High | Testable | P1 Must-Test | Type is pre-selected but editable. |
| AMD-REQ-033 | Entry Code must auto-generate from Label using the same code-generation rule as Type Code. | Data Validation | Medium | Testable | P1 Must-Test | Needs edge-value coverage. |
| AMD-REQ-034 | Entry Code must remain editable before the first save. | Functional | Medium | Testable | P1 Must-Test | Admin can override generated code. |
| AMD-REQ-035 | Entry Code must be unique within its Type only. | Data Validation | High | Partially Testable | P1 Must-Test | Client behavior can be tested; server race handling is unconfirmed. |
| AMD-REQ-036 | Sort Order must be a positive integer, optional on create, and default to the end of the selected type's list. | Data Validation | High | Partially Testable | P1 Must-Test | Exact handling for blank, zero, negative, decimal, duplicate, and large values is not specified. |
| AMD-REQ-037 | A newly created entry must be active by default and appear in the selected type's list after save. | Functional | High | Testable | P1 Must-Test | List placement depends on sort order behavior. |
| AMD-REQ-038 | Editing an existing entry must open a pre-filled side sheet. | Functional | Medium | Testable | P1 Must-Test | Includes Type, Label, Entry Code, Sort Order, and Status. |
| AMD-REQ-039 | Saved Entry Code must display as read-only with a lock icon and helper text. | UI/UX | Medium | Testable | P1 Must-Test | Must never render editable after save. |
| AMD-REQ-040 | Saved entry Type must be read-only and entries must not be movable between types. | Functional | High | Testable | P1 Must-Test | Protects downstream references. |
| AMD-REQ-041 | Deactivating an entry must show a non-dismissible confirmation popup with the entry label. | Functional | High | Testable | P1 Must-Test | Triggered from row toggle or edit sheet save. |
| AMD-REQ-042 | Cancelling entry deactivation must restore the entry status/toggle to Active and make no data changes. | Functional | Medium | Testable | P1 Must-Test | Applies to row and sheet paths. |
| AMD-REQ-043 | Reactivating an entry must happen immediately with no confirmation. | Functional | Medium | Testable | P1 Must-Test | No popup expected. |
| AMD-REQ-044 | Inactive entries must remain visible in the list with inactive status and reduced-opacity visual treatment. | UI/UX | Medium | Testable | P2 Should-Test | Keeps admin recovery possible. |
| AMD-REQ-045 | Admin must be able to drag-reorder entries within a single type tab, with sort order persisting immediately on drop. | Functional | High | Partially Testable | P1 Must-Test | Persistence needs backend/API implementation. |
| AMD-REQ-046 | Drag handles must be hidden when no single type tab is active or a multi-type view is active. | UI/UX | Low | Partially Testable | P3 Nice-to-Test | Multi-type view is referenced but not otherwise specified. |
| AMD-REQ-047 | The first deployment must seed 4 types and 22 entries exactly as documented. | Integration | High | Partially Testable | P1 Must-Test | Requires seeded environment or migration verification. |
| AMD-REQ-048 | Master Data changes must take effect system-wide immediately after save. | Integration | High | Partially Testable | P1 Must-Test | Downstream propagation mechanism and timing are undocumented. |
| AMD-REQ-049 | Deactivated Account Types must disappear from Client Portal account type selection and relevant Configuration rules surfaces. | Integration | High | Partially Testable | P1 Must-Test | Cross-portal validation depends on integrated environment. |
| AMD-REQ-050 | Deactivated Document Types must disappear from document upload checklists and document-rule configuration surfaces. | Integration | High | Partially Testable | P1 Must-Test | High business impact. |
| AMD-REQ-051 | Deactivated Rejection Reasons and Query Categories must be removed from Ops Portal decision/query dropdowns. | Integration | High | Partially Testable | P1 Must-Test | Cross-portal dependency. |
| AMD-REQ-052 | Master Data actions should generate Audit Log entries if audit logging applies to this module. | Integration | Medium | Not Testable | P2 Should-Test | Relationship is mentioned as unconfirmed. |
| AMD-REQ-053 | Table load should complete in under 2 seconds. | Non-Functional | Medium | Partially Testable | P2 Should-Test | Threshold is expected, not explicitly committed. |
| AMD-REQ-054 | Side sheet open interaction should complete in under 300 ms. | Non-Functional | Low | Partially Testable | P3 Nice-to-Test | Threshold is expected, not explicitly committed. |
| AMD-REQ-055 | Drag-reorder response should feel immediate, likely with optimistic UI. | Non-Functional | Medium | Partially Testable | P2 Should-Test | No API latency or rollback behavior documented. |
| AMD-REQ-056 | Toggle controls must expose `role="switch"` and `aria-checked`. | Non-Functional | Medium | Testable | P1 Must-Test | Confirmed in sampled FE source. |
| AMD-REQ-057 | Breadcrumb must use `nav` with `aria-label="Breadcrumb"`. | Non-Functional | Low | Testable | P2 Should-Test | Confirmed in QA knowledge as FE-backed. |
| AMD-REQ-058 | Side sheets and non-dismissible confirmation popups must handle focus predictably for keyboard and assistive technology users. | Non-Functional | Medium | Partially Testable | P2 Should-Test | WCAG level is not formally documented. |

## User Flows And State Transitions

### Type Management

| Flow | Initial State | Action | Transition | Terminal State |
|---|---|---|---|---|
| Create Type | Types table default or empty | Add Type, enter required fields, Save | Side sheet open -> validation -> save commit | New active type appears in table |
| Cancel Create Type | Create side sheet open | Cancel | Sheet closes without commit | Original table unchanged |
| Edit Type | Existing type row | Edit, update Name or Status, Save | Side sheet open -> optional deactivate popup -> save commit | Row reflects saved values |
| Row Deactivate Type, No Active Entries | Active type, no active entries | Toggle OFF | Confirmation popup -> confirm/cancel | Inactive type, or reverted active |
| Row Deactivate Type, Has Active Entries | Active type, active entries exist | Toggle OFF | Cascade warning -> confirm/cancel | Type and entries inactive atomically, or reverted active |
| Reactivate Type | Inactive type | Toggle ON | Immediate update | Type active, entries unchanged |
| Deep-Link To Entries | Types table | Click `N entries ->` | Route changes to `/admin/master-data?type=<typeCode>` | Matching tab selected when valid |

### Entry Management

| Flow | Initial State | Action | Transition | Terminal State |
|---|---|---|---|---|
| Create Entry | Master Data tab active | Add Entry, enter required fields, Save | Side sheet open -> validation -> save commit | New active entry appears in selected type |
| Cancel Create Entry | Create side sheet open | Cancel | Sheet closes without commit | Original entry list unchanged |
| Edit Entry | Existing entry row | Edit, update Label, Sort Order, or Status, Save | Side sheet open -> optional deactivate popup -> save commit | Row reflects saved values |
| Row Deactivate Entry | Active entry | Toggle OFF | Confirmation popup -> confirm/cancel | Entry inactive, or reverted active |
| Reactivate Entry | Inactive entry | Toggle ON | Immediate update | Entry active |
| Reorder Entry | Single type tab active | Drag row and drop | Sort order recalculated immediately | New order persists |

## Validations And Business Rules

- Type Name is required.
- Type Code is required, auto-generated from Name, editable before save, globally unique, lowercase/underscored, and immutable after save.
- Entry Type is required on create, pre-selected from the active tab, editable only during create, and read-only after save.
- Entry Label is required.
- Entry Code is required, auto-generated from Label, editable before save, unique within the selected type, lowercase/underscored, and immutable after save.
- Sort Order defaults to the end of the list and should be a positive integer.
- New types and entries are Active by default.
- Deactivation requires confirmation; reactivation does not.
- Type deactivation with active entries must cascade to entries atomically.
- Type reactivation must not reactivate entries.
- Inactive types are generally hidden from the normal Master Data tab strip, except the spec also states a deactivated deep-linked type should still show visually marked inactive.
- Entries cannot be moved between types.
- Deletion is out of scope; records are deactivated only.
- Search, filtering, and bulk operations are out of scope unless later requirements add them.

## Edge Cases And Negative Scenarios

- Name or Label empty on save.
- Type Code or Entry Code empty on save.
- Duplicate Type Code across types.
- Duplicate Entry Code within the same type.
- Same Entry Code under a different type should be allowed unless server rules say otherwise.
- Code generation from names with leading/trailing spaces, repeated spaces, hyphens, punctuation, non-ASCII characters, numbers, and all-invalid characters.
- Attempted edit of saved Type Code or Entry Code through UI manipulation or API payload.
- Deactivation popup cancel from row toggle and from edit side sheet.
- Cascade deactivation cancel after warning.
- Cascade deactivation where active entry count changes while popup is open.
- Reactivating a type after cascade deactivation.
- Deep-link to valid active type.
- Deep-link to valid inactive type.
- Deep-link to invalid/nonexistent type.
- No active types available on Master Data page.
- Empty entries under an active type.
- Sort Order blank, zero, negative, decimal, duplicate, very large, and non-numeric.
- Reorder with one entry, no entries, inactive entries, or rapid repeated drags.
- Network failure during create/edit/toggle/reorder.
- Two admins creating or editing duplicate codes concurrently.
- Session expiry while a side sheet or confirmation popup is open.
- Tablet viewport drag-and-drop support at 1024px.

## High-Risk Requirements

- AMD-REQ-001 through AMD-REQ-004: Admin-only access and server-side enforcement are critical. A UI-only restriction would expose platform configuration to unauthorized users or allow code mutation through direct API calls.
- AMD-REQ-012 and AMD-REQ-035: Code uniqueness protects stable references used across the platform. Client-only uniqueness checks are insufficient in concurrent admin sessions.
- AMD-REQ-020 and AMD-REQ-021: Cascade deactivation can remove values from downstream dropdowns and rules. Atomicity is essential to avoid a type inactive but entries still active, or entries inactive while type remains active after partial failure.
- AMD-REQ-023: Reactivating a type without reactivating entries is explicit and easy to regress because it looks counterintuitive from a UI perspective.
- AMD-REQ-036 and AMD-REQ-045: Sort order affects user-facing order and must survive create/edit/reorder operations. Undefined duplicate and invalid sort behavior creates risk.
- AMD-REQ-047 through AMD-REQ-051: Seed data and downstream consumption are platform-critical. Missing or incorrectly deactivated master data can break Client Portal, Ops Portal, and Configuration flows.
- AMD-REQ-048: "Changes take effect system-wide immediately" is a broad requirement with no propagation mechanism defined, making it both high-risk and only partially testable.

## Non-Testable Items

- AMD-REQ-004: Server-side immutability is not testable from the current artifact because `api.md` is empty and no request/response schema or error behavior exists. Needed: backend API contract and negative update behavior for immutable fields.
- AMD-REQ-052: Audit logging is not testable because the module spec does not confirm that Master Data actions must create Audit Log entries. Needed: audit event requirements, event fields, trigger matrix, and viewing/query behavior.

## Open Questions

### Carried Over From QA Knowledge

- What are the confirmed API endpoints, HTTP methods, request/response schemas, error codes, and auth requirements?
- What is the server-side data model, including database constraints, indexes, field lengths, and uniqueness enforcement?
- Are Type Code and Entry Code immutability enforced server-side, and what error is returned if a client attempts to mutate them?
- Is duplicate code validation enforced server-side for concurrent admin sessions?
- What is the expected propagation timing for deactivated master data in downstream portals?
- Does cascade deactivation trigger downstream cache invalidation, and is it immediate or next-request based?
- Is there a bulk-reactivate path for entries after reactivating a cascade-deactivated type?
- How many types and entries are expected in production, and are pagination/performance requirements sufficient?
- Is absence of search/filter intentional?
- How is type sort order defined if there is no type sort-order field or reorder UI?
- Should Master Data actions produce Audit Log entries?
- What happens when session expires while an admin is editing in a side sheet?
- Is drag-reorder supported on tablet/touch at 1024px?
- Should a deactivated type deep-link show an inactive tab, even though the normal tab strip only shows active types?
- What is the exact network error handling behavior for save/toggle/reorder failures?

### New Questions Raised During Analysis

- What is the maximum allowed length for Name, Label, Type Code, and Entry Code?
- Are names/labels required to be unique, or only codes?
- Should code uniqueness be case-insensitive after normalization?
- What should happen if auto-generation produces an empty code, such as from punctuation-only input?
- Are non-ASCII letters allowed in Name/Label, and how should they be normalized into codes?
- Can Sort Order duplicate an existing entry's sort order, and if so does the system shift other entries or reject the save?
- Should inactive entries participate in sort order and drag-reorder?
- Can an entry be active while its parent type is inactive?
- Should Add Entry be disabled when there are no active types?
- How should invalid `?type=<slug>` deep-links resolve: first active tab, empty state, error, or redirect?
- Are confirmation popups dismissible via Escape key even though outside-click dismissal is not allowed?
- What toast copy is expected for network errors beyond the generic flow-doc message?

## Coverage Recommendation

Deep coverage is required for:

- Admin route authorization and session expiry.
- Create/edit/toggle flows for both types and entries.
- Code generation, editability, immutability, and duplicate validation.
- Cascade deactivation, cancellation, and reactivation semantics.
- Deep-link behavior, especially invalid and inactive type slugs.
- Sort order defaults, manual edits, and drag-reorder persistence.
- Seed data and downstream consumption in Client Portal, Ops Portal, and Configuration.

Lighter smoke coverage is acceptable for:

- Static layout copy, breadcrumbs, table headers, visual chips, and standard empty states after core behavior is validated.
- Pagination display mechanics until production data volume is clarified.
- Performance checks where thresholds are only expected and not formally committed.

Suggested test types:

- Unit/component: code-generation helper, required-field validation, duplicate validation, toggle/popup state transitions, sort-order calculation.
- Integration: create/edit/deactivate flows with persisted state, cascade deactivation atomicity, reorder persistence, route guard behavior.
- E2E: Admin user journeys across `/admin/master-data-types` and `/admin/master-data`, including deep-link navigation and confirmation cancel/confirm branches.
- API: uniqueness, immutability, auth, cascade atomicity, reorder batch update, and error responses once `api.md` is provided.
- Accessibility: switch roles and states, focus management in side sheets/popups, keyboard navigation, breadcrumb semantics, non-dismissible dialog behavior.
- Performance: table load, side sheet open latency, and drag-reorder response once realistic data volume is defined.

## Readiness Assessment

- Ready for UI screenshot capture: Yes, with caveats. Capture can proceed for the current FE prototype and documented desktop/tablet viewports, but deactivated deep-link behavior and real network/error states remain ambiguous.
- Ready for test case generation: Partially. UI/component test cases can be generated now from this analysis. Full API, integration, downstream, audit-log, and concurrency test cases should wait for API contract, data model, and unresolved business-rule clarifications.
