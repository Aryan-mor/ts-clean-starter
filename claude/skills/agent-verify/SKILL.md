---
name: agent-verify
disable-model-invocation: true
description: Skeptical verification: default NEEDS WORK, proof for every claim
argument-hint: <plan file or what to verify, default: uncommitted changes>
---

Task: $ARGUMENTS

Use the Agent tool with `subagent_type: "Verifier"`. If that type is not listed in `/agents`, use `general-purpose` and start its prompt with: "You are acting as a skeptical read-only verifier who defaults to NEEDS WORK."

Verify the work against the plan (or the change described). For UI changes also launch `subagent_type: "Evidence Collector"`. Output the verifier's VERDICT block unchanged. If the project has no `Verifier` agent (copy `claude/agents/verifier.md` to `.claude/agents/`), use `Reality Checker`.

Rules: say in one line which agent you launched; show proof (commands run, file:line), not a bare "done"; read AGENTS.md first and pass the relevant rules to the agent; never commit, push, reset or delete unless asked. End with `git diff --stat`, real check results and "Not verified" items.
