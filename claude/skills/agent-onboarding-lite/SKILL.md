---
name: agent-onboarding-lite
disable-model-invocation: true
description: Quick, simple first look at a repo (read-only, about 20 lines, plain English)
argument-hint: <optional focus: a feature or flow; default: whole repo>
---

Task: $ARGUMENTS

Do this yourself in this chat. Do not launch a subagent. Be fast: read the README, the root manifest (`package.json` or similar), the folder tree, `.env.example`, and only the few source files on the main path. Stop when you can answer the points below.

Write in simple English (short sentences, no jargon without a one-line explanation). Facts from the code only: when you name a behavior, add the file (and line if easy). No refactor advice. Read-only: change nothing in the repo, run nothing that writes.

Write the answer as readable Markdown to `~/.claude/onboarding/<repo-folder-name>-lite.md`, creating the folder if needed. It is outside the repo so git stays clean, and it is the only file you may write. In the chat, reply with that path and the "Say it out loud" lines. Path rule: expand `~` to the real home folder and give the full absolute path. Print it on its own line as a bare URL like file:///C:/Users/NAME/.claude/onboarding/FILE.md (forward slashes, no backticks, no brackets) so the terminal makes it clickable, then the same path as plain text on the next line. Do not add notes about what you read, skipped or did not run.

Use this exact Markdown layout. Put a blank line between every block. Keep bullets under about 15 words and paragraphs to 2 short sentences. The file must read well in a Markdown preview (in VS Code: Ctrl+Shift+V).

````markdown
# <repo-name>: quick onboarding

> One sentence: what this repo does.

## What it is

1-2 short sentences.

## How to run

```bash
<install command>
<run command>
```

| Env var | Default | What it does |
| ------- | ------- | ------------ |
| `NAME`  | `value` | short reason |

## Main flow

```text
<input, e.g. POST /companies>   src/routes/x.ts
  -> <step>                      src/...
  -> <step>                      src/...
  -> <output, e.g. db row>       src/...
```

(max 6 steps, one per line)

## Read first

| File   | Why          |
| ------ | ------------ |
| `path` | short reason |

(exactly 3 rows)

## Watch out

- **`path`**: what looks surprising or fragile, in one sentence. Say what you see, not how to fix it.

(max 3 bullets)

## Say it out loud

> 2-3 sentences I could say to an interviewer.
````

If you skipped part of the repo, say which part in one line at the end.
