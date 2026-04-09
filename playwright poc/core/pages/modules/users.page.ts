import { Locator, Page } from "@playwright/test";
import { BasePage } from "../BasePage";

export class UsersPage extends BasePage {
  readonly locators: Record<string, Locator>;

  constructor(page: Page) {
    super(page);
    this.locators = {
      // --- Page heading ---
      newUserHeading: page.getByRole("heading", { name: "New User" }),

      // --- User type tab links ---
      // Original tabs (patients is the default active tab)
      patientsTab: page.getByRole("link", { name: "patients" }),
      physiciansTab: page.getByRole("link", { name: "physicians" }),
      techniciansTab: page.getByRole("link", { name: "technicians" }),
      secretariesTab: page.getByRole("link", { name: "secretaries" }),
      billingUsersTab: page.getByRole("link", { name: "billing users" }),
      schedulersTab: page.getByRole("link", { name: "schedulers" }),
      adminsTab: page.getByRole("link", { name: "admins" }),

      // Additional user type tabs (revealed by scrolling the tab-navs container horizontally)
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

      // --- Toolbar buttons ---
      // The "add" icon button opens the create-user form panel
      addButton: page.locator('button[aria-label="add"]'),
      mergeAccountsButton: page.getByRole("button", { name: "Merge Accounts" }),
      // MUI icon button in the top-toolbar for the message inbox (has an unread badge)
      openMessageInboxButton: page.getByRole("button", {
        name: "Open message inbox",
      }),

      // --- Toolbar navigation links ---
      // "Go to Inbox" text link — navigates to /staff/messages/inboxList
      goToInboxLink: page.getByRole("link", { name: "Go to Inbox" }),
      // "New Message" button-styled link — navigates to /staff/newMessage
      newMessageLink: page.getByRole("link", { name: "New Message" }),
      // Bell / notification icon link — has a red-point badge child for unread count
      // TODO: fragile selector — class-based icon link with no aria-label; verify after UI releases
      bellNotificationLink: page.locator("a.icons.btn-bell"),

      // --- Search ---
      // NOTE: quickSearchInput has no aria-label; identified only by placeholder.
      // The delete flow uses getByRole("textbox", { name: "Quick search" }) — Playwright resolves
      // this via the placeholder text since no label association exists in the DOM.
      quickSearchInput: page.getByPlaceholder("Quick search"),

      // --- Create-user form inputs ---
      // NOTE: these inputs are always present in the DOM (inline panel, not a modal dialog).
      // MUI labels have `for` attributes that associate to the inputs; getByLabel is the
      // preferred strategy but the label IDs are dynamic (:r3:, :r4: …). Placeholders are stable.
      firstNameInput: page.getByPlaceholder("First Name"),
      lastNameInput: page.getByPlaceholder("Last Name"),
      // dateOfBirth renders as a MUI DatePicker — interact via the input directly or the calendar button
      dateOfBirthInput: page.locator('input[name="dateOfBirth"]'),
      chooseDateButton: page.getByRole("button", { name: "Choose date" }),
      calendarSwitchToYearButton: page
        .getByRole("dialog")
        .getByRole("button", { name: /calendar view is open, switch/i }),
      emailInput: page.getByPlaceholder("User Email"),
      reasonForVisitInput: page.getByPlaceholder("Reason for Visit"),
      phoneInput: page.getByPlaceholder("Phone"),
      zipcodeInput: page.getByPlaceholder("Zipcode (optional)"),
      passwordInput: page.getByPlaceholder("Password (optional)"),

      // --- Create-user form: MUI Select dropdowns ---
      // Role MUI Select — rendered as a div[role="button"][aria-haspopup="listbox"].
      // It is DISABLED (Mui-disabled class) on the patients tab because the role is inferred from the tab.
      // On other tabs (e.g., physicians) it becomes enabled. Interact via locator by aria-labelledby.
      // TODO: fragile selector — MUI Select has no stable id usable by getByRole; verify after UI releases
      roleSelect: page.locator("#mui-component-select-role"),
      // Referral Type MUI Select — optional, enabled on all tabs
      // TODO: fragile selector — identified by id; verify after UI releases
      referralTypeSelect: page.locator(
        "#mui-component-select-referralType",
      ),

      // --- Create-user form comboboxes (MUI Autocomplete) ---
      stateCombobox: page.getByRole("combobox", { name: "State" }),
      // TODO: comboboxes below have no aria-label — identified by name+placeholder; fragile if attrs change
      organizationCombobox: page.locator(
        'input[name="organizationIds"][placeholder="Select Organization"]',
      ),
      referralSourceCombobox: page.locator(
        'input[name="partner"][placeholder="Referral Source (optional)"]',
      ),
      referringProviderCombobox: page.locator(
        'input[name="contacts"][placeholder="Referring Provider (optional)"]',
      ),

      // --- Create-user form checkboxes (MUI Switch — rendered as checkbox inputs) ---
      // TODO: fragile selectors — MUI switch inputs have no id or aria-label; verify after UI releases
      // Labels visible in DOM: "Notify Patient", "In-Person Patient", "Patient Email Collection"
      notifyPatientCheckbox: page.locator('input[name="notifyUser"]'),
      inPersonPatientCheckbox: page.locator('input[name="inPerson"]'),
      emailCollectionCheckbox: page.locator('input[name="emailCollection"]'),

      // --- Create-user form submit ---
      submitButton: page.getByRole("button", { name: "Submit" }),

      // --- Users table ---
      usersTable: page.locator("table.base-table"),
      // Scrollable wrapper around the table — has both horizontal (2023px) and vertical (2641px) overflow
      // TODO: fragile selector — class-based; verify after UI releases
      tableWrapper: page.locator("div.outer-table-wrapper"),

      // Column headers — all 13 columns confirmed in patients tab
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
      actionsColumnHeader: page.getByRole("columnheader", { name: "ACTIONS" }),

      // All edit and delete/trash action links across the table
      // Use row-scoped methods (clickEditLinkForRow / clickDeleteLinkForRow) in flows
      allEditLinks: page.locator("a.icons.icon-edit"),
      allDeleteLinks: page.locator("a.icons.icon-trash"),

      // --- Delete confirmation ---
      // TODO: confirmDeleteYesButton only appears after clicking a trash icon — not present on page load
      confirmDeleteYesButton: page.getByRole("button", { name: "Yes" }),

      // --- Pagination ---
      // TODO: fragile selectors — class-based icon links; verify after each UI release
      previousPageLink: page.locator("a.icons.icon-prev"),
      nextPageLink: page.locator("a.icons.icon-next"),

      // --- "View More" link ---
      // Appears at the bottom of the page (div.bottom-link); loads additional records or expands a section
      // TODO: fragile selector — class-based; verify after UI releases
      viewMoreLink: page.locator("a.blue-link"),

      // --- Toast notifications (Toastify — rendered dynamically after actions) ---
      // TODO: these locators only resolve after a create/delete action triggers a toast
      successToast: page.locator(".Toastify__toast--success"),
      errorToast: page.locator(".Toastify__toast--error"),
      successMessage: page.getByText(/User has been successfully/i),
    };
  }

