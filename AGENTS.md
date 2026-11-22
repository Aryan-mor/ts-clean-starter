# AGENTS.md

Rules for AI coding agents (Cursor, Claude Code, Codex, ...) working in a project
that uses these configs. Read this file fully before you change code.

## Tooling

- **Language:** TypeScript (strict), ES modules only (`"type": "module"`)
- **Lint:** ESLint 10 flat config + typescript-eslint (type-aware). Rules live in
  `eslint.base.js`; `eslint.config.js` re-exports it. Next.js and React variants:
  `eslint.config.next.js` and `eslint.config.react.js`.
- **Format:** Prettier (print width 100)
- **Git:** husky + lint-staged + commitlint (Conventional Commits)
- **Package manager:** pnpm (version pinned in `package.json`)

## Commands

Run from the project root:

| Command             | What it does                 |
| ------------------- | ---------------------------- |
| `pnpm install`      | Install devDependencies      |
| `pnpm lint`         | ESLint, fails on any warning |
| `pnpm lint:fix`     | ESLint with auto-fix         |
| `pnpm check-types`  | `tsc --noEmit`               |
| `pnpm format`       | Prettier write               |
| `pnpm format:check` | Prettier check (CI)          |

Use pnpm, never npm or yarn. Add a dependency with `pnpm add <pkg>` or
`pnpm add -D <pkg>`. In a monorepo, scope it: `pnpm --filter <name> add <pkg>`.

## Before you finish a task

1. `pnpm lint` passes with **0 warnings**.
2. `pnpm check-types` passes.
3. `pnpm format:check` passes (run `pnpm format` if not).
4. If you touched build config, the project build passes.

Do not say a task is done until these pass. Do not "fix" a failure by weakening a
rule or a tsconfig option.

## Code style

- **No `any`.** Use `unknown` and narrow it, or write a real type.
- **No non-null `!`** unless you can explain it in a comment. Handle `undefined` instead.
- **Small functions** with one job. Prefer early returns over nested `if`/`else`.
- **Arrow functions** for components and helpers. Prefer named exports.
- `const` by default. No `var`. Do not reassign parameters.
- `===` always (`== null` is the only exception).
- `??` for defaults, not `||` (so `0` and `""` stay valid).
- Always `await`, `return`, or `void` a promise. No floating promises.
- A `switch` over a union must handle every case.
- `console.log` is for debugging only. Use `console.info`, `console.warn`, `console.error`.

## Code structure

- **One file, one job.** Validation schemas, data access, constants, types and
  handlers of a feature live in separate files. Entry files (routes, pages,
  controllers) only wire things together; logic lives next to them.
- **Group by feature, not by kind.** Keep a feature's files in one folder
  (`users/route.ts`, `users/schema.ts`, `users/query.ts`), not spread over global
  `schemas/`, `queries/` folders.
- **No inline values with meaning.** A list, map, enum-like set or magic number
  gets a named `const` (with `as const`), so it can be reused and imported:
  `z.enum(SORT_DIRS)`, not `z.enum(["asc", "desc"])`.
- **One source of truth.** Derive types from values (`keyof typeof X`,
  `(typeof X)[number]`, `z.infer<typeof schema>`). Never write the same union by
  hand twice.
- **Where things go (smallest scope that works):**
  - Used in one file: keep it in that file, not exported.
  - Used by several files of one feature: a file in the feature folder.
  - Used across features of one app: `src/lib/`.
  - Used by more than one app or package (monorepo): a shared package.
- **Move it up when a second user appears**, not before. Do not create shared
  helpers "just in case".

## Reuse and simplicity

- **Search before you write.** Before adding a helper, comparator, mapper or constant,
  grep for it (feature folder, `src/lib/`, shared packages). Reuse or extend what exists;
  do not write a second version.
- **Extract on the second use.** The same expression or lambda twice (a sort comparator,
  a `.map` shape, a `where` condition) becomes one named function in the right place
  (see "Where things go"). Do not copy-paste it a third time.
- **Place by known use, not only current use.** If a helper is generic and a second user
  is already planned or in the same change, put it in the shared place now. A vague
  "maybe someday" is not enough; keep it local until the second use is real.
- **File name = job.** `query.ts` holds data-access builders only, `schema.ts` request
  validation, `serialize.ts` response shaping. If a function does not fit the file's job,
  move it.
- **Keep entry files thin.** If a handler has an inline `.map(...).sort(...)` chain or a
  `switch` that shapes data, move it to a named function next to it. The handler reads
  input, calls functions and returns.
- **Flat over nested.** Prefer small named helpers over long chained lambdas. Stop at
  about two levels of nesting; extract the rest.
- **Store what callers need.** Build lookup maps with the full objects, not just ids, so
  callers do not look each one up again. Never filter or branch on a case that cannot
  happen.
- **No behavior changes in a refactor.** Keep the output identical and say so. If you
  spot a real issue (for example unstable sort order), report it; do not fix it silently.
