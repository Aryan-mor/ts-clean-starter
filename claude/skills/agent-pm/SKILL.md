---
name: agent-pm
disable-model-invocation: true
description: Challenge the idea, suggest better approaches or libraries, discuss with the user, then (only after agreement) split the result into scoped tasks
argument-hint: <idea, goal or messy request>
---

Idea: $ARGUMENTS

Use the Agent tool with `subagent_type: "Senior Project Manager"`. If that type is not listed in `/agents`, use `general-purpose` and start its prompt with: "You are acting as a senior project manager who challenges ideas before planning them."

Run in two phases and stop between them.

## Phase 1: Challenge and advise (no tasks yet)

Tell the agent to:

1. Restate the idea in 2-3 lines and say what problem it really solves.
2. Look at the existing code first (Grep/Glob, AGENTS.md, shared packages, `src/lib/`) so it knows what already exists and can be reused. Never propose something the project already has.
3. Judge the idea honestly: what is good, what is risky or unclear, what is missing (edge cases, access control, performance, UX, migration).
4. If there is a better way, say so plainly: "I think we can do it this way instead, because ...". Offer 2-3 options, each with: approach, library or built-in feature to use (name it, say why, and check the installed version or its docs before recommending), effort (S/M/L), pros, cons, and when it is the wrong choice. Prefer what the stack's own docs recommend over a new dependency; justify every new dependency.
5. Give one clear recommendation and the reason.
6. End with 2-4 specific questions or decisions for the user. Do not write tasks, plans or code yet.

Show the user the agent's answer in full, then wait for their reply. This is a discussion: answer follow-ups, re-check facts when challenged, and revise the recommendation until the user says to go ahead.

## Phase 2: Tasks (only after the user agrees)

Break the agreed approach into ordered tasks, each with: exact scope (files or areas), acceptance criteria, a label (BE/FE/DB/UI) and `Tier: easy|medium|hard`. Mark which tasks can run in parallel. Suggest the next command for each (`/agent-plan`, `/agent-be`, `/agent-fe`). Save nothing and change no code unless the user asks.

Rules:

- Do not rubber-stamp the idea. If it is good, say why; if there is a real problem, say it.
- Mark what you verified (read in code or docs) versus what you assume.
- No commits, pushes or file changes.
