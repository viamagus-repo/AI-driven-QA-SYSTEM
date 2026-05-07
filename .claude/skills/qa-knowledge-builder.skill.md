---
name: qa-knowledge-builder
description: Reads design artifacts from a reference path (not copying) and produces a structured QA Knowledge document used by all downstream QA pipeline stages.
type: skill
---

# QA Knowledge Builder

## Name
`qa-knowledge-builder`

## Description
Transforms design repository modules (via reference paths) into a structured QA Knowledge artifact.

This artifact is the single source of truth for:
- requirement-analysis
- test-case-generation
- automation mapping

Downstream skills MUST use this output instead of re-reading design files.

---

## Purpose
Capture every testable aspect of the module in one place:
- Business context
- User flows
- Entities
- Validations
- Constraints
- System limitations
- Missing requirements

---

## Core Principle (MANDATORY)

Reference-based processing — NOT copy-based

- Read from external design repo path
- Do NOT copy design files into QA repo
- Do NOT paste raw design content
- Only generate processed QA knowledge

---

## When to Use
- At the start of QA pipeline for a module
- When design repo is updated
- Before running `requirement-analysis`

---

## Input

Provide:

Module Name: <Module Name>
Design Path: <Relative Path to Design Repo>

Example:
Module Name: Admin / Master Data  
Design Path: ../Design-Framework/portals/admin-panel/master-data

Optional:
Code Path: ../FE-Codebase  
App URL: https://staging.example.com  

---

## Execution Rules

1. Validate that the Design Path exists  
   - If NOT found → STOP and return error  
   - Do NOT guess or hallucinate  

2. If some files are missing  
   - Continue processing  
   - Clearly mention gaps in output  

3. Never assume undefined behavior  
   - Always report as a gap  

---

## Instructions

1. Navigate to the provided Design Path  
2. Read all relevant files, including:
   - flow / flow-*.md
   - screens.md
   - spec.md
   - data-model.md
   - layout.md
   - jtbd.md
   - api.md (if present)
   - context/ folder

3. Build understanding:
   - Module purpose
   - User roles
   - Screens and navigation
   - Core flows
   - Entities and relationships
   - Field-level rules
   - Business rules
   - System constraints

4. Identify testable surfaces:
   - UI screens
   - Input fields and validations
   - CRUD operations
   - State transitions
   - Data integrity rules
   - Edge scenarios

5. Detect ambiguities:
   - Missing validations
   - Undefined behavior
   - Incomplete flows
   - Gaps in design

6. Apply QA thinking:
   - What can break
   - What needs validation
   - What is risky
   - What is unclear

7. Generate structured QA Knowledge output (do NOT copy raw content)

---

## Output Format (MANDATORY)

Generate the output EXACTLY in the following structure:

# QA Knowledge: <Module Name>

## Meta
- Design Path Used
- Date
- Version

## Module Overview
- Purpose
- Scope within product

## User Roles

## Screen Inventory

## Navigation & Flows

## Entities & Data Model

## Field-Level Rules

## Business Rules

## System Constraints

## Edge Cases

## QA Risks

## Missing Requirements / Open Questions

## Testable Surface Summary

---

## File Output Requirement

- Output folder: knowledge/
- File name: <module-name>_qa_knowledge_v1.md
- If file exists → create v2, v3, etc.
- Never overwrite existing file

---

## File Handling Rules

- Check if file exists before writing
- Auto-increment version
- Do NOT delete or modify previous versions
- Notify user of created version

---

## Expected Outcome

A QA Knowledge document that:

- Is module-specific (not generic)
- Captures real constraints and validations
- Highlights missing requirements
- Is directly usable by requirement-analysis
- Eliminates need to re-read design repo later