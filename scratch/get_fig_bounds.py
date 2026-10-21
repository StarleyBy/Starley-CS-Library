import pymupdf

doc = pymupdf.open('scratch/cardio_oncology.pdf')

pages = {
    1: 11,
    2: 12,
    3: 13,
    4: 14,
    5: 17,
    6: 20,
    7: 22,
    8: 24
}

for fig, pno in pages.items():
    page = doc[pno - 1]
    drawings = page.get_drawings()
    img_list = page.get_images()
    print(f"Fig {fig} (p.{pno}): {len(drawings)} drawings, {len(img_list)} raster images")
    
    # find bounding box of drawings with y < caption_y0
    cap_y0 = [b[1] for b in page.get_text("blocks") if b[4].strip().startswith(f"Figure {fig}")][0]
    
    min_x = 9999
    min_y = 9999
    max_x = -9999
    max_y = -9999
    
    for d in drawings:
        r = d["rect"]
        # exclude headers (y < 45) and things below caption
        if r.y1 > 48 and r.y0 < cap_y0 - 2:
            min_x = min(min_x, r.x0)
            min_y = min(min_y, r.y0)
            max_x = max(max_x, r.x1)
            max_y = max(max_y, r.y1)
            
    print(f"  Drawing bounds above caption: ({min_x:.1f}, {min_y:.1f}, {max_x:.1f}, {max_y:.1f})")
