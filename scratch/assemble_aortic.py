# -*- coding: utf-8 -*-
"""
Assemble Chapter 15 (English & Russian)
2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease
Concatenates Blocks 1 to 4 and performs rigorous audits
"""

import os, re

OUT_DIR = 'books/guidelines/guide/chapters/chapter-15'
os.makedirs(OUT_DIR, exist_ok=True)

def assemble():
    # Read English blocks
    with open('scratch/aortic_block1_en.txt', 'r', encoding='utf-8') as f:
        b1_en = f.read().strip()
    with open('scratch/aortic_block2_en.txt', 'r', encoding='utf-8') as f:
        b2_en = f.read().strip()
    with open('scratch/aortic_block3_en.txt', 'r', encoding='utf-8') as f:
        b3_en = f.read().strip()
    with open('scratch/aortic_block4_en.txt', 'r', encoding='utf-8') as f:
        b4_en = f.read().strip()

    full_en = f"{b1_en}\n\n{b2_en}\n\n{b3_en}\n\n{b4_en}\n"
    en_path = os.path.join(OUT_DIR, 'chapter-15.md')
    with open(en_path, 'w', encoding='utf-8') as f:
        f.write(full_en)
    print(f"Wrote English chapter: {en_path} ({len(full_en):,} characters)")

    # Read Russian blocks
    with open('scratch/aortic_block1_ru.txt', 'r', encoding='utf-8') as f:
        b1_ru = f.read().strip()
    with open('scratch/aortic_block2_ru.txt', 'r', encoding='utf-8') as f:
        b2_ru = f.read().strip()
    with open('scratch/aortic_block3_ru.txt', 'r', encoding='utf-8') as f:
        b3_ru = f.read().strip()
    with open('scratch/aortic_block4_ru.txt', 'r', encoding='utf-8') as f:
        b4_ru = f.read().strip()

    full_ru = f"{b1_ru}\n\n{b2_ru}\n\n{b3_ru}\n\n{b4_ru}\n"
    ru_path = os.path.join(OUT_DIR, 'chapter-15-ru.md')
    with open(ru_path, 'w', encoding='utf-8') as f:
        f.write(full_ru)
    print(f"Wrote Russian chapter: {ru_path} ({len(full_ru):,} characters)")

    audit(en_path, 'EN')
    audit(ru_path, 'RU')

def audit(file_path, lang):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    print(f"\n=== AUDIT REPORT FOR {lang} ({file_path}) ===")
    
    # 1. HTML tag balance
    open_details = len(re.findall(r'<details\b', content))
    close_details = len(re.findall(r'</details>', content))
    open_div = len(re.findall(r'<div\b', content))
    close_div = len(re.findall(r'</div>', content))
    print(f"Details tags: {open_details} open, {close_details} close -> {'BALANCED' if open_details == close_details else 'MISMATCH!'}")
    print(f"Div tags:     {open_div} open, {close_div} close -> {'BALANCED' if open_div == close_div else 'MISMATCH!'}")

    # 2. Check for emojis
    emoji_pattern = re.compile(r'[\U00010000-\U0010ffff]', flags=re.UNICODE)
    emojis = emoji_pattern.findall(content)
    print(f"Emoji count:  {len(emojis)} -> {'CLEAN (0 emojis)' if len(emojis) == 0 else f'WARNING: found {len(emojis)}'}")

    # 3. Check for References / Bibliography section
    has_refs = bool(re.search(r'##\s*(?:References|Bibliography|Список литературы)', content, re.IGNORECASE))
    print(f"References section: {'ABSENT (Correct)' if not has_refs else 'WARNING: Found References section!'}")

    # 4. Check figures (28 figures)
    fig_matches = re.findall(r'fig(\d+)', content)
    unique_figs = sorted(list(set(int(x) for x in fig_matches)))
    print(f"Figures referenced: {len(unique_figs)} of 28 (List: {unique_figs})")

    # 5. Check Recommendation Tables
    if lang == 'EN':
        rt_matches = re.findall(r'Recommendation Table (\d+)', content)
    else:
        rt_matches = re.findall(r'Таблица рекомендаций (\d+)', content)
    unique_rts = sorted(list(set(int(x) for x in rt_matches)))
    print(f"Recommendation Tables referenced: {len(unique_rts)} (Min: {min(unique_rts) if unique_rts else 0}, Max: {max(unique_rts) if unique_rts else 0})")

    # 6. Check Clinical Tables
    if lang == 'EN':
        t_matches = re.findall(r'Table (\d+):', content)
    else:
        t_matches = re.findall(r'Таблица (\d+):', content)
    unique_ts = sorted(list(set(int(x) for x in t_matches)))
    print(f"Clinical Tables referenced: {len(unique_ts)} (Min: {min(unique_ts) if unique_ts else 0}, Max: {max(unique_ts) if unique_ts else 0})")

    print(f"Total length: {len(content):,} characters, {len(content.split()):,} words.")

if __name__ == '__main__':
    assemble()
