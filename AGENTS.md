# AGENTS.md

Rules for AI coding agents in this project. pnpm + TypeScript (strict, ESM) + ESLint + Prettier.

## Commands

`pnpm lint` (0 warnings allowed) · `pnpm lint:fix` · `pnpm check-types` · `pnpm format` ·
`pnpm format:check`. Use pnpm, never npm or yarn. Monorepo: `pnpm --filter <name> add <pkg>`.

## Before you finish

`pnpm lint`, `pnpm check-types` and `pnpm format:check` must pass; build too if you touched
build config. Never say "done" before. Never fix a failure by weakening a lint rule or a
tsconfig option.

## Read when it applies

- Adding a file or helper, moving code, refactoring: [docs/rules/structure.md](docs/rules/structure.md)
- Fixing an error or failing build: [docs/rules/debugging.md](docs/rules/debugging.md)

## Code

- ESLint enforces the basics (no `any`, `===`, `??`, no floating promises, exhaustive
  `switch`, no `console.log`). Run `pnpm lint` instead of guessing.
- Small functions with one job, early returns, arrow functions, named exports.
- Imports: with NodeNext, relative imports end in `.js`. No barrel `index.ts` files (circular imports give `undefined` at runtime). Type-only
  imports use `type`. Do not sort imports by hand; `pnpm lint:fix` does it.
- Types: branded ids and units (`UserId`, `Cents`) are Zod 4 schemas with `.brand`; infer the
  type with `z.infer`. Use top-level formats (`z.uuid().brand<"UserId">()`, not deprecated
  `z.string().uuid()`). Units follow the same pattern
  (`z.number().int().nonnegative().brand<"Cents">()`). Parse at the system boundary (API, DB,
  user input) with `.parse` or `.safeParse`. At the database, use a Drizzle `customType`: `toDriver` calls the schema's `.parse`
  (validate on write); `fromDriver` only brands, with a single `as` allowed only there,
  because DB constraints already guarantee the shape, and parse would add per-row cost
  and fail a whole query on a legacy row. Do not use `$type` alone. Keep the SQL type
  (`uuid`, `text`, `bigint`) unchanged so no migration is needed. `customType` has no
  `defaultRandom()`: use `.default(sql`gen_random_uuid()`)`. No manual brand helpers, and
  no `as` casts for brands except that `fromDriver`. `noUncheckedIndexedAccess` is on. No `enum` or `namespace`: use unions and `as const`.
- Never disable a lint rule without a reason:
  `// eslint-disable-next-line <rule> -- <why>`. No file-wide disables.

## Comments

- Default: none. Names and small functions explain the code.
- Write one only for something non-obvious (tricky logic, a hidden reason, a security caveat),
  in one or two lines, explaining why, never restating the name or the code.
- Above functions, exports, types and properties use JSDoc (`/** */`), never `//`.
  `//` is only for `TODO` / `TODO!` / `FIXME` and short notes inside a function body.
- A simple function, type or constant gets none: rename instead. Do not mention plans or
  "Part 7".

## Git

Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`, ...). Hooks run ESLint and
Prettier on staged files; never use `--no-verify`. Commit `pnpm-lock.yaml` with dependency
changes.

## Project-specific rules

Rules that only apply to this project (data access, auth, folder layout, internal packages).
