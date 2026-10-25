# -*- coding: utf-8 -*-
import sys, re

sys.stdout.reconfigure(encoding='utf-8')

with open('scratch/esc_hf_p19_41.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's search for start of each RT and print its content
for num in range(1, 8):
    pattern = rf'Recommendation Table {num} — [^\n]+'
    m = re.search(pattern, text)
    if m:
        pos = m.start()
        print(f"\n{'='*30} RT {num} {'='*30}")
        print(text[pos:pos+2500])
