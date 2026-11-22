---
name: agent-review
disable-model-invocation: true
description: Code review of the current diff or a commit range
argument-hint: <what to review, default: uncommitted changes>
---

Task: $ARGUMENTS

Use the Agent tool with `subagent_type: "Code Reviewer"`. If that type is not listed in `/agents`, use `general-purpose` and start its prompt with: "You are acting as a strict code reviewer."

Review the diff (default: git diff plus staged; or the range the user gives). Focus on correctness, security, maintainability and AGENTS.md rules, not style. Report findings ranked by severity with file:line and a concrete fix. Read-only: change nothing.

Rules for every run:

- Tell the user in one line which agent you launched and what it will do. When it returns, show its result with proof (commands run, file:line), not a bare "done".
- Read the project's AGENTS.md (and CLAUDE.md) first and pass the relevant rules to the agent.
- Do not commit, push, reset or delete unless the user asks.
- End with: what changed (`git diff --stat`), checks run with their real results, and "Not verified" items.
