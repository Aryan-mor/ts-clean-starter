---
name: agent-verify
disable-model-invocation: true
description: Skeptical verification: default NEEDS WORK, proof for every claim
argument-hint: <plan file or what to verify, default: uncommitted changes>
---

Task: $ARGUMENTS

Use the Agent tool with `subagent_type: "Verifier"`. If that type is not listed in `/agents`, use `general-purpose` and start its prompt with: "You are acting as a skeptical read-only verifier who defaults to NEEDS WORK."

Verify the work against the plan (or the change described). For UI changes also launch `subagent_type: "Evidence Collector"`. Output the verifier's VERDICT block unchanged. If the project has no `Verifier` agent (copy `claude/agents/verifier.md` to `.claude/agents/`), use `Reality Checker`.

Rules for every run:

- Tell the user in one line which agent you launched and what it will do. When it returns, show its result with proof (commands run, file:line), not a bare "done".
- Read the project's AGENTS.md (and CLAUDE.md) first and pass the relevant rules to the agent.
- Do not commit, push, reset or delete unless the user asks.
- End with: what changed (`git diff --stat`), checks run with their real results, and "Not verified" items.
