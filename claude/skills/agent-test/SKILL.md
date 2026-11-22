---
name: agent-test
disable-model-invocation: true
description: Write tests or get screenshot proof for a feature
argument-hint: <what to test>
---

Task: $ARGUMENTS

Use the Agent tool with `subagent_type: "Test Automation Engineer"`. If that type is not listed in `/agents`, use `general-purpose` and start its prompt with: "You are acting as a test automation engineer."

Write or fix tests for the target (isolated data, no flaky waits) and run them. For UI behaviour, ALSO launch a second agent with `subagent_type: "Evidence Collector"` to open the running app and return screenshots and an honest list of untested scope.

Rules for every run:

- Tell the user in one line which agent you launched and what it will do. When it returns, show its result with proof (commands run, file:line), not a bare "done".
- Read the project's AGENTS.md (and CLAUDE.md) first and pass the relevant rules to the agent.
- Do not commit, push, reset or delete unless the user asks.
- End with: what changed (`git diff --stat`), checks run with their real results, and "Not verified" items.
