import { Locator, Page } from "@playwright/test";
import { BasePage } from "../BasePage";

export class UsersPage extends BasePage {
  readonly locators: Record<string, Locator>;

  constructor(page: Page) {
    super(page);
    this.locators = {
      // -------------------------------------------------------------------------
      // Page heading
      // -------------------------------------------------------------------------
      newUserHeading: page.getByRole("heading", { name: "New User" }),

      // -------------------------------------------------------------------------
      // User-type tab links — 18 tabs total in the horizontally-scrollable
      // div.tab-navs container (scrollWidth ~1987px, visible ~820px).
      // Tabs from "Respiratory Therapists" onwards require scrollTabNavsToEnd()
      // before clicking.
      // -------------------------------------------------------------------------
      patientsTab: page.getByRole("link", { name: "patients" }),
      physiciansTab: page.getByRole("link", { name: "physicians" }),
      techniciansTab: page.getByRole("link", { name: "technicians" }),
      secretariesTab: page.getByRole("link", { name: "secretaries" }),
      billingUsersTab: page.getByRole("link", { name: "billing users" }),
      schedulersTab: page.getByRole("link", { name: "schedulers" }),
      adminsTab: page.getByRole("link", { name: "admins" }),
      // --- Tabs requiring horizontal scroll to reach ---
      respiratoryTherapistsTab: page.getByRole("link", {
        name: "Respiratory Therapists",
      }),
      dentistsTab: page.getByRole("link", { name: "Dentists" }),
      entProvidersTab: page.getByRole("link", { name: "ENT Providers" }),
      nutritionistsTab: page.getByRole("link", { name: "Nutritionists" }),
      behavioralTherapistsTab: page.getByRole("link", {
        name: "Behavioral Therapists",
      }),
      vendorsTab: page.getByRole("link", { name: "vendors" }),
      partnersTab: page.getByRole("link", { name: "partners" }),
      contactsTab: page.getByRole("link", { name: "contacts" }),
      organizationsTab: page.getByRole("link", { name: "organizations" }),
      carriersTab: page.getByRole("link", { name: "carriers" }),
      locationsTab: page.getByRole("link", { name: "locations" }),

      // -------------------------------------------------------------------------
      // Top toolbar — message inbox button and its tip-panel links
      // -------------------------------------------------------------------------
      // MUI icon button that opens the tip-panel showing unread message count,
      // "Go to Inbox" and "New Message" links.
      openMessageInboxButton: page.getByRole("button", {
        name: "Open message inbox",
      }),
      // Rendered inside the tip-panel (visible after clicking openMessageInboxButton)
      goToInboxLink: page.getByRole("link", { name: "Go to Inbox" }),
      newMessageLink: page.getByRole("link", { name: "New Message" }),
      // Bell/notification icon link — lives in div.info-module.hide; currently
      // hidden (display:none) in the DOM. Locator is captured for completeness.
      // TODO: bellNotificationLink is hidden (parent has display:none) — confirm
      //       whether this element is ever visible and under what conditions.
      bellNotificationLink: page.locator("a.icons.btn-bell"),

      // -------------------------------------------------------------------------
      // Toolbar: table controls (outside the create-user drawer)
      // -------------------------------------------------------------------------
      mergeAccountsButton: page.getByRole("button", { name: "Merge Accounts" }),

      // Sort dropdown — clicking this reveals two sort options inside div.popup.
      // TODO: fragile selector — class-based; verify after each UI release.
      dateOfRegistrationFilter: page.locator(
        ".dropdown-container .click-txt",
      ),
      // Sort options (only in DOM after clicking dateOfRegistrationFilter)
      // TODO: these options only appear after opening dateOfRegistrationFilter.
      dateOfRegistrationSortOption: page
        .locator(".dropdown-container .popup .item")
        .filter({ hasText: /Date of Registration/i }),
      dateOfActivationSortOption: page
        .locator(".dropdown-container .popup .item")
        .filter({ hasText: /Date of Activation/i }),

      // "Search Archived" toggle — rendered as a <p> with cursor:pointer styling;
      // no ARIA role or state attributes. Clicking it toggles the archived-user view.
      // TODO: fragile selector — no role/aria; relies on text content match.
      searchArchivedButton: page
        .getByText("Search Archived", { exact: true }),

      // -------------------------------------------------------------------------
      // Search
      // -------------------------------------------------------------------------
      // NOTE: no aria-label on this input; Playwright resolves the accessible name
      // via the placeholder text (also works as getByRole("textbox", { name: "Quick search" })).
      quickSearchInput: page.getByPlaceholder("Quick search"),
      // The magnifier/search icon link that wraps the quick-search input.
      // TODO: fragile selector — icon link with no accessible name; verify after UI releases.
      quickSearchIconLink: page.locator(
        'div.right-main a.icons[href="javascript:;"]',
      ),

      // -------------------------------------------------------------------------
      // Create-user form (MUI Drawer panel — always present in DOM)
      // -------------------------------------------------------------------------
      // Text inputs — placeholders are stable; MUI label `for` attrs point to
      // dynamic React IDs (:r3:, :r4: …) and must NOT be used in locators.
      firstNameInput: page.getByPlaceholder("First Name"),
      lastNameInput: page.getByPlaceholder("Last Name"),
      // Date of Birth — rendered as MUI DatePicker; interact via the input directly
      // or use chooseDateButton to open the calendar picker.
      // Fallback: page.locator('input[name="dateOfBirth"]')
      dateOfBirthInput: page.getByPlaceholder("MM/DD/YYYY"),
      chooseDateButton: page.getByRole("button", { name: "Choose date" }),
      // Calendar year/month/day elements are transient — only in DOM after opening
      // the date picker via chooseDateButton.
      // TODO: calendarSwitchToYearButton only appears inside the dialog after
      //       chooseDateButton is clicked; not present on initial page load.
      calendarSwitchToYearButton: page
        .getByRole("dialog")
        .getByRole("button", { name: /calendar view is open, switch/i }),
      emailInput: page.getByPlaceholder("User Email"),
      reasonForVisitInput: page.getByPlaceholder("Reason for Visit"),
      phoneInput: page.getByPlaceholder("Phone"),
      zipcodeInput: page.getByPlaceholder("Zipcode (optional)"),
      passwordInput: page.getByPlaceholder("Password (optional)"),

      // --- MUI Select dropdowns (role="combobox" with aria-haspopup="listbox") ---
      // Role select — DISABLED (aria-disabled="true") on the patients tab because
      // the role is inferred from the tab type. Enabled on all other tabs.
      // TODO: fragile selector — MUI Select with no stable accessible name; verify
      //       after UI releases.
      roleSelect: page.locator("#mui-component-select-role"),
      // Referral Type select — optional field; same MUI Select pattern.
      // TODO: fragile selector — id-based; verify after UI releases.
      referralTypeSelect: page.locator(
        "#mui-component-select-referralType",
      ),

      // --- MUI Autocomplete comboboxes ---
      // State: label association resolves via `for` attr → Playwright getByRole works.
      stateCombobox: page.getByRole("combobox", { name: "State" }),
      // Organization, Referral Source, Referring Provider have NO aria-label and no
      // stable id (React dynamic IDs). Locator uses name+placeholder which is stable.
      // TODO: fragile selectors — rely on name+placeholder; verify after UI releases.
      organizationCombobox: page.locator(
        'input[name="organizationIds"][placeholder="Select Organization"]',
      ),
      referralSourceCombobox: page.locator(
        'input[name="partner"][placeholder="Referral Source (optional)"]',
      ),
      referringProviderCombobox: page.locator(
        'input[name="contacts"][placeholder="Referring Provider (optional)"]',
      ),
      // MUI Autocomplete "Open" chevron buttons (one per combobox field)
      // TODO: fragile selectors — multiple "Open" buttons exist; scoped by sibling input.
      organizationOpenButton: page
        .locator('input[name="organizationIds"]')
        .locator("xpath=ancestor::div[contains(@class,'MuiAutocomplete')]")
        .getByRole("button", { name: "Open" }),
      referralSourceOpenButton: page
        .locator('input[name="partner"]')
        .locator("xpath=ancestor::div[contains(@class,'MuiAutocomplete')]")
        .getByRole("button", { name: "Open" }),
      referringProviderOpenButton: page
        .locator('input[name="contacts"]')
        .locator("xpath=ancestor::div[contains(@class,'MuiAutocomplete')]")
        .getByRole("button", { name: "Open" }),
      // MUI Autocomplete "Clear" buttons — appear when a value is selected.
      // TODO: fragile selectors — only visible when a value is already selected.
      organizationClearButton: page
        .locator('input[name="organizationIds"]')
        .locator("xpath=ancestor::div[contains(@class,'MuiAutocomplete')]")
        .getByRole("button", { name: "Clear" }),
      referralSourceClearButton: page
        .locator('input[name="partner"]')
        .locator("xpath=ancestor::div[contains(@class,'MuiAutocomplete')]")
        .getByRole("button", { name: "Clear" }),
      referringProviderClearButton: page
        .locator('input[name="contacts"]')
        .locator("xpath=ancestor::div[contains(@class,'MuiAutocomplete')]")
        .getByRole("button", { name: "Clear" }),

      // "Add another referring provider" icon button — inside the Referring Provider
      // row of the create-user form. Adds a second referring provider entry.
      // NOTE: this is NOT a top-level "create user" button.
      // TODO: fragile selector — aria-label="add" with no additional context; verify
      //       this button's purpose does not change after UI releases.
      addReferringProviderButton: page.locator(
        'button[aria-label="add"]',
      ),

      // --- MUI Switch checkboxes ---
      // MUI Switch inputs have no id or aria-label — must use input[name].
      // TODO: fragile selectors — no id/aria-label on MUI switch inputs; verify
      //       after UI releases.
      notifyPatientCheckbox: page.locator('input[name="notifyUser"]'),
      inPersonPatientCheckbox: page.locator('input[name="inPerson"]'),
      emailCollectionCheckbox: page.locator(
        'input[name="emailCollection"]',
      ),

      // --- Form submit ---
      submitButton: page.getByRole("button", { name: "Submit" }),

      // -------------------------------------------------------------------------
      // Users table
      // -------------------------------------------------------------------------
      usersTable: page.locator("table.base-table"),
      // Scrollable wrapper — horizontal overflow ~2023px wide (visible ~805px),
      // vertical overflow ~2641px tall (visible ~288px).
      // TODO: fragile selector — class-based; verify after UI releases.
      tableWrapper: page.locator("div.outer-table-wrapper"),

      // Column headers (13 columns confirmed on patients tab)
      nameColumnHeader: page.getByRole("columnheader", { name: "NAME" }),
      organizationColumnHeader: page.getByRole("columnheader", {
        name: "ORGANIZATION",
      }),
      referralSourceColumnHeader: page.getByRole("columnheader", {
        name: "REFERRAL SOURCE",
      }),
      dobColumnHeader: page.getByRole("columnheader", { name: "DOB" }),
      phoneNumberColumnHeader: page.getByRole("columnheader", {
        name: "PHONE NUMBER",
      }),
      insuranceCarrierColumnHeader: page.getByRole("columnheader", {
        name: "INSURANCE CARRIER",
      }),
      lastSeenColumnHeader: page.getByRole("columnheader", {
        name: "LAST SEEN",
      }),
      dateOfRegistrationColumnHeader: page.getByRole("columnheader", {
        name: "DATE OF REGISTRATION",
      }),
      dateOfActivationColumnHeader: page.getByRole("columnheader", {
        name: "DATE OF ACTIVATION",
      }),
      providerColumnHeader: page.getByRole("columnheader", {
        name: "PROVIDER",
      }),
      idColumnHeader: page.getByRole("columnheader", { name: "ID" }),
      stateColumnHeader: page.getByRole("columnheader", { name: "STATE" }),
      actionsColumnHeader: page.getByRole("columnheader", {
        name: "ACTIONS",
      }),

      // All edit and delete/trash action links across the table rows.
      // Use row-scoped helpers (clickEditLinkForRow / clickDeleteLinkForRow) in flows
      // rather than these aggregate locators.
      // TODO: fragile selectors — class-based icon links; verify after UI releases.
      allEditLinks: page.locator("a.icons.icon-edit"),
      allDeleteLinks: page.locator("a.icons.icon-trash"),

      // -------------------------------------------------------------------------
      // Delete confirmation dialog
      // -------------------------------------------------------------------------
      // TODO: confirmDeleteYesButton only appears in the DOM after clicking a trash
      //       icon — it is not present on initial page load.
      // SKIP: this is a destructive trigger confirmation — locator captured, not
      //       clicked during exploration.
      confirmDeleteYesButton: page.getByRole("button", { name: "Yes" }),

      // -------------------------------------------------------------------------
      // "Recently Viewed" panel
      // -------------------------------------------------------------------------
      // The recently-viewed section has its own independent icon-prev / icon-next
      // pagination links, separate from the main table pagination.
      // TODO: fragile selectors — class-based icon links; verify after UI releases.
      recentlyViewedPreviousLink: page
        .locator(".titles")
        .locator("a.icons.icon-prev"),
      recentlyViewedNextLink: page
        .locator(".titles")
        .locator("a.icons.icon-next"),

      // -------------------------------------------------------------------------
      // Main table pagination
      // -------------------------------------------------------------------------
      // TODO: fragile selectors — class-based icon links; verify after UI releases.
      previousPageLink: page.locator("a.icons.icon-prev").last(),
      nextPageLink: page.locator("a.icons.icon-next").last(),

      // -------------------------------------------------------------------------
      // "View More" link
      // -------------------------------------------------------------------------
      // Rendered at the bottom of the page in div.bottom-link; loads additional
      // records.
      // TODO: fragile selector — class-based; verify after UI releases.
      viewMoreLink: page.locator("a.blue-link"),

      // -------------------------------------------------------------------------
      // Toast notifications (Toastify — dynamically inserted after actions)
      // -------------------------------------------------------------------------
      // TODO: toast locators only resolve after a create/delete action triggers them.
      successToast: page.locator(".Toastify__toast--success"),
      errorToast: page.locator(".Toastify__toast--error"),
      successMessage: page.getByText(/User has been successfully/i),
    };
  }

