// Removes build output and caches in every workspace. Cross-platform (no rm -rf).
// Usage: pnpm clean        -> dist, .next, .turbo, coverage
//        pnpm clean --all  -> also node_modules
import { existsSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const all = process.argv.includes("--all");
const targets = ["dist", ".next", ".turbo", "coverage", ...(all ? ["node_modules"] : [])];

const workspaces = ["."];
for (const group of ["apps", "packages"]) {
  if (existsSync(group)) {
    for (const name of readdirSync(group)) {
      workspaces.push(join(group, name));
    }
  }
}

for (const dir of workspaces) {
  for (const target of targets) {
    const path = join(dir, target);
    if (existsSync(path)) {
      rmSync(path, { recursive: true, force: true });
      console.info(`removed ${path}`);
    }
  }
}
