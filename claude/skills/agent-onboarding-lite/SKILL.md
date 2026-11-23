---
name: agent-onboarding-lite
disable-model-invocation: true
description: Quick general overview of a repo (read-only, short, plain English)
argument-hint: <optional focus: a feature or flow; default: whole repo>
---

Task: $ARGUMENTS

Do this yourself in this chat. Do not launch a subagent. Be fast: read the README, the root manifest (`package.json` or similar), the folder tree, `.env.example`, and only the few source files on the main path. Stop when you can fill the sections below.

Goal: a short general overview of the project, so a developer who has never seen it knows what it is, what it is built with, how it is organised and where to start. Write in simple English (short sentences, no jargon without a one-line explanation). Facts from the code only: when you name a behavior, add the file. No refactor advice. Read-only: change nothing in the repo, run nothing that writes.

Write the overview as Markdown to `~/.claude/onboarding/<repo-folder-name>-lite.md`, creating the folder if needed. It is outside the repo so git stays clean, and it is the only file you may write. In the chat, reply only with the path and the 1-line summary. Path rule: expand `~` to the real home folder and give the full absolute path. Print it on its own line as a bare URL like file:///C:/Users/NAME/.claude/onboarding/FILE.md (forward slashes, no backticks, no brackets) so the terminal makes it clickable, then the same path as plain text on the next line. Do not add notes about what you read, skipped or did not run.

Use this exact Markdown layout. Put a blank line between every block. Keep bullets under about 15 words and paragraphs to 2 short sentences. The file must read well in a Markdown preview (in VS Code: Ctrl+Shift+V).

````markdown
# <repo-name>: overview

> One sentence: what this repo does.

## What it does

2-3 short sentences: the problem it solves, the main input and the main output.

## Tech stack

| Part                | Tool |
| ------------------- | ---- |
| Language / runtime  | ...  |
| Framework           | ...  |
| Database / storage  | ...  |
| Other key libraries | ...  |

## How to run

```bash
<install command>
<run command>
```

| Env var | Default | What it does |
| ------- | ------- | ------------ |
| `NAME`  | `value` | short reason |

## Folder structure

```text
src/
  routes/     what lives here
  ...
```

(top-level code folders only, one short note each)

## Main features

- **<feature>**: one sentence, with its file.

(max 5 bullets: API endpoints, pages, commands or jobs, whatever the repo exposes)

## Main flow

```text
<input, e.g. POST /companies>   src/routes/x.ts
  -> <step>                      src/...
  -> <output, e.g. db row>       src/...
```

(max 6 steps, one per line)

## Key files

| File   | Why          |
| ------ | ------------ |
| `path` | short reason |

(3-5 rows, the best files to read first)

## Watch out

- **`path`**: what looks surprising or fragile, in one sentence. Say what you see, not how to fix it.

(max 3 bullets)
````

If you skipped part of the repo, say which part in one line at the end of the file.
