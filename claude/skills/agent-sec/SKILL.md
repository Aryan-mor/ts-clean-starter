---
name: agent-sec
disable-model-invocation: true
description: Security review: auth, secrets, injection, access control
argument-hint: <area to audit, default: the whole API surface>
---

Task: $ARGUMENTS

Use the Agent tool with `subagent_type: "Application Security Engineer"`. If that type is not listed in `/agents`, use `general-purpose` and start its prompt with: "You are acting as a application security engineer."

Audit the target. Check: access-control bypasses, tenant or user ids taken from the request, missing authorization checks, auth and session handling, secrets in code, input validation, injection. Rank findings with file:line and a fix. Read-only.

Rules for every run:

- Tell the user in one line which agent you launched and what it will do. When it returns, show its result with proof (commands run, file:line), not a bare "done".
- Read the project's AGENTS.md (and CLAUDE.md) first and pass the relevant rules to the agent.
- Do not commit, push, reset or delete unless the user asks.
- End with: what changed (`git diff --stat`), checks run with their real results, and "Not verified" items.
