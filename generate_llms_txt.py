#!/usr/bin/env python3
"""
Generate llms.txt from docs.json for developer.eka.care.

llms.txt is a machine-readable index of all documentation pages, designed
for LLMs and AI agents to discover and navigate developer documentation.
See: https://llmstxt.org

Usage:
    python generate_llms_txt.py

Output:
    llms.txt — page index in standard llms.txt format
"""

import json
import re
from pathlib import Path

DOCS_ROOT = Path(__file__).parent
BASE_URL = "https://developer.eka.care"
OUTPUT_FILE = DOCS_ROOT / "llms.txt"


def parse_frontmatter(content: str) -> dict:
    """Extract YAML frontmatter key/value pairs from MDX content."""
    if not content.startswith("---"):
        return {}
    end = content.find("---", 3)
    if end == -1:
        return {}
    result = {}
    for line in content[3:end].splitlines():
        if ":" in line:
            key, _, value = line.partition(":")
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            if key and value:
                result[key] = value
    return result


def get_page_meta(page_path: str) -> tuple[str, str]:
    """Return (title, description) for a doc page path."""
    for ext in [".mdx", ".md"]:
        fp = DOCS_ROOT / (page_path + ext)
        if fp.exists():
            fm = parse_frontmatter(fp.read_text(encoding="utf-8"))
            title = _clean_text(fm.get("title") or _title_from_path(page_path))
            description = _clean_text(fm.get("description", ""))
            return title, description
    return _title_from_path(page_path), ""


def _title_from_path(page_path: str) -> str:
    return page_path.rstrip("/").split("/")[-1].replace("-", " ").title()


def _clean_text(text: str) -> str:
    """Strip HTML tags and collapse whitespace from a string."""
    text = re.sub(r"<[^>]+>", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def collect_pages(nav_item, tab_section: str) -> list[tuple[str, str]]:
    """
    Recursively walk a docs.json navigation item and collect (section, page_path) pairs.

    The tab name is used as the section label in llms.txt — keeping the output
    readable without excessive nesting.
    """
    results = []

    if isinstance(nav_item, str):
        # Leaf: a page path
        results.append((tab_section, nav_item))

    elif isinstance(nav_item, list):
        for item in nav_item:
            results.extend(collect_pages(item, tab_section))

    elif isinstance(nav_item, dict):
        if "anchor" in nav_item:
            # Top-level anchor — descend into its tabs
            for tab in nav_item.get("tabs", []):
                results.extend(collect_pages(tab, tab_section))

        elif "tab" in nav_item:
            # Tab — use tab name as the section label
            tab_name = nav_item["tab"]
            for group in nav_item.get("groups", []):
                results.extend(collect_pages(group, tab_name))

        elif "group" in nav_item:
            # Group or nested group — preserve current tab section
            for page in nav_item.get("pages", []):
                results.extend(collect_pages(page, tab_section))

    return results


def generate(docs: dict) -> str:
    name = docs.get("name", "Eka Developer Platform APIs")

    lines = [
        f"# {name}",
        "",
        "> Eka Care developer platform: APIs, SDKs, and integration guides for building"
        " healthcare applications on India's leading health network.",
        "",
    ]

    # Collect all pages from the navigation tree
    navigation = docs.get("navigation", {})
    raw_pages: list[tuple[str, str]] = []

    for anchor in navigation.get("anchors", []):
        raw_pages.extend(collect_pages(anchor, ""))

    # Handle flat tabs/groups at the navigation root (if any)
    for key in ("tabs", "groups"):
        for item in navigation.get(key, []):
            raw_pages.extend(collect_pages(item, ""))

    # Deduplicate while preserving insertion order, group by section
    seen: set[str] = set()
    sections: dict[str, list[str]] = {}
    section_order: list[str] = []

    for section, page_path in raw_pages:
        if page_path in seen:
            continue
        seen.add(page_path)
        if section not in sections:
            sections[section] = []
            section_order.append(section)
        sections[section].append(page_path)

    # Write each section
    for section in section_order:
        lines.append(f"## {section}")
        lines.append("")
        for page_path in sections[section]:
            title, description = get_page_meta(page_path)
            url = f"{BASE_URL}/{page_path}"
            entry = f"- [{title}]({url})"
            if description:
                entry += f": {description}"
            lines.append(entry)
        lines.append("")

    return "\n".join(lines)


def main():
    docs_json = DOCS_ROOT / "docs.json"
    if not docs_json.exists():
        print("Error: docs.json not found. Run from the eka-docs root directory.")
        raise SystemExit(1)

    with open(docs_json, encoding="utf-8") as f:
        docs = json.load(f)

    output = generate(docs)
    OUTPUT_FILE.write_text(output, encoding="utf-8")

    page_count = output.count("\n- [")
    section_count = output.count("\n## ")
    print(f"Generated {OUTPUT_FILE.name}")
    print(f"  {section_count} sections, {page_count} pages")


if __name__ == "__main__":
    main()
