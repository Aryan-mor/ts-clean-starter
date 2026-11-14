# ts-clean-starter

A clean, strict TypeScript monorepo starter. Turborepo + pnpm, ESLint and Prettier set up the
way they should be, editor settings that fix your code on save, git hooks, CI, and rules for AI
coding agents.

## What's inside

```
apps/
  web/                 Next.js (App Router) + React 19
  api/                 Hono on Node.js, bundled with esbuild
packages/
  shared/              Shared types (branded IDs) and helpers
  ui/                  Shared React components
  eslint-config/       ESLint flat configs: base, react-internal, next-js
  typescript-config/   tsconfig: base, node-library, react-library, nextjs
```

- **TypeScript 7**, strict, plus `noUncheckedIndexedAccess`, `noImplicitOverride`,
  `verbatimModuleSyntax`, `erasableSyntaxOnly`, NodeNext modules.
- **ESLint 10** with type-aware `typescript-eslint` (strict + stylistic), auto-removal of unused
  imports, sorted imports (perfectionist), no circular imports (import-x), Turbo env checks.
  Every rule has a short comment that says why.
- **Prettier** for formatting (width 100). Prettier formats, ESLint sorts imports. The editor's
  "Organize Imports" is turned off so they never fight.
- **VS Code / Cursor settings:** format + ESLint fix on save, LF line endings, 2 spaces,
  ruler at 100, repo TypeScript version, hidden build folders. Recommended extensions included.
- **husky + lint-staged:** ESLint `--fix` and Prettier on staged files before every commit.
- **commitlint:** Conventional Commits (`feat: ...`, `fix(api): ...`).
- **GitHub Actions CI:** install, format check, lint, type check, build.
- **AGENTS.md** for AI coding agents (`CLAUDE.md` and `.cursor/rules` point to it).

## Requirements

- Node.js 24+ (see `.nvmrc`)
- pnpm (`corepack enable`, or install pnpm; the version is pinned in `package.json`)

## Start a new project from this template

**Option 1:** on GitHub, click **Use this template** > **Create a new repository**, then clone it.

**Option 2:** copy it without git history:

```bash
npx degit Aryan-mor/ts-clean-starter my-app
cd my-app
git init
```

Then:

```bash
pnpm install   # also installs the git hooks
pnpm dev       # web on http://localhost:3000, api on http://localhost:3001
```

Open the folder in VS Code or Cursor and install the recommended extensions when asked.

## Commands

| Command             | What it does                                                         |
| ------------------- | -------------------------------------------------------------------- |
| `pnpm dev`          | Start all apps in watch mode                                         |
| `pnpm build`        | Build all apps                                                       |
| `pnpm lint`         | ESLint in every workspace, fails on warnings                         |
| `pnpm lint:fix`     | ESLint with auto-fix                                                 |
| `pnpm check-types`  | Type check every workspace                                           |
| `pnpm format`       | Format everything with Prettier                                      |
| `pnpm format:check` | Check formatting (used in CI)                                        |
| `pnpm clean`        | Remove build output (`pnpm clean --all` also removes `node_modules`) |

Run a script in one workspace: `pnpm --filter @apps/api dev`.

## Make it yours

1. Change `"name"` in the root `package.json`.
2. Rename the package scopes if you want (`@packages/*`, `@apps/*`). Search and replace
   the old name in every `package.json`, the `import` lines, `apps/web/next.config.js`
   (`transpilePackages`) and `internalPattern` in `packages/eslint-config/base.js`.
   Then run `pnpm install`.
3. Delete what you don't need. For example, remove `apps/api` if you only need a web app.
4. Update this README and `AGENTS.md` for your project.

## Adding a package

1. Create `packages/<name>/` with `package.json` (`"name": "@packages/<name>"`, `"type": "module"`,
   `exports` pointing at `src` files), `tsconfig.json` extending a shared config, and
   `eslint.config.js` using a shared ESLint config. Copy `packages/shared` as a start.
2. Add it where you need it: `"@packages/<name>": "workspace:*"`, then `pnpm install`.
3. If a Next.js app uses it, add it to `transpilePackages` in `next.config.js`.

## Why TypeScript 6 in `eslint-config`?

`typescript-eslint` does not support TypeScript 7 yet, so `packages/eslint-config` installs
TypeScript 6 under the name `typescript` (`npm:@typescript/typescript6`). Everything else
uses TypeScript 7. Remove the alias once `typescript-eslint` supports 7.

## License

MIT
