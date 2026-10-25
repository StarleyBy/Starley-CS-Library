# -*- coding: utf-8 -*-
"""
Assemble Chapter 12: 2025 ACC/AHA ACS Guideline (EN and RU)
"""

import os, re

def assemble():
    # 1. Assemble EN
    blocks_en = []
    for b in range(1, 5):
        with open(f'scratch/acs_block{b}_en.txt', 'r', encoding='utf-8') as f:
            blocks_en.append(f.read().strip())
            
    header_en = "# 2025 ACC/AHA/ACEP/NAEMSP/SCAI Guideline for the Management of Patients With Acute Coronary Syndromes\n\n"
    full_en = header_en + '\n\n'.join(blocks_en) + '\n'
    
    out_dir = 'books/guidelines/guide/chapters/chapter-12'
    os.makedirs(out_dir, exist_ok=True)
    
    path_en = os.path.join(out_dir, 'chapter-12.md')
    with open(path_en, 'w', encoding='utf-8') as f:
        f.write(full_en)
    print(f"Wrote EN: {path_en} ({len(full_en):,} characters)")
    
    # 2. Assemble RU
    blocks_ru = []
    for b in range(1, 5):
        with open(f'scratch/acs_block{b}_ru.txt', 'r', encoding='utf-8') as f:
            blocks_ru.append(f.read().strip())
            
    header_ru = "# Клинические рекомендации ACC/AHA/ACEP/NAEMSP/SCAI 2025 года по ведению пациентов с острым коронарным синдромом\n\n"
    full_ru = header_ru + '\n\n'.join(blocks_ru) + '\n'
    
    path_ru = os.path.join(out_dir, 'chapter-12-ru.md')
    with open(path_ru, 'w', encoding='utf-8') as f:
        f.write(full_ru)
    print(f"Wrote RU: {path_ru} ({len(full_ru):,} characters)")

if __name__ == '__main__':
    assemble()
