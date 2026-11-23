---
name: agent-ui
disable-model-invocation: true
description: UI design: layout, states, tokens, accessibility for a screen or component
argument-hint: <screen or component to design>
---

Task: $ARGUMENTS

Use the Agent tool with `subagent_type: "UI Designer"`. If that type is not listed in `/agents`, use `general-purpose` and start its prompt with: "You are acting as a senior UI designer." In an editor without the Agent tool (for example Cursor), take that role yourself and do the work in this chat.

Design (and, only if asked, implement) the UI using the project's existing design system and components. Cover empty, loading and error states, spacing, hierarchy and accessibility. Do not edit generated base files of a component library (for example shadcn). When implementing: For React 19+ (check the installed `react` version first), use the modern APIs where they fit instead of hand-rolled state: `useOptimistic` for instant UI on mutations, `useTransition` / `startTransition` for non-blocking updates, `useActionState` and `useFormStatus` for forms and actions, `use()` to read promises and context, `useDeferredValue` for slow lists. In the Next.js App Router prefer Server Components and Server Actions. If the React Compiler is on, do not add manual `useMemo` / `useCallback`. Never use an API the installed version does not have.

External UI skills, if installed (see docs/external-skills.md), are hidden from the model on purpose to save tokens. Read the one you need directly from `.claude/skills/<name>/SKILL.md`: `emil-design-eng` (polish, motion), `mobile-native` (phone and PWA), `break-ui` (worst-case data), `pick-ui-library` (before hand-rolling a component), `apple-design` (or run `/agent-apple`).

Rules: say in one line which agent you launched; show proof (commands run, file:line), not a bare "done"; read AGENTS.md first and pass the relevant rules to the agent; never commit, push, reset or delete unless asked. End with `git diff --stat`, real check results and "Not verified" items.
