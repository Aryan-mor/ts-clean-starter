# Add the agent kit with one prompt

The `claude/` folder holds a ready set of Claude Code helpers:

| Command         | Agent it launches                             | Use it to                                                |
| --------------- | --------------------------------------------- | -------------------------------------------------------- |
| `/agent-pm`     | Senior Project Manager                        | Challenge an idea, discuss it, then split it into tasks. |
| `/agent-plan`   | Master Plan Architect                         | Write a plan only (no code) with a done-check per step.  |
| `/agent-be`     | Backend Architect                             | Implement or design backend work.                        |
| `/agent-fe`     | Frontend Developer                            | Implement frontend work.                                 |
| `/agent-ui`     | UI Designer                                   | Design a screen: states, hierarchy, accessibility.       |
| `/agent-db`     | Database Optimizer                            | Indexes, `EXPLAIN`, migrations.                          |
| `/agent-test`   | Test Automation Engineer + Evidence Collector | Write tests; screenshot proof for UI.                    |
| `/agent-review` | Code Reviewer                                 | Review a diff (read-only).                               |
| `/agent-sec`    | Application Security Engineer                 | Security audit (read-only).                              |
| `/agent-verify` | `Verifier` (`claude/agents/verifier.md`)      | Skeptical check: default verdict is NEEDS WORK.          |

Every skill follows the same rules: say which agent it launched, read `AGENTS.md` first,
never commit or push on its own, and end with `git diff --stat`, real check results and a
"Not verified" list.

## The one prompt

Open Claude Code in the project you want to equip and paste this. Replace the source path
if the starter is somewhere else.

```text
Install the agent kit from ts-clean-starter into this project.

Source: <path or URL of ts-clean-starter, e.g. D:\projects\ts-clean-starter>
Read docs/add-agents.md and AGENTS.md in the source first.

1. Copy claude/agents/*.md to .claude/agents/ and claude/skills/* to .claude/skills/ in
   this project. Do not overwrite a file that already exists; show me the diff and ask.
2. Run /agents. For every subagent_type the skills use (Backend Architect, Frontend
   Developer, UI Designer, Database Optimizer, Master Plan Architect, Code Reviewer,
   Application Security Engineer, Test Automation Engineer, Evidence Collector,
   Senior Project Manager, Reality Checker) that is not listed, tell me. Do not invent
   them; the skills fall back to general-purpose.
3. Add a "Project-specific rules" section to this project's AGENTS.md if it has none
   (data access, auth, folder layout). Ask me for the rules; do not guess them.
4. If this project has a design system or UI package, add one line naming it to
   .claude/skills/agent-ui/SKILL.md and agent-fe/SKILL.md.
5. Do not commit. Finish with the list of files added and anything you skipped.
```

To install for every project instead, say "into ~/.claude" in the first line. Skills there
work in any folder.

## Where the agents come from

The skills call subagent types by name. Most (`Backend Architect`, `Frontend Developer`,
`UI Designer`, `Code Reviewer`, `Reality Checker`, ...) come from an agent pack installed in
`~/.claude/agents/`. Only `Verifier` ships in this kit. A missing type is not an error:
each skill says to fall back to `general-purpose` with a one-line role.

## Make a new `/agent-xyz`

Copy `claude/skills/agent-review/SKILL.md`, then change four things:

1. `name` and `description` in the frontmatter.
2. `argument-hint`, shown after the command in the prompt.
3. The `subagent_type` and the fallback role.
4. The paragraph of instructions. Keep the "Rules for every run" block.

Keep `disable-model-invocation: true` so the skill runs only when you type it.
