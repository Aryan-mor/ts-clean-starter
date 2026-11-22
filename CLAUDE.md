@AGENTS.md

## This repo

A config-only kit (ESLint, Prettier, tsconfig, editor settings, git hooks, `claude/` agent
kit). Not an app. File table: [README.md](./README.md).

- Set it up in another project: follow [docs/setup-project.md](./docs/setup-project.md).
- Keep it generic: no project names or company rules. Change a rule in `eslint.base.js` and
  its text in `AGENTS.md` / `docs/rules/` in the same commit.
- Missing third-party skills: `npx skills@latest experimental_install -a claude-code`
  (ask first; see [docs/external-skills.md](./docs/external-skills.md)).
