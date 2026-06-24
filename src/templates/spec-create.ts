export const SPEC_CREATE_SKILL = `---
name: spec-create
description: Create a concise spec, multi-codebase map, and task breakdown for a new development task
---

# spec-create — Create Development Spec

You are starting a new development task. Your job is to create a concise, durable spec and task breakdown that any AI agent (or human) can pick up and implement independently.

The active spec is a curated working set, not a session diary. Keep it compact and high-signal: preserve only what cannot be cheaply re-derived from the code or git, and drop everything else.

Assume the work may span multiple codebases or microservices. The spec must retain cross-repo context explicitly instead of assuming a single repository.

## Conciseness Contract (read before writing a single line)

The reader pays for this spec in working memory. Every line you write costs the next agent context-window budget *before they have done any work*. A bloated spec defeats its own purpose — the agent burns its context just reading the plan. Treat brevity as a hard requirement, not a style preference.

**Do NOT write what the reader can recover cheaply elsewhere:**
- **Don't re-explain existing code.** Point to it — \`path/to/file.ts:42\`, a symbol name, or a \`rg "Foo" src\` command. The agent reads the real code more accurately than your paraphrase. Capture only the *non-obvious* behavior or the *why*, never a line-by-line retelling.
- **Don't narrate process.** No "I explored X, then tried Y, then decided Z." Record the decision and its rationale; drop the journey. Exploration belongs in git or nowhere.
- **Don't restate.** Each fact appears once, in the section that owns it. Requirements ≠ design ≠ tasks. If two sections say the same thing, cut one.
- **Don't pad.** Strip filler ("it is important to note", "as mentioned above", "in order to", "basically"). Prefer fragments, bullets, and tables over prose. One sentence beats three.

**DO keep what code and git cannot give:** requirements, acceptance criteria, design decisions, trade-offs, rejected alternatives + why, cross-repo wiring, and the re-entry map. These are the spec's whole reason to exist — never sacrifice them for brevity. Concise ≠ lossy: cut redundancy, not substance.

## Process

1. **Understand the request**: Ask clarifying questions if the goal is ambiguous. Identify the scope, constraints, and success criteria.

2. **Research the codebase**: Before writing anything, explore the relevant parts of the codebase:
   - Find related files, patterns, and conventions
   - Understand existing architecture and how the new work fits in
   - Identify dependencies, potential conflicts, and reusable code

3. **Create the spec directory**: Create \`agent-specs/active/<task-name>/\` where \`<task-name>\` is a short kebab-case identifier.

4. **Write the plan file** (\`<task-name>-plan.md\`):

\`\`\`markdown
# <Task Name>

Last updated: YYYY-MM-DD HH:MM

## Overview
One paragraph max summarizing what this task accomplishes and why.

## Requirements
- [ ] Requirement 1 — clear, testable statement
- [ ] Requirement 2
- ...

## Acceptance Criteria
- [ ] Criterion 1 — how to verify the requirement is met
- [ ] Criterion 2
- ...

## Current State
Bullet points describing what exists today. Capture relevant code paths, data flows, or behaviors. Keep it concise, focused, and not lossy.

## Proposed Design
How the implementation will work. Prefer short bullets over long prose. Include:
- Architecture / component design
- API contracts (if applicable)
- Data flow changes
- Key algorithms or logic

## Decisions & Trade-offs
| Decision | Choice | Alternatives Considered | Rationale |
|----------|--------|------------------------|-----------|
| ... | ... | ... | ... |

## Dependencies & Risks
| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | ... | ... | ... |
| Risk | ... | ... | ... |

## Codebase Map
### Repositories
| Repo / Codebase | Root / Location | Purpose | Status | Notes |
|-----------------|-----------------|---------|--------|-------|
| \\\`service-a\\\` | \\\`../service-a\\\` | why it matters | in-scope | relevant details |
| \\\`service-b\\\` | \\\`../service-b\\\` | downstream dependency | maybe-needed | relevant details |

### In-Scope Paths
| Repo / Codebase | Path | Purpose | Status | Notes |
|-----------------|------|---------|--------|-------|
| \\\`service-a\\\` | \\\`src/path/to/file\\\` | why it matters | planned | relevant details |
| \\\`service-b\\\` | \\\`docs/api-contract.md\\\` | contract reference | reference | relevant details |

### Useful Links & References
| Repo / Codebase | Link / Command | Type | Why it matters |
|-----------------|----------------|------|----------------|
| \\\`service-a\\\` | \\\`docs/design.md\\\` | doc | background context |
| \\\`service-b\\\` | \\\`rg "FeatureName" src\\\` | search | quick re-entry point |
\`\`\`

5. **Write the tasks file** (\`<task-name>-tasks.md\`):

\`\`\`markdown
# <Task Name> — Tasks

Last updated: YYYY-MM-DD HH:MM

## Phase 1: <Phase Name>
- [ ] **Task 1** [S] — Description
  - Acceptance: how to verify this task is done
  - Depends on: nothing | task X
  - Primary paths: \`path/to/file\`
- [ ] **Task 2** [M] — Description
  - Acceptance: ...
  - Depends on: Task 1
  - Primary paths: \`path/to/file\`, \`path/to/other\`

## Phase 2: <Phase Name>
- [ ] **Task 3** [L] — Description
  - Acceptance: ...
  - Depends on: Phase 1
  - Primary paths: \`path/to/file\`

## Effort Key
- **S** = Small (< 30 min) — single file, well-understood change
- **M** = Medium (30 min – 2 hr) — multi-file, some design needed
- **L** = Large (2 – 4 hr) — significant implementation, testing needed
- **XL** = Extra Large (4+ hr) — consider breaking down further

## Handoff
- **Current focus**: (which task/phase to start with)
- **Next step**: (specific action to take first)
- **Primary repos / paths**: (1-5 repo-qualified paths or repo roots to open first)
- **Open questions**: (anything unresolved that needs input)
\`\`\`

6. **Self-review pass (mandatory)**: Before you finish, re-read the entire spec as a fresh agent who pays context-window budget for every token. Go line by line and ask:
   - *Can the reader recover this from code or git?* → cut it, leave a pointer.
   - *Is this said elsewhere in the spec?* → keep one copy, delete the rest.
   - *Is this process narration or filler?* → delete it.
   - *Would removing this line lose a requirement, decision, constraint, or re-entry detail?* → if no, remove it.

   The spec is done only after this pass has removed everything that does not earn its place. If the spec did not get shorter, you did not review hard enough.

## Guidelines

- **Be specific, not generic**: Every requirement and task should reference actual code, files, or behaviors in this codebase.
- **Treat the plan as the landing page**: Keep every section terse and high signal. If a section starts reading like a diary, compress it — keep the decision, drop the narration.
- **Codebase Map is mandatory**: Keep a cumulative, deduplicated inventory of every in-scope repo/codebase, path, useful link, and re-entry command future sessions may need after context compaction.
- **Model cross-repo work explicitly**: If the feature spans multiple microservices or repos, record all of them. Do not collapse multi-codebase work into a single "main" repo entry.
- **Avoid duplication**: The plan is the single source of truth for *what* and *why*. The tasks file is for *how* and *when*. Never repeat the same fact in both.
- **Size tasks for AI agents**: Each task should be completable in a single focused session. If a task needs more than ~4 files changed, break it down.
- **Include acceptance criteria everywhere**: Both the plan (for requirements) and tasks (for individual work items) need clear verification steps.
- **Think about session continuity**: Write as if the next person reading has zero context. The spec + tasks should be fully self-contained.
- **Prefer rewrite over append**: Keep the latest truth in the active spec. Rewrite stale sections in place; never let the plan grow by appending session notes.
- **Update timestamps**: Always update "Last updated" when creating or modifying files. These files are gitignored, so timestamps are the only way to track freshness.
`;
