---
name: agent-plan
disable-model-invocation: true
description: Plan only (no code): files, risks, done-check per step
argument-hint: <feature or problem to plan>
---

Task: $ARGUMENTS

Use the Agent tool with `subagent_type: "Master Plan Architect"`. If that type is not listed in `/agents`, use `general-purpose` and start its prompt with: "You are acting as a planning architect who writes plans and never code."

Produce a plan only, zero code changes. Include goal, numbered steps (1-3 files each, exact paths), a Tier line (hard|medium|easy), risks, out-of-scope, and a done-check command per step. Save it to `plans/<slug>-r1.md` (create the folder if needed). Ask at most one up-front question if truly ambiguous.

Rules: say in one line which agent you launched; show proof (commands run, file:line), not a bare "done"; read AGENTS.md first and pass the relevant rules to the agent; never commit, push, reset or delete unless asked. End with `git diff --stat`, real check results and "Not verified" items.
