import pymupdf

doc = pymupdf.open('scratch/cardio_oncology.pdf')

check_figs = [11, 12, 14, 19, 21, 22, 23]
for fig in check_figs:
    for pno in range(25, 55):
        page = doc[pno]
        rects = page.search_for(f"Figure {fig}")
        if rects:
            for r in rects:
                # also get text block around r
                text_around = page.get_text("text", clip=pymupdf.Rect(r.x0-10, r.y0-5, r.x1+300, r.y1+30))
                print(f"Fig {fig} on Page {pno+1}: rect={r} | text={text_around.strip().replace(chr(10), ' ')[:80]}")
