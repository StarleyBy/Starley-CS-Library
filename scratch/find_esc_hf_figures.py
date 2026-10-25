# -*- coding: utf-8 -*-
"""
Find exact pages and bounding boxes for Figures 1 to 23 in scratch/next_guideline.pdf
"""
import fitz, re

doc = fitz.open('scratch/next_guideline.pdf')

figures_info = {}

for pno in range(len(doc)):
    page = doc[pno]
    text = page.get_text("text")
    # Search for "Figure X" or "Figure X." or "Figure X "
    matches = re.finditer(r'(Figure\s+(\d+)\b[^\n]*)', text, re.IGNORECASE)
    for m in matches:
        full_line = m.group(1).strip()
        fnum = int(m.group(2))
        if fnum > 23:
            continue
        # Check if this line looks like a caption (starts with Figure X)
        # Search for rect of this text
        rects = page.search_for(f"Figure {fnum}")
        print(f"Page {pno+1:03d} (0-idx {pno:02d}): Figure {fnum:02d} -> {full_line[:80]} | Rects: {len(rects)}")
        if fnum not in figures_info:
            figures_info[fnum] = []
        figures_info[fnum].append({
            'page': pno + 1,
            'page_idx': pno,
            'line': full_line,
            'rects': [list(r) for r in rects]
        })

print('\nTotal figures detected:', len(figures_info))
