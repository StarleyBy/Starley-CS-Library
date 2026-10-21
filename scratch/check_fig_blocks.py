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
    # find where Figure X caption is
    rects = page.search_for(f"Figure {fig}")
    cap_rect = None
    for r in rects:
        # Check if it's the start of the caption (usually x0 < 60)
        if r.x0 < 60:
            cap_rect = r
            break
    print(f"Fig {fig} on Page {pno}: caption y0={cap_rect.y0 if cap_rect else 'NOT FOUND'}")
    # Let's inspect text blocks on page to find top of figure
    blocks = page.get_text("blocks")
    for b in blocks:
        # b is (x0, y0, x1, y1, text, block_no, block_type)
        if b[4].strip().startswith(f"Figure {fig}"):
            print(f"   Caption block: ({b[0]:.1f}, {b[1]:.1f}, {b[2]:.1f}, {b[3]:.1f}) text={b[4][:80]}...")
