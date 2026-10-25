# -*- coding: utf-8 -*-
"""
Inspect text blocks on figure pages to determine exact diagram bounding boxes
"""
import fitz, sys
sys.stdout.reconfigure(encoding='utf-8')

doc = fitz.open('scratch/next_guideline.pdf')

fig_pages = {
    1: 10,
    2: 17,
    3: 18,
    4: 23,
    5: 26,
    6: 27,
    7: 28,
    8: 29,
    9: 31,
    10: 40,
    11: 43,
    12: 45,
    13: 46,
    14: 47,
    15: 49,
    16: 53,
    17: 55,
    18: 56,
    19: 61,
    20: 63,
    21: 70,
    22: 73,
    23: 76
}

for fnum, pno in fig_pages.items():
    page = doc[pno - 1]
    blocks = page.get_text("blocks")
    caption_block = None
    other_blocks = []
    for b in blocks:
        # b is (x0, y0, x1, y1, text, block_no, block_type)
        txt = b[4].strip()
        if f"Figure {fnum}" in txt:
            caption_block = b
        else:
            other_blocks.append(b)
    
    print(f"\n--- Fig {fnum:02d} (Page {pno:02d}) ---")
    if caption_block:
        print(f"Caption: y0={caption_block[1]:.1f}, y1={caption_block[3]:.1f} | Text: {caption_block[4][:60].strip()}...")
    else:
        print("Caption block NOT found directly")
    
    # Check other text blocks
    print(f"Other blocks: {len(other_blocks)}")
    for ob in other_blocks:
        # Only print if it looks like main text (long or significant)
        if len(ob[4].strip()) > 30:
            print(f"   block y0={ob[1]:.1f}, y1={ob[3]:.1f}, x0={ob[0]:.1f}, x1={ob[2]:.1f}: {ob[4][:50].strip()}...")
