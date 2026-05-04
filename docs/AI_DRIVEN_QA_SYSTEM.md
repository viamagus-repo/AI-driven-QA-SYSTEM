# AI-Driven QA System

## Table of Contents

1. [Purpose](#1-purpose)
2. [Folder Structure](#2-folder-structure)
3. [End-to-End Pipeline](#3-end-to-end-pipeline)
4. [Skills Reference](#4-skills-reference)
5. [Skill Output Folders](#5-skill-output-folders)
6. [How Output Becomes Input](#6-how-output-becomes-input)
7. [Example Workflow Using flow.md](#7-example-workflow-using-flowmd)
8. [QA Validation Responsibilities](#8-qa-validation-responsibilities)
9. [Git Usage for Generated Artifacts](#9-git-usage-for-generated-artifacts)

---

## 1. Purpose

This AI-driven QA system replaces ad-hoc, manually written test artefacts with a structured, reproducible pipeline that starts from product inputs and ends with automation-ready specifications.

**The problem it solves:**
- QA coverage is inconsistent when test cases are written from memory or informal reading of a PRD.
- Requirements drift between what was specified, what was built, and what was tested.
- Automation scripts are hard to write cleanly when the underlying test cases are vague.
- Reviews happen too late — after scripts are already written.

**What this system provides:**
- A single, traceable chain from raw product inputs to automation specs, with every intermediate artefact saved and versioned.
- AI-assisted generation at each stage, with a human review gate built into the pipeline.
- Consistent output formats that any QA engineer or automation engineer can pick up without needing to re-read the original source material.
- Clear ownership: the AI generates, the QA engineer validates, the automation engineer implements.

---

## 2. Folder Structure

```
vm-playwright-boilerplate-automation/
│
├── docs/
│   └── AI_DRIVEN_QA_SYSTEM.md           # This document
├── CLAUDE.md                            # Root-level AI behaviour rules
│
└── playwright poc/                      # Full automation framework + all QA artifacts
    │
    ├── .claude/
    │   └── skills/                      # AI skill definitions (pipeline configuration)
    │       ├── qa-knowledge-builder.skill.md
    │       ├── requirement-analysis.skill.md
    │       ├── test-case-generation.skill.md
    │       ├── test-case-review.skill.md
    │       └── automation-adapter.skill.md
    │
    ├── qa-knowledge/                    # Stage 1 output: structured QA knowledge docs
    │   └── <feature>_qa_knowledge_v1.md
    │
    ├── qa-analysis/                     # Stage 2 output: requirement analysis docs
    │   └── <feature>_requirement_analysis_v1.md
    │
    ├── Test cases/                      # Stage 3 output: generated test case suites
    │   └── <feature>_test_cases_v1.md
    │
    ├── qa-review/                       # Stage 4 output: test case review reports
    │   └── <feature>_test_case_review_v1.md
    │
    ├── qa-automation/                   # Stage 5 output: automation adapter specs
    │   └── <feature>_automation_adapter_v1.md
    │
    ├── flows/                           # Playwright flow handlers
    ├── pages/                           # Page Object Model files
    ├── tests/                           # Playwright orchestrator specs
    ├── core/                            # Framework internals
    └── CLAUDE.md                        # Automation-layer rules
```

**Versioning convention:** If a file already exists, the system appends `_v2`, `_v3`, etc. to the filename. Prior versions are never overwritten or deleted.

---

## 3. End-to-End Pipeline

The pipeline has five stages. Each stage consumes the previous stage's output and produces a new artefact. No stage should be skipped.

```
┌─────────────────────────────────────────────────────────────────┐
│  INPUTS                                                         │
│  Design doc / PRD / Spec / API definition / App URL             │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 1 — QA Knowledge Builder                                 │
│  Skill: qa-knowledge-builder                                    │
│  Output: qa-knowledge/<feature>_qa_knowledge_v1.md              │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 2 — Requirement Analysis                                 │
│  Skill: requirement-analysis                                    │
│  Output: qa-analysis/<feature>_requirement_analysis_v1.md       │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 3 — Test Case Generation                                 │
│  Skill: test-case-generation                                    │
│  Output: Test cases/<feature>_test_cases_v1.md                  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 4 — Test Case Review                          [QA Gate]  │
│  Skill: test-case-review                                        │
│  Output: qa-review/<feature>_test_case_review_v1.md             │
└───────────────────────────┬─────────────────────────────────────┘
                            │  (only proceed if verdict = Ready)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 5 — Automation Adapter                                   │
│  Skill: automation-adapter                                      │
│  Output: qa-automation/<feature>_automation_adapter_v1.md       │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
                  Automation engineers implement
                  Playwright specs from the adapter doc
```

**Important:** Stage 5 does not produce Playwright code. It produces a specification document. Actual `.spec.ts` files are written by an automation engineer (or a separate code-generation step) using the adapter doc as their authoritative input.

---

## 4. Skills Reference

### Stage 1 — `qa-knowledge-builder`

**What it does:**
Ingests raw product inputs and produces a single structured document that captures every testable aspect of the feature: business goals, user flows, entities, API surfaces, non-functional requirements, integrations, and known gaps. All downstream skills read from this document rather than the original source material.

**Inputs it accepts:**
- Design documents (Figma links, PDFs, pasted descriptions,screenshots)
- PRDs and specifications (text or documents)
- API definitions (OpenAPI/Swagger JSON or YAML)
- Live app URLs for exploratory analysis
- Plain English feature summaries

**Key output sections:**
Business Context, Functional Scope, Entities & Data Models, User Flows, API Surface, Non-Functional Requirements, Integrations, Known Ambiguities, Testable Surface Summary.

---

### Stage 2 — `requirement-analysis`

**What it does:**
Reads the QA Knowledge document and extracts every discrete, testable requirement. Each requirement is categorized, given a risk level (High / Medium / Low), assessed for testability, and assigned a coverage priority (P1 Must-Test / P2 Should-Test / P3 Nice-to-Test).

**Why it matters:**
Without this step, test case generation lacks a traceable basis. The Requirement Analysis is the traceability backbone — every test case must map to a requirement ID from this document.

**Key output sections:**
Requirement Summary, Requirements Table (with ID, category, risk, testability, priority), High-Risk Requirements, Non-Testable Items, Open Questions, Coverage Recommendation.

---

### Stage 3 — `test-case-generation`

**What it does:**
For each requirement in the Requirement Analysis, generates structured test cases covering: happy paths, negative paths, boundary and edge conditions, authorization scenarios, and integration scenarios. Test cases are tagged by type (Functional, Negative, Boundary, Security, etc.), priority, and automation readiness (Auto-Ready / Partial / Manual-Only).

**Test case ID format:** `TC-<MODULE>-<NNN>` (e.g., `TC-AUTH-001`, `TC-USERS-012`)

**Key output sections:**
Meta (totals, breakdowns), grouped test cases each with Requirement ID, Priority, Test Type, Automation Readiness, Preconditions, Test Data, Steps, Expected Result.

---

### Stage 4 — `test-case-review`

**What it does:**
Acts as an independent reviewer of the test case suite. Scores each test case against quality criteria (traceability, clarity, completeness, accuracy, atomicity, data specificity, redundancy). Performs a coverage gap analysis against the full requirement list. Produces a prioritized fix list and an explicit sign-off verdict.

**Verdicts per test case:** Pass / Needs Minor Fix / Needs Major Fix / Fail

**Suite-level verdicts:** Ready for Execution / Needs Revision / Major Rework Required

**The QA gate:** Do not proceed to Stage 5 unless the suite-level verdict is "Ready for Execution" or "Needs Revision" with all Must Fix items resolved.

---

### Stage 5 — `automation-adapter`

**What it does:**
For every `Auto-Ready` and `Partial` test case that passed review, produces a structured automation specification: Page Object mappings, locator strategy hints, Playwright action mappings, test data fixtures (with env-var flags for sensitive fields), API payload templates, precondition setup guidance, and assertion patterns.

**What it does NOT do:** Write `.spec.ts` files or any executable code. It is a specification, not an implementation.

**Skipped cases:** `Manual-Only` test cases are listed in the output but no adapter entry is produced for them.

---

## 5. Skill Output Folders

| Skill | Output Folder | File Name Pattern |
|-------|--------------|-------------------|
| `qa-knowledge-builder` | `qa-knowledge/` | `<feature>_qa_knowledge_v1.md` |
| `requirement-analysis` | `qa-analysis/` | `<feature>_requirement_analysis_v1.md` |
| `test-case-generation` | `Test cases/` | `<feature>_test_cases_v1.md` |
| `test-case-review` | `qa-review/` | `<feature>_test_case_review_v1.md` |
| `automation-adapter` | `qa-automation/` | `<feature>_automation_adapter_v1.md` |

**Version suffix rule:** Before writing, each skill checks whether the `_v1` file already exists. If it does, it writes `_v2` instead, and so on. No file is ever overwritten.

**Feature name convention:** Use lowercase, hyphen-separated slugs (e.g., `user-login`, `checkout-flow`, `api-users`). Keep the slug consistent across all five stages so the files form a traceable set.

---

## 6. How Output Becomes Input

Each stage passes its output file path to the next stage. The chain is:

```
Stage 1 writes:  qa-knowledge/<feature>_qa_knowledge_v1.md
                     │
                     └──► Stage 2 reads this file as its primary input

Stage 2 writes:  qa-analysis/<feature>_requirement_analysis_v1.md
                     │
                     └──► Stage 3 reads this (+ the knowledge file) as input

Stage 3 writes:  Test cases/<feature>_test_cases_v1.md
                     │
                     └──► Stage 4 reads this + the requirement analysis file

Stage 4 writes:  qa-review/<feature>_test_case_review_v1.md
                     │
                     └──► Stage 5 reads this + the test cases file
```

**Handoff rule:** Always pass the exact file path of the previous stage's output when invoking the next skill. Do not paraphrase or summarise the content — the downstream skill reads the file directly.

**What accumulates:** By Stage 5, the automation adapter skill has access to four prior artefacts. This layered context means the final output is grounded in the original business requirements, not just the test case text.

---

## 7. Example Workflow Using flow.md

A `flow.md` file is a lightweight wrapper you can create at the root of a feature folder to record the paths of all artefacts for a given feature. This makes it easy to hand off a feature's QA work to another engineer or to resume after a break.

**Example: `flow.md` for a User Login feature**

```markdown
# QA Flow: User Login

## Feature Slug
`user-login`

## Pipeline Artefacts

| Stage | File |
|-------|------|
| QA Knowledge | qa-knowledge/user-login_qa_knowledge_v1.md |
| Requirement Analysis | qa-analysis/user-login_requirement_analysis_v1.md |
| Test Cases | Test cases/user-login_test_cases_v1.md |
| Test Case Review | qa-review/user-login_test_case_review_v1.md |
| Automation Adapter | qa-automation/user-login_automation_adapter_v1.md |

## Pipeline Status

| Stage | Status | Notes |
|-------|--------|-------|
| QA Knowledge | Complete | |
| Requirement Analysis | Complete | |
| Test Cases | Complete | 34 cases generated |
| Test Case Review | Complete | 2 minor fixes applied, re-run as _v2 |
| Automation Adapter | In Progress | |

## Source Inputs Used
- PRD: [link or filename]
- Figma: [link]
- API spec: docs/api/user-auth.yaml

## Open Questions
- [ ] Confirm password reset flow is in scope for this sprint
- [ ] Max failed login attempts threshold — not specified in PRD
```

**Workflow steps using this file:**

1. Create `flow.md` before starting Stage 1 and fill in the Feature Slug and Source Inputs.
2. After each stage completes, update the Stage Status table and record the output file path.
3. When invoking the next skill, copy the file path from `flow.md` — no need to remember it.
4. When a revision creates a `_v2` file, update `flow.md` to point to the new version.
5. Commit `flow.md` alongside the artefacts so the whole set is reviewable in one PR.

---

## 8. QA Validation Responsibilities

The AI generates — the QA engineer validates. At each stage, there is a defined human responsibility:

### After Stage 1 (QA Knowledge)
- Read the Testable Surface Summary and confirm it matches your understanding of the feature.
- Review the Known Ambiguities section and chase down open questions with the PM or dev team before proceeding.
- Do not proceed to Stage 2 with unresolved P1-impacting ambiguities.

### After Stage 2 (Requirement Analysis)
- Verify that no requirement from the PRD/spec is missing from the Requirements Table.
- Check the High-Risk Requirements section — if you disagree with a risk rating, adjust it before test case generation (changing risk level changes test depth).
- Confirm Non-Testable Items with the team; items that stay non-testable need a sign-off note.

### After Stage 3 (Test Case Generation)
- Spot-check 10–20% of test cases for accuracy before running the review skill.
- Confirm test data values are realistic and available in the test environment.
- Flag any test cases that would be destructive in production-like environments.

### After Stage 4 (Test Case Review) — Primary QA Gate
- This is the most important review point. Read the Executive Summary and overall verdict.
- Work through the Must Fix list completely before proceeding to Stage 5.
- Sign off on the review document explicitly (add your name/date to a sign-off comment or section) before the automation adapter is run.
- If the verdict is "Major Rework Required," return to Stage 3 and regenerate.

### After Stage 5 (Automation Adapter)
- Verify that all P1 test cases are represented in the adapter (not accidentally dropped to Manual-Only).
- Check the Environment Variable Requirements section and ensure those variables are configured in the CI environment before automation implementation begins.
- Review the Shared Helpers section — coordinate with the automation engineer to avoid duplicate implementation.

---

## 9. Git Usage for Generated Artifacts

All pipeline artefacts are source-controlled. This provides a full audit trail, enables PR-based review, and prevents accidental loss of generated content.

### Branch Strategy

Use a dedicated branch per feature QA cycle:

```
git checkout -b qa/<feature-slug>
# e.g.: git checkout -b qa/user-login
```

Keep all five pipeline artefacts for a feature on this branch. Open one PR per feature when the cycle is complete.

### What to Commit

Commit all artefacts at each stage as you go, rather than in one large commit at the end:

```bash
# After Stage 1
git add qa-knowledge/user-login_qa_knowledge_v1.md flow.md
git commit -m "qa(user-login): add QA knowledge document"

# After Stage 2
git add qa-analysis/user-login_requirement_analysis_v1.md flow.md
git commit -m "qa(user-login): add requirement analysis"

# After Stage 3
git add "Test cases/user-login_test_cases_v1.md" flow.md
git commit -m "qa(user-login): generate test case suite (34 cases)"

# After Stage 4 review + fixes
git add "Test cases/user-login_test_cases_v2.md" qa-review/user-login_test_case_review_v1.md flow.md
git commit -m "qa(user-login): add test case review; apply fixes in _v2"

# After Stage 5
git add qa-automation/user-login_automation_adapter_v1.md flow.md
git commit -m "qa(user-login): add automation adapter spec"
```

### What NOT to Commit

- Do not commit incomplete artefacts mid-stage (e.g., a partial test case file with placeholder steps).
- Do not commit `Manual-Only` test cases to the automation folder — they belong only in `Test cases/`.
- Do not commit environment variable values — only the variable names (e.g., `process.env.TEST_PASSWORD`).

### Versioned Files

When a skill produces `_v2` due to an existing `_v1`, commit both. Never delete `_v1` — it is the before-state for review comparison.

```bash
# If test cases were revised
git add "Test cases/user-login_test_cases_v2.md"
git commit -m "qa(user-login): revised test cases (v2) after review fixes"
# user-login_test_cases_v1.md remains committed and unchanged
```

### PR Description Template

When opening a QA artefacts PR, include:

```
## QA Artefacts: <Feature Name>

### Pipeline Status
- [x] QA Knowledge
- [x] Requirement Analysis
- [x] Test Cases
- [x] Test Case Review
- [x] Automation Adapter

### Coverage Summary
- Requirements: N total (X High-risk, Y Medium, Z Low)
- Test Cases: N total (X Auto-Ready, Y Partial, Z Manual-Only)
- Review Verdict: Ready for Execution / Needs Revision

### Open Items Before Automation Implementation
- List any Must Fix items still pending

### Reviewers
- QA Lead: @name
- Feature Owner: @name
```

### .gitignore Considerations

No pipeline artefacts should be gitignored. If your `.gitignore` contains patterns that would exclude Markdown files from any of the output folders, remove or scope those patterns.

---

*This document describes the AI-driven QA pipeline as configured in `.claude/skills/`. Update this document whenever a skill definition changes.*
