# CLAUDE.md — AI-Driven QA System (Root)

This file governs Claude Code behaviour across the entire repository.
For automation-framework-specific rules, see [`playwright poc/CLAUDE.md`](playwright%20poc/CLAUDE.md).

---

## Repository Layout

```
vm-playwright-boilerplate-automation/      ← you are here (root)
├── docs/                                  ← system-level documentation
│   └── AI_DRIVEN_QA_SYSTEM.md
└── playwright poc/                        ← full automation framework + QA artifacts
    ├── .claude/skills/                    ← AI pipeline skill definitions
    ├── qa-knowledge/                      ← Stage 1 output
    ├── qa-analysis/                       ← Stage 2 output
    ├── Test cases/                        ← Stage 3 output
    ├── qa-review/                         ← Stage 4 output
    ├── qa-automation/                     ← Stage 5 output
    ├── flows/  pages/  tests/  core/      ← Playwright framework
    └── CLAUDE.md                          ← automation-layer rules
```

**All QA artifact folders are inside `playwright poc/`.** Do not create artifact folders at the repo root.

---

## Global Rules

### 1. Inspect Before Acting

Always survey the relevant directory before creating or modifying any file:
- Check whether the target file already exists.
- Check whether the parent folder exists and is the correct location.
- Check the nearest `CLAUDE.md` for folder-specific rules.

Never assume a path is correct from memory alone.

### 2. QA Artifact Storage

Store every pipeline output in its designated folder inside `playwright poc/`:

| Pipeline Stage | Folder | File Pattern |
|----------------|--------|--------------|
| QA Knowledge | `playwright poc/qa-knowledge/` | `<feature>_qa_knowledge_v1.md` |
| Requirement Analysis | `playwright poc/qa-analysis/` | `<feature>_requirement_analysis_v1.md` |
| Test Cases | `playwright poc/Test cases/` | `<feature>_test_cases_v1.md` |
| Test Case Review | `playwright poc/qa-review/` | `<feature>_test_case_review_v1.md` |
| Automation Adapter | `playwright poc/qa-automation/` | `<feature>_automation_adapter_v1.md` |

Use lowercase, hyphen-separated feature slugs (e.g., `user-login`, `checkout-flow`). Keep the slug consistent across all five stages.

### 3. Pipeline Sequence

Treat each stage's output as the mandatory input to the next stage. The pipeline is:

```
Inputs (Design / PRD / Spec / API / App URL)
  → [Stage 1] QA Knowledge        (qa-knowledge-builder skill)
  → [Stage 2] Requirement Analysis (requirement-analysis skill)
  → [Stage 3] Test Cases           (test-case-generation skill)
  → [Stage 4] Test Case Review     (test-case-review skill)   ← QA gate
  → [Stage 5] Automation Adapter   (automation-adapter skill)
```

Do not skip stages or reorder them without explicit user instruction.

### 4. Do Not Skip the QA Knowledge Layer

Never jump directly from raw inputs (PRD, design files, screenshots, URLs) to Requirement Analysis or Test Cases. Always run `qa-knowledge-builder` first.

The QA Knowledge document is the single authoritative source for all downstream stages.

### 5. Use Available Artefacts Before Re-Reading Raw Inputs

If `qa-knowledge/` and `qa-analysis/` artefacts already exist for the current feature, read those files first. Do not regenerate from raw design files unless the user explicitly asks for a rebuild or the artefacts are outdated/missing.

### 6. Never Overwrite Generated Artefacts

Before writing any pipeline output file:
1. Check whether the `_v1` file already exists.
2. If it does, write `_v2` instead (then `_v3`, etc.).
3. Never delete or modify a prior version.

This applies to all five output folders.

### 7. Automation: Follow the Framework Guide

For any work touching the automation layer (`playwright poc/flows/`, `pages/`, `tests/`, `core/`), read and follow:
- [`playwright poc/CLAUDE.md`](playwright%20poc/CLAUDE.md) — authoritative framework rules
- [`docs/automation-framework-guide.md`](docs/automation-framework-guide.md) — extended automation guidance (when present)

### 8. Do Not Create Standalone Playwright Scripts

Do not write free-standing `.spec.ts` or `.test.ts` files outside the established framework structure. Every test must go through the data-driven pipeline:

```
Excel row → JSON testcase → Orchestrator → Flow handler → Page Object
```

See `playwright poc/CLAUDE.md` § Architecture for the full pipeline.

### 9. Prefer Framework-Compliant Structure

When adding automation for a new feature, always use the scaffolding tools:

```bash
npm run generate:module -- <name> --route=/path    # full module scaffold
npm run generate:flow -- --module=<name> --flowCode=<code>  # new flow
```

Never hand-write a flow, page object, or orchestrator from scratch. If the scaffolding tools do not cover a case, raise it with the user before improvising.

---

## Skill Definitions

Pipeline skills are defined in `playwright poc/.claude/skills/`. Each skill file specifies its inputs, instructions, output schema, and target folder. Invoke skills by name; do not paraphrase their logic inline.

| Skill File | Stage |
|------------|-------|
| `playwright poc/.claude/skills/qa-knowledge-builder.skill.md` | Stage 1 |
| `playwright poc/.claude/skills/requirement-analysis.skill.md` | Stage 2 |
| `playwright poc/.claude/skills/test-case-generation.skill.md` | Stage 3 |
| `playwright poc/.claude/skills/test-case-review.skill.md` | Stage 4 |
| `playwright poc/.claude/skills/automation-adapter.skill.md` | Stage 5 |

---

## Documentation

| Document | Purpose |
|----------|---------|
| `docs/AI_DRIVEN_QA_SYSTEM.md` | Full pipeline guide, folder map, QA responsibilities, git usage |
| `playwright poc/CLAUDE.md` | Automation framework commands, architecture, naming conventions |
| `docs/automation-framework-guide.md` | Extended automation guidance (create if missing before automating) |
