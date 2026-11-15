import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import { importX } from "eslint-plugin-import-x";
import onlyWarn from "eslint-plugin-only-warn";
import perfectionist from "eslint-plugin-perfectionist";
import unicorn from "eslint-plugin-unicorn";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tseslint from "typescript-eslint";
import { localPlugin } from "./eslint-rules/no-relative-package-imports.js";

// Base naming rules. Reused by the constants-folder override below.
const namingConvention = [
  {
    selector: "default",
    format: ["camelCase"],
    leadingUnderscore: "allow",
  },
  {
    selector: "variable",
    format: ["camelCase", "UPPER_CASE", "PascalCase"],
    leadingUnderscore: "allow",
  },
  { selector: "function", format: ["camelCase", "PascalCase"] },
  {
    selector: "parameter",
    format: ["camelCase"],
    leadingUnderscore: "allow",
  },
  { selector: "typeLike", format: ["PascalCase"] },
  { selector: "enumMember", format: ["UPPER_CASE", "PascalCase"] },
  // __Org__ style brand keys (branded ID types) are allowed.
  {
    selector: ["objectLiteralProperty", "typeProperty"],
    format: ["camelCase", "UPPER_CASE", "PascalCase"],
    leadingUnderscore: "allowDouble",
    trailingUnderscore: "allowDouble",
  },
  {
    selector: ["objectLiteralProperty", "typeProperty"],
    modifiers: ["requiresQuotes"],
    format: null,
  },
  { selector: "import", format: null },
];

/**
 * Shared ESLint rules. eslint.config.js re-exports this file.
 * Next.js / React variants import from here, not from eslint.config.js.
 *
 * Why everything is so strict: the compiler can't catch forgotten promises,
 * unsafe `any`, or circular imports. These rules can.
 *
 * For Next.js, see eslint.config.next.js. For a React library, see
 * eslint.config.react.js.
 *
 * @type {import("eslint").Linter.Config[]}
 */
const config = [
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

  // Clean-code rules for every file.
  {
    plugins: { local: localPlugin },
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
      // Monorepo: never reach into another package with a relative path
      // ("../../../shared/src/..."). Auto-fixed to the name: "@packages/shared".
      "local/no-relative-package-imports": "error",
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
      // Names: variables/functions camelCase, types PascalCase, constants UPPER_CASE.
      // PascalCase is also allowed for React components and const objects (Currency).
      // Keys in quotes ("Content-Type", "snake_key") are free; plain keys must be camelCase.
      "@typescript-eslint/naming-convention": ["error", ...namingConvention],
    },
  },

  // constants folders: enum-like objects are PascalCase (Currency),
  // their value arrays are UPPER_CASE (CURRENCIES). Nothing else is allowed there.
  {
    files: ["**/constants/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/naming-convention": [
        "error",
        ...namingConvention,
        { selector: "variable", modifiers: ["const", "global"], format: ["PascalCase"] },
        {
          selector: "variable",
          modifiers: ["const", "global"],
          types: ["array"],
          format: ["UPPER_CASE"],
        },
      ],
    },
  },

  // File names in kebab-case: pipeline-stage.ts, not pipeline_stage.ts or PipelineStage.ts.
  {
    files: ["**/*.{js,mjs,ts,tsx}"],
    plugins: { unicorn },
    rules: {
      "unicorn/filename-case": ["error", { case: "kebabCase" }],
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
      // Import lines: packages first, then path aliases / internal packages, then local files.
      // Adjust `internalPattern` to match your aliases (e.g. "^@/", "^@acme/").
      "perfectionist/sort-imports": [
        "error",
        {
          internalPattern: ["^@/", "^@packages/", "^@apps/"],
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

export default config;
