# -*- coding: utf-8 -*-
"""
Final Assembler and Auditor for Chapter 10 (Cardio-oncology)
Combines Blocks 1-3 with Block 4 for both EN and RU,
then runs full validation (details tags, stack depth, emojis, citation numbers).
"""

import re
import sys

def assemble_file(main_path, block4_path):
    with open(main_path, 'r', encoding='utf-8') as f:
        main_text = f.read()
    with open(block4_path, 'r', encoding='utf-8') as f:
        b4_text = f.read()

    # Find the last </div></details> in main_text and strip it so Section 6 stays open
    # Check that main_text ends with </div></details>
    stripped_main = main_text.rstrip()
    if stripped_main.endswith('</div></details>'):
        last_idx = stripped_main.rfind('</div></details>')
        base_text = stripped_main[:last_idx].rstrip()
    else:
        raise ValueError(f"{main_path} does not end with </div></details>")

    full_text = base_text + "\n\n" + b4_text.strip() + "\n"

    with open(main_path, 'w', encoding='utf-8') as f:
        f.write(full_text)

    return full_text

# 1. Assemble EN
full_en = assemble_file(
    'books/guidelines/guide/chapters/chapter-10/chapter-10.md',
    'scratch/block4_en_text.md'
)
print("Assembled Chapter 10 EN!")

# 2. Assemble RU
full_ru = assemble_file(
    'books/guidelines/guide/chapters/chapter-10/chapter-10-ru.md',
    'scratch/block4_ru_text.md'
)
print("Assembled Chapter 10 RU!")

# 3. Comprehensive Audit Function
def audit(text, name):
    print(f"\n==================== AUDIT: {name} ====================")
    lines = text.splitlines()
    print(f"Total lines: {len(lines)}, Total characters: {len(text)}")

    # Check tags
    open_count = text.count('<details')
    close_count = text.count('</details>')
    print(f"<details> tags: {open_count}, </details> tags: {close_count}, diff: {open_count - close_count}")

    # Stack trace verification
    stack = 0
    max_depth = 0
    errors = []
    for line_idx, line in enumerate(lines, 1):
        # count occurrences in line
        o = line.count('<details')
        c = line.count('</details>')
        stack += o
        if stack > max_depth:
            max_depth = stack
        stack -= c
        if stack < 0:
            errors.append(f"Line {line_idx}: Stack fell below 0 (stack={stack})")

    if stack != 0:
        errors.append(f"End of file: Unclosed details tags! Remaining stack: {stack}")

    print(f"Max stack depth: {max_depth}, Final stack: {stack}")
    if errors:
        for err in errors[:10]:
            print("  ERROR:", err)
    else:
        print("  Tag stack audit: PERFECT (0 errors)!")

    # Check for emojis
    # Emoji regex pattern
    emoji_pattern = re.compile(
        r'[\U00010000-\U0010ffff]'
        r'|[\u2600-\u27bf]'
        r'|[\u2300-\u23ff]'
        r'|[\u2b50-\u2b55]'
        r'|[\u203c\u2049\u2139\u2194-\u21aa\u2934\u2935\u25aa\u25ab\u25b6\u25c0\u25fb-\u25fe]'
    )
    emojis_found = emoji_pattern.findall(text)
    print(f"Emojis found: {len(emojis_found)}")
    if emojis_found:
        print("  Found emoji characters:", emojis_found[:10])

    # Check citations e.g. [1], [1-4], [12, 14]
    citations = re.findall(r'\[\d+(?:[\u2013\u2014\-–]\d+)?(?:,\s*\d+)*\]', text)
    print(f"Citations found: {len(citations)}")
    if citations:
        print("  Sample citations:", citations[:10])

    # Check figure anchors and table anchors
    fig_anchors = re.findall(r'<span id="fig-(\d+)"></span>', text)
    print(f"Figure anchors found: {len(fig_anchors)} (expected 48, min {min(map(int, fig_anchors)) if fig_anchors else 0}, max {max(map(int, fig_anchors)) if fig_anchors else 0})")

    rec_anchors = re.findall(r'<span id="table-rec-(\d+)"></span>', text)
    print(f"Rec table anchors found: {len(rec_anchors)} (expected 50, min {min(map(int, rec_anchors)) if rec_anchors else 0}, max {max(map(int, rec_anchors)) if rec_anchors else 0})")

audit(full_en, "Chapter 10 EN")
audit(full_ru, "Chapter 10 RU")
