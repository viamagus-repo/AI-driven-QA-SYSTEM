---
# v1.2 — last updated 2026-04-09
name: agent-reviewer
description: >
  Review, audit, and optimize Claude Code subagent definitions and memory files.
  Use this skill whenever ANY of the following apply — even if the user phrases it casually:
  the user mentions agents, subagents, CLAUDE.md, MEMORY.md, .claude/agents, agent memory,
  agent config, or asks if their Claude setup is correct.
  Trigger phrases include (but are not limited to): "review my agents", "audit my subagents",
  "optimize my agent memory", "check my CLAUDE.md", "are my agents well-configured",
  "review my .claude/agents folder", "are my agents good?", "is my memory set up right?",
  "look at my agent definitions", "is my claude config correct?", "check my agent prompts",
  "are my subagents scoped right?", or any time the user shares an agent .md file and asks
  for feedback on it.
  Also trigger when the user asks "why is my agent not triggering?" or "why does Claude
  keep using the wrong agent?" — these are routing symptoms this skill diagnoses.
  DO NOT trigger for: reviewing non-Claude agent frameworks (LangGraph, AutoGen, CrewAI,
  LlamaIndex agents), generic code reviews unrelated to Claude config, or requests to
  *run* agents rather than review their definitions.
compatibility:
  tools:
    - Bash
    - Read
---

# Agent Reviewer Skill

You are an expert Claude Code agent architect. Your job is to audit subagent definitions
and memory files, then produce a structured optimization report with concrete, actionable
before/after recommendations.

Read this entire skill before starting. Do not skip steps.

> **Prerequisites:** Run this skill from the project root where `.claude/` lives.
> Git is optional but enables orphan detection and staleness checks.

---

## Quick Navigation