  // ---------------------------------------------------------------------------
  // Module ready guard
  // ---------------------------------------------------------------------------

  async waitForModuleReady(): Promise<void> {
    await this.waitForIdle();
    await this.locators.usersTable.waitFor({ state: "visible" });
  }

  // ---------------------------------------------------------------------------
  // Top toolbar actions
  // ---------------------------------------------------------------------------

  async clickOpenMessageInboxButton(): Promise<void> {
    await this.click(this.locators.openMessageInboxButton);
  }

  async clickGoToInboxLink(): Promise<void> {
    await this.click(this.locators.goToInboxLink);
  }

  async clickNewMessageLink(): Promise<void> {
    await this.click(this.locators.newMessageLink);
  }

  async clickBellNotificationLink(): Promise<void> {
    // NOTE: bellNotificationLink is in a hidden container (display:none) — ensure
    // the parent div.info-module is visible before calling this method.
    await this.click(this.locators.bellNotificationLink);
  }

  async clickMergeAccountsButton(): Promise<void> {
    await this.click(this.locators.mergeAccountsButton);
  }

  // ---------------------------------------------------------------------------
  // Sort / filter controls
  // ---------------------------------------------------------------------------

  async clickDateOfRegistrationFilter(): Promise<void> {
    await this.click(this.locators.dateOfRegistrationFilter);
  }

