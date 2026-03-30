#!/usr/bin/env python3
"""
Simple thumbnail generator.

Usage examples:
  python thumbnail_generator.py image.jpg
  python thumbnail_generator.py ./images --output ./thumbs --size 320x240
"""

from __future__ import annotations

import argparse
from pathlib import Path
from typing import Iterable, Tuple

from PIL import Image, UnidentifiedImageError


SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tiff", ".gif"}


def parse_size(value: str) -> Tuple[int, int]:
    """Parse SIZE string like '300x300' into width/height."""
    if "x" not in value.lower():
        raise argparse.ArgumentTypeError("Size must be in WIDTHxHEIGHT format, e.g. 300x300")

    width_text, height_text = value.lower().split("x", 1)
    try:
        width = int(width_text)
        height = int(height_text)
    except ValueError as exc:
        raise argparse.ArgumentTypeError("Width and height must be integers") from exc

    if width <= 0 or height <= 0:
        raise argparse.ArgumentTypeError("Width and height must be greater than 0")

    return width, height


def iter_image_files(path: Path, recursive: bool) -> Iterable[Path]:
    """Yield image files from a file or directory path."""
    if path.is_file():
        if path.suffix.lower() in SUPPORTED_EXTENSIONS:
            yield path
        return

    if not path.is_dir():
        return

    pattern = "**/*" if recursive else "*"
    for item in path.glob(pattern):
        if item.is_file() and item.suffix.lower() in SUPPORTED_EXTENSIONS:
            yield item


def make_thumbnail(
    source_path: Path,
    output_path: Path,
    size: Tuple[int, int],
    quality: int,
) -> None:
    """Create and save one thumbnail from source_path to output_path."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(source_path) as img:
        img.thumbnail(size, Image.Resampling.LANCZOS)

        save_kwargs = {}
        if output_path.suffix.lower() in {".jpg", ".jpeg", ".webp"}:
            save_kwargs["quality"] = quality
            # Better web compatibility for JPEG output.
            if output_path.suffix.lower() in {".jpg", ".jpeg"} and img.mode in {"RGBA", "P"}:
                img = img.convert("RGB")

        img.save(output_path, **save_kwargs)


def build_output_path(
    source: Path,
    input_root: Path,
    output_root: Path,
    output_format: str | None,
) -> Path:
    """Map source image path to output thumbnail path."""
    rel = source.name if input_root.is_file() else source.relative_to(input_root)
    output_path = output_root / rel
    if output_format:
        output_path = output_path.with_suffix(f".{output_format.lower()}")
    return output_path


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate thumbnails from image files.")
    parser.add_argument(
        "input",
        type=Path,
        help="Input image file or directory",
    )
    parser.add_argument(
        "-o",
        "--output",
        type=Path,
        default=Path("thumbnails"),
        help="Output directory (default: ./thumbnails)",
    )
    parser.add_argument(
        "-s",
        "--size",
        type=parse_size,
        default=(300, 300),
        help="Max thumbnail size in WIDTHxHEIGHT format (default: 300x300)",
    )
    parser.add_argument(
        "-q",
        "--quality",
        type=int,
        default=85,
        help="Output quality for JPEG/WEBP (1-100, default: 85)",
    )
    parser.add_argument(
        "-r",
        "--recursive",
        action="store_true",
        help="Recursively scan directories",
    )
    parser.add_argument(
        "-f",
        "--format",
        choices=["jpg", "jpeg", "png", "webp"],
        default=None,
        help="Force output format (default: keep original extension)",
    )

    args = parser.parse_args()

    if not args.input.exists():
        print(f"Error: input path does not exist: {args.input}")
        return 1

    if not (1 <= args.quality <= 100):
        print("Error: quality must be between 1 and 100")
        return 1

    files = list(iter_image_files(args.input, args.recursive))
    if not files:
        print("No supported images found.")
        return 0

    created = 0
    skipped = 0
    for src in files:
        dst = build_output_path(src, args.input, args.output, args.format)
        try:
            make_thumbnail(src, dst, args.size, args.quality)
            print(f"Created: {dst}")
            created += 1
        except (UnidentifiedImageError, OSError) as exc:
            print(f"Skipped: {src} ({exc})")
            skipped += 1

    print(f"\nDone. Created {created} thumbnail(s), skipped {skipped}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
