import pymupdf

doc = pymupdf.open('scratch/cardio_oncology.pdf')

pages = {
    9: 27,
    10: 30,
    11: 31,
    12: 33,
    13: 35,
    14: 36,
    15: 38,
    16: 40,
    17: 41,
    18: 42,
    19: 43,
    20: 45,
    21: 46,
    22: 49,
    23: 51,
    24: 53
}

for fig, pno in pages.items():
    page = doc[pno - 1]
    # find where caption is
    blocks = page.get_text("blocks")
    cap_b = None
    for b in blocks:
        if b[4].strip().startswith(f"Figure {fig}"):
            cap_b = b
            break
            
    drawings = page.get_drawings()
    cap_y0 = cap_b[1] if cap_b else 9999
    
    min_x = 9999
    min_y = 9999
    max_x = -9999
    max_y = -9999
    
    for d in drawings:
        r = d["rect"]
        if r.y1 > 48 and r.y0 < cap_y0 - 2:
            min_x = min(min_x, r.x0)
            min_y = min(min_y, r.y0)
            max_x = max(max_x, r.x1)
            max_y = max(max_y, r.y1)
            
    print(f"Fig {fig:2d} (p.{pno}): cap_y0={cap_y0:.1f} | drawings: ({min_x:.1f}, {min_y:.1f}, {max_x:.1f}, {max_y:.1f})")
    if cap_b:
        print(f"   Caption: {cap_b[4][:70]}...")