  async clickDateOfRegistrationSortOption(): Promise<void> {
    // TODO: only available after clickDateOfRegistrationFilter() opens the popup.
    await this.click(this.locators.dateOfRegistrationSortOption);
  }

  async clickDateOfActivationSortOption(): Promise<void> {
    // TODO: only available after clickDateOfRegistrationFilter() opens the popup.
    await this.click(this.locators.dateOfActivationSortOption);
  }

  async clickSearchArchivedButton(): Promise<void> {
    await this.click(this.locators.searchArchivedButton);
  }

  // ---------------------------------------------------------------------------
  // Tab navigation
  // ---------------------------------------------------------------------------

  async clickPatientsTab(): Promise<void> {
    await this.click(this.locators.patientsTab);
  }

  async clickPhysiciansTab(): Promise<void> {
    await this.click(this.locators.physiciansTab);
  }

  async clickTechniciansTab(): Promise<void> {
    await this.click(this.locators.techniciansTab);
  }

  async clickSecretariesTab(): Promise<void> {
    await this.click(this.locators.secretariesTab);
  }

  async clickBillingUsersTab(): Promise<void> {
    await this.click(this.locators.billingUsersTab);
  }

  async clickSchedulersTab(): Promise<void> {
    await this.click(this.locators.schedulersTab);
  }

