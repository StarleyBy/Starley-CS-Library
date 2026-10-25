# -*- coding: utf-8 -*-
import fitz, sys
sys.stdout.reconfigure(encoding='utf-8')

doc = fitz.open(r'C:\Users\starl\.gemini\antigravity-ide\brain\5d0779b1-97a7-4c06-b7fa-fd5b15e8c424\scratch\ESC_HF_2026.pdf')

import os
sys.path.insert(0, os.path.dirname(__file__))
from extract_esc_hf_figures import FIGURES

for fnum, pno, y_cutoff, fname in FIGURES:
    page = doc[pno - 1]
    blocks = page.get_text('blocks')
    # find figure caption block
    fig_caption = None
    for b in blocks:
        if f'Figure {fnum}' in b[4] or f'Figure  {fnum}' in b[4]:
            fig_caption = b
            break
    
    # get image rects
    img_list = page.get_images(full=True)
    img_rects = []
    for img_info in img_list:
        xref = img_info[0]
        rects = page.get_image_rects(xref)
        img_rects.extend(rects)
    
    # Non-header, non-caption text blocks
    text_blocks = [b for b in blocks if b[1] > 40 and (fig_caption is None or b != fig_caption)]
    
    print(f"=== Fig {fnum:02d} (p.{pno}, y_cutoff={y_cutoff}) ===")
    if fig_caption:
        print(f"  Caption y=({fig_caption[1]:.1f}, {fig_caption[3]:.1f})")
    if img_rects:
        # bounding box of all images
        min_x = min(r.x0 for r in img_rects)
        max_x = max(r.x1 for r in img_rects)
        min_y = min(r.y0 for r in img_rects)
        max_y = max(r.y1 for r in img_rects)
        print(f"  Images bbox: x=({min_x:.1f}, {max_x:.1f}), y=({min_y:.1f}, {max_y:.1f})")
    
    # Any text above the figure or below the caption?
    above_text = [b for b in text_blocks if b[3] < (fig_caption[1] if fig_caption else 700)]
    below_text = [b for b in text_blocks if fig_caption and b[1] > fig_caption[3]]
    
    if above_text:
        max_above_y = max(b[3] for b in above_text)
        print(f"  TEXT ABOVE FIGURE: count={len(above_text)}, max_y={max_above_y:.1f}")
        for b in above_text:
            t = b[4].strip().replace('\n', ' ')[:40]
            print(f"    y=({b[1]:.1f}, {b[3]:.1f}): {t}")
    else:
        print("  NO text above figure")
        
    if below_text:
        min_below_y = min(b[1] for b in below_text)
        print(f"  TEXT BELOW CAPTION: count={len(below_text)}, min_y={min_below_y:.1f}")
