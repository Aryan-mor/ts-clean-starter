import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import { importX } from "eslint-plugin-import-x";
import onlyWarn from "eslint-plugin-only-warn";
import perfectionist from "eslint-plugin-perfectionist";
import turboPlugin from "eslint-plugin-turbo";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tseslint from "typescript-eslint";

/**
 * Shared ESLint config for every workspace.
 *
 * Why everything is so strict: the compiler can't catch forgotten promises,
 * unsafe `any`, or circular imports. These rules can.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const config = [
  // ESLint only lints .js by default; this makes it lint TypeScript too.
  { files: ["**/*.{js,mjs,ts,tsx}"] },
  js.configs.recommended,

  // Strict TypeScript rules that use type information (no any, no unsafe
  // values, no forgotten promises, ...). Stylistic = consistent TS style.
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      globals: { ...globals.node },
      parserOptions: {
        // Finds the right tsconfig.json for every file automatically.
        projectService: {
          // Config files in a package root are not in tsconfig "include".
          allowDefaultProject: ["*.js", "*.mjs"],
        },
      },
    },
  },

  // Turns off rules that fight Prettier. Prettier owns formatting.
  eslintConfigPrettier,

  // Every env var must be listed in turbo.json, or the Turbo cache can be wrong.
  {
    plugins: { turbo: turboPlugin },
    rules: {
      "turbo/no-undeclared-env-vars": "error",
    },
  },

  // Clean-code rules for every file.
  {
    rules: {
      // Always === and !== (except "== null", which checks null and undefined).
      eqeqeq: ["error", "always", { null: "ignore" }],
      "no-var": "error",
      "prefer-const": "error",
      "object-shorthand": "error",
      "prefer-template": "error",
      "no-else-return": "error",
      "no-nested-ternary": "error",
      "no-param-reassign": "error",
      curly: ["error", "all"],
      // console.log is for debugging only; info/warn/error are fine for real logs.
      "no-console": ["error", { allow: ["info", "warn", "error"] }],
    },
  },

  // TypeScript-only rules.
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { "unused-imports": unusedImports },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      // Unused imports are removed automatically on save (--fix).
      // Unused vars are errors; prefix with _ when it must stay (e.g. _req).
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
      // import type { X } for types only (removed from the JS output).
      "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],
      "@typescript-eslint/consistent-type-exports": "error",
      // With verbatimModuleSyntax, `import { type A }` would keep an empty import.
      "@typescript-eslint/no-import-type-side-effects": "error",
      // A switch over a union/enum must handle every case.
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      // Promises must be awaited, returned, or marked with void.
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      // Use ?? instead of || for defaults (0 and "" stay valid values).
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      // Template strings only with string/number values.
      "@typescript-eslint/restrict-template-expressions": ["error", { allowNumber: true }],
    },
  },

  // Plain JS files (configs) have no types, so type-aware rules are off.
  {
    files: ["**/*.{js,mjs}"],
    ...tseslint.configs.disableTypeChecked,
  },

  // Import hygiene. Circular imports (often through a barrel index.ts) give
  // `undefined` at runtime, and TypeScript can't see it.
  {
    plugins: { "import-x": importX },
    settings: {
      "import-x/resolver-next": [createTypeScriptImportResolver()],
      // import-x must parse files with the same parser to follow imports.
      "import-x/parsers": { "@typescript-eslint/parser": [".js", ".mjs", ".ts", ".tsx"] },
      "import-x/extensions": [".js", ".mjs", ".ts", ".tsx"],
    },
    rules: {
      // Two files must never import each other (directly or through a barrel).
      "import-x/no-cycle": "error",
      "import-x/no-self-import": "error",
      "import-x/no-duplicates": "error",
      "import-x/first": "error",
    },
  },

  // Sorted imports/exports (auto-fixable with --fix). Prettier does not sort,
  // and VS Code "organize imports" is turned off so they don't fight.
  {
    plugins: { perfectionist },
    settings: {
      perfectionist: { type: "natural", ignoreCase: true },
    },
    rules: {
      // Import lines: packages first, then our @packages/@apps, then local files.
      "perfectionist/sort-imports": [
        "error",
        {
          internalPattern: ["^@packages/", "^@apps/"],
          groups: [["builtin", "external"], "internal", ["parent", "sibling", "index"], "unknown"],
          newlinesBetween: 0,
        },
      ],
      // Inside { }: values first, then types, each A-Z.
      "perfectionist/sort-named-imports": ["error", { groups: ["value-import", "type-import"] }],
      "perfectionist/sort-named-exports": "error",
      "perfectionist/sort-exports": "error",
    },
  },

  // Every rule becomes a warning, so the editor shows yellow, not red.
  // `eslint --max-warnings 0` still fails CI and commits on any warning.
  {
    plugins: { onlyWarn },
  },

  {
    ignores: [
      "dist/**",
      ".next/**",
      "out/**",
      "build/**",
      "coverage/**",
      ".turbo/**",
      "node_modules/**",
    ],
  },
];
