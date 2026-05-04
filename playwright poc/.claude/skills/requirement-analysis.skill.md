---
name: requirement-analysis
description: Reads the QA Knowledge document and produces a structured Requirement Analysis with categorized requirements, risk ratings, coverage priorities, and testability assessments.
type: skill
---

# Requirement Analysis

## Name
`requirement-analysis`

## Description
Transforms the QA Knowledge artifact into a formal Requirement Analysis document. Each requirement is extracted, categorized, assigned a risk level, and assessed for testability. The output drives test case scoping and prioritization in the next pipeline stage.

## Purpose
Ensure every requirement is explicitly documented, nothing is missed, high-risk areas are flagged for deep coverage, and untestable items are escalated before test writing begins.

## When to Use
- After `qa-knowledge-builder` has produced a QA Knowledge document.
- Before running `test-case-generation`.
- When requirements change and existing test cases need to be re-scoped.

## Input

| Input | Required | Description |
|-------|----------|-------------|
| QA Knowledge file | Yes | Path to the `qa-knowledge/<feature>_qa_knowledge_v*.md` file |
| Additional constraints | Optional | Stakeholder priorities, deadline, environment limits |

## Instructions

1. **Read the QA Knowledge document.** Do not re-read the original PRD/spec — the knowledge document is the authoritative input.

2. **Extract all requirements.** For each item in the Functional Scope, User Flows, API Surface, Non-Functional Requirements, and Integrations sections, write a discrete, testable requirement statement.

3. **Categorize each requirement:**
   - Functional
   - Non-Functional (Performance / Security / Accessibility / Compatibility)
   - Integration
   - UI/UX
   - Data Validation
   - Authorization & Authentication

4. **Assign risk level** (High / Medium / Low) based on:
   - Business impact if it fails
   - Complexity of the implementation
   - Dependency on external systems
   - Historical defect density (if known)

5. **Assess testability** (Testable / Partially Testable / Not Testable). For anything not fully testable, document why and what is needed to make it testable.

6. **Assign coverage priority** (P1 Must-Test / P2 Should-Test / P3 Nice-to-Test).

7. **List open questions** carried over from the Knowledge document plus any new ones surfaced during analysis.

8. **Save the file** following the File Output Requirement.

## Output

Produce a Markdown file with the following sections:

```
# Requirement Analysis: <Feature/Module Name>
## Meta
- QA Knowledge source file
- Date
- Version

## Requirement Summary
- Total requirements extracted
- Breakdown by category
- Breakdown by risk level

## Requirements Table
| ID | Requirement Statement | Category | Risk | Testability | Priority | Notes |

## High-Risk Requirements
- Detailed narrative for each High-risk item

## Non-Testable Items
- Item, reason, what is needed to unblock

## Open Questions
- Carried over from QA Knowledge
- New questions raised during analysis

## Coverage Recommendation
- Which areas need deep coverage
- Which areas can use lighter smoke coverage
- Suggested test types per area (unit, integration, E2E, performance, security)
```

## File Output Requirement
- **Output folder:** `qa-analysis/`
- **File name:** `<feature-name>_requirement_analysis_v1.md`
- If `_v1` already exists, save as `_v2`, `_v3`, etc.
- Never overwrite an existing file.

## File Handling Rules
- Check if `qa-analysis/<feature-name>_requirement_analysis_v1.md` exists before writing.
- If it exists, increment the version suffix and notify the user which version was created.
- Do not delete or modify prior versions.

## Expected Outcome
A complete Requirement Analysis document saved in `qa-analysis/` that:
- Lists every discrete requirement with category, risk, testability, and priority.
- Highlights high-risk areas requiring deep coverage.
- Surfaces all gaps before test case writing begins.
- Is directly consumable by `test-case-generation` as its primary input.
