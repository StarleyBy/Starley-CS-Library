import pymupdf, os

pdf_path = 'scratch/cardio_oncology.pdf'
out_dir = r'books/guidelines/guide/chapters/chapter-10'
img_dir = os.path.join(out_dir, 'images')
os.makedirs(out_dir, exist_ok=True)
os.makedirs(img_dir, exist_ok=True)

doc = pymupdf.open(pdf_path)

fig_pages = {
    9: (27, 637.4),
    10: (30, 539.2),
    11: (32, 481.1),
    12: (34, 503.8),
    13: (35, 646.2),
    14: (37, 415.0),
    15: (38, 534.1),
    16: (40, 666.4),
    17: (41, 539.2),
    18: (42, 522.7),
    19: (44, 379.0),
    20: (45, 669.5),
    21: (47, 611.8),
    22: (50, 383.8),
    23: (52, 543.6),
    24: (53, 422.0),
}

with open('scratch/fig_crop_rects_block2.py', 'w', encoding='utf-8') as f:
    f.write("# Computed crops for Block 2\nfigures_block2 = [\n")
    for fig, (pno, cap_y0) in fig_pages.items():
        page = doc[pno - 1]
        drawings = page.get_drawings()
        min_x, min_y, max_x, max_y = 9999, 9999, -9999, -9999
        for d in drawings:
            r = d["rect"]
            if r.y1 > 48 and r.y0 < cap_y0 - 2:
                min_x = min(min_x, r.x0)
                min_y = min(min_y, r.y0)
                max_x = max(max_x, r.x1)
                max_y = max(max_y, r.y1)
        # fallback if drawings not found or minimal
        if min_x > 500 or min_y > 700:
            min_x, min_y, max_x, max_y = 45, 55, 550, cap_y0 - 5
        else:
            min_x = max(40, min_x - 6)
            min_y = max(50, min_y - 6)
            max_x = min(555, max_x + 6)
            max_y = min(cap_y0 - 2, max_y + 6)
        fname = f"fig{fig:02d}_block2.jpg"
        f.write(f"    ({fig}, {pno}, pymupdf.Rect({min_x:.1f}, {min_y:.1f}, {max_x:.1f}, {max_y:.1f}), '{fname}'),\n")
    f.write("]\n")

print("Generated scratch/fig_crop_rects_block2.py")
