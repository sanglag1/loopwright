# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

An npm CLI (`npx coding-agents-toolings init`) that installs spec-driven development skills (`spec-create`, `spec-update`, `spec-complete`, `spec-handoff`, `ide-mcp`) into a target git repo, plus opt-in (`--hook`) repo-local hook wiring for Codex and Claude. It never writes user-global config (`~/.codex`, `~/.claude.json`). Zero runtime dependencies; Node >= 18, ESM, TypeScript (`module: Node16`, so relative imports must use `.js` extensions).

## Commands

```bash
npm run build                          # tsc -p tsconfig.build.json → dist/
npm test                               # pretest builds first, then vitest run
npx vitest run test/init.test.ts       # single file (run `npm run build` first — see below)
npx vitest run -t "is idempotent"      # single test by name
npm run dev -- init --dry-run          # build and run the CLI against the cwd
```

Tests are end-to-end: they create a temp git repo and spawn `node dist/index.js`, so **they exercise the compiled `dist/`, not `src/`**. Always rebuild before running vitest directly, or changes won't be picked up.

Releases: `npm version patch` (produces the bare `0.1.x` commits and a `v*` tag); pushing the tag triggers `.github/workflows/publish.yml`, which builds, tests, publishes to npm via OIDC, and creates a GitHub release.

## Architecture

- `src/index.ts` — hand-rolled argv parsing (no CLI library); dispatches to `commands/init.ts`.
- `src/commands/init.ts` — orchestrates the install steps in order: write skills → `.claude/skills` symlink → optional hooks → `.gitignore` entry for `agent-specs/`. Each step returns whether it changed anything, used for the final "already up to date" message.
- `src/templates/*.ts` — **the product content.** Each skill's `SKILL.md` is a single exported template-literal string (e.g. `SPEC_CREATE_SKILL`). Editing skill behavior means editing these strings. Because they are template literals, backticks and `${` inside must be escaped, and regex backslashes are doubled (see `ide-mcp-hook.ts`).
- `src/templates/ide-mcp-hook.ts` — a full Node hook script (as a string) installed identically to `.codex/hooks/` and `.claude/hooks/`. It handles `UserPromptSubmit` (detects code-oriented prompts, routes to a JetBrains IDE by language) and, for Codex, `PreToolUse`/`PostToolUse` guardrails that block broad shell search until enough JetBrains MCP calls have happened (state persisted under the OS temp dir).
- `src/installer/` — one module per install target. All writes go through `writeIfChanged` (returns `created | updated | unchanged`) so re-runs are idempotent, and all honor `dryRun`.
  - `codex-hooks.ts` merges into an existing `.codex/config.toml` via string manipulation: ensures `[features] codex_hooks = true` and upserts a block delimited by `# BEGIN/END coding-agents-toolings ide-mcp` markers.
  - `claude-settings.ts` parses/merges `.claude/settings.json`, deduplicating hook entries by the hook script path.
  - `link-claude.ts` + `conflict.ts` handle existing `.claude/skills` states (none / correct symlink / wrong symlink / empty dir / dir with content), prompting interactively unless `--force`.

## Conventions

- When changing skill templates, check `test/init.test.ts` — it asserts specific phrases in the generated SKILL.md files (e.g. "Conciseness Contract", "Self-review pass (mandatory)", absence of `history/`). Update the tests together with wording changes.
- Keep `README.md` in sync with skill behavior and CLI flags (also mirrored in `printHelp()` in `src/index.ts` and the summary output in `init.ts`).
