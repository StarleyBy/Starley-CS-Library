# -*- coding: utf-8 -*-
import fitz, os, sys
from PIL import Image
sys.stdout.reconfigure(encoding='utf-8')

doc = fitz.open('scratch/next_guideline.pdf')

# Inspect pages 17 (Fig 2), 18 (Fig 3), 28 (Fig 7), 29 (Fig 8), 40 (Fig 10), 61 (Fig 19)
figs_to_check = [
    (2, 17, "Figure 2"),
    (3, 18, "Figure 3"),
    (7, 28, "Figure 7"),
    (8, 29, "Figure 8"),
    (10, 40, "Figure 10"),
    (19, 61, "Figure 19"),
]

for fnum, pno, cap_prefix in figs_to_check:
    page = doc[pno - 1]
    blocks = page.get_text("blocks")
    
    # Body text blocks at top
    top_blocks = [b for b in blocks if b[1] >= 40 and b[1] < 400 and b[0] < 560 and not 'Downloaded from' in b[4] and not cap_prefix in b[4]]
    # Filter only those that look like article body text (width around 240-260, text > 50 chars)
    body_top = [b for b in top_blocks if len(b[4].strip()) > 50 and (b[2] - b[0] > 180)]
    
    cap_blocks = [b for b in blocks if cap_prefix in b[4]]
    
    max_body_y = max(b[3] for b in body_top) if body_top else None
    cap_y0 = cap_blocks[0][1] if cap_blocks else None
    cap_y1 = cap_blocks[0][3] if cap_blocks else None
    
    print(f"=== Fig {fnum:02d} (p.{pno}) ===")
    print(f"  Body text above ends at: y = {max_body_y:.1f}" if max_body_y else "  No body text above")
    print(f"  Caption starts at: y = {cap_y0:.1f}, ends at: y = {cap_y1:.1f}" if cap_y0 else "  No caption")
    
    # Let's inspect where drawings / images actually exist between max_body_y and cap_y0
    drawings = page.get_drawings()
    in_range_draws = [d['rect'] for d in drawings if (max_body_y is None or d['rect'].y1 > max_body_y) and (cap_y0 is None or d['rect'].y0 < cap_y0 + 10)]
    if in_range_draws:
        d_min_y = min(r.y0 for r in in_range_draws)
        d_max_y = max(r.y1 for r in in_range_draws)
        d_min_x = min(r.x0 for r in in_range_draws)
        d_max_x = max(r.x1 for r in in_range_draws)
        print(f"  Drawings in range: y=({d_min_y:.1f}, {d_max_y:.1f}), x=({d_min_x:.1f}, {d_max_x:.1f})")
