import pluginReactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import base from "./eslint.base.js";

/**
 * ESLint config for React libraries: base rules + React hooks.
 *
 * To use this as your project config, change eslint.config.js to:
 *   export { default } from "./eslint.config.react.js";
 *
 * @type {import("eslint").Linter.Config[]}
 */
export default [
  ...base,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.serviceworker },
    },
  },
  pluginReactHooks.configs.flat.recommended,
];
