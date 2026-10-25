# -*- coding: utf-8 -*-
"""
Assemble Chapter 14: 2022 AHA/ACC/HFSA Heart Failure Guideline (EN and RU)
"""

import os

def assemble():
    out_dir = 'books/guidelines/guide/chapters/chapter-14'
    os.makedirs(out_dir, exist_ok=True)
    
    # 1. Assemble EN
    blocks_en = []
    for b in range(1, 5):
        with open(f'scratch/hf_block{b}_en.txt', 'r', encoding='utf-8') as f:
            blocks_en.append(f.read().strip())
            
    header_en = "# 2022 AHA/ACC/HFSA Guideline for the Management of Heart Failure\n\n"
    full_en = header_en + '\n\n'.join(blocks_en) + '\n'
    
    path_en = os.path.join(out_dir, 'chapter-14.md')
    with open(path_en, 'w', encoding='utf-8') as f:
        f.write(full_en)
    print(f"Wrote EN: {path_en} ({len(full_en):,} characters)")
    
    # 2. Assemble RU
    blocks_ru = []
    for b in range(1, 5):
        with open(f'scratch/hf_block{b}_ru.txt', 'r', encoding='utf-8') as f:
            blocks_ru.append(f.read().strip())
            
    header_ru = "# Клинические рекомендации AHA/ACC/HFSA 2022 года по ведению сердечной недостаточности\n\n"
    full_ru = header_ru + '\n\n'.join(blocks_ru) + '\n'
    
    path_ru = os.path.join(out_dir, 'chapter-14-ru.md')
    with open(path_ru, 'w', encoding='utf-8') as f:
        f.write(full_ru)
    print(f"Wrote RU: {path_ru} ({len(full_ru):,} characters)")

if __name__ == '__main__':
    assemble()
