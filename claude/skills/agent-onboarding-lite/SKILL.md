---
name: agent-onboarding-lite
disable-model-invocation: true
description: Quick, simple first look at a repo (read-only, about 20 lines, plain English)
argument-hint: <optional focus: a feature or flow; default: whole repo>
---

Task: $ARGUMENTS

Do this yourself in this chat. Do not launch a subagent. Be fast: read the README, the root manifest (`package.json` or similar), the folder tree, `.env.example`, and only the few source files on the main path. Stop when you can answer the points below.

Write in simple English (short sentences, no jargon without a one-line explanation). Facts from the code only: when you name a behavior, add the file (and line if easy). No refactor advice. Read-only: change nothing in the repo, run nothing that writes.

Write the answer as readable Markdown to `~/.claude/onboarding/<repo-folder-name>-lite.md`, creating the folder if needed. It is outside the repo so git stays clean, and it is the only file you may write. In the chat, reply with that path and the "Say it out loud" lines.

Use this exact shape, max about 20 lines:

1. **What it is**: 1-2 sentences.
2. **How to run it**: the commands and env vars it needs.
3. **Main flow**: one line, max 6 steps, like `request -> route -> queue -> pipeline -> db`, each step with its file.
4. **Read first**: 3 files, one short reason each.
5. **Watch out**: up to 3 things in the code that look surprising or fragile, each with its file. Say what you see, not how to fix it.
6. **Say it out loud**: a 2-3 sentence summary I could say to an interviewer.

If you skipped part of the repo, say which part in one line at the end.
