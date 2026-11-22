---
name: agent-db
disable-model-invocation: true
description: Database design and performance: indexes, EXPLAIN, migrations
argument-hint: <query, table or migration to look at>
---

Task: $ARGUMENTS

Use the Agent tool with `subagent_type: "Database Optimizer"`. If that type is not listed in `/agents`, use `general-purpose` and start its prompt with: "You are acting as a database optimization specialist."

Analyse the schema or query (use EXPLAIN where a database is reachable). Keep existing access rules (row level security, tenant filters). Propose index or migration changes with evidence; change nothing unless the user asks.

Rules for every run:

- Tell the user in one line which agent you launched and what it will do. When it returns, show its result with proof (commands run, file:line), not a bare "done".
- Read the project's AGENTS.md (and CLAUDE.md) first and pass the relevant rules to the agent.
- Do not commit, push, reset or delete unless the user asks.
- End with: what changed (`git diff --stat`), checks run with their real results, and "Not verified" items.
