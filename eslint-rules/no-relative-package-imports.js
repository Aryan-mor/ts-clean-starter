// Local ESLint rule: a relative import that reaches into ANOTHER workspace
// package ("./../../../shared/src/types/ids") is replaced with that package's
// name ("@packages/shared"). Auto-fixable, so it runs on save and on --fix.
import fs from "node:fs";
import path from "node:path";

const cache = new Map();

/** Nearest folder (going up) that has a package.json with a "name". */
function findPackage(startDir) {
  let dir = startDir;
  for (;;) {
    if (cache.has(dir)) {
      return cache.get(dir);
    }
    const file = path.join(dir, "package.json");
    if (fs.existsSync(file)) {
      const { name } = JSON.parse(fs.readFileSync(file, "utf8"));
      if (name) {
        const pkg = { dir, name };
        cache.set(dir, pkg);
        return pkg;
      }
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      return null;
    }
    dir = parent;
  }
}

/** @type {import("eslint").Rule.RuleModule} */
export const noRelativePackageImports = {
  meta: {
    type: "problem",
    fixable: "code",
    docs: { description: "Import other workspace packages by name, not by a relative path." },
    messages: {
      useName: 'Import "{{name}}" by name, not by the relative path "{{path}}".',
    },
    schema: [],
  },
  create(context) {
    const filename = context.physicalFilename ?? context.filename;
    const own = findPackage(path.dirname(filename));

    function check(node) {
      const source = node.source;
      if (!source || typeof source.value !== "string" || !source.value.startsWith(".")) {
        return;
      }
      const target = findPackage(path.dirname(path.resolve(path.dirname(filename), source.value)));
      if (!own || !target || target.dir === own.dir) {
        return;
      }
      const quote = source.raw[0];
      context.report({
        node: source,
        messageId: "useName",
        data: { name: target.name, path: source.value },
        fix: (fixer) => fixer.replaceText(source, `${quote}${target.name}${quote}`),
      });
    }

    return {
      ImportDeclaration: check,
      ExportNamedDeclaration: check,
      ExportAllDeclaration: check,
    };
  },
};

export const localPlugin = {
  rules: { "no-relative-package-imports": noRelativePackageImports },
};