  async waitForModuleReady(): Promise<void> {
    await this.waitForIdle();
    await this.locators.usersTable.waitFor({ state: "visible" });
  }

  // --- Toolbar actions ---

  async clickAddButton(): Promise<void> {
    await this.click(this.locators.addButton);
  }

  async clickMergeAccountsButton(): Promise<void> {
    await this.click(this.locators.mergeAccountsButton);
  }

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
    await this.click(this.locators.bellNotificationLink);
  }

  // --- Tab navigation ---

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

  // --- Search ---

  async fillQuickSearch(value: string): Promise<void> {
    await this.fill(this.locators.quickSearchInput, value);
  }

  async pressEnterOnQuickSearch(): Promise<void> {
    await this.locators.quickSearchInput.press("Enter");
  }

  // --- Create-user form ---

  async fillFirstName(value: string): Promise<void> {
    await this.fill(this.locators.firstNameInput, value);
  }

  async fillLastName(value: string): Promise<void> {
    await this.fill(this.locators.lastNameInput, value);
  }

  async clickChooseDateButton(): Promise<void> {
    await this.click(this.locators.chooseDateButton);
  }

  async clickCalendarSwitchToYearButton(): Promise<void> {
    await this.clickChooseDateButton();
    await this.click(this.locators.calendarSwitchToYearButton);
  }

  async clickYearOption(year: string): Promise<void> {
    // TODO: year options render as divs with exact text — only appear after clickCalendarSwitchToYearButton
    await this.page
      .locator("div")
      .filter({ hasText: new RegExp(`^${year}$`) })
      .click();
  }

  async clickMonthRadio(month: string): Promise<void> {
    // TODO: month radio buttons only appear after selecting a year in the date picker
    await this.page.getByRole("radio", { name: month }).click();
  }

  async clickDayCell(day: string): Promise<void> {
    // TODO: day grid cells only appear in the date picker calendar after selecting a month
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

  async fillStateCombobox(value: string): Promise<void> {
    await this.fill(this.locators.stateCombobox, value);
  }

  async clickStateOption(optionName: string): Promise<void> {
    await this.page.getByRole("option", { name: optionName }).click();
  }

  async clickRoleSelect(): Promise<void> {
    // TODO: roleSelect is disabled (Mui-disabled) on the patients tab; only click on tabs where role is editable
    await this.click(this.locators.roleSelect);
  }

  async clickRoleOption(optionName: string): Promise<void> {
    // TODO: options only appear in the DOM after clickRoleSelect() opens the MUI listbox
    await this.page.getByRole("option", { name: optionName }).click();
  }

  async clickReferralTypeSelect(): Promise<void> {
    await this.click(this.locators.referralTypeSelect);
  }

  async clickReferralTypeOption(optionName: string): Promise<void> {
    // TODO: options only appear in the DOM after clickReferralTypeSelect() opens the MUI listbox
    await this.page.getByRole("option", { name: optionName }).click();
  }

  async fillOrganizationCombobox(value: string): Promise<void> {
    await this.fill(this.locators.organizationCombobox, value);
  }

  async fillReferralSourceCombobox(value: string): Promise<void> {
    await this.fill(this.locators.referralSourceCombobox, value);
  }

  async fillReferringProviderCombobox(value: string): Promise<void> {
    await this.fill(this.locators.referringProviderCombobox, value);
  }

  async checkNotifyPatient(): Promise<void> {
    await this.locators.notifyPatientCheckbox.check();
  }

  async checkInPersonPatient(): Promise<void> {
    await this.locators.inPersonPatientCheckbox.check();
  }

  async checkEmailCollection(): Promise<void> {
    await this.locators.emailCollectionCheckbox.check();
  }

  async clickSubmitButton(): Promise<void> {
    await this.click(this.locators.submitButton);
  }

  // --- Table row actions ---

  async clickEditLinkForRow(rowIndex: number): Promise<void> {
    // TODO: row index is positional — prefer a name-scoped locator when a stable row id is available
    await this.page
      .locator("table.base-table tbody tr")
      .nth(rowIndex)
      .locator("a.icons.icon-edit")
      .click();
  }

  async clickDeleteLinkForRow(rowIndex: number): Promise<void> {
    // TODO: row index is positional — prefer a name-scoped locator when a stable row id is available
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
    return this.page.getByRole("cell", { name: `${firstName} ${lastName}` });
  }

  async clickViewMoreLink(): Promise<void> {
    await this.click(this.locators.viewMoreLink);
  }

  // --- Delete confirmation ---

  async clickConfirmDeleteYes(): Promise<void> {
    await this.click(this.locators.confirmDeleteYesButton);
  }

  // --- Pagination ---

  async clickNextPage(): Promise<void> {
    await this.click(this.locators.nextPageLink);
  }

  async clickPreviousPage(): Promise<void> {
    await this.click(this.locators.previousPageLink);
  }

  // --- Scroll helpers ---

  // Scrolls the horizontal tab-navs container to the end to reveal hidden tabs
  // (tab-navs scrollWidth is ~1987px; visible width is ~820px — roughly half the tabs are off-screen)
  async scrollTabNavsToEnd(): Promise<void> {
    await this.page.evaluate(() => {
      const tabNavs = document.querySelector(".tab-navs");
      if (tabNavs) tabNavs.scrollLeft = tabNavs.scrollWidth;
    });
  }

  // Scrolls the tab-navs container back to the start (leftmost position)
  async scrollTabNavsToStart(): Promise<void> {
    await this.page.evaluate(() => {
      const tabNavs = document.querySelector(".tab-navs");
      if (tabNavs) tabNavs.scrollLeft = 0;
    });
  }

  // Scrolls the outer-table-wrapper to the rightmost position to reveal hidden columns
  // (tableWrapper scrollWidth is ~2023px; visible width is ~805px)
  async scrollTableToRight(): Promise<void> {
    await this.locators.tableWrapper.evaluate(
      (el) => (el.scrollLeft = el.scrollWidth),
    );
  }

  // Scrolls the outer-table-wrapper back to the leftmost position
  async scrollTableToLeft(): Promise<void> {
    await this.locators.tableWrapper.evaluate((el) => (el.scrollLeft = 0));
  }

  // Scrolls the outer-table-wrapper to the bottom to reveal rows below the fold
  async scrollTableToBottom(): Promise<void> {
    await this.locators.tableWrapper.evaluate(
      (el) => (el.scrollTop = el.scrollHeight),
    );
  }

  // Scrolls the outer-table-wrapper back to the top
  async scrollTableToTop(): Promise<void> {
    await this.locators.tableWrapper.evaluate((el) => (el.scrollTop = 0));
  }

  // --- Toast / feedback ---

  async waitForSuccessToast(): Promise<void> {
    await this.locators.successToast.waitFor({ state: "visible" });
  }

  async waitForErrorToast(): Promise<void> {
    await this.locators.errorToast.waitFor({ state: "visible" });
  }

  async waitForSuccessMessage(): Promise<void> {
    await this.locators.successMessage.waitFor({ state: "visible" });
  }
}
