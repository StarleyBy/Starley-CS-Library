# -*- coding: utf-8 -*-
"""
Audit Chapter 12 EN and RU
"""

import re, sys

def audit_file(filepath, lang):
    print(f"\n================ AUDITING {lang.upper()}: {filepath} ================")
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()

    errors = []
    
    # 1. HTML details balance
    open_details = len(re.findall(r'<details\b', text, re.I))
    close_details = len(re.findall(r'</details>', text, re.I))
    print(f"Details tags: {open_details} open, {close_details} close")
    if open_details != close_details:
        errors.append(f"Mismatched details tags: {open_details} vs {close_details}")

    # 2. HTML div content balance
    open_divs = len(re.findall(r'<div class="details-content">', text, re.I))
    close_divs = len(re.findall(r'</div>', text, re.I))
    print(f"Div content tags: {open_divs} open, {close_divs} close")
    if open_divs != close_divs:
        errors.append(f"Mismatched div tags: {open_divs} vs {close_divs}")

    # 3. Emoji check
    # common emoji ranges
    emojis = re.findall(r'[\U00010000-\U0010ffff]', text)
    print(f"Emoji count: {len(emojis)}")
    if emojis:
        errors.append(f"Found {len(emojis)} emojis: {set(emojis)}")

    # 4. Figures check (11 figures)
    for fig_num in range(1, 12):
        pattern = rf'fig{fig_num:02d}_'
        found = re.search(pattern, text)
        if not found:
            errors.append(f"Missing Figure {fig_num} (fig{fig_num:02d}_)")
    print("Figures 1-11 check completed.")

    # 5. Recommendation Tables check (37 RTs)
    for rt_num in range(1, 38):
        if lang == 'en':
            pat = rf'Recommendation Table {rt_num}\b'
        else:
            pat = rf'Таблица рекомендаций {rt_num}\b'
        if not re.search(pat, text):
            errors.append(f"Missing Recommendation Table {rt_num}")
    print(f"Recommendation Tables 1-37 check completed.")

    # 6. Clinical Tables check (Table 1 to 22)
    for t_num in range(1, 23):
        if lang == 'en':
            pat = rf'Table {t_num}[:\s—]'
        else:
            pat = rf'Таблица {t_num}[:\s—]'
        if not re.search(pat, text):
            errors.append(f"Missing Clinical Table {t_num}")
    print("Clinical Tables 1-22 check completed.")

    # 7. Check references section
    if re.search(r'\n## References\b', text, re.I) or re.search(r'\n## Список литературы\b', text, re.I):
        errors.append("Found forbidden References / Bibliography section")

    print(f"File length: {len(text):,} characters, {len(text.splitlines()):,} lines")
    if errors:
        print(f"AUDIT FAILED with {len(errors)} errors:")
        for e in errors:
            print("  -", e)
        return False
    else:
        print("AUDIT PASSED! All structural and content checks succeeded.")
        return True

if __name__ == '__main__':
    ok_en = audit_file('books/guidelines/guide/chapters/chapter-12/chapter-12.md', 'en')
    ok_ru = audit_file('books/guidelines/guide/chapters/chapter-12/chapter-12-ru.md', 'ru')
    if not (ok_en and ok_ru):
        sys.exit(1)