  async clickAdminsTab(): Promise<void> {
    await this.click(this.locators.adminsTab);
  }

  async clickRespiratoryTherapistsTab(): Promise<void> {
    await this.scrollTabNavsToEnd();
    await this.click(this.locators.respiratoryTherapistsTab);
  }

  async clickDentistsTab(): Promise<void> {
    await this.scrollTabNavsToEnd();
    await this.click(this.locators.dentistsTab);
  }

  async clickEntProvidersTab(): Promise<void> {
    await this.scrollTabNavsToEnd();
    await this.click(this.locators.entProvidersTab);
  }

  async clickNutritionistsTab(): Promise<void> {
    await this.scrollTabNavsToEnd();
    await this.click(this.locators.nutritionistsTab);
  }

  async clickBehavioralTherapistsTab(): Promise<void> {
    await this.scrollTabNavsToEnd();
    await this.click(this.locators.behavioralTherapistsTab);
  }

  async clickVendorsTab(): Promise<void> {
    await this.scrollTabNavsToEnd();
    await this.click(this.locators.vendorsTab);
  }

  async clickPartnersTab(): Promise<void> {
    await this.scrollTabNavsToEnd();
    await this.click(this.locators.partnersTab);
  }

  async clickContactsTab(): Promise<void> {
    await this.scrollTabNavsToEnd();
    await this.click(this.locators.contactsTab);
  }

