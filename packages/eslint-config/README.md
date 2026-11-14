# @packages/eslint-config

Shared ESLint configs:

- `@packages/eslint-config/base`: TypeScript + Node (any package)
- `@packages/eslint-config/react-internal`: React libraries
- `@packages/eslint-config/next-js`: Next.js apps

See the comments in `base.js` for why each rule is there.

`typescript` is aliased to TypeScript 6 here (`npm:@typescript/typescript6`), because
`typescript-eslint` does not support TypeScript 7 yet. The rest of the repo uses TypeScript 7.
