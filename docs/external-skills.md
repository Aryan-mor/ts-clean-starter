# External Claude skills (not committed, restorable)

Skills written by other people are installed per project but **not committed**. Git keeps
only `skills-lock.json` (each skill pinned to an exact commit and hash). On a new machine one
command downloads them again.

This repo already pins the skills below in `skills-lock.json`: after you clone it, run the restore command.

## Install and track

```sh
npx skills@latest add <owner/repo> -s <skill-name> -a claude-code -y
```

This writes `.claude/skills/<skill-name>/` and `skills-lock.json`. Then:

1. Add `.agents/` and `.claude/skills/<skill-name>/` to `.gitignore`. Use the explicit name,
   never `.claude/skills/`, because our own `/agent-*` skills live there and are committed.
2. Commit `skills-lock.json` and `.gitignore`.
3. Add a "Missing skills" note to the project's `CLAUDE.md` (copy it from below).

Read a skill's `SKILL.md` before you install it: skills run with full agent permissions.

Before installing a new skill, run `/skill-audit` (see `.claude/skills/skill-audit/`). It scans the skill with [SkillSpector](https://github.com/NVIDIA/SkillSpector) (static analysis by default) and gives a go/no-go. Set the `SKILLSPECTOR` environment variable to your SkillSpector executable or wrapper if it is not already on `PATH`.

## Zero prompt cost: call them only by name

Every installed skill puts its name and description into **every** prompt. To avoid that, hide
them from the model but keep them callable (`/emil-design-eng`, ...) with `skillOverrides` in
`.claude/settings.json`. This does not edit the skill files, so the lock hash and `npx skills update`
keep working:

```json
{
  "skillOverrides": {
    "apple-design": "user-invocable-only",
    "ask-emil": "user-invocable-only",
    "break-ui": "user-invocable-only",
    "emil-design-eng": "user-invocable-only",
    "mobile-native": "user-invocable-only",
    "pick-ui-library": "user-invocable-only",
    "review-animations": "user-invocable-only"
  }
}
```

Add one line per skill you install. Check with `/skills`: each should show `user-only`. Claude then
loads a skill only when you type its command, or when `/agent-ui`, `/agent-fe` or `/agent-apple`
reads its file. `"name-only"` is the cheaper middle option: the name is listed, the description is not.

## Restore on a new machine

```sh
npx skills@latest experimental_install -a claude-code
```

It downloads every skill in `skills-lock.json` at its pinned commit into `.agents/skills/` and
links it into `.claude/skills/`. Update with `npx skills update` and review the lock diff.

## Text for the project's CLAUDE.md

```md
## Missing skills (new machine or fresh clone)

Third-party skills are not in git. If a skill listed in `skills-lock.json` is missing from
`.claude/skills/`, restore them with `npx skills@latest experimental_install -a claude-code`.
Ask the user before you run it.
```

## Recommended for web UI work

[`emilkowalski/skills`](https://github.com/emilkowalski/skills) (MIT). Pick what you need:

| Skill               | Use it for                                                        |
| ------------------- | ----------------------------------------------------------------- |
| `emil-design-eng`   | UI polish: press and hover states, easing, invisible details      |
| `apple-design`      | Apple's interface principles for the web (used by `/agent-apple`) |
| `mobile-native`     | A PWA that feels native: 100vh, input zoom, safe areas, taps      |
| `break-ui`          | Try to break a UI with long names, empty lists, huge counts       |
| `review-animations` | Strict review of motion code                                      |
| `pick-ui-library`   | Pick a library instead of hand-rolling a toast or drawer          |

```sh
npx skills@latest add emilkowalski/skills -a claude-code -y \
  -s emil-design-eng -s apple-design -s mobile-native -s break-ui -s review-animations -s pick-ui-library
```

`agent-ui`, `agent-fe` and `agent-apple` use these when they are installed and do nothing
different when they are not. Skip `animate-expo` and `write-swift` unless you build native apps.

## Cursor

Cursor loads `.claude/skills/` too, so restored skills work there. But `skillOverrides` is Claude
Code only, so in Cursor the name and description of every installed skill is in the prompt. To avoid
that, install only the skills you use, or add `disable-model-invocation: true` to a skill's frontmatter
(the next `npx skills update` overwrites that, and the lock hash will differ).