  async clickOrganizationsTab(): Promise<void> {
    await this.scrollTabNavsToEnd();
    await this.click(this.locators.organizationsTab);
  }

  async clickCarriersTab(): Promise<void> {
    await this.scrollTabNavsToEnd();
    await this.click(this.locators.carriersTab);
  }

  async clickLocationsTab(): Promise<void> {
    await this.scrollTabNavsToEnd();
    await this.click(this.locators.locationsTab);
  }

  // ---------------------------------------------------------------------------
  // Search
  // ---------------------------------------------------------------------------

  async fillQuickSearch(value: string): Promise<void> {
    await this.fill(this.locators.quickSearchInput, value);
  }

  async pressEnterOnQuickSearch(): Promise<void> {
    await this.locators.quickSearchInput.press("Enter");
  }

  async clearQuickSearch(): Promise<void> {
    await this.locators.quickSearchInput.clear();
  }

  // ---------------------------------------------------------------------------
  // Create-user form — text inputs
  // ---------------------------------------------------------------------------

  async fillFirstName(value: string): Promise<void> {
    await this.fill(this.locators.firstNameInput, value);
  }

  async fillLastName(value: string): Promise<void> {
    await this.fill(this.locators.lastNameInput, value);
  }

  async fillDateOfBirth(value: string): Promise<void> {
    await this.fill(this.locators.dateOfBirthInput, value);
  }

