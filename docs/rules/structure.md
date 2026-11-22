# Structure, reuse and refactoring

Read this before you add a file or helper, move code, or refactor.

## Code structure

- **One file, one job.** Validation schemas, data access, constants, types and handlers of
  a feature live in separate files. Entry files (routes, pages, controllers) only wire
  things together; logic lives next to them.
- **Group by feature, not by kind.** `users/route.ts`, `users/schema.ts`, `users/query.ts`,
  not global `schemas/` and `queries/` folders.
- **No inline values with meaning.** A list, map, enum-like set or magic number gets a named
  `const` (with `as const`): `z.enum(SORT_DIRS)`, not `z.enum(["asc", "desc"])`.
- **One source of truth.** Derive types from values (`keyof typeof X`, `(typeof X)[number]`,
  `z.infer<typeof schema>`). Never write the same union by hand twice.
- **Where things go (smallest scope that works):**
  - Used in one file: keep it there, not exported.
  - Used by several files of one feature: a file in the feature folder.
  - Used across features of one app: `src/lib/`.
  - Used by more than one app or package (monorepo): a shared package.
- **Move it up when a second user appears**, not before. No shared helpers "just in case".

## Reuse and simplicity

- **Search before you write.** Before adding a helper, comparator, mapper or constant, grep
  for it (feature folder, `src/lib/`, shared packages). Reuse or extend; do not write a
  second version.
- **Extract on the second use.** The same expression or lambda twice becomes one named
  function in the right place. Do not copy-paste it a third time.
- **Place by known use.** If a generic helper's second user is already planned or in the same
  change, put it in the shared place now. A vague "maybe someday" is not enough.
- **File name = job.** `query.ts` data access only, `schema.ts` validation, `serialize.ts`
  response shaping. A function that does not fit the file's job moves.
- **Keep entry files thin.** An inline `.map(...).sort(...)` chain or a shaping `switch` in a
  handler becomes a named function next to it.
- **Flat over nested.** Small named helpers over long chained lambdas; about two levels of
  nesting at most.
- **Store what callers need.** Build lookup maps with full objects, not just ids. Never
  filter or branch on a case that cannot happen.
- **No behavior change in a refactor.** Keep the output identical and say so. Report a real
  issue you spot (for example unstable sort order); do not fix it silently.
- **Finish the job.** Remove now-unused imports and exports, then run the checks in
  `AGENTS.md`.
