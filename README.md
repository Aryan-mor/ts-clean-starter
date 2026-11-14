# ts-clean-starter

A copy-ready set of TypeScript, ESLint, Prettier, editor, and git-hook settings,
plus this setup guide. This is **not** a full app or monorepo. You copy the files
you need into a new or existing project.

## What's in this repo

| File                              | What it does                                                                                                                                    |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `eslint.base.js`                  | Shared ESLint 10 rules: type-aware typescript-eslint, unused-import removal, perfectionist import sorting, no circular imports.                 |
| `eslint.config.js`                | What ESLint loads. Re-exports `eslint.base.js` by default.                                                                                      |
| `eslint.config.next.js`           | Optional Next.js + React hooks rules, built on `eslint.base.js`.                                                                                |
| `eslint.config.react.js`          | Optional React library rules (hooks), built on `eslint.base.js`.                                                                                |
| `tsconfig.base.json`              | Shared strict compiler options. Extend this; do not edit it per app unless you must.                                                            |
| `tsconfig.json`                   | Default project tsconfig used by this kit (`noEmit`). A good start for a single Node/TS app.                                                    |
| `tsconfig.node.json`              | Node library / server: `outDir` is `dist`, types for Node.                                                                                      |
| `tsconfig.next.json`              | Next.js app (Bundler resolution, `jsx: preserve`).                                                                                              |
| `tsconfig.react.json`             | React library (`jsx: react-jsx`).                                                                                                               |
| `.prettierrc` / `.prettierignore` | Formatting: width 100, semicolons, double quotes, trailing commas, LF.                                                                          |
| `.editorconfig`                   | Same basics (2 spaces, LF, UTF-8) for any editor.                                                                                               |
| `.vscode/settings.json`           | Format + ESLint fix on save, unused import cleanup, ruler at 100, repo TypeScript version. Organize Imports is off so it does not fight ESLint. |
| `.vscode/extensions.json`         | Recommended VS Code / Cursor extensions.                                                                                                        |
| `commitlint.config.js`            | Conventional Commits (`feat: ...`, `fix: ...`).                                                                                                 |
| `.lintstagedrc.json`              | ESLint `--fix` and Prettier on staged files.                                                                                                    |
| `.husky/pre-commit`               | Runs lint-staged.                                                                                                                               |
| `.husky/commit-msg`               | Runs commitlint.                                                                                                                                |
| `.gitignore`                      | node_modules, env files, build output, coverage.                                                                                                |
| `.nvmrc`                          | Node.js version (24+ is required; this file pins 26).                                                                                           |
| `AGENTS.md`                       | Coding rules for AI agents. `CLAUDE.md` and `.cursor/rules` point at it.                                                                        |
| `.github/workflows/ci.yml`        | CI for this kit: install, format, lint, typecheck. No app build.                                                                                |
| `examples/ci.yml`                 | A CI template you can copy into your own project.                                                                                               |

## Requirements

- Node.js 24+ (see `.nvmrc`)
- pnpm (`corepack enable`, or install pnpm; the version is pinned in `package.json`)

## Use this kit in a new project

### 1. Create the project and copy the files

```bash
mkdir my-app && cd my-app
pnpm init
# then copy the config files from this repo into my-app
```

Copy at least:

- `eslint.base.js` and `eslint.config.js`
- `tsconfig.base.json`
- `tsconfig.json` (or one of the specialized tsconfigs, renamed to `tsconfig.json` if you prefer)
- `.prettierrc`, `.prettierignore`
- `.editorconfig`
- `.gitignore`
- `.nvmrc`
- `.vscode/settings.json`, `.vscode/extensions.json`
- `commitlint.config.js`, `.lintstagedrc.json`
- `.husky/pre-commit`, `.husky/commit-msg`
- `AGENTS.md` (and optionally `CLAUDE.md`, `.cursor/rules`)

For a Next.js app, also copy `eslint.config.next.js` and `tsconfig.next.json`.
For a React library, also copy `eslint.config.react.js` and `tsconfig.react.json`.
For a Node server or library, use `tsconfig.node.json`.

Put them in the **project root** (the same folder as `package.json`). In a monorepo, see below.

### 2. Install the devDependencies

From your project root, with `"type": "module"` in `package.json`:

```bash
pnpm add -D \
  @commitlint/cli@^21.2.4 \
  @commitlint/config-conventional@^21.2.4 \
  @eslint/js@10.0.1 \
  @types/node@26.4.1 \
  eslint@10.9.1 \
  eslint-config-prettier@10.1.8 \
  eslint-import-resolver-typescript@^4.4.5 \
  eslint-plugin-import-x@^4.18.1 \
  eslint-plugin-only-warn@1.2.1 \
  eslint-plugin-perfectionist@^5.13.0 \
  eslint-plugin-unicorn@^79.0.0 \
  eslint-plugin-unused-imports@^4.4.1 \
  globals@17.12.0 \
  husky@^9.1.7 \
  lint-staged@^17.6.0 \
  prettier@3.9.6 \
  typescript@npm:@typescript/typescript6@6.0.2 \
  "@typescript/native@npm:typescript@7.0.2" \
  typescript-eslint@^8.72.2
```

