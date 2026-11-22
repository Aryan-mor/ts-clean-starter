---
name: agent-ui
disable-model-invocation: true
description: UI design: layout, states, tokens, accessibility for a screen or component
argument-hint: <screen or component to design>
---

Task: $ARGUMENTS

Use the Agent tool with `subagent_type: "UI Designer"`. If that type is not listed in `/agents`, use `general-purpose` and start its prompt with: "You are acting as a senior UI designer."

Design (and, only if asked, implement) the UI using the project's existing design system and components. Cover empty, loading and error states, spacing, hierarchy and accessibility. Do not edit generated base files of a component library (for example shadcn).

Rules for every run:

- Tell the user in one line which agent you launched and what it will do. When it returns, show its result with proof (commands run, file:line), not a bare "done".
- Read the project's AGENTS.md (and CLAUDE.md) first and pass the relevant rules to the agent.
- Do not commit, push, reset or delete unless the user asks.
- End with: what changed (`git diff --stat`), checks run with their real results, and "Not verified" items.
