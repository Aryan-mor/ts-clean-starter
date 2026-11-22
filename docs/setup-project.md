# Set up this kit in another project

Instructions for Claude (and for you). Follow the steps in order, say which one you are on,
and do not skip the checks. The ready prompt that points here is in [README.md](../README.md).

1. **Look first.** In the target project read `package.json`, the lockfile, and any existing
   `eslint.config.*`, `tsconfig*.json`, `.prettierrc*`, `.husky/`, `AGENTS.md`, `CLAUDE.md`.
   Decide: new project, single app, or monorepo; Node, Next.js, or React library. The package
   manager must be pnpm; if it is not, stop and ask.
2. **Never overwrite silently.** If a target file exists, show the difference and ask: merge,
   replace or skip. `AGENTS.md` and `CLAUDE.md` are merged, not replaced: keep the project's
   own rules and add what is missing.
3. **Copy the files** listed in README.md under "Copy at least", plus for the project type:
   - Node app or library: `tsconfig.node.json`
   - Next.js: `eslint.config.next.js`, `tsconfig.next.json`
   - React library: `eslint.config.react.js`, `tsconfig.react.json`
   - CI: `examples/ci.yml` to `.github/workflows/ci.yml`
   - Cursor users: also `.cursor/rules/`
   - Monorepo: also read "Use this kit in a monorepo".

   `CLAUDE.md` comes from `examples/CLAUDE.md`, not from the repo root (that one is for
   maintaining this kit).

4. **Scripts, then install.** Add the scripts block from README.md to `package.json` and set
   `"type": "module"` and `"engines": {"node": ">=24"}` first. Then `pnpm add -D` the
   devDependencies from README.md, then run `pnpm prepare`: a plain `pnpm install` does not
   install the git hooks if nothing changed. Check `git config core.hooksPath` prints
   `.husky/_`.
5. **Adapt** `internalPattern` in `eslint.base.js` to the project's package scopes, and set the
   `"name"` field. Do not weaken any rule to make existing code pass. If existing code fails,
   run `pnpm lint:fix` and `pnpm format`, then list what is left (for example `any`).
6. **Agent kit and external skills (optional, ask first).** Follow
   [add-agents.md](./add-agents.md) and [external-skills.md](./external-skills.md).
7. **Verify** with the real commands: `pnpm lint`, `pnpm check-types`, `pnpm format:check`.
   Report each exit code. If something still fails, say so; do not claim it is done.
8. **Do not commit or push** unless the user asks. Finish with the files added, merged and
   skipped.
