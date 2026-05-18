#!/usr/bin/env python3

from __future__ import annotations

import argparse
import json
import shutil
import sys
from pathlib import Path
from urllib.parse import quote

DEFAULT_DELIVERY_ROOT = Path("/Users/chenyanshan/Documents/vibecoding/mobile-web-view")
VALID_KINDS = ("auto", "markdown", "html")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Copy an artifact into the mobile-web-view project."
    )
    parser.add_argument("--source", required=True, help="Absolute or relative source path.")
    parser.add_argument(
        "--kind",
        default="auto",
        choices=VALID_KINDS,
        help="Publish bucket. Default is auto-detect."
    )
    parser.add_argument(
        "--name",
        help="Destination artifact name without extension. Defaults to the source stem."
    )
    parser.add_argument(
        "--delivery-root",
        default=str(DEFAULT_DELIVERY_ROOT),
        help="Override the mobile-web-view project root."
    )
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Replace an existing destination artifact."
    )
    return parser


def fail(message: str) -> None:
    print(message, file=sys.stderr)
    raise SystemExit(1)


def detect_kind(source: Path) -> str:
    if source.is_dir():
        fail("Directory sources are no longer supported. Publish a single markdown or html file.")

    suffix = source.suffix.lower()
    if suffix == ".md":
        return "markdown"
    if suffix in {".html", ".htm"}:
        return "html"

    fail("Auto-detect supports only .md or .html/.htm files.")


def normalize_name(source: Path, explicit_name: str | None) -> str:
    if explicit_name:
        return explicit_name
    return source.stem


def ensure_empty_destination(destination: Path, overwrite: bool) -> None:
    if not destination.exists():
        return
    if not overwrite:
        fail(f"Destination already exists: {destination}")

    if destination.is_dir():
        shutil.rmtree(destination)
    else:
        destination.unlink()


def publish_markdown(source: Path, delivery_root: Path, name: str, overwrite: bool) -> dict[str, str]:
    destination = delivery_root / "content" / "markdown" / f"{name}.md"
    destination.parent.mkdir(parents=True, exist_ok=True)
    ensure_empty_destination(destination, overwrite)
    shutil.copy2(source, destination)
    relative_path = destination.name
    return {
        "kind": "markdown",
        "destination": str(destination),
        "relative_path": relative_path,
        "route": f"/view/markdown?path={quote(relative_path)}"
    }


def publish_html(source: Path, delivery_root: Path, name: str, overwrite: bool) -> dict[str, str]:
    destination = delivery_root / "content" / "html" / f"{name}.html"
    destination.parent.mkdir(parents=True, exist_ok=True)
    ensure_empty_destination(destination, overwrite)
    shutil.copy2(source, destination)
    relative_path = destination.name
    return {
        "kind": "html",
        "destination": str(destination),
        "relative_path": relative_path,
        "route": f"/view/html?path={quote(relative_path)}"
    }


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()

    source = Path(args.source).expanduser().resolve()
    if not source.exists():
        fail(f"Source does not exist: {source}")

    delivery_root = Path(args.delivery_root).expanduser().resolve()
    if not delivery_root.exists():
        fail(f"Delivery root does not exist: {delivery_root}")

    kind = args.kind
    if kind == "auto":
        kind = detect_kind(source)

    name = normalize_name(source, args.name)

    if kind == "markdown":
        if source.is_dir() or source.suffix.lower() != ".md":
            fail("Markdown publishing requires a .md file.")
        result = publish_markdown(source, delivery_root, name, args.overwrite)
    elif kind == "html":
        if source.is_dir() or source.suffix.lower() not in {".html", ".htm"}:
            fail("HTML publishing requires a single .html or .htm file.")
        result = publish_html(source, delivery_root, name, args.overwrite)
    else:
        fail(f"Unsupported kind: {kind}")

    payload = {
        "source": str(source),
        **result
    }
    print(json.dumps(payload, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
