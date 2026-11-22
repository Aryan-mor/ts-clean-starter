# Set up this kit in another project

Instructions for Claude (and for you). Follow the steps in order and say which step you
are on. Do not skip the checks.

The ready prompt that points Claude here is in [README.md](../README.md).

1. **Look first.** In the target project read `package.json`, the lockfile, any existing
   `eslint.config.*`, `tsconfig*.json`, `.prettierrc*`, `.husky/`, `AGENTS.md`, `CLAUDE.md`.
   Decide: new project, single app, or monorepo; Node, Next.js, or React library. The
   package manager must be pnpm; if it is not, stop and ask.
2. **Never overwrite silently.** If a target file exists, show the difference and ask
   whether to merge, replace or skip. `AGENTS.md` and `CLAUDE.md` are merged, not replaced:
   keep the project's own rules and add the missing sections.
3. **Copy the config files** listed in README.md under "Copy at least", for the project type:
   - Node app or library: `tsconfig.node.json`
   - Next.js: `eslint.config.next.js`, `tsconfig.next.json`
   - React library: `eslint.config.react.js`, `tsconfig.react.json`
   - Monorepo: also `eslint-rules/`, and read "Use this kit in a monorepo".

   For CI, copy `examples/ci.yml` to `.github/workflows/ci.yml`.

4. **Install** the devDependencies from README.md ("Install the devDependencies") with
   `pnpm add -D`, and add the scripts block. Then run `pnpm install` so husky is set up.
5. **Adapt** `internalPattern` in `eslint.base.js` to the project's package scopes, and set
   the `"name"` field. Do not weaken any rule to make existing code pass. If existing code
   fails, run `pnpm lint:fix` and `pnpm format`, then list what is left.
6. **Agent kit (optional, ask first).** Follow [add-agents.md](./add-agents.md).
7. **Verify** with the real commands: `pnpm lint`, `pnpm check-types`, `pnpm format:check`.
   Report each exit code. If something still fails, say so; do not claim it is done.
8. **Do not commit or push** unless the user asks. Finish with the list of files added,
   merged and skipped.
