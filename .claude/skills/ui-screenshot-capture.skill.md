---
name: ui-screenshot-capture
description: Runs an existing Playwright screenshot script from the FE codebase to capture module screenshots for downstream test case generation.
type: skill
---

# UI Screenshot Capture

## Name
`ui-screenshot-capture`

## Description
Runs a Playwright screenshot capture script from the referenced FE codebase and stores module-specific screenshots for downstream QA stages.

This skill supports:
- test-case-generation
- test-case-review
- automation mapping

---

## Purpose

Capture actual UI states from localhost so test cases can be generated using both:
- Requirement Analysis output
- Real UI screenshots

---

## Core Principle

- FE codebase is used by reference path
- Existing screenshot script should be reused if available
- Do NOT copy FE code into QA pipeline repo
- Do NOT manually capture screenshots
- Do NOT modify application business logic
- Store screenshots in FE codebase screenshot folder
- Use screenshot output path as reference in test-case-generation

---

## When to Use

- After Requirement Analysis is completed
- Before test-case-generation
- When UI implementation is available locally
- When screenshots need to be refreshed after code/design changes

---

## When NOT to Use

- Before FE codebase is available
- If localhost cannot be started
- For generating test cases directly
- For writing final Playwright automation scripts

---

## Input

Provide:

FE Codebase Path: ../FE-Codebase  
Module Name: Admin / Master Data  
Module Slug: master-data  
Localhost URL: http://localhost:3004  
Screenshot Script Path: screenshots/capture-master-data.mjs  
Screenshot Output Path: screenshots/master-data  

Optional:

Route Path: /admin/master-data  
Login Required: Yes / No  
Username: <username>  
Password: <password>  
Start Command: npm start  

Example:

FE Codebase Path: ../FE-Codebase  
Module Name: Admin / Master Data  
Module Slug: master-data  
Localhost URL: http://localhost:3004  
Screenshot Script Path: screenshots/capture-master-data.mjs  
Screenshot Output Path: screenshots/master-data  
Start Command: npm start  
Login Required: No

---

## Execution Rules

1. Validate FE Codebase Path exists
   - If missing, STOP

2. Validate `package.json` exists inside FE Codebase Path
   - If missing, STOP

3. Navigate to FE Codebase Path before running any command

4. Validate Screenshot Script Path exists
   - If present, reuse it
   - Do NOT regenerate the script

5. If Screenshot Script Path is missing
   - Create a reusable screenshot script only after confirming no script exists
   - Save it under `screenshots/`
   - Use module-specific naming:
     `capture-<module-slug>.mjs`

6. Start localhost using Start Command if app is not already running

7. Confirm Localhost URL is reachable

8. Execute screenshot script using:

   `node <Screenshot Script Path>`

9. Validate Screenshot Output Path exists after execution

10. Confirm screenshots were generated

11. Generate or update screenshot manifest:

   `screenshots/<module-slug>/screenshot-manifest.md`

12. Do NOT copy screenshots into QA pipeline repo

13. Do NOT modify app source/business logic

14. If execution fails, report exact blocker and command output

---

## Instructions

You are a QA Automation Assistant.

Perform the following:

1. Navigate to FE Codebase Path

2. Inspect:
   - package.json
   - existing screenshot script
   - existing screenshot output folder

3. Check current branch and report it:
   - `git branch --show-current`

4. Start the application if required:
   - Use Start Command
   - If not provided, inspect package.json and choose correct command

5. Confirm Localhost URL:
   - Example: `http://localhost:3004`

6. Run existing screenshot script:
   - `node screenshots/capture-master-data.mjs`

7. Verify screenshots are created under:
   - `screenshots/master-data`

8. Generate screenshot manifest with:
   - Screenshot file name
   - UI state captured
   - Route or page if identifiable
   - Notes/blockers

---

## Screenshot Manifest Format

Create or update:

`screenshots/<module-slug>/screenshot-manifest.md`

Use this format:

# Screenshot Manifest: <Module Name>

## Meta
- FE Codebase Path:
- Branch:
- Localhost URL:
- Screenshot Script:
- Screenshot Output Path:
- Date:

## Screenshots

| Screenshot | UI State | Route/Page | Notes |
|---|---|---|---|

## Blockers / Missing States
- List any states not captured

---

## Expected Screenshot Coverage

For Admin / Master Data, expected screenshots may include:

- Master Data Types default list
- Create Master Data Type sheet
- Create Master Data Type validation errors
- Create Master Data Type filled form
- Edit Master Data Type sheet
- Master Data Type inactive state
- Deactivate Type confirmation popup
- Master Data Types empty state
- Master Data default tab
- Master Data deep-link tab
- Master Data tab switching
- Create Master Data Entry sheet
- Create Master Data Entry validation errors
- Create Master Data Entry filled form
- Edit Master Data Entry sheet
- Deactivate Entry popup
- Row inactive state
- Reactivated row state
- Drag handle hover
- Drag reorder active state

---

## Output Format

After execution, provide this summary:

# Screenshot Capture Summary: <Module Name>

## Localhost
- FE Codebase Path:
- Branch:
- Localhost URL:
- Start Command Used:

## Script Execution
- Screenshot Script Used:
- Command Executed:
- Status:

## Screenshot Output
- Output Folder:
- Manifest File:
- Total Screenshots Captured:

## Screenshots Captured
| Screenshot | Status | Notes |
|---|---|---|

## Blockers / Gaps
- Any issue found

## Next Step
Use Screenshot Path in `test-case-generation`.

---

## File Output Requirement

Screenshots must remain under FE codebase:

`screenshots/<module-slug>/`

Manifest must be created under:

`screenshots/<module-slug>/screenshot-manifest.md`

Do not store screenshots inside QA pipeline repo.

---

## Expected Outcome

A refreshed screenshot set captured from localhost using the existing Playwright script, ready to be used by `test-case-generation`.