- **Finish the job.** After moving or deleting code, remove now-unused imports and
  exports, then run the "Before you finish" checks.

## When something breaks

- **Do not patch the symptom.** A workaround that only makes the error go away (a loader,
  an alias, a `paths` entry, a cast, a `@ts-ignore`, a retry, a try/catch that swallows)
  is not a fix.
- **Find the root cause first.** Reproduce it, then check whether it also breaks
  somewhere else (another app, the production build, the start script). One bug often
  shows up in two places; fix the place it comes from.
- **Choose the production-ready practice.** Pick the approach the tool's own docs
  recommend for production, even when it is bigger than a quick fix. Read the installed
  docs first (they are often bundled in `node_modules`).
- **Decide, then explain.** Say what the cause is, which options you considered, why the
  chosen one is the production-ready one, and what you verified. If two options are both
  reasonable and the choice changes the project's conventions, ask before changing them.
- **Prove it.** Run lint, type check and build, and run the real production path (for
  example `node dist/index.js`), not only the dev server.
- **Remove the temporary fix.** When the real fix lands, delete every earlier workaround.

## Comments

- Default: no comment. Clear names and small functions should explain the code.
- Write one only when the code is important or not obvious (a tricky query, a non-obvious rule, a security caveat).
- Document a function only when it is hard to read or complicated (tricky logic, non-obvious contract, edge cases, a hidden reason). A simple function, type, constant or component gets no comment; rename instead.
- Never write a comment that restates the name or the code. If deleting it loses no information, delete it.
- Keep a comment to one or two lines. Do not mention plans or other parts ("Part 7", "the next part"); they go stale.
- Above functions, exports, types and object properties, always use JSDoc (`/** ... */`), never `//`, so it shows on hover in the IDE.
- Explain **why** (or the contract: input, output, edge cases), not what the code does. Short, plain English.
- `//` is only for `TODO` / `TODO!` / `FIXME` markers and short notes inside a function body.

## Imports

- **With NodeNext** (`tsconfig.base.json` and `tsconfig.node.json`): relative imports
  need the `.js` extension, even in `.ts` files: `import { app } from "./app.js";`
  TypeScript maps `.js` to the `.ts` file. Bundler configs (`tsconfig.next.json`)
  do not need the extension.
- **Import the file directly. Do not create barrel files** (`index.ts` that re-exports
  everything). Barrels make circular imports easy, and a circular import gives
  `undefined` at runtime that TypeScript cannot see. `import-x/no-cycle` will fail
  the lint.
- Type-only imports use `type`:
  `import { formatUser, type User } from "./user.js";`
- Import order is enforced by ESLint (perfectionist) and fixed by `pnpm lint:fix`.
  Do not sort imports by hand and do not use the editor's "Organize Imports".

## Types

- **Branded types for IDs**, so a `UserId` can't be passed where an `OrgId` is expected:
  ```ts
  export type UserId = string & { readonly __UserId__: true };
  ```
  Create them only after validation, with helpers like `toUserId()`.
- **Branded types for units** too (`Cents`, `Euros`, `Ms`), with conversion helpers
  (`eurosToCents()`). Calling code never converts with `as`; `as` is only allowed
  inside such helpers and at validated boundaries.
- `noUncheckedIndexedAccess` is on: `array[0]` is `T | undefined`. Handle it.
- `verbatimModuleSyntax` and `erasableSyntaxOnly` are on: no `enum`, no `namespace`, no
  constructor parameter properties. Use union types and `as const` objects.

## Lint rules (and why)

All rules live in `eslint.base.js` with a comment for each.

- `strictTypeChecked` + `stylisticTypeChecked`: catches unsafe `any`, forgotten promises,
  useless conditions.
- `unused-imports/*`: unused imports are removed on save. Unused variables are errors;
  prefix with `_` if one must stay.
- `import-x/no-cycle`, `no-self-import`, `no-duplicates`, `first`: clean import graph.
- `perfectionist/*`: one import order everywhere, auto-fixable.
- `only-warn`: rules show as warnings in the editor, but `--max-warnings 0` still fails.

**Never disable a lint rule without a comment that says why:**

```ts
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- lib has no types
```

Do not add file-wide `eslint-disable` and never edit the shared config just to make
your code pass.

## Git

- Conventional Commits, checked by commitlint:
  `feat: add users route`, `fix: handle empty list`, `chore: bump deps`.
  Types: `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `style`, `build`, `ci`, `chore`.
- The pre-commit hook runs ESLint `--fix` and Prettier on staged files.
  Never skip hooks with `--no-verify`.
- Commit `pnpm-lock.yaml` with dependency changes.

## Project-specific rules

Add rules that only apply to this project below (data access, auth, folder layout,
internal packages). Keep this file the single source of truth: `CLAUDE.md` and
`.cursor/rules` only point here.
