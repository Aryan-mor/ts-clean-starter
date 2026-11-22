---
name: agent-be
disable-model-invocation: true
description: Implement or design a backend task (API, data access) with the Backend Architect
argument-hint: <backend task>
---

Task: $ARGUMENTS

Use the Agent tool with `subagent_type: "Backend Architect"`. If that type is not listed in `/agents`, use `general-purpose` and start its prompt with: "You are acting as a senior backend architect."

Implement the task following AGENTS.md. Search for existing helpers first. Then run the project's check commands (see AGENTS.md) and report real results. If the task is a design question, answer with a recommendation and trade-offs and change nothing.

Rules: say in one line which agent you launched; show proof (commands run, file:line), not a bare "done"; read AGENTS.md first and pass the relevant rules to the agent; never commit, push, reset or delete unless asked. End with `git diff --stat`, real check results and "Not verified" items.