If you use the Next.js or React ESLint configs, also install:

```bash
pnpm add -D @next/eslint-plugin-next@16.3.4 eslint-plugin-react-hooks@7.1.1
```

You can also copy `package.json` from this repo and run `pnpm install`, then change
the `"name"` field.

Add these scripts:

```json
{
  "scripts": {
    "lint": "eslint . --max-warnings 0",
    "lint:fix": "eslint . --fix --max-warnings 0",
    "check-types": "tsc --noEmit",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "prepare": "husky"
  }
}
```

`prepare` installs the git hooks when someone runs `pnpm install`.

### 3. Pick a tsconfig and an ESLint config

- **Single Node/TS app:** keep `tsconfig.json` (it already extends `tsconfig.base.json`).
  Point `"include"` at your source, for example `"src/**/*.ts"`. Use `eslint.config.js`
  as-is.
- **Next.js app:** point your `tsconfig.json` at `"extends": "./tsconfig.next.json"`,
  or replace `tsconfig.json` with the contents of `tsconfig.next.json` (and fix the
  `extends` path). For ESLint, change `eslint.config.js` to re-export the Next config:

  ```js
  export { default } from "./eslint.config.next.js";
  ```

- **React library:** same idea with `tsconfig.react.json` and `eslint.config.react.js`.

If you use path aliases such as `@/`, the import sorter already treats `^@/` as
internal. Add your own package prefixes in `internalPattern` inside `eslint.config.js`.

### 4. Editor

Open the project in VS Code or Cursor and install the recommended extensions when
asked:

- `dbaeumer.vscode-eslint` — ESLint, including fix on save
- `esbenp.prettier-vscode` — format on save
- `editorconfig.editorconfig` — matches `.editorconfig`
- `yoavbls.pretty-ts-errors` — readable TypeScript errors
- `typescriptteam.native-preview` — TypeScript 7 native preview (optional)

On save, Prettier formats the file and ESLint removes unused imports and sorts
imports. Do not turn on "Organize Imports"; it fights ESLint.

Auto-save must be `onFocusChange` (set in `.vscode/settings.json`). With
`afterDelay` the editor skips all on-save actions, so imports are not sorted.

In a monorepo, import other packages by name (`@packages/shared`), never by a
relative path into their `src`. ESLint (`eslint-rules/no-relative-package-imports.js`) auto-fixes it to the package name on save, and
the editor setting stops auto-import from suggesting it. If a wrong path still
appears, it usually came from an AI tab completion, not from TypeScript.

## Naming rules

- Variables and functions: `camelCase`. Types and classes: `PascalCase`. Constants: `UPPER_CASE`.
- Object keys must be camelCase. Put a key in quotes when it must be different (`"Content-Type"`).
- File names: `kebab-case` (`pipeline-stage.ts`), checked by `unicorn/filename-case`.
- With Drizzle, set `casing: "snake_case"` and leave out column names: `createdAt` becomes `created_at`.

## Use this kit in a monorepo

1. Copy the same files to the **repo root**.
2. Keep one root `eslint.config.js` and one `tsconfig.base.json`.
3. Each package gets a small `tsconfig.json` that extends the root base (or
   `tsconfig.node.json` / `tsconfig.react.json` / `tsconfig.next.json`) and sets
   its own `include`.
4. Packages can use the root ESLint config as-is, or add a local `eslint.config.js`
   that imports the root file and adds package-only ignores.
5. Adjust `internalPattern` in `eslint.config.js` to your package scopes
   (this kit already includes `^@packages/` and `^@apps/`).
6. If you use Turborepo, add your own `turbo.json` and `pnpm-workspace.yaml`.
   Those are not part of this kit. If you want `eslint-plugin-turbo` (so every
   env var is listed for a correct Turbo cache), install it and add the rule to
   `eslint.config.js`.

## Commands in this repo

| Command             | What it does                 |
| ------------------- | ---------------------------- |
| `pnpm install`      | Install devDependencies      |
| `pnpm lint`         | ESLint, fails on any warning |
| `pnpm lint:fix`     | ESLint with auto-fix         |
| `pnpm check-types`  | `tsc --noEmit`               |
| `pnpm format`       | Prettier write               |
| `pnpm format:check` | Prettier check (CI)          |

## Why TypeScript 6 is installed next to TypeScript 7

TypeScript 7.0 is the native compiler (`tsc`), but it does not ship a JavaScript
API yet. `typescript-eslint` still needs that API, so this kit installs Microsoft's
`@typescript/typescript6` package under the name `typescript`, and TypeScript 7
under the name `@typescript/native`. Then:

- `pnpm exec tsc --version` is TypeScript 7 (used by `pnpm check-types`)
- `require("typescript")` is TypeScript 6 (used by ESLint)
- `pnpm exec tsc6 --version` is TypeScript 6, if you need it

The editor is pointed at `node_modules/@typescript/native`. You can drop the
alias once `typescript-eslint` supports TypeScript 7.1 or later.

## License

MIT
