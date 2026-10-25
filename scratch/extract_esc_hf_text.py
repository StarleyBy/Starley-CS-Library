# -*- coding: utf-8 -*-
import pypdf, sys

sys.stdout.reconfigure(encoding='utf-8')
reader = pypdf.PdfReader('scratch/next_guideline.pdf')

ranges = [
    (1, 18, 'scratch/esc_hf_p1_18.txt'),
    (19, 41, 'scratch/esc_hf_p19_41.txt'),
    (42, 58, 'scratch/esc_hf_p42_58.txt'),
    (58, 81, 'scratch/esc_hf_p58_81.txt'),
]

for start, end, out_path in ranges:
    text = ''
    for p in range(start - 1, end):
        text += f"\n--- Page {p+1} ---\n" + reader.pages[p].extract_text()
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(text)
    print(f"Saved {out_path}: {len(text):,} characters")
