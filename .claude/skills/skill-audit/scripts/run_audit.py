#!/usr/bin/env python3
"""Locate SkillSpector and run a skill scan. Static analysis (--no-llm) is the default."""

from __future__ import annotations

import argparse
import os
import shutil
import subprocess
import sys
from pathlib import Path

WINDOWS_FALLBACKS = (
    Path(r"D:\tools\SkillSpector\skillspector.cmd"),
    Path(r"D:\tools\SkillSpector\.venv\Scripts\skillspector.exe"),
)

INSTALL_HINT = """\
SkillSpector was not found. Install it, then set SKILLSPECTOR to the executable
or wrapper (or add it to PATH).

Needs Python 3.12 or 3.13.

On this user's Windows PC, keep the clone, the venv, and pip/uv caches on D:
(never install onto C:):

  git clone --depth 1 https://github.com/NVIDIA/SkillSpector.git D:\\tools\\SkillSpector
  D:\\Python312\\python.exe -m venv D:\\tools\\SkillSpector\\.venv
  set UV_CACHE_DIR=D:\\tools\\uv-cache
  set PIP_CACHE_DIR=D:\\tools\\pip-cache
  uv pip install --python D:\\tools\\SkillSpector\\.venv\\Scripts\\python.exe -e D:\\tools\\SkillSpector

Create D:\\tools\\SkillSpector\\skillspector.cmd so it calls
.venv\\Scripts\\skillspector.exe, or set SKILLSPECTOR to that exe.

On other machines, clone into any dedicated directory, create a venv with
Python 3.12 or 3.13, install the package, and set SKILLSPECTOR to the
wrapper or executable.
"""


def candidates_from(path: Path) -> list[Path]:
    path = path.expanduser()
    if path.is_file():
        return [path]
    if not path.is_dir():
        return []
    options = [
        path / "skillspector.cmd",
        path / "skillspector.exe",
        path / "skillspector",
        path / ".venv" / "Scripts" / "skillspector.exe",
        path / ".venv" / "Scripts" / "skillspector.cmd",
        path / ".venv" / "bin" / "skillspector",
    ]
    return [p for p in options if p.is_file()]


def resolve_cli() -> Path | None:
    env = os.environ.get("SKILLSPECTOR", "").strip()
    if env:
        found = candidates_from(Path(env))
        if found:
            return found[0]
    which = shutil.which("skillspector") or shutil.which("skillspector.cmd")
    if which:
        return Path(which)
    for fallback in WINDOWS_FALLBACKS:
        if fallback.is_file():
            return fallback
    return None


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Run SkillSpector against a skill URL, zip, or folder."
    )
    parser.add_argument("target", help="GitHub URL, zip, or local skill/collection path")
    parser.add_argument("--recursive", action="store_true", help="Scan immediate child skills")
    parser.add_argument("--max-skills", type=int, default=None)
    parser.add_argument(
        "--format",
        choices=("json", "markdown", "terminal", "sarif"),
        default="json",
    )
    parser.add_argument(
        "--llm",
        action="store_true",
        help="Enable optional LLM analysis (needs SKILLSPECTOR_PROVIDER and its API key)",
    )
    args, extra = parser.parse_known_args()

    cli = resolve_cli()
    if cli is None:
        sys.stderr.write(INSTALL_HINT)
        return 2

    cmd = [str(cli), "scan", args.target, "--format", args.format]
    if not args.llm:
        cmd.append("--no-llm")
    if args.recursive:
        cmd.append("--recursive")
    if args.max_skills is not None:
        cmd.extend(["--max-skills", str(args.max_skills)])
    cmd.extend(extra)

    # Do not use --output: SkillSpector rejects it on Windows.
    # Print the report to stdout; the caller may redirect it.
    return subprocess.call(cmd)


if __name__ == "__main__":
    raise SystemExit(main())
