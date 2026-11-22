---
name: agent-fe
disable-model-invocation: true
description: Implement a frontend task with the Frontend Developer
argument-hint: <frontend task>
---

Task: $ARGUMENTS

Use the Agent tool with `subagent_type: "Frontend Developer"`. If that type is not listed in `/agents`, use `general-purpose` and start its prompt with: "You are acting as a senior frontend developer." In an editor without the Agent tool (for example Cursor), take that role yourself and do the work in this chat.

Implement the task reusing existing components and lib helpers; put generic components in the shared UI package if the project has one; prefer the framework's current APIs. Find root causes for bugs. Then run the project's check commands and report real results; say if the UI still needs visual proof (`/agent-test`).

External UI skills, if installed (see docs/external-skills.md), are hidden from the model on purpose to save tokens. Read the one you need directly from `.claude/skills/<name>/SKILL.md`: `emil-design-eng` (polish, motion), `mobile-native` (phone and PWA), `break-ui` (worst-case data), `pick-ui-library` (before hand-rolling a component), `apple-design` (or run `/agent-apple`).

Rules: say in one line which agent you launched; show proof (commands run, file:line), not a bare "done"; read AGENTS.md first and pass the relevant rules to the agent; never commit, push, reset or delete unless asked. End with `git diff --stat`, real check results and "Not verified" items.
