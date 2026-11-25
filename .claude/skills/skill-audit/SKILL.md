---
name: skill-audit
description: "Use only when adding or installing a NEW agent skill (from a GitHub URL, a zip, or a folder), or when the user explicitly asks to audit, scan, or review installed or proposed skills with SkillSpector. Gives a risk score, key findings, and a go/no-go before install. Skip it for everyday coding, bug fixes, refactors, and any task that is not about installing or auditing skills."
argument-hint: "<github-url | zip | folder | existing skills>"
---

# Skill audit (SkillSpector)

Security-scan an agent skill with [SkillSpector](https://github.com/NVIDIA/SkillSpector) **before it is installed**, or audit skills already on disk when the user asks. Invoke as `/skill-audit`.

Default is **static analysis only** (`--no-llm`). No API key is required. Do not copy, install, or enable a new skill until you have reported the score and a go/no-go, and the user has accepted any risk.

## Locate the CLI

Resolve in this order; then run it (or `scripts/run_audit.py`, which does the same lookup):

1. Env var `SKILLSPECTOR` — path to the executable, the `skillspector.cmd` wrapper, or an install directory that contains one of them (also accept `.venv/Scripts/skillspector.exe` or `.venv/bin/skillspector`).
2. `skillspector` on `PATH`.
3. Windows fallback on this machine: `D:\tools\SkillSpector\skillspector.cmd`.

If none exist, **stop**. Tell the user how to install it (below). Do not install it yourself unless they ask.

## Scan a new skill

The target may be a GitHub URL, a zip, or a local folder. Prefer the folder that contains `SKILL.md`. If you only have a repo URL, scan the URL, then say clearly when findings are in benchmarks, tests, or docs rather than the skill itself. If the path is a collection of skills (no `SKILL.md` at the root), add `--recursive`.

On Windows, `--output` is rejected. Always redirect stdout to a **new** file **outside** the scan target. Keep temp/report files on `D:` when you can (for example `D:\tools\tmp`).

```powershell
& $cli scan $target --no-llm --format json 1> $outJson 2> $errLog
```

Unix may accept `--output`, but redirecting stdout works everywhere. You can also run:

```powershell
python ~/.claude/skills/skill-audit/scripts/run_audit.py $target
# or, in this repo:
python .claude/skills/skill-audit/scripts/run_audit.py $target --recursive
```

## Audit installed skills (only when asked)

Scan both trees when they exist, with `--recursive --max-skills 100`:

- Global: `%USERPROFILE%\.claude\skills` (or `~/.claude/skills`)
- This project: `.claude/skills`

Summarize each skill that has findings. List clean skills in one short line each.

## Report

For each scan, include:

- Target (URL or path)
- Risk score (0-100), severity, and recommendation (`SAFE`, `REVIEW`, `DO_NOT_INSTALL`, or whatever the report says)
- Coverage: if analysis is not complete, say so
- Key findings, grouped by severity and rule ID, with file and a one-line why. Down-rank obvious test/benchmark/doc false positives, but still mention HIGH/CRITICAL ones
- **Go / no-go**:
  - `SAFE` and no HIGH/CRITICAL in the skill's own files (the `SKILL.md`, scripts, and hooks that get installed) → go
  - HIGH/CRITICAL or `DO_NOT_INSTALL` in those files → no-go unless the user explicitly accepts the risk after you explain it
  - Findings only in tests, benchmarks, or docs of a full-repo scan → say so; re-scan just the skill folder before deciding

### Windows path typography

The chat renders Markdown, so a bare backslash path gets mangled (`\.` loses its backslash). On its own line print a Markdown link whose text is the file name and whose target is the file URL with forward slashes, exactly like [SKILL.md](file:///C:/Users/NAME/.claude/skills/skill-audit/SKILL.md). On the next line print the Windows path inside backticks, exactly like `C:\Users\NAME\.claude\skills\skill-audit\SKILL.md`. Never print a backslash path outside backticks.

## Optional LLM mode

Use `--no-llm` unless the user asks for semantic analysis. To enable LLM mode they must set a provider and its key, then omit `--no-llm` (or pass `--llm` to the helper):

```powershell
$env:SKILLSPECTOR_PROVIDER = "anthropic"   # or openai, ollama, gemini, ...
$env:ANTHROPIC_API_KEY = "..."             # credential that matches the provider
& $cli scan $target --format json
```

Do not invent, guess, or go looking for API keys.

## If SkillSpector is missing

Needs **Python 3.12 or 3.13** (YARA wheels). On this user's Windows PC, put the clone, the venv, and pip/uv caches on **D:** — never install onto C:.

```powershell
git clone --depth 1 https://github.com/NVIDIA/SkillSpector.git D:\tools\SkillSpector
# Prefer a Python already on D:, e.g. D:\Python312\python.exe
& $python -m venv D:\tools\SkillSpector\.venv
$env:UV_CACHE_DIR = "D:\tools\uv-cache"
$env:PIP_CACHE_DIR = "D:\tools\pip-cache"
uv pip install --python D:\tools\SkillSpector\.venv\Scripts\python.exe -e D:\tools\SkillSpector
# Wrapper D:\tools\SkillSpector\skillspector.cmd should call .venv\Scripts\skillspector.exe
```

On other machines, clone into any dedicated directory, create a venv with Python 3.12 or 3.13, install the package, and set `SKILLSPECTOR` to the wrapper or executable. Verify with `skillspector --version`.
