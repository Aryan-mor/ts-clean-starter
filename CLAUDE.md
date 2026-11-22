# CLAUDE.md

All coding rules for AI agents are in [AGENTS.md](./AGENTS.md). Read it first and follow it.

## What this repo is

A config-only kit: ESLint, Prettier, tsconfig, editor settings, git hooks, `AGENTS.md` and
a Claude Code agent kit (`claude/`). It is not an app. Copy the parts you need into a
project. The file table is in [README.md](./README.md).

## When the user asks you to set the kit up in another project

Follow [docs/setup-project.md](./docs/setup-project.md), step by step.

## When you change this repo

- Keep it generic: no project names, no company rules. Project rules go in the target
  project's own "Project-specific rules" section.
- If you change a rule in `eslint.base.js`, update the matching text in `AGENTS.md` and
  README.md in the same commit.
- Run `pnpm lint`, `pnpm check-types` and `pnpm format:check` before you say it is done.
