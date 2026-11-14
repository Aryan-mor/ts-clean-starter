// Bundles the API into dist/index.js with esbuild.
// Workspace packages (@packages/*) ship TypeScript source, so they are bundled in.
// npm dependencies stay external and load from node_modules at runtime.
import { build } from "esbuild";
import { readFileSync } from "node:fs";

const pkg = JSON.parse(readFileSync(new URL("package.json", import.meta.url), "utf8"));
const external = Object.keys(pkg.dependencies ?? {}).filter(
  (name) => !name.startsWith("@packages/"),
);

await build({
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.js",
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node24",
  sourcemap: true,
  external,
});

console.info("built dist/index.js");