  async clickChooseDateButton(): Promise<void> {
    await this.click(this.locators.chooseDateButton);
  }

  async clickCalendarSwitchToYearButton(): Promise<void> {
    // Requires chooseDateButton to have been clicked first to open the calendar.
    await this.click(this.locators.calendarSwitchToYearButton);
  }

  async clickYearOption(year: string): Promise<void> {
    // TODO: year options render as divs with exact text — only appear after
    //       clickCalendarSwitchToYearButton().
    await this.page
      .locator("div")
      .filter({ hasText: new RegExp(`^${year}$`) })
      .click();
  }

  async clickMonthRadio(month: string): Promise<void> {
    // TODO: month radio buttons only appear after selecting a year in the date picker.
    await this.page.getByRole("radio", { name: month }).click();
  }

  async clickDayCell(day: string): Promise<void> {
    // TODO: day grid cells only appear after selecting a month in the date picker.
    await this.page.getByRole("gridcell", { name: day }).click();
  }

  async fillEmail(value: string): Promise<void> {
    await this.fill(this.locators.emailInput, value);
  }

  async fillReasonForVisit(value: string): Promise<void> {
    await this.fill(this.locators.reasonForVisitInput, value);
  }

  async fillPhone(value: string): Promise<void> {
    await this.fill(this.locators.phoneInput, value);
  }

  async fillZipcode(value: string): Promise<void> {
    await this.fill(this.locators.zipcodeInput, value);
  }

  async fillPassword(value: string): Promise<void> {
    await this.fill(this.locators.passwordInput, value);
  }

  // ---------------------------------------------------------------------------
  // Create-user form — MUI Select dropdowns
  // ---------------------------------------------------------------------------

  async clickRoleSelect(): Promise<void> {
    // NOTE: roleSelect is disabled (aria-disabled="true") on the patients tab;
    // only call this method on tabs where the role field is editable.
    await this.click(this.locators.roleSelect);
  }

  async clickRoleOption(optionName: string): Promise<void> {
    // TODO: options only appear in the DOM after clickRoleSelect() opens the listbox.
    await this.page.getByRole("option", { name: optionName }).click();
  }

  async clickReferralTypeSelect(): Promise<void> {
    await this.click(this.locators.referralTypeSelect);
  }

  async clickReferralTypeOption(optionName: string): Promise<void> {
    // TODO: options only appear in the DOM after clickReferralTypeSelect() opens the listbox.
    await this.page.getByRole("option", { name: optionName }).click();
  }

  // ---------------------------------------------------------------------------
  // Create-user form — MUI Autocomplete comboboxes
  // ---------------------------------------------------------------------------

  async fillStateCombobox(value: string): Promise<void> {
    await this.fill(this.locators.stateCombobox, value);
  }

  async clickStateOption(optionName: string): Promise<void> {
    await this.page.getByRole("option", { name: optionName }).click();
  }

  async fillOrganizationCombobox(value: string): Promise<void> {
    await this.fill(this.locators.organizationCombobox, value);
  }

  async clickOrganizationOpenButton(): Promise<void> {
    await this.click(this.locators.organizationOpenButton);
  }

  async clickOrganizationClearButton(): Promise<void> {
    // NOTE: only visible when a value is already selected in the organization field.
    await this.click(this.locators.organizationClearButton);
  }