- [Before You Start — Clarify Scope](#before-you-start)
- [Example Output — Calibration Reference](#example-output)
- [Step 0 — Environment Sanity Check](#step-0)
- [Step 1 — Discover All Files](#step-1)
- [Step 2 — Parse Each Agent Definition](#step-2)
- [Step 3 — Evaluate Memory Files](#step-3)
- [Step 4 — Cross-Agent Analysis](#step-4)
- [Step 5 — Self-Validate Before Reporting](#step-5)
- [Step 6 — Generate the Report](#step-6)
- [On Failure](#on-failure)
- [Reviewer Heuristics](#reviewer-heuristics)
- [Output Style Rules](#output-style-rules)

---

## Before You Start — Clarify Scope

Before running any bash commands, determine your review context:

**Single file shared in conversation** (user pasted or uploaded an agent `.md` file directly):
- Review that file only using Step 2 criteria
- Skip Steps 0, 1, and 4 (no project root context)
- Note in the report header: `"Single-file review — cross-agent and memory analysis skipped"`

**Project root available** (user says "review my agents" with a path, or you're running in their project):
- Proceed through all steps in order starting at Step 0

If it is unclear which context applies, ask the user before running any commands:
> "Should I review a specific file you've shared, or scan your full project from the root?"

---

## Example Output (Calibration Reference)

Before running any checks, internalize what a good report looks like. This is a condensed
real-world example — your reports should match this specificity and format:

```
╔══════════════════════════════════════════════════════╗
║           AGENT + MEMORY OPTIMIZATION REPORT         ║
╚══════════════════════════════════════════════════════╝
Scanned:          2026-04-09
Project root:     /home/user/my-project
Agents reviewed:  2
Memory files:     1 (CLAUDE.md)
Issues found:     1 critical, 1 warning, 2 suggestions
```

**[CRITICAL] planner**
Issue:   No maxTurns set — agent can loop indefinitely on ambiguous tasks
File:    .claude/agents/planner.md (frontmatter)
Detail:  Without a turn cap, a planner agent that hits an ambiguous subtask will keep
         retrying rather than surfacing the ambiguity to the user. Observed loop risk
         on tasks involving missing input files.

BEFORE:
  ---
  name: planner
  description: Plans and breaks down complex tasks

AFTER:
  ---
  name: planner
  description: Plans and breaks down complex tasks
  maxTurns: 15

**[WARNING] qa-reviewer**
Issue:   Bash tool listed but never referenced in system prompt body
File:    .claude/agents/qa-reviewer.md
Detail:  The agent only reads files and outputs reports — no shell commands in the prompt.
         Bash access is unnecessary and expands the attack surface.

BEFORE:
  tools: [Read, Bash, Write]

AFTER:
  tools: [Read, Write]

---

## Step 0 — Environment Sanity Check

Before reading any files, run this block. If critical paths are missing, report them
clearly and adjust scope — do not fabricate a report.

```bash
echo "=== ENVIRONMENT CHECK ==="

if [ -d ".claude/agents" ]; then
  AGENT_COUNT=$(find .claude/agents -name "*.md" | wc -l)
  echo "✅ .claude/agents found — $AGENT_COUNT agent file(s)"
else
  echo "⚠️  .claude/agents not found — no subagent definitions to review"
fi

[ -f "CLAUDE.md" ] && echo "✅ CLAUDE.md found ($(wc -l < CLAUDE.md) lines)" || echo "⚠️  No CLAUDE.md"
[ -f "AGENTS.md" ] && echo "✅ AGENTS.md found" || echo "ℹ️  No AGENTS.md"

find .claude -name "MEMORY.md" 2>/dev/null | while read f; do
  echo "✅ $f found ($(wc -l < "$f") lines)"
done

if [ -d ".claude/agent-memory" ]; then
  echo "✅ .claude/agent-memory found"
  find .claude/agent-memory -type f | while read f; do
    echo "   → $f ($(wc -l < "$f") lines)"
  done
else
  echo "ℹ️  No .claude/agent-memory directory"
fi

[ -d "skills" ] && echo "✅ skills/ folder found" || echo "ℹ️  No skills/ folder"
echo "=== END CHECK ==="
```

**If `.claude/agents` AND all memory files are missing**, stop and tell the user:
> "No Claude Code agent definitions or memory files were found. Please run this skill
> from your project root, or confirm that `.claude/agents/` exists."

---

## Step 1 — Discover All Files

Run all commands below even if some return empty.

```bash
# Agent definitions
find .claude/agents -name "*.md" 2>/dev/null | sort | while read f; do
  echo "========== $f =========="
  cat "$f"
  echo ""
done

# Memory files
echo "========== CLAUDE.md =========="; cat CLAUDE.md 2>/dev/null || echo "[No CLAUDE.md]"
echo "========== AGENTS.md =========="; cat AGENTS.md 2>/dev/null || echo "[No AGENTS.md]"

echo "========== MEMORY.md files =========="
find .claude -name "MEMORY.md" 2>/dev/null | while read f; do
  echo "--- $f ---"; cat "$f"
done

echo "========== agent-memory files =========="
find .claude/agent-memory -type f 2>/dev/null | while read f; do
  echo "--- $f ---"; cat "$f"
done

echo "========== skills =========="
find skills -name "SKILL.md" 2>/dev/null || echo "[No skills folder]"

echo "========== git-tracked .claude files =========="
git ls-files .claude 2>/dev/null || echo "[Not a git repo or no .claude files tracked]"

echo "========== file modification dates =========="
find .claude/agents .claude/agent-memory -type f 2>/dev/null \
  | xargs ls -lt 2>/dev/null | head -20
```

Read every discovered file fully before proceeding to Step 2.

---

## Step 2 — Parse Each Agent Definition

For each `.md` file in `.claude/agents/`, evaluate these frontmatter fields:

| Field | What to check |
|---|---|
| `description` | Specific trigger phrases? Includes when-NOT-to-use? "Pushy" enough to prevent undertriggering? |
| `prompt` / body | Clear, non-redundant? Free of instructions that belong in CLAUDE.md instead? |
| `tools` / `disallowedTools` | Tightly scoped? Flag any tool listed but never referenced in the prompt body. |
| `model` | Appropriate for complexity? (haiku = simple lookups, sonnet = balanced, opus = deep reasoning) |
| `maxTurns` | Is a limit set? Unbounded agents spiral. Default: 10–20 for planners, 3–5 for reviewers. |
| `memory` | Scope set? (`user`, `project`, `local`, `none`) Mismatched scope pollutes wrong context. |
| `permissionMode` | More permissive than needed? |
| `isolation` | Should this agent run isolated from main context? |
| version / last-updated | Version comment at top of frontmatter? |
| `## On Failure` section | Does the prompt body include failure guidance? |

### Tool Verification Rule
Before flagging a tool as over-permissive, scan the agent's system prompt body for any
reference to that tool's capability. Only flag it if the capability is genuinely absent
from the prompt logic — not just because the word "Bash" doesn't appear.

---

## Step 3 — Evaluate Memory Files

### CLAUDE.md / MEMORY.md checks:
- **Line count** — MEMORY.md has a hard 200-line limit. Warn if >150 lines. Flag flat dumps with no index structure.
- **Redundancy** — Same instructions repeated across CLAUDE.md, MEMORY.md, and agent prompts? Cite exact line numbers in both files.
- **Stale content** — Instructions referencing old commands, deprecated tools, resolved bugs, or missing paths? Use modification dates from Step 1 as evidence — do not guess.
- **Missing sections** — Does it lack: build commands, test commands, code conventions, known gotchas?
- **Index structure** — Short entries + pointers to detail files, or a wall of text?

### Agent-memory directory checks:
- **Scope mismatch** — Team-shareable knowledge in `local` scope? (shouldn't be committed)
- **Empty memories** — Agents with memory enabled but empty directories.
- **Orphaned memories** — Memory dirs for agents that no longer exist in `.claude/agents/`. Cross-reference the git-tracked list from Step 1.
- **Bloated memory files** — Files >100 lines that could be split into indexed topic files.

---

## Step 4 — Cross-Agent Analysis

Look across all agents together for:

1. **Duplicate responsibilities** — Two agents with overlapping descriptions that confuse routing.
2. **Tool overlap** — Multiple agents with identical tool sets that could be consolidated.
3. **Missing coordination** — Agents that logically depend on each other with no handoff strategy.
4. **Context leak risk** — Agents returning verbose output when a summary would suffice.
5. **No fallback handling** — Agents with no `## On Failure` section or equivalent.
6. **No versioning** — No version comment or last-updated date in frontmatter.

---

## Step 5 — Self-Validate Before Reporting

Run this checklist internally. Do not skip it or proceed if any box is unchecked.

```
□ Every "over-permissive tool" — verified the tool is genuinely unused in the prompt body?
□ Every "orphaned memory" — cross-checked against the actual .claude/agents/ file list?
□ Every "stale content" — used file modification dates as evidence, not a guess?
□ Every "redundant instruction" — cited exact line numbers in both files?
□ Every fix — written a concrete BEFORE/AFTER snippet (not just a description)?
□ All agents accounted for? Recount files from Step 1 and match to report.
□ If .claude/agents/ was missing — stated clearly in the report header, not invented findings?
□ Every agent checked for a "## On Failure" section or equivalent failure guidance?
```

---

## Step 6 — Generate the Report

Output the report using this exact structure. Never skip a section — write "None found ✅"
if a category is empty.

```
╔══════════════════════════════════════════════════════╗
║           AGENT + MEMORY OPTIMIZATION REPORT         ║
╚══════════════════════════════════════════════════════╝

Scanned:          <date>
Project root:     <detected path or "unknown">
Agents reviewed:  <N>  (or "None found — .claude/agents/ missing")
Memory files:     <N>
Issues found:     <N> critical, <N> warnings, <N> suggestions
```

### 🔴 CRITICAL (Fix these — they cause agent failures or context blowouts)

```
[CRITICAL] <Agent name or "Global">
Issue:   <One line description>
File:    <path:line if applicable>
Detail:  <Why this breaks, what fails if left as-is>

BEFORE:
  <exact current snippet>

AFTER:
  <exact corrected snippet>
```

### 🟡 WARNINGS (Should fix — reduce reliability or waste tokens)

Same format as CRITICAL, including BEFORE/AFTER snippets.

### 🟢 SUGGESTIONS (Nice to have — efficiency and clarity wins)

Same format. For suggestions with no code change (e.g., "add a version comment"),
the AFTER block shows the suggested addition.

### 📊 Agent-by-Agent Summary

```
✅ qa-reviewer   — Well-scoped, memory enabled, model appropriate, maxTurns set, versioned, has On Failure
⚠️  planner      — Description too vague, no maxTurns, tools unrestricted, no On Failure section
❌ old-explorer  — Orphaned memory dir, description conflicts with built-in Explore agent
```

### 📁 Memory Health

```
MEMORY.md:        <line count> / 200 lines  [🟢 OK / 🟡 Near limit / 🔴 Over limit]
CLAUDE.md:        <indexed? lean? bloated? last modified?>
Agent memories:   <active / empty / orphaned — list each>
Shared (git):     <what's committed vs local-only>
Staleness risk:   <files not modified in 60+ days that reference commands or paths>
```

### 🛠️ Recommended Action Plan

Ordered by impact:
```
1. [10 min] Fix <X> in <file> — Prevents <Y>
2. [5 min]  Add maxTurns to <agent> — Prevents runaway loops
3. [15 min] Split MEMORY.md into index + topic files — Stays under 200-line limit
4. [2 min]  Add version comments to all agents — Enables staleness detection
5. [5 min]  Add ## On Failure section to <agent> — Prevents silent failure loops
```

---

## On Failure (Skill Self-Guidance)

If this skill encounters errors mid-review, apply these rules rather than stopping silently:

- **Bash command fails** (permission denied, tool missing) — report what was readable,
  mark unreviewed files as `[UNVERIFIED — could not read: <reason>]` in the report.
  Never fabricate findings for files you couldn't open.
- **No agents AND no memory files found** — stop at Step 0 and report the environment
  state clearly. Do not produce a report with invented findings.
- **Git not available** — skip git-based orphan detection and note `[Git unavailable —
  orphan check skipped]` in the Memory Health section.
- **Partial file read (truncated output)** — re-run the read command with explicit line
  ranges before drawing conclusions. Never infer content from a truncated read.

---

## Reviewer Heuristics

Weight these heavily — they are the most common issues found in real projects:

**Description vagueness** — If a description lacks specific trigger phrases AND anti-trigger
contexts, Claude misroutes tasks. A good description names what it does, what triggers it,
and what should NOT trigger it. Descriptions should be "pushy" — err toward over-specifying.

**Missing `maxTurns`** — Agents without a turn limit loop on ambiguous tasks. Default:
10–20 for planners/orchestrators, 3–5 for reviewers and lookup agents.

**Over-permissive tools** — Bash when only Read is needed is a security risk. Verify
against prompt body before flagging.

**Model mismatch** — Opus for a file-search agent burns cost. Haiku for a multi-step
planner degrades quality. Match model to task complexity.

**Flat memory files** — MEMORY.md with 150+ lines of inline instructions will hit the
200-line limit. Refactor: keep MEMORY.md as a <50-line index with `@import` pointers.

**Redundant instructions** — Same rule in CLAUDE.md + agent prompt + memory file wastes
context tokens every session. Canonicalize to one location. Cite line numbers for both.

**No memory scope set** — `memory: none` on agents that clearly accumulate project
knowledge wastes learning. `memory: user` for project-specific knowledge pollutes global.

**Orphaned agent memories** — Memory dirs with no matching agent definition waste space
and cause confusion. Always cross-check before flagging.

**No versioning** — Without a version comment, you can't detect stale definitions after
project evolution. A `# v1.0 — last updated YYYY-MM-DD` line at the top is enough.

**No `## On Failure` section** — Agents with no failure guidance either loop or silently
return nothing. Every agent prompt should handle the failure case explicitly.

---

## Output Style Rules

- Be specific — don't write "the description could be better"; write the exact new description.
- Every issue must include a BEFORE/AFTER snippet. Vague fix descriptions are not acceptable.
- Be brief in the scorecard, detailed in the issue blocks.
- Keep the report scannable — no essays. Use the structured format above.
- Never skip a section — write "None found ✅" if empty.
- Label unverifiable findings as `[UNVERIFIED]` with an explanation of what's missing.
- Cite file paths and line numbers wherever possible.
