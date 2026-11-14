# AGENTS.md

Rules for AI coding agents (Cursor, Claude Code, Codex, ...) working in this repo.
Read this file fully before you change code.

## Stack

- **Monorepo:** Turborepo + pnpm workspaces
- **Language:** TypeScript 7 (strict), ES modules only (`"type": "module"`)
- **Web:** Next.js (App Router) + React 19 in `apps/web`
- **API:** Hono on Node.js in `apps/api` (bundled with esbuild)
- **Lint:** ESLint 10 flat config + typescript-eslint (type-aware) in `packages/eslint-config`
- **Format:** Prettier (print width 100)
- **Git:** husky + lint-staged + commitlint (Conventional Commits)

## Layout

```
apps/
  web/                 Next.js app
  api/                 Hono API (src/app.ts = routes, src/index.ts = server)
packages/
  shared/              Shared types and helpers (branded IDs, ...)
  ui/                  Shared React components
  eslint-config/       Shared ESLint configs (base, react-internal, next-js)
  typescript-config/   Shared tsconfig files (base, node-library, react-library, nextjs)
```

Internal packages are named `@packages/*` and apps `@apps/*`.
`packages/shared` and `packages/ui` ship TypeScript source (no build step).
Next.js compiles them (`transpilePackages`) and the API bundles them with esbuild.

## Commands

Run from the repo root:

| Command             | What it does                      |
| ------------------- | --------------------------------- |
| `pnpm install`      | Install everything                |
| `pnpm dev`          | Start all apps in watch mode      |
| `pnpm build`        | Build all apps                    |
| `pnpm lint`         | ESLint, fails on any warning      |
| `pnpm lint:fix`     | ESLint with auto-fix              |
| `pnpm check-types`  | `tsc --noEmit` in every workspace |
| `pnpm format`       | Prettier write                    |
| `pnpm format:check` | Prettier check (CI)               |
| `pnpm clean`        | Remove build output               |
| `pnpm clean:all`    | Also remove all `node_modules`    |

One workspace only: `pnpm --filter @apps/api <script>`.
Add a dependency: `pnpm --filter @apps/web add <pkg>` (never `npm` or `yarn`).

## Before you finish a task

1. `pnpm lint` passes with **0 warnings**.
2. `pnpm check-types` passes.
3. `pnpm format:check` passes (run `pnpm format` if not).
4. If you touched build config, `pnpm build` passes.

Do not say a task is done until these pass. Do not "fix" a failure by weakening a rule or a
tsconfig option.

## Code style

- **No `any`.** Use `unknown` and narrow it, or write a real type.
- **No non-null `!`** unless you can explain it in a comment. Handle `undefined` instead.
- **Small functions** with one job. Prefer early returns over nested `if`/`else`.
- **Arrow functions** for components and helpers. Named exports in packages.
- `const` by default. No `var`. Do not reassign parameters.
- `===` always (`== null` is the only exception).
- `??` for defaults, not `||` (so `0` and `""` stay valid).
- Always `await`, `return`, or `void` a promise. No floating promises.
- A `switch` over a union must handle every case.
- `console.log` is for debugging only. Use `console.info`, `console.warn`, `console.error`.
- Comments explain **why**, not what. Short and plain English.

## Imports

- **NodeNext: relative imports need the `.js` extension**, even in `.ts` files:
  `import { app } from "./app.js";` TypeScript maps `.js` to the `.ts` file.
- **Import the file directly. Do not create barrel files** (`index.ts` that re-exports
  everything). Barrels make circular imports easy, and a circular import gives `undefined`
  at runtime that TypeScript cannot see. `import-x/no-cycle` will fail the lint.
- Packages expose files directly: `import { toUserId } from "@packages/shared/ids";`
- Type-only imports use `type`: `import { formatUser, type User } from "@packages/shared/user";`
- Import order is enforced by ESLint (perfectionist) and fixed by `pnpm lint:fix`.
  Do not sort imports by hand and do not use the editor's "Organize Imports".

## Types

- **Branded types for IDs**, so a `UserId` can't be passed where an `OrgId` is expected:
  ```ts
  export type UserId = string & { readonly __UserId__: true };
  ```
  Create them only after validation, with helpers like `toUserId()`.
- `noUncheckedIndexedAccess` is on: `array[0]` is `T | undefined`. Handle it.
- `verbatimModuleSyntax` and `erasableSyntaxOnly` are on: no `enum`, no `namespace`, no
  constructor parameter properties. Use union types and `as const` objects.

## Lint rules (and why)

All rules live in `packages/eslint-config/base.js` with a comment for each.

- `strictTypeChecked` + `stylisticTypeChecked`: catches unsafe `any`, forgotten promises,
  useless conditions.
- `unused-imports/*`: unused imports are removed on save. Unused variables are errors;
  prefix with `_` if one must stay.
- `import-x/no-cycle`, `no-self-import`, `no-duplicates`, `first`: clean import graph.
- `perfectionist/*`: one import order everywhere, auto-fixable.
- `turbo/no-undeclared-env-vars`: every env var must be listed in `turbo.json`
  (`globalEnv` or a task's `env`), or the Turbo cache can return wrong builds.
- `only-warn`: rules show as warnings in the editor, but `--max-warnings 0` still fails.

**Never disable a lint rule without a comment that says why:**

```ts
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- lib has no types
```

Do not add file-wide `eslint-disable` and never edit the shared config to make your code pass.

## Git

- Conventional Commits, checked by commitlint:
  `feat(api): add users route`, `fix(web): handle empty list`, `chore: bump deps`.
  Types: `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `style`, `build`, `ci`, `chore`.
- The pre-commit hook runs ESLint `--fix` and Prettier on staged files.
  Never skip hooks with `--no-verify`.
- Commit `pnpm-lock.yaml` with dependency changes.
