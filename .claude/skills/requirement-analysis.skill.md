---
name: requirement-analysis
description: Reads the QA Knowledge document and produces a structured Requirement Analysis with categorized requirements, risk ratings, coverage priorities, and testability assessments.
type: skill
---

# Requirement Analysis

## Name
`requirement-analysis`

## Description
Transforms the QA Knowledge artifact into a structured Requirement Analysis document.

Each requirement is:
- Extracted as a discrete testable statement
- Categorized
- Risk-rated
- Evaluated for testability
- Assigned coverage priority

This output drives:
- test-case-generation
- automation mapping

---

## Purpose

Ensure:
- No requirement is missed
- High-risk areas are clearly identified
- Gaps are caught BEFORE test case generation
- Testability issues are surfaced early

---

## Core Principle (MANDATORY)

- QA Knowledge document is the ONLY source of truth
- Do NOT re-read design repo
- Do NOT assume missing behavior
- Convert knowledge into testable requirements

---

## When to Use

- After `qa-knowledge-builder`
- Before `test-case-generation`
- When requirements change

---

## Input

Provide:

QA Knowledge File: knowledge/<module-name>_qa_knowledge_v*.md

Example:
QA Knowledge File: knowledge/admin-master-data_qa_knowledge_v2.md

Optional:
- Constraints (timeline, priority, etc.)

---

## Execution Rules

1. Validate QA Knowledge file exists  
   - If NOT found → STOP  
   - Do NOT hallucinate  

2. Use ONLY QA Knowledge  
   - Do NOT go back to design repo  

3. If something is unclear  
   - Mark as "Gap / Not Defined"  
   - Do NOT assume  

---

## Instructions

1. Read QA Knowledge file completely

2. Extract requirements from:
   - Navigation & Flows
   - Field-Level Rules
   - Business Rules
   - System Constraints
   - Edge Cases
   - Testable Surface Summary

3. Convert into discrete requirements:
   - Each requirement must be atomic
   - Each must be testable
   - Avoid combining multiple conditions

4. Categorize each requirement:
   - Functional
   - UI/UX
   - Data Validation
   - Business Rule
   - Integration
   - Non-Functional (Performance / Security / Accessibility)

5. Assign Risk Level:
   - High → Business-critical / data impact / system-wide
   - Medium → Important but limited scope
   - Low → Cosmetic / minor impact

6. Assign Testability:
   - Testable
   - Partially Testable
   - Not Testable

7. Assign Coverage Priority:
   - P1 → Must test (critical path)
   - P2 → Should test
   - P3 → Nice to test

8. Apply QA Thinking:
   - What can break?
   - What is high impact?
   - What is frequently error-prone?
   - What depends on data integrity?

9. Identify:
   - High-risk requirements
   - Non-testable items
   - Missing requirements

---

## Output Format (MANDATORY)

Generate EXACTLY in this structure:

# Requirement Analysis: <Module Name>

## Meta
- QA Knowledge Source File
- Date
- Version

## Requirement Summary
- Total Requirements
- Count by Category
- Count by Risk Level

## Requirements Table

| ID | Requirement Statement | Category | Risk | Testability | Priority | Notes |

## High-Risk Requirements
- Explain why each is high risk

## Non-Testable Items
- Requirement
- Reason
- What is needed to make it testable

## Missing Requirements / Gaps
- Carried from QA Knowledge
- Newly identified gaps

## Coverage Recommendation
- Areas needing deep testing
- Areas for smoke testing
- Suggested test types (E2E, Integration, API, etc.)

---

## File Output Requirement

- Output folder: `analysis/`
- File name: `<module-name>_requirement_analysis_v1.md`
- If exists → create v2, v3, etc.
- Never overwrite existing file

---

## File Handling Rules

- Check if file exists before writing
- Auto-increment version
- Do NOT delete or modify previous versions
- Notify user of created version

---

## Expected Outcome

A Requirement Analysis document that:

- Converts QA knowledge into testable requirements
- Identifies high-risk areas clearly
- Highlights testability gaps early
- Drives structured test case generation
- Is directly consumable by next pipeline stage