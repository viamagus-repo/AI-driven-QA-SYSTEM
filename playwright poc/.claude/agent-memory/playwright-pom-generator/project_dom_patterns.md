---
name: Ognomy Web Portal DOM Patterns
description: Stable locator patterns, UI conventions, and fragile selector notes discovered across modules in the Ognomy Web Portal (web-tmp.ognomy.com)
type: project
---

## Auth & Navigation

- Auth state lives in `storage/auth.json` — JWTs expire quickly (48h). When expired, the MCP browser tool must log in programmatically via the login form before navigating.
- Login credentials for test account: `viamagus@ognomy.com` / `!NotReal123` (from `data/json/modules/auth/TC-AUTH-LOGIN-TC01.json`).
- A "Warning" dialog with an "I ACKNOWLEDGE" button always appears on first page load — must be dismissed before interacting with the login form.
- After login, the app lands at `/staff/appointments` (AppPage.HOME). Navigate to `/staff/users` for the users module.
- AppPage enum keys: HOME = "home", LOGIN = "login", USERS = "users". Routes: LOGIN="/", HOME="/staff/appointments", USERS="/staff/users".

**Why:** JWT in auth.json can expire between test runs; the browser tool has no built-in storageState injection, so login must be done interactively.
**How to apply:** Always check current URL after navigation. If redirected to `/` (login page), perform login programmatically before continuing DOM exploration.

## Users Module (`/staff/users`) DOM Patterns

### Layout
- The page has an inline create-user form panel (heading "New User") always present in the DOM — it is NOT a modal/dialog.
- A `table.base-table` inside `div.outer-table-wrapper` contains the user list (50 rows per page confirmed).
- The outer-table-wrapper has both horizontal overflow (~2023px wide, ~805px visible) and vertical overflow (~2641px tall, ~288px visible) — scroll helpers are needed for off-screen columns and rows.
- User type tabs are `<a class="tab-itmes ...">` links — note the typo "itmes" (not "items") in the class name.
- The `div.tab-navs` container scrolls horizontally (~1987px wide, ~820px visible) — many tabs are hidden off-screen. Must call `scrollTabNavsToEnd()` before clicking tabs from "Respiratory Therapists" onwards.

### All User Type Tabs (18 total)
patients, physicians, technicians, secretaries, billing users, schedulers, admins,
Respiratory Therapists, Dentists, ENT Providers, Nutritionists, Behavioral Therapists,
vendors, partners, contacts, organizations, carriers, locations.

### Table Columns (patients tab — 13 columns)
NAME, ORGANIZATION, REFERRAL SOURCE, DOB, PHONE NUMBER, INSURANCE CARRIER,
LAST SEEN, DATE OF REGISTRATION, DATE OF ACTIVATION, PROVIDER, ID, STATE, ACTIONS.

### Stable Locators
- Table: `page.locator("table.base-table")` — class `base-table` is stable.
- Table wrapper: `page.locator("div.outer-table-wrapper")` — use for scoped scroll helpers.
- Add button: `page.locator('button[aria-label="add"]')` — aria-label is reliable.
- Submit (create form): `page.getByRole("button", { name: "Submit" })` — single Submit button on page.
- Quick search: `page.getByPlaceholder("Quick search")` — no name/aria-label, placeholder is stable.
  - NOTE: `page.getByRole("textbox", { name: "Quick search" })` also works (Playwright resolves via placeholder).
- State combobox: `page.getByRole("combobox", { name: "State" })` — MUI Autocomplete; label has `for` pointing to input id.
- Action links per row: `a.icons.icon-edit` and `a.icons.icon-trash` — icon font links, exactly 2 per row.
- Tab links: `page.getByRole("link", { name: "<tabname>" })` — accessible by link text.
- Open message inbox button: `page.getByRole("button", { name: "Open message inbox" })` — in `div.top-toolbar flex`.
- Go to Inbox link: `page.getByRole("link", { name: "Go to Inbox" })` — navigates to `/staff/messages/inboxList`.
- New Message link: `page.getByRole("link", { name: "New Message" })` — navigates to `/staff/newMessage`.
- View More link: `page.locator("a.blue-link")` — at the bottom of the page in `div.bottom-link`.

