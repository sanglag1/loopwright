export const SPEC_UPDATE_SKILL = `---
name: spec-update
description: Update an existing spec and tasks before context compaction or session end
---

# spec-update — Update Development Spec

You are updating an existing development spec to preserve context before a session ends or context compaction occurs. Your goal is to capture everything a fresh session needs to continue the work seamlessly without turning the active spec into a novel.

The plan and tasks files are the entire spec — there is no separate archive. Rewrite them in place to reflect the latest truth; never let them grow by appending session notes.

**Conciseness is a hard requirement.** The reader pays for every line in working memory before doing any work. As you update, cut as much as you add:
- **Don't re-explain code** the reader can open — point to \`path/file.ts:42\` or a \`rg\` command, keep only the non-obvious *why*.
- **Don't narrate process** ("I tried X then Y") — record the decision, drop the journey.
- **Don't restate** — each fact lives in exactly one section; merge or delete duplicates.
- **Concise ≠ lossy** — cut redundancy, never requirements, decisions, or re-entry detail.

Preserve cross-repo context deliberately. If the work spans multiple microservices or repos, the active spec must say so clearly and keep those references current.

## Process

1. **Find the active spec**: Look in \`agent-specs/active/\` for the task directory. If multiple exist, ask which one to update.

2. **Review current state**: Read both the plan and tasks files. Compare against:
   - Git diff (staged and unstaged changes)
   - Git log (recent commits in this session)
   - Any open files or recent conversations

3. **Update the plan file** (\`<task-name>-plan.md\`):

   Update the "Last updated" timestamp.

   **Refresh sections in place** — Keep the plan current, concise, and deduplicated:
   - Rewrite summaries so they reflect the latest truth instead of appending session prose
   - Merge repeated bullets and remove stale details that no longer matter
   - If a previous decision was reversed, keep only the current decision in the main plan; note the reversal and its reason in the Decisions & Trade-offs table

   **Decisions & Trade-offs** — Add or update the current decision set:
   | Decision | Choice | Alternatives Considered | Rationale |
   |----------|--------|------------------------|-----------|
   | ... | ... | ... | ... |

   **Codebase Map** — Treat this as the canonical inventory for context-compacted sessions across one or more codebases:
   - Add newly touched or discovered repos, service roots, files, directories, docs, issue links, dashboards, and helpful commands
   - Keep entries deduplicated
   - Ensure each path, link, or command is tied to the correct repo/codebase
   - Remove something only if you are sure it is no longer in scope; if you do, note why in the Decisions & Trade-offs table

   **Capture what git doesn't** — Fold these into the right plan sections instead of a separate log:
   - Rejected approaches and *why* they failed → Decisions & Trade-offs
   - Blockers, gotchas, surprises → Dependencies & Risks (and the tasks Handoff)
   - Newly discovered repos, paths, links, commands → Codebase Map

4. **Update the tasks file** (\`<task-name>-tasks.md\`):

   Update the "Last updated" timestamp.

   - Mark completed tasks: \`- [ ]\` → \`- [x]\`
   - Mark blocked tasks and note the blocker
   - Add newly discovered tasks in the appropriate phase
   - Update effort estimates if original was wrong
   - Keep task wording short; design details stay in the plan, not duplicated here

   **Update the Handoff section**:
   \`\`\`markdown
   ## Handoff
   - **Current focus**: what task/phase is in progress
   - **Next step**: the specific next action to take
   - **Primary repos / paths**: 1-5 repo-qualified paths or repo roots to open first (must also exist in the plan's Codebase Map)
   - **Uncommitted work**: description of any uncommitted changes and their state
   - **Open questions**: anything that needs human input or further research
   - **Gotchas**: things the next session should watch out for
   \`\`\`

5. **Self-review pass (mandatory)**: Re-read the updated plan and tasks as a fresh agent paying context budget per token. Cut anything recoverable from code/git, anything restated, and any filler. If the spec did not get tighter where it could, you did not review hard enough.

## Guidelines

- **Focus on what git doesn't record**: Git captures *what* changed. You capture *why*, *what was tried and failed*, and *what to do next*.
- **Active spec stays concise**: The plan and tasks are the whole spec, not a running log. Rewrite them in place to reflect the latest truth.
- **Codebase Map is sacred**: Keep it cumulative and current so future sessions can recover key repos, paths, and links after context compaction.
- **Multiple codebases matter**: When the work spans more than one repo or microservice, keep all affected codebases visible in the active spec. Never assume the current shell repo is the whole story.
- **Be honest about state**: If something is broken, half-done, or unclear, say so explicitly in the handoff.
- **Keep it concise**: The reader pays for every line in working memory. Record only what code and git cannot preserve; cut anything re-derivable, restated, or filler.
- **Update, don't accumulate**: Modify the plan and tasks in place. Never paste session chronology into the spec.
- **Update timestamps**: Always update "Last updated" in both files. These files are gitignored, so timestamps are the only way to track freshness.
`;