  async fillReferralSourceCombobox(value: string): Promise<void> {
    await this.fill(this.locators.referralSourceCombobox, value);
  }

  async clickReferralSourceOpenButton(): Promise<void> {
    await this.click(this.locators.referralSourceOpenButton);
  }

  async clickReferralSourceClearButton(): Promise<void> {
    // NOTE: only visible when a value is already selected in the referral source field.
    await this.click(this.locators.referralSourceClearButton);
  }

  async fillReferringProviderCombobox(value: string): Promise<void> {
    await this.fill(this.locators.referringProviderCombobox, value);
  }

  async clickReferringProviderOpenButton(): Promise<void> {
    await this.click(this.locators.referringProviderOpenButton);
  }

  async clickReferringProviderClearButton(): Promise<void> {
    // NOTE: only visible when a value is already selected in the referring provider field.
    await this.click(this.locators.referringProviderClearButton);
  }

  async clickAddReferringProviderButton(): Promise<void> {
    // Adds a second referring provider entry row in the create-user form.
    await this.click(this.locators.addReferringProviderButton);
  }

  async clickAutoCompleteOption(optionName: string): Promise<void> {
    // Generic option-click used for any open MUI Autocomplete dropdown.
    await this.page.getByRole("option", { name: optionName }).click();
  }

  // ---------------------------------------------------------------------------
  // Create-user form — MUI Switch checkboxes
  // ---------------------------------------------------------------------------

  async checkNotifyPatient(): Promise<void> {
    await this.locators.notifyPatientCheckbox.check();
  }

  async uncheckNotifyPatient(): Promise<void> {
    await this.locators.notifyPatientCheckbox.uncheck();
  }

  async checkInPersonPatient(): Promise<void> {
    await this.locators.inPersonPatientCheckbox.check();
  }

  async uncheckInPersonPatient(): Promise<void> {
    await this.locators.inPersonPatientCheckbox.uncheck();
  }

  async checkEmailCollection(): Promise<void> {
    await this.locators.emailCollectionCheckbox.check();
  }

  async uncheckEmailCollection(): Promise<void> {
    await this.locators.emailCollectionCheckbox.uncheck();
  }

  // ---------------------------------------------------------------------------
  // Create-user form — submit
  // ---------------------------------------------------------------------------

  async clickSubmitButton(): Promise<void> {
    await this.click(this.locators.submitButton);
  }

  // ---------------------------------------------------------------------------
  // Table row actions
  // ---------------------------------------------------------------------------

  async clickEditLinkForRow(rowIndex: number): Promise<void> {
    // TODO: row index is positional — prefer a name-scoped locator when a stable
    //       row identifier is available.
    await this.page
      .locator("table.base-table tbody tr")
      .nth(rowIndex)
      .locator("a.icons.icon-edit")
      .click();
  }

  async clickDeleteLinkForRow(rowIndex: number): Promise<void> {
    // TODO: row index is positional — prefer a name-scoped locator when a stable
    //       row identifier is available.
    // SKIP: destructive trigger — locator captured; not clicked during exploration.
    await this.page
      .locator("table.base-table tbody tr")
      .nth(rowIndex)
      .locator("a.icons.icon-trash")
      .click();
  }

  async getUserRowByName(
    firstName: string,
    lastName: string,
  ): Promise<Locator> {
    return this.page.getByRole("cell", {
      name: `${firstName} ${lastName}`,
    });
  }

  async clickEditLinkForUser(firstName: string, lastName: string): Promise<void> {
    await this.page
      .getByRole("row", { name: new RegExp(`${firstName}\\s+${lastName}`, "i") })
      .locator("a.icons.icon-edit")
      .click();
  }

  async clickDeleteLinkForUser(
    firstName: string,
    lastName: string,
  ): Promise<void> {
    // SKIP: destructive trigger — locator captured; not clicked during exploration.
    await this.page
      .getByRole("row", { name: new RegExp(`${firstName}\\s+${lastName}`, "i") })
      .locator("a.icons.icon-trash")
      .click();
  }

