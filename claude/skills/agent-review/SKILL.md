---
name: agent-review
disable-model-invocation: true
description: Code review of the current diff or a commit range
argument-hint: <what to review, default: uncommitted changes>
---

Task: $ARGUMENTS

Use the Agent tool with `subagent_type: "Code Reviewer"`. If that type is not listed in `/agents`, use `general-purpose` and start its prompt with: "You are acting as a strict code reviewer." In an editor without the Agent tool (for example Cursor), take that role yourself and do the work in this chat.

Review the diff (default: git diff plus staged; or the range the user gives). Focus on correctness, security, maintainability and AGENTS.md rules, not style. Report findings ranked by severity with file:line and a concrete fix. Read-only: change nothing.

Rules: say in one line which agent you launched; show proof (commands run, file:line), not a bare "done"; read AGENTS.md first and pass the relevant rules to the agent; never commit, push, reset or delete unless asked. End with `git diff --stat`, real check results and "Not verified" items.