### Fragile Locators
- Role MUI Select: `page.locator("#mui-component-select-role")` — rendered as div[role="button"][aria-haspopup="listbox"]. DISABLED (Mui-disabled) on the patients tab.
- Referral Type MUI Select: `page.locator("#mui-component-select-referralType")` — optional field.
- Bell notification link: `page.locator("a.icons.btn-bell")` — has `<i class="red-point">` child for unread badge.
- MUI checkbox inputs (`notifyUser`, `inPerson`, `emailCollection`): have no `id` or `aria-label` — must use `input[name="..."]`.
- Organization/referral comboboxes: no `aria-label` — use `input[name="..."][placeholder="..."]`.
- Date picker year/month/day elements: only exist in DOM after opening the picker — they are transient. Year = `div` filtered by exact text; month = `radio` by name; day = `gridcell` by name.
- Pagination: `a.icons.icon-prev` / `a.icons.icon-next` — class-based icon links.
- Delete confirmation "Yes" button: only appears after clicking `a.icons.icon-trash`.
- Tab-navs container: `div.tab-navs` — only needed for scroll helpers, not for clicking individual tabs.

### Toast Notifications
- Uses Toastify library. Container: `.Toastify`. Success toast: `.Toastify__toast--success`. Error toast: `.Toastify__toast--error`.
- Toasts are dynamically inserted — container is empty on page load.
- Delete success text: `page.getByText(/User has been successfully/i)`.

### MUI Autocomplete Pattern
- MUI Autocomplete comboboxes render an `input[role="combobox"]` — fill with text, then click the `getByRole("option", { name })` that appears in the dropdown.
- The `stateCombobox` is the only one with an accessible name via label association (`for` attr links label to input id).
- Organization, Referral Source, Referring Provider comboboxes have no aria-label — use `input[name][placeholder]` selectors.

### MUI Select (native-style dropdown) Pattern
- MUI Select renders a hidden `<input type="hidden">` plus a visible `<div role="button" aria-haspopup="listbox">`.
- Click the div to open, then `getByRole("option", { name })` to pick a value.
- The `id` attribute on the div is `mui-component-select-<fieldname>` — use `page.locator("#mui-component-select-<fieldname>")`.

### Interactive Patterns — Users Module (2026-04-09)
- Tab containers: `div.tab-navs` — 18 tabs — scrollable: YES (horizontal, scrollWidth ~1987px, visible ~820px)
- Tabs in order: patients, physicians, technicians, secretaries, billing users, schedulers, admins, Respiratory Therapists, Dentists, ENT Providers, Nutritionists, Behavioral Therapists, vendors, partners, contacts, organizations, carriers, locations
- Tabs requiring scroll: Respiratory Therapists, Dentists, ENT Providers, Nutritionists, Behavioral Therapists, vendors, partners, contacts, organizations, carriers, locations
- Default active tab: patients
- Tab element selector: `div.tab-navs a` (class typo: "tab-itmes" not "tab-items")
- Accordions: no
- Overlays triggered: "Open message inbox" button (opens inbox panel), bell notification link
- Dropdowns explored: Role Select (#mui-component-select-role, disabled on patients tab), Referral Type Select (#mui-component-select-referralType), State combobox, Organization combobox, Referral Source combobox, Referring Provider combobox
- Load More / pagination: yes — `a.blue-link` (View More) + `a.icons.icon-next` / `a.icons.icon-prev`
- Expandable rows: no
- Tooltips: no
- Destructive triggers skipped: `a.icons.icon-trash` (delete user — triggers "Yes" confirmation dialog)

### Form Label Notes
- MUI form labels have `for` attributes pointing to dynamic IDs (`:r3:`, `:r4:`, etc.) — these IDs are React-generated and may change across renders/sessions. Do not use them in locators.
- Placeholder text is stable and preferred for MUI text inputs where no aria-label exists.
- Visible label texts: First Name, Last Name, Date of Birth, User Email, Reason for Visit, Role, Phone, State, Zipcode (optional), Organization, Referral Source (optional), Referring Provider (optional), Referral Type (optional), Password (optional), Notify Patient, In-Person Patient, Patient Email Collection.