  // ---------------------------------------------------------------------------
  // Delete confirmation
  // ---------------------------------------------------------------------------

  async clickConfirmDeleteYes(): Promise<void> {
    // NOTE: confirmDeleteYesButton only appears after clicking a trash icon.
    await this.click(this.locators.confirmDeleteYesButton);
  }

  // ---------------------------------------------------------------------------
  // Recently Viewed panel pagination
  // ---------------------------------------------------------------------------

  async clickRecentlyViewedPreviousLink(): Promise<void> {
    await this.click(this.locators.recentlyViewedPreviousLink);
  }

  async clickRecentlyViewedNextLink(): Promise<void> {
    await this.click(this.locators.recentlyViewedNextLink);
  }

  // ---------------------------------------------------------------------------
  // Main table pagination
  // ---------------------------------------------------------------------------

  async clickNextPage(): Promise<void> {
    await this.click(this.locators.nextPageLink);
  }

  async clickPreviousPage(): Promise<void> {
    await this.click(this.locators.previousPageLink);
  }

  async clickViewMoreLink(): Promise<void> {
    await this.click(this.locators.viewMoreLink);
  }

  // ---------------------------------------------------------------------------
  // Toast / feedback
  // ---------------------------------------------------------------------------

  async waitForSuccessToast(): Promise<void> {
    await this.locators.successToast.waitFor({ state: "visible" });
  }

  async waitForErrorToast(): Promise<void> {
    await this.locators.errorToast.waitFor({ state: "visible" });
  }

  async waitForSuccessMessage(): Promise<void> {
    await this.locators.successMessage.waitFor({ state: "visible" });
  }

  // ---------------------------------------------------------------------------
  // Scroll helpers
  // ---------------------------------------------------------------------------

  // Scrolls the horizontal tab-navs container to the end to reveal hidden tabs.
  // (tab-navs scrollWidth ~1987px, visible ~820px — roughly half the tabs are
  // off-screen to the right.)
  async scrollTabNavsToEnd(): Promise<void> {
    await this.page.evaluate(() => {
      const tabNavs = document.querySelector(".tab-navs");
      if (tabNavs) tabNavs.scrollLeft = tabNavs.scrollWidth;
    });
  }

  // Scrolls the tab-navs container back to the start (leftmost position).
  async scrollTabNavsToStart(): Promise<void> {
    await this.page.evaluate(() => {
      const tabNavs = document.querySelector(".tab-navs");
      if (tabNavs) tabNavs.scrollLeft = 0;
    });
  }

  // Scrolls the outer-table-wrapper to the rightmost position to reveal hidden
  // columns (scrollWidth ~2023px, visible ~805px).
  async scrollTableToRight(): Promise<void> {
    await this.locators.tableWrapper.evaluate(
      (el) => (el.scrollLeft = el.scrollWidth),
    );
  }

  // Scrolls the outer-table-wrapper back to the leftmost position.
  async scrollTableToLeft(): Promise<void> {
    await this.locators.tableWrapper.evaluate((el) => (el.scrollLeft = 0));
  }

  // Scrolls the outer-table-wrapper to the bottom to reveal rows below the fold.
  async scrollTableToBottom(): Promise<void> {
    await this.locators.tableWrapper.evaluate(
      (el) => (el.scrollTop = el.scrollHeight),
    );
  }

  // Scrolls the outer-table-wrapper back to the top.
  async scrollTableToTop(): Promise<void> {
    await this.locators.tableWrapper.evaluate((el) => (el.scrollTop = 0));
  }

  // Scrolls the create-user form drawer into view (useful when form fields at the
  // bottom of the drawer are off-screen).
  async scrollToSubmitButton(): Promise<void> {
    await this.locators.submitButton.scrollIntoViewIfNeeded();
  }
}
