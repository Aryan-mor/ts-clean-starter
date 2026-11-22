---
name: agent-fe
disable-model-invocation: true
description: Implement a frontend task with the Frontend Developer
argument-hint: <frontend task>
---

Task: $ARGUMENTS

Use the Agent tool with `subagent_type: "Frontend Developer"`. If that type is not listed in `/agents`, use `general-purpose` and start its prompt with: "You are acting as a senior frontend developer."

Implement the task reusing existing components and lib helpers; put generic components in the shared UI package if the project has one; prefer the framework's current APIs. Find root causes for bugs. Then run the project's check commands and report real results; say if the UI still needs visual proof (`/agent-test`).

Rules for every run:

- Tell the user in one line which agent you launched and what it will do. When it returns, show its result with proof (commands run, file:line), not a bare "done".
- Read the project's AGENTS.md (and CLAUDE.md) first and pass the relevant rules to the agent.
- Do not commit, push, reset or delete unless the user asks.
- End with: what changed (`git diff --stat`), checks run with their real results, and "Not verified" items.
