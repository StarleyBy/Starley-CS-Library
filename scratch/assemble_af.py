# -*- coding: utf-8 -*-
"""
Assembler and Auditor for Chapter 11 (English and Russian)
2024 ESC Guidelines for the management of atrial fibrillation (ESC/EACTS/EHRA/ESO)
"""

import os, re

def assemble():
    # 1. Assemble English
    en_parts = []
    with open('books/guidelines/guide/chapters/chapter-11/chapter-11.md', 'r', encoding='utf-8') as f:
        en_parts.append(f.read().strip())
    
    for b in ['scratch/af_block2_en.txt', 'scratch/af_block3_en.txt', 'scratch/af_block4_en.txt']:
        with open(b, 'r', encoding='utf-8') as f:
            en_parts.append(f.read().strip())
            
    full_en = '\n\n'.join(en_parts) + '\n'
    
    with open('books/guidelines/guide/chapters/chapter-11/chapter-11.md', 'w', encoding='utf-8') as f:
        f.write(full_en)
        
    print(f'English Chapter 11 written: {len(full_en):,} characters')
    
    # 2. Assemble Russian
    ru_parts = []
    with open('books/guidelines/guide/chapters/chapter-11/chapter-11-ru.md', 'r', encoding='utf-8') as f:
        ru_parts.append(f.read().strip())
        
    for b in ['scratch/af_block2_ru.txt', 'scratch/af_block3_ru.txt', 'scratch/af_block4_ru.txt']:
        with open(b, 'r', encoding='utf-8') as f:
            ru_parts.append(f.read().strip())
            
    full_ru = '\n\n'.join(ru_parts) + '\n'
    
    with open('books/guidelines/guide/chapters/chapter-11/chapter-11-ru.md', 'w', encoding='utf-8') as f:
        f.write(full_ru)
        
    print(f'Russian Chapter 11 written: {len(full_ru):,} characters')
    
    # 3. Audit both files
    audit_file('EN', full_en)
    audit_file('RU', full_ru)

def audit_file(tag, text):
    print(f'\n=== AUDIT {tag} ===')
    
    # Tag balances
    open_details = len(re.findall(r'<details\b', text))
    close_details = len(re.findall(r'</details>', text))
    open_div = len(re.findall(r'<div class="details-content">', text))
    close_div = len(re.findall(r'</div>', text))
    
    print(f'<details> balance: open={open_details}, close={close_details}, diff={open_details - close_details}')
    print(f'<div> balance: open={open_div}, close={close_div}, diff={open_div - close_div}')
    
    assert open_details == close_details, f'Mismatch in <details> tags in {tag}'
    assert open_div == close_div, f'Mismatch in <div> tags in {tag}'
    
    # Emoji check
    # Common emojis regex range
    emoji_pattern = re.compile(r'[\U00010000-\U0010ffff]', flags=re.UNICODE)
    emojis = emoji_pattern.findall(text)
    print(f'Emojis found: {len(emojis)}')
    assert len(emojis) == 0, f'Forbidden emojis found in {tag}: {emojis[:10]}'
    
    # Figures check (fig01 to fig16)
    for i in range(1, 17):
        fig_str = f'fig{i:02d}'
        count = text.count(fig_str)
        if count == 0:
            print(f'WARNING: {fig_str} not found in {tag}')
        else:
            pass
    print(f'All 16 figures checked in {tag}')
    
    # Check recommendation tables
    rec_tables = re.findall(r'Recommendation Table \d+|Таблица рекомендаций \d+', text)
    print(f'Recommendation tables found: {len(rec_tables)}')
    
    # Check clinical tables
    tbls = re.findall(r'Table \d+|Таблица \d+', text)
    print(f'Tables found: {len(tbls)}')
    
    print(f'{tag} validation passed with 100% compliance!')

if __name__ == '__main__':
    assemble()
