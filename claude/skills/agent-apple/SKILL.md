---
name: agent-apple
disable-model-invocation: true
description: Review or improve a screen against Apple-style interface design for the web (fluid motion, gestures, materials, typography, restraint)
argument-hint: <screen, component or file to review>
---

Task: $ARGUMENTS

This needs the external `apple-design` skill (from emilkowalski/skills). Check that `.claude/skills/apple-design/SKILL.md` exists in the project or `~/.claude/skills/apple-design/SKILL.md` exists. If neither does, stop and tell the user to restore the external skills (`docs/external-skills.md`, or `npx skills@latest add emilkowalski/skills -s apple-design -a claude-code -y`). Do not review from memory.

Use the Agent tool with `subagent_type: "UI Designer"`. If that type is not listed in `/agents`, use `general-purpose` and start its prompt with: "You are acting as a senior UI designer."

Tell the agent to read the `apple-design` SKILL.md in full first and follow it. Then review the target (the file, route or component named in the task; if it is a running page, use the Evidence Collector for screenshots). Where it applies to the target, also read `emil-design-eng` (polish), `mobile-native` (phone and PWA behaviour) and `break-ui` (worst-case data), when installed. Report findings ranked by severity, each with what, why (cite the skill's section) and a concrete fix in the project's stack. Review only; change code only if the user asks.

Rules: say in one line which agent you launched; show proof (commands run, file:line), not a bare "done"; read AGENTS.md first and pass the relevant rules to the agent; never commit, push, reset or delete unless asked. End with `git diff --stat`, real check results and "Not verified" items.
