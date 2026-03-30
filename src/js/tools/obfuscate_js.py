#!/usr/bin/env python3
"""Generate a simple obfuscated JS bundle from a source file.

Usage:
  python3 tools/obfuscate_js.py src/js/photgrapjy.js src/js/photgrapjy.obf.js
"""

from __future__ import annotations

import base64
import pathlib
import sys


def build_obfuscated_payload(source_code: str) -> str:
    encoded = base64.b64encode(source_code.encode("utf-8")).decode("ascii")
    return (
        "(function(){"
        "const _p='" + encoded + "';"
        "const _d=atob(_p);"
        "Function(_d)();"
        "})();\n"
    )


def main() -> int:
    if len(sys.argv) != 3:
        print("Usage: python3 tools/obfuscate_js.py <source.js> <output.js>")
        return 1

    source_path = pathlib.Path(sys.argv[1])
    output_path = pathlib.Path(sys.argv[2])

    if not source_path.exists():
        print(f"Source not found: {source_path}")
        return 1

    source_code = source_path.read_text(encoding="utf-8")
    obfuscated = build_obfuscated_payload(source_code)
    output_path.write_text(obfuscated, encoding="utf-8")
    print(f"Generated obfuscated file: {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
