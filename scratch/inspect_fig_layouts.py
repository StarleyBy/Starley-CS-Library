# -*- coding: utf-8 -*-
"""
Inspect layout and extract bounding boxes for Figures 1 to 23
"""
import fitz

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
    rect = page.rect
    # Search for caption "Figure {fnum}"
    cap_rects = page.search_for(f"Figure {fnum}")
    print(f"Fig {fnum:02d} on Page {pno:02d}: Page size {rect.width:.1f} x {rect.height:.1f}, Caption rects: {[list(r) for r in cap_rects]}")
