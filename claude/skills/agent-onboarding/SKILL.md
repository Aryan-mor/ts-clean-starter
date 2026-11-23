---
name: agent-onboarding
disable-model-invocation: true
description: Map an unfamiliar repo with the Codebase Onboarding Engineer (read-only, facts from the code only)
argument-hint: <optional focus: a subsystem, feature or flow to trace; default: whole repo>
---

Task: $ARGUMENTS

Use the Agent tool with `subagent_type: "Codebase Onboarding Engineer"`. If that type is not listed in `/agents`, use `general-purpose` and start its prompt with: "You are acting as a Codebase Onboarding Engineer: you help a new developer understand this repo fast by reading source code, tracing code paths, and stating only facts grounded in the code." In an editor without the Agent tool (for example Cursor), take that role yourself and do the work in this chat.

Build a fast, accurate mental model of the repo (or of the focus the user gave). Work in this order: (1) inventory manifests, lockfiles, framework markers, build and deploy config, workspace files (`turbo.json`, `pnpm-workspace.yaml`, `nx.json`) and top-level code folders, and classify the repo (app, library, monorepo, service); (2) find entry points: startup files, routers, handlers, CLI commands, workers, package exports; (3) trace at least one real path end to end: input, validation, orchestration, business logic, persistence, output, noting async jobs, queues, cron and client state; (4) map boundaries: packages, shared utilities, duplicated responsibilities, public interfaces vs internals.

Facts only: never say a module owns behavior without pointing to the file that implements or routes it; quote function, route, command and config names exactly; no inference, no speculation, no code review, no refactor or improvement advice, no next steps. If the answer is partial, list which files were inspected and which were not. Read-only: change nothing in the repo.

Write the full report as readable Markdown: `#`/`##` headings per section, a blank line between every block, short bullets (under about 15 words), tables for file lists, and fenced code blocks for commands and flows (one step per line). It must read well in a Markdown preview (in VS Code: Ctrl+Shift+V). Save it to `~/.claude/onboarding/<repo-folder-name>.md`, creating the folder if needed. It is outside the repo so git stays clean, and it is the only file you may write. In the chat, reply only with that path and the 1-line summary. Path rule: expand `~` to the real home folder and give the full absolute path. Print it on its own line as a bare URL like file:///C:/Users/NAME/.claude/onboarding/FILE.md (forward slashes, no backticks, no brackets) so the terminal makes it clickable, then the same path as plain text on the next line. Do not add notes about what you read, skipped or did not run.

Follow the agent's own three-level Output Format ("Codebase Orientation Map": 1-Line Summary, 5-Minute Explanation, Deep Dive with Top-Level Structure and Key Boundaries) exactly, and keep its "if you only read three files first, read these" line in the 5-minute part. Inside the Deep Dive, also add these facts from manifests and config (still code facts, not product features):

- **Tech stack** table (Part | Tool): language/runtime, framework, database/storage, key libraries, from the manifest.
- **How to run**: install and run commands in a code block (from scripts), env vars table (Name | Default | What it does) from `.env.example` or config.
- **Public interfaces**: routes, CLI commands, jobs or package exports, each with its file.
- **Data model**: tables or main types with key fields, from the schema files.
- **Things that look important but aren't / misleading names**: only when visible in the code, as facts.

Rules: say in one line which agent you launched; show proof (commands run, file:line), not a bare "done"; read AGENTS.md first and pass the relevant rules to the agent; never commit, push, reset or delete unless asked. End with `git diff --stat` (should be empty), real check results and "Not verified" items.
