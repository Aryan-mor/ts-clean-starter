# When something breaks

Read this when a build, test, type check or runtime error needs fixing.

- **Do not patch the symptom.** A loader, alias, `paths` entry, cast, `@ts-ignore`, retry or
  swallowing try/catch that only makes the error go away is not a fix.
- **Find the root cause first.** Reproduce it, then check whether it also breaks elsewhere
  (another app, the production build, the start script). Fix the place it comes from.
- **Choose the production-ready practice.** Use what the tool's own docs recommend for
  production, even if it is bigger than a quick fix. Read the installed docs first (often
  bundled in `node_modules`).
- **Decide, then explain.** State the cause, the options you considered, why the chosen one is
  production-ready, and what you verified. If two options are reasonable and the choice
  changes project conventions, ask first.
- **Prove it.** Run lint, type check and build, and the real production path (for example
  `node dist/index.js`), not only the dev server.
- **Remove the temporary fix.** When the real fix lands, delete every earlier workaround.
