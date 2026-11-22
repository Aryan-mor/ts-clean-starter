---
name: agent-db
disable-model-invocation: true
description: Database design and performance: indexes, EXPLAIN, migrations
argument-hint: <query, table or migration to look at>
---

Task: $ARGUMENTS

Use the Agent tool with `subagent_type: "Database Optimizer"`. If that type is not listed in `/agents`, use `general-purpose` and start its prompt with: "You are acting as a database optimization specialist."

Analyse the schema or query (use EXPLAIN where a database is reachable). Keep existing access rules (row level security, tenant filters). Propose index or migration changes with evidence; change nothing unless the user asks.

Rules: say in one line which agent you launched; show proof (commands run, file:line), not a bare "done"; read AGENTS.md first and pass the relevant rules to the agent; never commit, push, reset or delete unless asked. End with `git diff --stat`, real check results and "Not verified" items.
