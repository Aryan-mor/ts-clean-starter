import pluginNext from "@next/eslint-plugin-next";
import pluginReactHooks from "eslint-plugin-react-hooks";
import { globalIgnores } from "eslint/config";
import globals from "globals";
import base from "./eslint.base.js";

/**
 * ESLint config for Next.js apps: base rules + Next.js + React hooks.
 *
 * To use this as your project config, change eslint.config.js to:
 *   export { default } from "./eslint.config.next.js";
 *
 * @type {import("eslint").Linter.Config[]}
 */
export default [
  ...base,
  // Same ignores as eslint-config-next.
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.serviceworker },
    },
  },
  {
    plugins: { "@next/next": pluginNext },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules,
    },
  },
  // Rules of hooks + exhaustive deps (stale closures are a real bug source).
  pluginReactHooks.configs.flat.recommended,
];
