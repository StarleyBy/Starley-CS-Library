with open('scratch/block1_text.txt', 'r', encoding='utf-8') as f:
    text = f.read()

import re

for tnum in [3, 4, 5]:
    pos = text.find(f'Table {tnum}')
    print(f"\n--- TABLE {tnum} (found at {pos}) ---")
    if pos != -1:
        print(text[pos:pos+1500])
