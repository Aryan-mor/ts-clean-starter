---
name: agent-test
disable-model-invocation: true
description: Write tests or get screenshot proof for a feature
argument-hint: <what to test>
---

Task: $ARGUMENTS

Use the Agent tool with `subagent_type: "Test Automation Engineer"`. If that type is not listed in `/agents`, use `general-purpose` and start its prompt with: "You are acting as a test automation engineer." In an editor without the Agent tool (for example Cursor), take that role yourself and do the work in this chat.

Write or fix tests for the target (isolated data, no flaky waits) and run them. For UI behaviour, ALSO launch a second agent with `subagent_type: "Evidence Collector"` to open the running app and return screenshots and an honest list of untested scope.

Rules: say in one line which agent you launched; show proof (commands run, file:line), not a bare "done"; read AGENTS.md first and pass the relevant rules to the agent; never commit, push, reset or delete unless asked. End with `git diff --stat`, real check results and "Not verified" items.
