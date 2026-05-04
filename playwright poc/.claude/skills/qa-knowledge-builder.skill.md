---
name: qa-knowledge-builder
description: Ingests design docs, PRDs, specs, API definitions, or app URLs and produces a structured QA Knowledge document that all downstream pipeline stages consume.
type: skill
---

# QA Knowledge Builder

## Name
`qa-knowledge-builder`

## Description
Transforms raw product inputs — Design documents, PRDs, Specifications, API contracts, or live App URLs — into a structured QA Knowledge artifact. This artifact is the single source of truth for the entire AI-driven QA pipeline and must be produced before any analysis or test generation begins.

## Purpose
Capture every testable aspect of the product in one place: business goals, user flows, entities, constraints, integrations, and non-functional requirements. Downstream skills (requirement-analysis, test-case-generation, etc.) read from this output rather than re-interpreting raw source material.

## When to Use
- At the start of a QA engagement for a new feature, module, or product.
- When a PRD, spec, design, or API definition is provided or updated.
- When a live app URL is shared for exploratory analysis.
- Before running `requirement-analysis`.

## Input
Provide one or more of the following (at least one is required):

| Input Type       | Example                                      |
|------------------|----------------------------------------------|
| Design doc       | Figma link, PDF, or pasted design description|
| PRD / Spec       | Pasted text or attached document             |
| API definition   | OpenAPI/Swagger JSON or YAML, REST endpoints |
| App URL          | `https://staging.example.com`                |
| Feature summary  | Plain English description of the feature     |

## Instructions

1. **Parse all provided inputs.** Extract: feature name, version/release, business objective, target users, functional scope, out-of-scope items, key entities/data models, API endpoints, user flows, edge cases mentioned, non-functional requirements (performance, security, accessibility), dependencies, and environment details.

2. **Identify testable surfaces.** List every UI screen, API endpoint, data flow, state transition, permission boundary, and integration point that requires validation.

3. **Flag ambiguities.** Note anything unclear, contradictory, or missing from the source material. Do not assume; document the gap.

4. **Structure the output** using the schema defined in the Output section below.

5. **Save the file** following the File Output Requirement.

## Output

Produce a Markdown file with the following sections:

```
# QA Knowledge: <Feature/Module Name>
## Meta
- Source inputs used
- Date
- Version

## Business Context
- Business objective
- Target users / personas
- Success criteria

## Functional Scope
- In-scope features (bulleted list)
- Out-of-scope items

## Entities & Data Models
- Key entities with fields and constraints

## User Flows
- Named flows with step-by-step descriptions

## API Surface
- Endpoint list: method, path, auth requirement, key params

## Non-Functional Requirements
- Performance thresholds
- Security / auth requirements
- Accessibility standards
- Browser / device targets

## Integrations & Dependencies
- Third-party services, internal APIs, databases

## Known Ambiguities & Open Questions
- Numbered list of gaps or contradictions found

## Testable Surface Summary
- Bullet summary of what must be tested
```

## File Output Requirement
- **Output folder:** `qa-knowledge/`
- **File name:** `<feature-name>_qa_knowledge_v1.md`
- If `_v1` already exists, save as `_v2`, `_v3`, etc.
- Never overwrite an existing file.

## File Handling Rules
- Check if `qa-knowledge/<feature-name>_qa_knowledge_v1.md` exists before writing.
- If it exists, increment the version suffix and notify the user which version was created.
- Do not delete or modify prior versions.

## Expected Outcome
A complete, structured QA Knowledge document saved in `qa-knowledge/` that:
- Covers all testable surfaces derived from the inputs.
- Lists all known ambiguities for stakeholder resolution.
- Can be consumed directly by `requirement-analysis` without re-reading the original source material.
